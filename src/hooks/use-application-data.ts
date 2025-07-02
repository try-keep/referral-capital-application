import { ReferralApplicationData } from '@/types';

/**
 * Hook to get the application data from local storage
 * It provides the type-safe version of the data
 * @returns The application data or null if no data is found
 */

export const useApplicationData = (): ReferralApplicationData | null => {
  const savedData = localStorage.getItem('referralApplicationData');
  const data = savedData ? JSON.parse(savedData) : null;

  return data as ReferralApplicationData | null;
};
