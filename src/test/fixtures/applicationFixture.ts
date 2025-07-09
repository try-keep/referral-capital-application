import { ApplicationData } from '@/lib/api';
import { generateEntityFromMock } from '../types/';

export const APPLICATION_MOCK: ApplicationData = {
  // Step 1: Loan Type
  loanType: 'business_loan',

  // Step 2: Business Owner
  isBusinessOwner: 'yes',
  owns_more_than_50pct: 'yes',

  // Step 3: Monthly Sales
  monthlySales: '50000',

  // Step 4: Existing Loans
  hasExistingLoans: 'yes',
  totalLoanAmount: '75000',

  // Step 5: Business Search
  businessName: 'Test Business Inc.',
  businessSearchVerified: 'verified',

  // Step 6: Bank Connection
  bankConnected: 'yes',
  bankConnectionMethod: 'plaid',

  // Step 7: Personal Information
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@testbusiness.com',
  phone: '416-555-0123',
  dateOfBirth: '1985-03-15',
  ssn: '1234',

  // Step 8: Funding Amount
  fundingAmount: '100000',
  fundingTimeline: '6',

  // Step 9: Funding Purpose
  fundingPurpose: 'working_capital',

  // Step 10: Business Details
  businessType: 'corporation',
  numberOfEmployees: '25',

  // Step 11: Financial Information
  annualRevenue: '1200000',
  cashFlow: '150000',
  creditScore: '750',
  timeInBusiness: '5',

  // Step 12: Bank Information
  bankConnectionCompleted: true,
  skippedBankConnection: false,

  // Step 13: Additional Details
  businessAddress: '123 Business Street, Toronto, ON M5V 2H1',
  businessPhone: '416-555-0100',
  websiteUrl: 'https://testbusiness.com',
  additionalInfo: 'Test business for application processing',

  // Step 14: Review & Submit
  agreesToTerms: 'true',
  authorizesCreditCheck: 'true',

  // Application Status
  ipAddress: '192.168.1.100',

  // Business Reference
  businessId: '1',
};

export const generateApplicationMock = generateEntityFromMock(APPLICATION_MOCK);
