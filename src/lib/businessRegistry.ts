// Canadian Business Registry API client

export interface BusinessRegistryResult {
  Registry_Source: string;
  Jurisdiction: string;
  Company_Name: string;
  BN: string; // Business Number
  MRAS_ID: string;
  Juri_ID: string;
  Reg_office_city: string;
  City: string;
  Reg_office_province: string;
  Status_State: string;
  Status_Date: string;
  Status_Notes: string;
  Entity_Type: string;
  Date_Incorporated: string;
  Display_Date: string;
  score: number;
}

export interface BusinessRegistryResponse {
  totalResults: number;
  count: number;
  docs: BusinessRegistryResult[];
  paging: {
    previous: string;
    next: string;
  };
}

// Search for businesses in the Canadian Business Registry
export async function searchCanadianBusinesses(
  businessName: string
): Promise<BusinessRegistryResponse> {
  try {
    // Clean and encode the business name for the API
    const encodedName = encodeURIComponent(`{${businessName.toUpperCase()}}`);
    const apiUrl = `https://ised-isde.canada.ca/cbr/srch/api/v1/search?fq=keyword:${encodedName}&lang=en&queryaction=fieldquery&sortfield=score&sortorder=desc`;

    console.log('Searching Canadian Business Registry for:', businessName);
    console.log('API URL:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Business Application Form',
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data: BusinessRegistryResponse = await response.json();

    console.log('Search results:', data);

    return data;
  } catch (error) {
    console.error('Error searching Canadian Business Registry:', error);
    throw error;
  }
}

// Format business data for form pre-filling
export function formatBusinessDataForForm(business: BusinessRegistryResult) {
  return {
    businessName: business.Company_Name,
    businessNumber: business.BN,
    businessAddress: `${business.Reg_office_city}, ${business.Reg_office_province}`,
    businessCity: business.Reg_office_city,
    businessProvince: business.Reg_office_province,
    entityType: business.Entity_Type,
    incorporationDate: business.Date_Incorporated,
    businessStatus: business.Status_State,
    jurisdiction: business.Jurisdiction,
    registrySource: business.Registry_Source,
    // These can be used to prefill other form fields
    businessAge: calculateBusinessAge(business.Date_Incorporated),
    businessType: mapEntityTypeToBusinessType(business.Entity_Type),
  };
}

// Calculate business age based on incorporation date
function calculateBusinessAge(incorporationDate: string): string {
  if (!incorporationDate) return '';

  const incorporatedDate = new Date(incorporationDate);
  const now = new Date();
  const monthsDiff =
    (now.getFullYear() - incorporatedDate.getFullYear()) * 12 +
    (now.getMonth() - incorporatedDate.getMonth());

  if (monthsDiff < 6) return '< 6 months';
  if (monthsDiff < 12) return '6–12 months';
  if (monthsDiff < 36) return '1–3 years';
  return '3+ years';
}

// Map entity type to our business type options
function mapEntityTypeToBusinessType(entityType: string): string {
  const type = entityType.toLowerCase();

  if (type.includes('corp') || type.includes('corporation'))
    return 'professional-services';
  if (type.includes('partnership')) return 'professional-services';
  if (type.includes('sole')) return 'professional-services';
  if (type.includes('restaurant') || type.includes('food')) return 'restaurant';
  if (type.includes('retail')) return 'retail';
  if (type.includes('construction')) return 'construction';
  if (type.includes('health')) return 'healthcare';
  if (type.includes('tech') || type.includes('software')) return 'technology';
  if (type.includes('manufact')) return 'manufacturing';
  if (type.includes('transport')) return 'transportation';
  if (type.includes('real estate')) return 'real-estate';

  // Default to professional services for corporations
  return 'professional-services';
}
