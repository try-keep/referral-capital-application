// Geoapify API utility for address autocomplete
const GEOAPIFY_API_KEY = '22fb94fa85254f60aeeff54dadb692ec';

export interface GeoapifyFeature {
  properties: {
    formatted: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
    lon: number;
    lat: number;
  };
  geometry: {
    coordinates: [number, number];
  };
}

export interface GeoapifyResponse {
  features: GeoapifyFeature[];
  query: {
    text: string;
    parsed: {
      city?: string;
      expected_type?: string;
    };
  };
}

export async function searchAddresses(
  query: string,
  country?: 'CA'
): Promise<GeoapifyFeature[]> {
  if (!query || query.trim().length < 3) {
    return [];
  }

  try {
    const requestOptions = {
      method: 'GET',
    };
    const params = new URLSearchParams({
      text: query,
      apiKey: GEOAPIFY_API_KEY,
      limit: '5',
    });
    if (country) {
      params.append('filter', `countrycode:${country.toLowerCase()}`);
    }

    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?${params.toString()}`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: GeoapifyResponse = await response.json();
    return result.features || [];
  } catch (error) {
    console.error('Error fetching addresses from Geoapify:', error);
    return [];
  }
}

export function formatAddress(feature: GeoapifyFeature): string {
  return feature.properties.formatted;
}
