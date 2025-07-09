import { getUserIpAddress } from '@/lib/ipAddress';
import { UserData } from '@/lib/supabase';
import { FormData } from '@/types';

const create = async (data: FormData) => {
  try {
    const userIpAddress = await getUserIpAddress();
    const userData: UserData = {
      first_name: data.firstName || '',
      last_name: data.lastName || '',
      email: data.email || '',
      phone: data.phone || '',
      address_line1: data.addressLine1 || '',
      address_line2: data.addressLine2 || '',
      city: data.city || '',
      province: data.province || '',
      postal_code: data.postalCode || '',
      role_in_business: data.roleInBusiness || '',
      ownership_percentage: data.ownershipPercentage
        ? parseInt(data.ownershipPercentage)
        : undefined,
      source: 'referral_application',
      email_marketing_consent: data.emailMarketingConsent === 'true',
      sms_marketing_consent: data.smsMarketingConsent === 'true',
      ip_address: userIpAddress || undefined,
      user_agent:
        typeof window !== 'undefined' ? window.navigator.userAgent : undefined,

      // Extract UTM parameters from URL or localStorage if available
      utm_campaign:
        new URLSearchParams(window.location.search).get('utm_campaign') ||
        undefined,
      utm_source:
        new URLSearchParams(window.location.search).get('utm_source') ||
        undefined,
      utm_medium:
        new URLSearchParams(window.location.search).get('utm_medium') ||
        undefined,
      utm_content:
        new URLSearchParams(window.location.search).get('utm_content') ||
        undefined,
    };

    const response = await fetch('/api/users/upsert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userData,
      }),
    });
    const result = await response.json();

    if (result.success && result.user) {
      console.log('User created/updated:', result.user);
      localStorage.setItem('userId', result.user.id);
    } else {
      console.error('User upsert failed:', result.error);
    }
  } catch (error) {
    console.error('Error creating user:', error);
    // Don't block the flow if user creation fails
  }
};

export const user = {
  create,
};
