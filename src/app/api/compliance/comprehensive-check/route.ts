import { NextRequest, NextResponse } from 'next/server';
import { 
  saveComplianceCheck, 
  updateComplianceCheck, 
  scrapeWebsiteMetadata,
  WebsiteMetadata 
} from '@/lib/compliance';

// NewsAPI integration
async function searchNewsAPI(businessName: string, businessUrl?: string): Promise<any[]> {
  const newsApiKey = process.env.NEWSAPI_KEY;
  console.log('NewsAPI key exists:', !!newsApiKey);
  console.log('NewsAPI key length:', newsApiKey?.length || 0);
  
  if (!newsApiKey) {
    console.warn('NewsAPI key not found, skipping adverse media check');
    return [];
  }

  // Build search query prioritizing the website domain
  const domain = businessUrl ? businessUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : '';
  let queries = [];
  
  // Priority 1: Search for exact domain and company-specific terms
  if (domain) {
    queries.push(`"${domain}"`);
    // Add company context to filter out generic references
    if (businessName) {
      queries.push(`"${businessName}" AND "fintech"`);
      queries.push(`"${businessName}" AND "startup"`);
      queries.push(`"${businessName}" AND "company"`);
      queries.push(`"${businessName}" AND "valuation"`);
      queries.push(`"${businessName}" AND "funding"`);
    }
  }

  const query = queries.slice(0, 3).join(' OR '); // Limit to top 3 most relevant queries
  console.log('NewsAPI search query:', query);
  
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=relevancy&pageSize=10&apiKey=${newsApiKey}`;
  console.log('NewsAPI URL (without key):', url.replace(newsApiKey, '[REDACTED]'));

  try {
    const response = await fetch(url);
    console.log('NewsAPI response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('NewsAPI error response:', errorText);
      throw new Error(`NewsAPI error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('NewsAPI response:', {
      status: data.status,
      totalResults: data.totalResults,
      articlesCount: data.articles?.length || 0
    });
    
    return data.articles || [];
  } catch (error) {
    console.error('NewsAPI search failed:', error);
    return [];
  }
}

// OpenAI integration for sentiment analysis and AI categorization
async function analyzeWithOpenAI(businessName: string, businessDescription?: string, articles?: any[]): Promise<any> {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    console.warn('OpenAI key not found, skipping AI analysis');
    return null;
  }

  try {
    // Prepare context for AI analysis
    let analysisPrompt = `Analyze the business "${businessName}"`;
    if (businessDescription) {
      analysisPrompt += ` with description: "${businessDescription}"`;
    }
    
    analysisPrompt += `\n\nProvide analysis in this exact JSON format:
{
  "category": "exact business category",
  "category_confidence_score": confidence_score_0_to_1,
  "high_risk_similarity_score": risk_score_0_to_1,
  "summary": "brief business summary"
}`;

    // Add sentiment analysis for articles if available
    let sentimentPrompt = '';
    if (articles && articles.length > 0) {
      const articleText = articles.slice(0, 5).map(a => `${a.title}: ${a.description || ''}`).join('\n');
      sentimentPrompt = `\n\nAlso analyze these news articles for sentiment about "${businessName}":\n${articleText}\n\nProvide sentiment scores (0.0-1.0, where 0.0 is very negative, 0.5 is neutral, 1.0 is very positive) for each article.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: analysisPrompt + sentimentPrompt
        }],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    try {
      return JSON.parse(content);
    } catch {
      return {
        category: 'Unknown',
        category_confidence_score: 0.5,
        high_risk_similarity_score: 0.5,
        summary: content || 'Analysis completed'
      };
    }
  } catch (error) {
    console.error('OpenAI analysis failed:', error);
    return {
      category: 'Unknown',
      category_confidence_score: 0.5,
      high_risk_similarity_score: 0.5,
      summary: 'AI analysis unavailable'
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Comprehensive compliance check API called');
    const body = await request.json();
    console.log('Request body:', body);
    
    const { businessWebsite, businessName, applicationId } = body;
    
    if (!businessWebsite) {
      return NextResponse.json(
        { error: 'Business website is required' }, 
        { status: 400 }
      );
    }
    
    console.log('Processing comprehensive compliance check for:', businessWebsite);
    
    // Create initial compliance check record
    const checkId = await saveComplianceCheck({
      application_id: applicationId,
      check_type: 'comprehensive_compliance',
      status: 'pending',
      input_data: { businessWebsite, businessName }
    });
    console.log('Created compliance check with ID:', checkId);
    
    try {
      // 1. Scrape website metadata
      console.log('Starting website scraping...');
      const metadata: WebsiteMetadata = await scrapeWebsiteMetadata(businessWebsite);
      console.log('Website scraping completed. Success:', metadata.success);
      
      // 2. Search for adverse media
      console.log('Starting adverse media search...');
      const articles = await searchNewsAPI(businessName || 'Unknown Business', businessWebsite);
      console.log(`Found ${articles.length} articles`);
      
      // 3. AI analysis for categorization and sentiment
      console.log('Starting AI analysis...');
      const aiAnalysis = await analyzeWithOpenAI(businessName || 'Unknown Business', metadata.description, articles);
      console.log('AI analysis completed');
      
      // Format response like rue projects
      const comprehensiveResponse = {
        domain: businessWebsite.replace(/^https?:\/\//, ''),
        type: 'comprehensive',
        metadata: {
          title: metadata.title,
          description: metadata.description,
          keywords: metadata.keywords,
          phoneNumbers: metadata.phone_numbers,
          emails: metadata.emails,
          socialMediaLinks: Object.values(metadata.social_media_links).flat()
        },
        adverse_media: {
          has_adverse_media: articles.length > 0,
          overall_adverse_score: articles.length > 0 ? 0.1 : 0.0, // Simple scoring
          adverse_media_articles: articles.slice(0, 5).map(article => ({
            title: article.title,
            description: article.description || '',
            url: article.url,
            source: article.source?.name || 'Unknown',
            publishedAt: article.publishedAt,
            sentiment_score: 0.0 // Will be enhanced with AI analysis
          }))
        },
        ai_response: aiAnalysis || {
          category: 'Unknown',
          category_confidence_score: 0.5,
          high_risk_similarity_score: 0.5,
          summary: 'Analysis unavailable'
        },
        whois_data: {
          creation_date: 'Unknown',
          expiration_date: 'Unknown',
          last_updated: 'Unknown',
          name_servers: [],
          registrar: 'Unknown'
        }
      };
      
      // Calculate overall risk score 
      let overallRiskScore = 0.0;
      
      // Website quality factors
      if (!metadata.success) overallRiskScore += 0.3;
      if (!metadata.title || metadata.title.length < 10) overallRiskScore += 0.1;
      if (!metadata.description || metadata.description.length < 20) overallRiskScore += 0.1;
      if (metadata.emails.length === 0) overallRiskScore += 0.1;
      if (metadata.phone_numbers.length === 0) overallRiskScore += 0.1;
      
      // Social media presence (reduces risk)
      if (Object.keys(metadata.social_media_links).length > 0) overallRiskScore -= 0.05;
      
      // Adverse media factors
      if (articles.length > 5) overallRiskScore += 0.1;
      
      // AI risk assessment
      if (aiAnalysis?.high_risk_similarity_score > 0.7) overallRiskScore += 0.2;
      
      overallRiskScore = Math.max(0, Math.min(1, overallRiskScore));
      
      // Update compliance check with comprehensive results
      await updateComplianceCheck(checkId, {
        status: 'completed',
        risk_score: overallRiskScore,
        results: comprehensiveResponse
      });
      console.log('Updated compliance check in database');
      
      const responseData = { 
        success: true, 
        checkId,
        overallRiskScore,
        ...comprehensiveResponse
      };
      
      console.log('✅ Sending comprehensive response');
      return NextResponse.json(responseData);
      
    } catch (error) {
      console.error('Comprehensive compliance check processing error:', error);
      
      // Update compliance check with error
      await updateComplianceCheck(checkId, {
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error'
      });
      
      return NextResponse.json(
        { error: 'Failed to process comprehensive compliance check', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Comprehensive compliance check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}