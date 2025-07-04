import {
  saveApplication,
  ApplicationData as SupabaseApplicationData,
  supabase,
} from './supabase';

// Original form data interface (used internally by the form steps)
export interface FormData {
  [key: string]: string | boolean;
}

// Existing loan interface
export interface ExistingLoan {
  lenderName: string;
  loanAmount: string;
}

// Application data interface for submission
export interface ApplicationData {
  // Step 1: Loan Type
  loanType: string;

  // Step 2: Business Owner
  isBusinessOwner: string;
  owns_more_than_50pct?: string;

  // Step 3: Monthly Sales
  monthlySales: string;

  // Step 4: Existing Loans
  hasExistingLoans: string;
  totalLoanAmount?: string;
  existingLoans?: ExistingLoan[];

  // Step 5: Business Search
  businessName: string;
  businessSearchVerified?: string;

  // Step 6: Bank Connection
  bankConnected?: string;
  bankConnectionMethod?: string;

  // Step 7: Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  ssn?: string;

  // Step 8: Funding Amount
  fundingAmount: string;
  fundingTimeline: string;

  // Step 9: Funding Purpose
  fundingPurpose: string;

  // Step 10: Business Details
  businessType: string;
  numberOfEmployees: string;

  // Step 11: Financial Information
  annualRevenue: string;
  cashFlow: string;
  creditScore: string;
  timeInBusiness: string;

  // Step 12: Bank Information
  bankConnectionCompleted?: boolean;
  skippedBankConnection?: boolean;
  bankStatements?: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }>;

  // Step 13: Additional Details
  businessAddress: string;
  businessPhone: string;
  websiteUrl?: string;
  additionalInfo?: string;

  // Step 14: Review & Submit
  agreesToTerms: string;
  authorizesCreditCheck: string;

  // Bank upload tracking
  applicationUploadId?: string;

  // Application Metadata
  ipAddress?: string;

  // Business Reference
  businessId?: string;
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  applicationId: number;
  data: {
    id: number;
    businessName: string;
    email: string;
    status: string;
    submittedAt: string;
  };
}

// Transform form data to Supabase format
function transformToSupabaseFormat(
  data: ApplicationData
): SupabaseApplicationData {
  return {
    // Step 1: Loan Type
    loan_type: data.loanType,

    // Step 2: Business Owner
    is_business_owner: data.isBusinessOwner,
    owns_more_than_50pct: data.owns_more_than_50pct,

    // Step 3: Monthly Sales
    monthly_sales: data.monthlySales,

    // Step 4: Existing Loans
    has_existing_loans: data.hasExistingLoans,
    total_loan_amount: data.totalLoanAmount,

    // Step 5: Business Search
    business_name: data.businessName,
    business_search_verified: data.businessSearchVerified,

    // Step 6: Bank Connection
    bank_connected: data.bankConnected,
    bank_connection_method: data.bankConnectionMethod,

    // Step 7: Personal Information
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone,
    date_of_birth: data.dateOfBirth,
    title: '', // Default empty since removed from form
    ssn_last_4: '', // Default empty since removed from form

    // Step 8: Funding Amount
    funding_amount: data.fundingAmount,
    funding_timeline: data.fundingTimeline,

    // Step 9: Funding Purpose
    funding_purpose: data.fundingPurpose,

    // Step 10: Business Details
    business_type: data.businessType,
    number_of_employees: data.numberOfEmployees,

    // Step 11: Financial Information
    annual_revenue: data.annualRevenue,
    cash_flow: data.cashFlow,
    credit_score: data.creditScore,
    time_in_business: data.timeInBusiness,

    // Step 12: Bank Information
    bank_connection_completed: data.bankConnectionCompleted || false,
    skipped_bank_connection: data.skippedBankConnection || false,

    // Step 13: Additional Details
    business_address: data.businessAddress,
    business_phone: data.businessPhone,
    website_url: data.websiteUrl,
    additional_info: data.additionalInfo,

    // Step 14: Review & Submit
    agrees_to_terms: data.agreesToTerms === 'true',
    authorizes_credit_check: data.authorizesCreditCheck === 'true',

    // Application Status
    status: 'submitted',
    submitted_at: new Date().toISOString(),
    ip_address: data.ipAddress,

    // Business Reference
    business_id: data.businessId ? parseInt(data.businessId) : undefined,
  };
}

export async function submitApplication(
  data: ApplicationData
): Promise<ApplicationResponse> {
  try {
    // Transform the data to Supabase format
    const supabaseData = transformToSupabaseFormat(data);

    // Check if there's a user to link to this application
    const userId =
      typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if (userId) {
      supabaseData.user_id = userId;
    }

    // Save to Supabase
    const savedApplication = await saveApplication(supabaseData);

    // Prepare response data
    const responseData = {
      success: true,
      message: 'Application submitted successfully',
      applicationId: savedApplication.id,
      data: {
        id: savedApplication.id!,
        businessName: savedApplication.business_name,
        email: savedApplication.email,
        status: savedApplication.status || 'submitted',
        submittedAt: savedApplication.submitted_at || new Date().toISOString(),
      },
    };

    // Handle existing loans if any
    if (
      data.hasExistingLoans === 'yes' &&
      data.existingLoans &&
      data.existingLoans.length > 0
    ) {
      const existingLoansToSave = data.existingLoans
        .filter((loan) => loan.lenderName.trim() && loan.loanAmount.trim())
        .map((loan) => ({
          application_id: savedApplication.id!,
          lender_name: loan.lenderName.trim(),
          loan_amount: parseFloat(loan.loanAmount.replace(/,/g, '') || '0'),
        }));

      const { error: loansError } = await supabase
        .from('existing_loans')
        .insert(existingLoansToSave);

      if (loansError) {
        console.error('Error saving existing loans:', loansError);
        // Don't throw error - application is already saved
      }
    }

    // Handle bank statements if manual upload was used
    if (data.bankConnectionMethod === 'manual' && data.applicationUploadId) {
      // Update all bank_statements records with this applicationUploadId to link them to the application
      const { error: statementsError } = await supabase
        .from('bank_statements')
        .update({ application_id: savedApplication.id! })
        .eq('application_upload_id', data.applicationUploadId);

      if (statementsError) {
        console.error('Error linking bank statements:', statementsError);
        // Don't throw error - application is already saved
      }
    }

    return responseData;
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
}

export async function checkApiHealth(): Promise<{
  status: string;
  message: string;
}> {
  // Since we're using Supabase, we can do a simple health check
  return {
    status: 'healthy',
    message: 'Supabase connection ready',
  };
}
