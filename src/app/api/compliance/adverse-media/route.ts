import { NextRequest, NextResponse } from 'next/server';
import {
  saveComplianceCheck,
  updateComplianceCheck,
  AdverseMediaResult,
} from '@/lib/compliance';

const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface NewsArticle {
  title: string;
  url: string;
  publishedAt: string;
  description: string;
  content: string;
}

async function searchNewsAPI(
  businessName: string,
  businessUrl?: string
): Promise<NewsArticle[]> {
  if (!NEWSAPI_KEY) {
    throw new Error('NewsAPI key not configured');
  }

  // Construct search query
  let query = `"${businessName}"`;
  if (businessUrl) {
    query += ` OR "${businessUrl}"`;
  }

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=10&apiKey=${NEWSAPI_KEY}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; ComplianceBot/1.0)',
    },
  });

  if (!response.ok) {
    throw new Error(`NewsAPI error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.status !== 'ok') {
    throw new Error(`NewsAPI error: ${data.message || 'Unknown error'}`);
  }

  return (
    data.articles?.map((article: any) => ({
      title: article.title || '',
      url: article.url || '',
      publishedAt: article.publishedAt || '',
      description: article.description || '',
      content: article.content || article.description || '',
    })) || []
  );
}

async function analyzeSentimentWithOpenAI(
  articleText: string
): Promise<number> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = `Analyze the following article for adverse sentiment related to business/financial reputation and return a numerical score from 0.0 (not adverse/neutral) to 1.0 (highly adverse/negative). Consider factors like fraud, bankruptcy, legal issues, regulatory violations, scandals, or other negative business practices. Respond with only the numerical score.

Article: ${articleText.substring(0, 1000)}...`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 10,
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `OpenAI API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  const scoreText = data.choices[0]?.message?.content?.trim();

  // Parse the score
  const score = parseFloat(scoreText);
  if (isNaN(score)) {
    throw new Error(`Invalid sentiment score from OpenAI: ${scoreText}`);
  }

  return Math.max(0, Math.min(1, score)); // Ensure between 0 and 1
}

async function runAdverseMediaCheck(
  businessName: string,
  businessUrl?: string
): Promise<AdverseMediaResult> {
  try {
    // Search for news articles
    const articles = await searchNewsAPI(businessName, businessUrl);

    if (articles.length === 0) {
      return {
        business_name: businessName,
        articles_found: 0,
        overall_sentiment_score: 0.0,
        risk_level: 'low',
        articles: [],
      };
    }

    // Analyze sentiment for each article
    const analyzedArticles = [];
    let totalSentiment = 0;

    for (const article of articles.slice(0, 5)) {
      // Limit to 5 articles to control costs
      try {
        const sentimentScore = await analyzeSentimentWithOpenAI(
          `${article.title} ${article.description} ${article.content}`
        );

        analyzedArticles.push({
          title: article.title,
          url: article.url,
          sentiment_score: sentimentScore,
          published_at: article.publishedAt,
        });

        totalSentiment += sentimentScore;

        // Add delay to respect API rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to analyze article: ${article.title}`, error);
        // Continue with other articles
      }
    }

    const overallSentiment =
      analyzedArticles.length > 0
        ? totalSentiment / analyzedArticles.length
        : 0.0;

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (overallSentiment >= 0.7) {
      riskLevel = 'high';
    } else if (overallSentiment >= 0.4) {
      riskLevel = 'medium';
    }

    return {
      business_name: businessName,
      articles_found: articles.length,
      overall_sentiment_score: overallSentiment,
      risk_level: riskLevel,
      articles: analyzedArticles,
    };
  } catch (error) {
    throw new Error(
      `Adverse media check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessName, businessWebsite, applicationId } = body;

    if (!businessName) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      );
    }

    // Create initial compliance check record
    const checkId = await saveComplianceCheck({
      application_id: applicationId,
      check_type: 'adverse_media',
      status: 'pending',
      input_data: { businessName, businessWebsite },
    });

    try {
      // Run adverse media check
      const result = await runAdverseMediaCheck(businessName, businessWebsite);

      // Update compliance check with results
      await updateComplianceCheck(checkId, {
        status: 'completed',
        risk_score: result.overall_sentiment_score,
        results: result,
      });

      return NextResponse.json({
        success: true,
        checkId,
        result,
      });
    } catch (error) {
      // Update compliance check with error
      await updateComplianceCheck(checkId, {
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      return NextResponse.json(
        {
          error: 'Failed to process adverse media check',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Adverse media check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
