import { NextRequest, NextResponse } from 'next/server';
import { 
  saveComplianceCheck, 
  updateComplianceCheck,
  AICategorization 
} from '@/lib/compliance';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// High-risk business categories
const HIGH_RISK_CATEGORIES = [
  'Gambling and Gaming',
  'Adult Entertainment',
  'Cryptocurrency and Digital Assets',
  'Pharmaceuticals and Controlled Substances',
  'Weapons and Firearms',
  'Tobacco and Vaping Products',
  'Debt Collection',
  'Multi-level Marketing',
  'Payday Lending',
  'Money Services and Remittance',
  'Cannabis and CBD Products',
  'Political Organizations',
  'Religious Organizations'
];

// Standard business categories
const BUSINESS_CATEGORIES = [
  'Technology and Software',
  'E-commerce and Retail',
  'Healthcare and Medical Services',
  'Financial Services',
  'Education and Training',
  'Food and Beverage',
  'Manufacturing',
  'Construction and Real Estate',
  'Professional Services',
  'Transportation and Logistics',
  'Media and Entertainment',
  'Non-profit and Charity',
  'Agriculture and Farming',
  'Energy and Utilities',
  'Hospitality and Tourism',
  'Automotive',
  'Beauty and Personal Care',
  'Sports and Recreation',
  'Legal Services',
  'Marketing and Advertising',
  'Other'
];

async function categorizeBusinessWithAI(businessName: string, businessDescription?: string): Promise<AICategorization> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }
  
  const businessInfo = businessDescription 
    ? `${businessName} - ${businessDescription}`
    : businessName;
  
  const categories = [...BUSINESS_CATEGORIES, ...HIGH_RISK_CATEGORIES];
  
  const prompt = `Analyze the following business and categorize it. Respond with a JSON object containing:
1. "category": The most appropriate category from the provided list
2. "confidence_score": A number from 0.0 to 1.0 indicating confidence in the categorization
3. "summary": A 2-sentence business summary

Business: ${businessInfo}

Available categories: ${categories.join(', ')}

Respond only with valid JSON in this format:
{
  "category": "category name",
  "confidence_score": 0.85,
  "summary": "Business description here."
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.1
    })
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  const responseText = data.choices[0]?.message?.content?.trim();
  
  try {
    const result = JSON.parse(responseText);
    
    // Calculate high-risk similarity if applicable
    let highRiskSimilarity = 0;
    const matchedHighRiskCategories: string[] = [];
    
    if (HIGH_RISK_CATEGORIES.includes(result.category)) {
      highRiskSimilarity = 1.0;
      matchedHighRiskCategories.push(result.category);
    } else {
      // Check if business might be similar to high-risk categories
      for (const riskCategory of HIGH_RISK_CATEGORIES) {
        if (businessInfo.toLowerCase().includes(riskCategory.toLowerCase().split(' ')[0])) {
          highRiskSimilarity = Math.max(highRiskSimilarity, 0.3);
          matchedHighRiskCategories.push(riskCategory);
        }
      }
    }
    
    return {
      business_name: businessName,
      category: result.category,
      confidence_score: Math.max(0, Math.min(1, result.confidence_score)),
      summary: result.summary,
      high_risk_similarity: highRiskSimilarity,
      high_risk_categories: matchedHighRiskCategories
    };
    
  } catch (error) {
    throw new Error(`Failed to parse AI response: ${responseText}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessName, businessDescription, applicationId } = body;
    
    if (!businessName) {
      return NextResponse.json(
        { error: 'Business name is required' }, 
        { status: 400 }
      );
    }
    
    // Create initial compliance check record
    const checkId = await saveComplianceCheck({
      application_id: applicationId,
      check_type: 'ai_categorization',
      status: 'pending',
      input_data: { businessName, businessDescription }
    });
    
    try {
      // Run AI categorization
      const result = await categorizeBusinessWithAI(businessName, businessDescription);
      
      // Calculate risk score based on categorization
      let riskScore = result.high_risk_similarity || 0;
      
      // Adjust risk score based on confidence
      if (result.confidence_score < 0.5) {
        riskScore += 0.1; // Increase risk for uncertain categorizations
      }
      
      // Ensure risk score is between 0 and 1
      riskScore = Math.max(0, Math.min(1, riskScore));
      
      // Update compliance check with results
      await updateComplianceCheck(checkId, {
        status: 'completed',
        risk_score: riskScore,
        results: result
      });
      
      return NextResponse.json({ 
        success: true, 
        checkId,
        result 
      });
      
    } catch (error) {
      // Update compliance check with error
      await updateComplianceCheck(checkId, {
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error'
      });
      
      return NextResponse.json(
        { error: 'Failed to process AI categorization', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('AI categorization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}