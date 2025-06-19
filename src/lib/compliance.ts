import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase client only if environment variables are available
const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export interface ComplianceCheck {
  id?: number;
  application_id?: number;
  check_type: string;
  status: 'pending' | 'completed' | 'failed';
  risk_score?: number;
  results?: any;
  input_data?: any;
  created_at?: string;
  completed_at?: string;
  error_message?: string;
}

export interface WebsiteMetadata {
  url: string;
  status_code?: number;
  title: string;
  description: string;
  keywords: string;
  phone_numbers: string[];
  emails: string[];
  social_media_links: Record<string, string[]>;
  success: boolean;
  error?: string;
}

export interface AdverseMediaResult {
  business_name: string;
  articles_found: number;
  overall_sentiment_score: number;
  risk_level: 'low' | 'medium' | 'high';
  articles: Array<{
    title: string;
    url: string;
    sentiment_score: number;
    published_at: string;
  }>;
}

export interface AICategorization {
  business_name: string;
  category: string;
  confidence_score: number;
  summary: string;
  high_risk_similarity?: number;
  high_risk_categories?: string[];
}

// Database operations
export async function saveComplianceCheck(check: ComplianceCheck): Promise<number> {
  if (!supabase) {
    throw new Error('Supabase client not initialized - missing environment variables');
  }

  const { data, error } = await supabase
    .from('compliance_checks')
    .insert(check)
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to save compliance check: ${error.message}`);
  }

  return data.id;
}

export async function updateComplianceCheck(id: number, updates: Partial<ComplianceCheck>): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase client not initialized - missing environment variables');
  }

  const { error } = await supabase
    .from('compliance_checks')
    .update({
      ...updates,
      completed_at: updates.status === 'completed' ? new Date().toISOString() : undefined
    })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update compliance check: ${error.message}`);
  }
}

export async function getComplianceChecks(applicationId: number): Promise<ComplianceCheck[]> {
  if (!supabase) {
    throw new Error('Supabase client not initialized - missing environment variables');
  }

  const { data, error } = await supabase
    .from('compliance_checks')
    .select('*')
    .eq('application_id', applicationId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to get compliance checks: ${error.message}`);
  }

  return data || [];
}

// Website metadata scraping utilities
export function cleanText(text: string): string {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}

export function extractPhoneNumbers(text: string): string[] {
  const phonePatterns = [
    /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g, // US format
    /(\+?44[-.\s]?)?(\d{4})[-.\s]?(\d{6})/g, // UK format
    /(\+?1[-.\s]?)?(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})/g, // General format
  ];
  
  const phoneNumbers: string[] = [];
  for (const pattern of phonePatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const phoneNumber = match[0].replace(/[^\d+]/g, '');
      if (phoneNumber.length >= 10) {
        phoneNumbers.push(phoneNumber);
      }
    }
  }
  
  return [...new Set(phoneNumbers)]; // Remove duplicates
}

export function extractEmails(text: string): string[] {
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = text.match(emailPattern) || [];
  return [...new Set(emails)]; // Remove duplicates
}

export function extractSocialMediaLinks(html: string, baseUrl: string): Record<string, string[]> {
  const socialPlatforms = {
    facebook: ['facebook.com', 'fb.com'],
    twitter: ['twitter.com', 'x.com'],
    linkedin: ['linkedin.com'],
    instagram: ['instagram.com'],
    youtube: ['youtube.com', 'youtu.be'],
    tiktok: ['tiktok.com'],
    pinterest: ['pinterest.com']
  };
  
  const socialLinks: Record<string, string[]> = {};
  
  // Simple regex to find href attributes
  const hrefPattern = /href=["']([^"']+)["']/gi;
  const matches = html.matchAll(hrefPattern);
  
  for (const match of matches) {
    const href = match[1];
    let fullUrl = href;
    
    // Convert relative URLs to absolute
    if (href.startsWith('/')) {
      const url = new URL(baseUrl);
      fullUrl = `${url.protocol}//${url.host}${href}`;
    } else if (!href.startsWith('http')) {
      continue;
    }
    
    // Check if it's a social media link
    for (const [platform, domains] of Object.entries(socialPlatforms)) {
      for (const domain of domains) {
        if (fullUrl.includes(domain)) {
          if (!socialLinks[platform]) {
            socialLinks[platform] = [];
          }
          socialLinks[platform].push(fullUrl);
        }
      }
    }
  }
  
  // Remove duplicates
  for (const platform in socialLinks) {
    socialLinks[platform] = [...new Set(socialLinks[platform])];
  }
  
  return socialLinks;
}

export async function scrapeWebsiteMetadata(domain: string): Promise<WebsiteMetadata> {
  // Ensure the domain has a protocol
  const urlsToTry = [];
  if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
    urlsToTry.push(`https://${domain}`, `http://${domain}`);
  } else {
    urlsToTry.push(domain);
  }
  
  let lastError = '';
  
  for (const url of urlsToTry) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const html = await response.text();
      
      // Parse HTML to extract metadata
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
      const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i);
      
      const pageText = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                           .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                           .replace(/<[^>]+>/g, ' ')
                           .replace(/\s+/g, ' ');
      
      return {
        url,
        status_code: response.status,
        title: titleMatch ? cleanText(titleMatch[1]) : '',
        description: descMatch ? cleanText(descMatch[1]) : '',
        keywords: keywordsMatch ? cleanText(keywordsMatch[1]) : '',
        phone_numbers: extractPhoneNumbers(pageText),
        emails: extractEmails(pageText),
        social_media_links: extractSocialMediaLinks(html, url),
        success: true,
      };
      
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error';
      continue;
    }
  }
  
  return {
    url: domain,
    title: '',
    description: '',
    keywords: '',
    phone_numbers: [],
    emails: [],
    social_media_links: {},
    success: false,
    error: `Failed to scrape website: ${lastError}`,
  };
}