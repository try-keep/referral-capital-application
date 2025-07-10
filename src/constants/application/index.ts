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
    id: 'submit',
    label: 'Review & Submit',
    description: 'Review & Submit Your Application',
    requiredFields: ['submittedAt'],
  },
] as const;

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
    stepIds: ['submit'],
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
