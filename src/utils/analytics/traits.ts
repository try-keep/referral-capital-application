import { filterObjectEmptyValues } from '../misc';

/**
 * Get the application traits for Segment analytics that will be sent with each page view
 * @param applicationData The application data from local storage
 * @returns The application traits
 */
export const getApplicationTraits = (
  applicationData: {
    [key: string]: any;
    existingLoans?: Array<{ lenderName: string; loanAmount: string }>;
  }
) => {
  return filterObjectEmptyValues({
    email: applicationData.email,
    phone: applicationData.phone,
    firstName: applicationData.firstName,
    lastName: applicationData.lastName,
    businessName: applicationData.businessName,
  });
};
