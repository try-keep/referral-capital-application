// Utility function to get user's IP address
export async function getUserIpAddress(): Promise<string | null> {
  try {
    // Try to get IP from ipify API (free service)
    const response = await fetch('https://api.ipify.org?format=json');
    if (response.ok) {
      const data = await response.json();
      return data.ip;
    }
  } catch (error) {
    console.error('Failed to get IP from ipify:', error);
  }

  try {
    // Fallback to another service
    const response = await fetch('https://httpbin.org/ip');
    if (response.ok) {
      const data = await response.json();
      return data.origin;
    }
  } catch (error) {
    console.error('Failed to get IP from httpbin:', error);
  }

  // If all external services fail, return null
  console.warn('Could not determine user IP address');
  return null;
}