// Application steps definition for navigation, validation, and display

export interface ApplicationStep {
  id: string;
  label: string;
  description?: string;
  requiredFields?: string[];
}

export const APPLICATION_STEPS: ApplicationStep[] = [
  {
    id: 'funding-amount',
    label: 'Funding Amount',
    description: 'How much funding do you need?',
    requiredFields: ['fundingAmount'],
  },
  {
    id: 'time-in-business',
    label: 'Time in Business',
    description: 'How long has your business been operating?',
    requiredFields: ['timeInBusiness'],
  },
  {
    id: 'monthly-sales',
    label: 'Average Monthly Sales',
    description: 'What is your average monthly sales for the last 6 months?',
    requiredFields: ['monthlySales'],
  },
  {
    id: 'credit-score',
    label: 'Personal Credit Score',
    description: 'What is your personal credit score?',
    requiredFields: ['creditScore'],
  },
  {
    id: 'profile-analysis',
    label: 'Profile Analysis',
    description: 'Analyzing Your Business Profile',
    requiredFields: ['tierResult'],
  },
  {
    id: 'email-address',
    label: 'Email Address',
    description: 'What is your email address?',
    requiredFields: ['email'],
  },
  {
    id: 'personal-details',
    label: 'Personal Details',
    description: 'Enter your personal information',
    requiredFields: ['firstName', 'lastName', 'phone', 'dateOfBirth'],
  },
  {
    id: 'personal-address',
    label: 'Personal Address',
    description: 'What is your personal address?',
    requiredFields: ['addressLine1', 'city', 'province', 'postalCode'],
  },
  {
    id: 'business-information',
    label: 'Business Information',
    description: 'Business Information',
    requiredFields: ['businessName', 'businessIndustry'],
  },
  {
    id: 'business-address',
    label: 'Business Address & Contact Information',
    description: 'Business Address & Contact Information',
    requiredFields: [],
  },
  {
    id: 'business-entity-type',
    label: 'Business Entity Type',
    description: 'What is your business entity type?',
    requiredFields: ['entityType'],
  },
  {
    id: 'number-of-employees',
    label: 'Number of Employees',
    description: 'How many employees does your business have?',
    requiredFields: ['numberOfEmployees'],
  },
  {
    id: 'funding-timeline',
    label: 'Funding Timeline',
    description: 'When do you need the funding?',
    requiredFields: ['fundingTimeline'],
  },
  {
    id: 'funding-purpose',
    label: 'Funding Purpose',
    description: 'What is the primary purpose for this funding?',
    requiredFields: ['fundingPurpose'],
  },
  {
    id: 'type-of-funding',
    label: 'Type of Funding Requested',
    description: 'What type of funding are you requesting?',
    requiredFields: ['loanType'],
  },
  {
    id: 'existing-loans',
    label: 'Existing Business Loans',
    description: 'Do you have any existing business loans?',
    requiredFields: ['hasExistingLoans', 'existingLoans'],
  },
  {
    id: 'business-ownership',
    label: 'Business Ownership & Authorization',
    description:
      'Are you an owner of the business, or are you authorized to secure capital on its behalf?',
    requiredFields: ['owns_more_than_50pct', 'isBusinessOwner'],
  },
  {
    id: 'bank-account-connection',
    label: 'Bank Account Connection',
    description: 'Connect your business bank account',
    requiredFields: [],
  },
  {
    id: 'submit',
    label: 'Review & Submit',
    description: 'Review & Submit Your Application',
    requiredFields: ['submittedAt'],
  },
];

export interface ApplicationStepGroup {
  title: string;
  stepIds: string[];
}

export const APPLICATION_STEP_GROUPS: ApplicationStepGroup[] = [
  {
    title: 'Basic Info',
    stepIds: [
      'funding-amount',
      'time-in-business',
      'monthly-sales',
      'credit-score',
      'profile-analysis',
    ],
  },
  {
    title: 'Personal Info',
    stepIds: ['email-address', 'personal-details', 'personal-address'],
  },
  {
    title: 'Business Info',
    stepIds: [
      'business-information',
      'business-address',
      'business-entity-type',
      'number-of-employees',
      'funding-timeline',
      'funding-purpose',
      'type-of-funding',
      'existing-loans',
      'business-ownership',
      'bank-account-connection',
      'submit',
    ],
  },
];

// Step navigation map for v2 application
export const APPLICATION_V2_ROUTES_MAP: Record<
  ApplicationStep['id'],
  { previous: string | null; next: string | null }
> = (() => {
  const map: Record<
    ApplicationStep['id'],
    { previous: string | null; next: string | null }
  > = {};

  // Create a flat list of all step IDs from all groups
  const allStepIds = APPLICATION_STEP_GROUPS.flatMap((group) => group.stepIds);

  for (let i = 0; i < allStepIds.length; i++) {
    const current = allStepIds[i];
    const previous = i > 0 ? allStepIds[i - 1] : null;
    const next = i < allStepIds.length - 1 ? allStepIds[i + 1] : null;
    map[current] = { previous, next };
  }

  return map;
})();
