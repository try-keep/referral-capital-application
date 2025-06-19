import { NextRequest, NextResponse } from 'next/server';
import { 
  saveComplianceCheck, 
  updateComplianceCheck, 
  scrapeWebsiteMetadata,
  WebsiteMetadata 
} from '@/lib/compliance';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessWebsite, businessName, applicationId } = body;
    
    if (!businessWebsite) {
      return NextResponse.json(
        { error: 'Business website is required' }, 
        { status: 400 }
      );
    }
    
    // Create initial compliance check record
    const checkId = await saveComplianceCheck({
      application_id: applicationId,
      check_type: 'website_metadata',
      status: 'pending',
      input_data: { businessWebsite, businessName }
    });
    
    try {
      // Scrape website metadata
      const metadata: WebsiteMetadata = await scrapeWebsiteMetadata(businessWebsite);
      
      // Calculate a basic risk score based on website quality
      let riskScore = 0.0;
      
      // Increase risk if website fails to load
      if (!metadata.success) {
        riskScore += 0.3;
      }
      
      // Increase risk if missing basic business information
      if (!metadata.title || metadata.title.length < 10) {
        riskScore += 0.1;
      }
      
      if (!metadata.description || metadata.description.length < 20) {
        riskScore += 0.1;
      }
      
      if (metadata.emails.length === 0) {
        riskScore += 0.1;
      }
      
      if (metadata.phone_numbers.length === 0) {
        riskScore += 0.1;
      }
      
      // Decrease risk for professional indicators
      if (metadata.social_media_links.linkedin?.length > 0) {
        riskScore -= 0.05;
      }
      
      if (metadata.social_media_links.facebook?.length > 0) {
        riskScore -= 0.05;
      }
      
      // Ensure risk score is between 0 and 1
      riskScore = Math.max(0, Math.min(1, riskScore));
      
      // Update compliance check with results
      await updateComplianceCheck(checkId, {
        status: 'completed',
        risk_score: riskScore,
        results: {
          metadata,
          risk_factors: {
            website_accessible: metadata.success,
            has_title: !!metadata.title,
            has_description: !!metadata.description,
            has_contact_email: metadata.emails.length > 0,
            has_phone_number: metadata.phone_numbers.length > 0,
            has_social_media: Object.keys(metadata.social_media_links).length > 0
          }
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        checkId,
        riskScore,
        metadata 
      });
      
    } catch (error) {
      // Update compliance check with error
      await updateComplianceCheck(checkId, {
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error'
      });
      
      return NextResponse.json(
        { error: 'Failed to process website check', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Website compliance check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}