// Application steps definition for navigation, validation, and display

export interface ApplicationStep {
  id: string;
  label: string;
  description?: string;
  requiredFields?: string[];
}

export interface ApplicationStepInfo {
  step: ApplicationStep;
  stepId: StepId;
  label: string;
  description?: string;
  requiredFields: string[];
  group: ApplicationStepGroup | null;
  groupTitle: string | null;
  stepIndexInGroup: number;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  groupProgress: number;
  overallProgress: number;
  nextInGroup: StepId | null;
  prevInGroup: StepId | null;
  nextStep: StepId | null;
  prevStep: StepId | null;
  isFirstStep: boolean;
  isLastStep: boolean;
}

// Define step IDs as a const array for type safety
export const STEP_IDS = [
  'funding-amount',
  'time-in-business',
  'monthly-sales',
  'credit-score',
  'profile-analysis',
  'email-address',
  'personal-details',
  'personal-address',
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
] as const;

// Create a type from the step IDs
export type StepId = (typeof STEP_IDS)[number];

// Single data structure with type-safe access by step ID
export const APPLICATION_STEPS: Record<StepId, ApplicationStep> = {
  'funding-amount': {
    id: 'funding-amount',
    label: 'Funding Amount',
    description: 'How much funding do you need?',
    requiredFields: ['fundingAmount'],
  },
  'time-in-business': {
    id: 'time-in-business',
    label: 'Time in Business',
    description: 'How long has your business been operating?',
    requiredFields: ['timeInBusiness'],
  },
  'monthly-sales': {
    id: 'monthly-sales',
    label: 'Average Monthly Sales',
    description: 'What is your average monthly sales for the last 6 months?',
    requiredFields: ['monthlySales'],
  },
  'credit-score': {
    id: 'credit-score',
    label: 'Personal Credit Score',
    description: 'What is your personal credit score?',
    requiredFields: ['creditScore'],
  },
  'profile-analysis': {
    id: 'profile-analysis',
    label: 'Profile Analysis',
    description: 'Analyzing Your Business Profile',
    requiredFields: ['tierResult'],
  },
  'email-address': {
    id: 'email-address',
    label: 'Email Address',
    description: 'What is your email address?',
    requiredFields: ['email'],
  },
  'personal-details': {
    id: 'personal-details',
    label: 'Personal Details',
    description: 'Enter your personal information',
    requiredFields: ['firstName', 'lastName', 'phone', 'dateOfBirth'],
  },
  'personal-address': {
    id: 'personal-address',
    label: 'Personal Address',
    description: 'What is your personal address?',
    requiredFields: ['addressLine1', 'city', 'province', 'postalCode'],
  },
  'business-information': {
    id: 'business-information',
    label: 'Business Information',
    description: 'Business Information',
    requiredFields: ['businessName', 'businessIndustry'],
  },
  'business-address': {
    id: 'business-address',
    label: 'Business Address & Contact Information',
    description: 'Business Address & Contact Information',
    requiredFields: [
      'businessAddressLine1',
      'businessCity',
      'businessProvince',
      'businessPostalCode',
      'businessPhone',
    ],
  },
  'business-entity-type': {
    id: 'business-entity-type',
    label: 'Business Entity Type',
    description: 'What is your business entity type?',
    requiredFields: ['entityType'],
  },
  'number-of-employees': {
    id: 'number-of-employees',
    label: 'Number of Employees',
    description: 'How many employees does your business have?',
    requiredFields: ['numberOfEmployees'],
  },
  'funding-timeline': {
    id: 'funding-timeline',
    label: 'Funding Timeline',
    description: 'When do you need the funding?',
    requiredFields: ['fundingTimeline'],
  },
  'funding-purpose': {
    id: 'funding-purpose',
    label: 'Funding Purpose',
    description: 'What is the primary purpose for this funding?',
    requiredFields: ['fundingPurpose'],
  },
  'type-of-funding': {
    id: 'type-of-funding',
    label: 'Type of Funding Requested',
    description: 'What type of funding are you requesting?',
    requiredFields: ['loanType'],
  },
  'existing-loans': {
    id: 'existing-loans',
    label: 'Existing Business Loans',
    description: 'Do you have any existing business loans?',
    requiredFields: ['hasExistingLoans', 'existingLoans'],
  },
  'business-ownership': {
    id: 'business-ownership',
    label: 'Business Ownership & Authorization',
    description:
      'Are you an owner of the business, or are you authorized to secure capital on its behalf?',
    requiredFields: ['owns_more_than_50pct', 'isBusinessOwner'],
  },
  'bank-account-connection': {
    id: 'bank-account-connection',
    label: 'Bank Account Connection',
    description: 'Connect your business bank account',
    requiredFields: [],
  },
  submit: {
    id: 'submit',
    label: 'Review & Submit',
    description: 'Review & Submit Your Application',
    requiredFields: ['submittedAt'],
  },
} as const;

// Helper function for type-safe step access
export const getStep = (stepId: StepId): ApplicationStep => {
  return APPLICATION_STEPS[stepId];
};

// Helper function to get step label
export const getStepLabel = (stepId: StepId): string => {
  return APPLICATION_STEPS[stepId].label;
};

// Helper function to get step description
export const getStepDescription = (stepId: StepId): string | undefined => {
  return APPLICATION_STEPS[stepId].description;
};

// Helper function to get required fields
export const getStepRequiredFields = (stepId: StepId): string[] | undefined => {
  return APPLICATION_STEPS[stepId].requiredFields;
};

// Helper function to get the step group that contains a given step
export const getStepGroup = (stepId: StepId): ApplicationStepGroup | null => {
  return (
    APPLICATION_STEP_GROUPS.find((group) => group.stepIds.includes(stepId)) ||
    null
  );
};

// Helper function to get the index of a step within its group
export const getStepIndexInGroup = (stepId: StepId): number => {
  const group = getStepGroup(stepId);
  if (!group) return -1;
  return group.stepIds.indexOf(stepId);
};

// Helper function to get progress within a step group (0-100)
export const getStepGroupProgress = (stepId: StepId): number => {
  const group = getStepGroup(stepId);
  if (!group) return 0;

  const currentIndex = getStepIndexInGroup(stepId);
  if (currentIndex === -1) return 0;

  // Calculate progress as percentage (0-100)
  return Math.round(((currentIndex + 1) / group.stepIds.length) * 100);
};

// Helper function to get progress within a specific step group
export const getProgressInGroup = (
  stepId: StepId,
  groupTitle: string
): number => {
  const group = APPLICATION_STEP_GROUPS.find((g) => g.title === groupTitle);
  if (!group) return 0;

  const currentIndex = group.stepIds.indexOf(stepId);
  if (currentIndex === -1) return 0;

  return Math.round(((currentIndex + 1) / group.stepIds.length) * 100);
};

// Helper function to get overall application progress (0-100)
export const getOverallProgress = (stepId: StepId): number => {
  const allStepIds = APPLICATION_STEP_GROUPS.flatMap((group) => group.stepIds);
  const currentIndex = allStepIds.indexOf(stepId);

  if (currentIndex === -1) return 0;

  return Math.round(((currentIndex + 1) / allStepIds.length) * 100);
};

// Helper function to get the next step in the same group
export const getNextStepInGroup = (stepId: StepId): StepId | null => {
  const group = getStepGroup(stepId);
  if (!group) return null;

  const currentIndex = getStepIndexInGroup(stepId);
  if (currentIndex === -1 || currentIndex >= group.stepIds.length - 1)
    return null;

  return group.stepIds[currentIndex + 1];
};

// Helper function to get the previous step in the same group
export const getPreviousStepInGroup = (stepId: StepId): StepId | null => {
  const group = getStepGroup(stepId);
  if (!group) return null;

  const currentIndex = getStepIndexInGroup(stepId);
  if (currentIndex <= 0) return null;

  return group.stepIds[currentIndex - 1];
};

// Helper function to get comprehensive current step information
export const getCurrentStepInfo = (stepId: StepId): ApplicationStepInfo => {
  const step = APPLICATION_STEPS[stepId];
  const group = getStepGroup(stepId);
  const stepIndex = getStepIndexInGroup(stepId);
  const groupProgress = getStepGroupProgress(stepId);
  const overallProgress = getOverallProgress(stepId);
  const nextInGroup = getNextStepInGroup(stepId);
  const prevInGroup = getPreviousStepInGroup(stepId);
  const nextStep = APPLICATION_V2_ROUTES_MAP[stepId]?.next || null;
  const prevStep = APPLICATION_V2_ROUTES_MAP[stepId]?.previous || null;

  return {
    // Step details
    step,
    stepId,
    label: step.label,
    description: step.description,
    requiredFields: step.requiredFields ?? [],

    // Group context
    group,
    groupTitle: group?.title || null,
    stepIndexInGroup: stepIndex,
    isFirstInGroup: stepIndex === 0,
    isLastInGroup: group ? stepIndex === group.stepIds.length - 1 : false,

    // Progress information
    groupProgress,
    overallProgress,

    // Navigation
    nextInGroup,
    prevInGroup,
    nextStep,
    prevStep,

    // Group navigation
    isFirstStep: prevStep === null,
    isLastStep: nextStep === null,
  };
};

// Helper function to get step with navigation context
export const getStepWithNavigation = (stepId: StepId) => {
  const step = APPLICATION_STEPS[stepId];
  const nextStep = APPLICATION_V2_ROUTES_MAP[stepId]?.next || null;
  const prevStep = APPLICATION_V2_ROUTES_MAP[stepId]?.previous || null;

  return {
    ...step,
    nextStep,
    prevStep,
    hasNext: nextStep !== null,
    hasPrevious: prevStep !== null,
  };
};

// Helper function to get step with group context
export const getStepWithGroupContext = (stepId: StepId) => {
  const step = APPLICATION_STEPS[stepId];
  const group = getStepGroup(stepId);
  const stepIndex = getStepIndexInGroup(stepId);
  const groupProgress = getStepGroupProgress(stepId);

  return {
    ...step,
    group,
    stepIndexInGroup: stepIndex,
    groupProgress,
    isFirstInGroup: stepIndex === 0,
    isLastInGroup: group ? stepIndex === group.stepIds.length - 1 : false,
  };
};

// Helper function to check if a step is completed (has required fields)
export const isStepCompleted = (
  stepId: StepId,
  formData: Record<string, any>
): boolean => {
  const step = APPLICATION_STEPS[stepId];
  if (!step.requiredFields || step.requiredFields.length === 0) return true;

  return step.requiredFields.every((field) => {
    const value = formData[field];
    return value !== undefined && value !== null && value !== '';
  });
};

// Helper function to get all completed steps
export const getCompletedSteps = (formData: Record<string, any>): StepId[] => {
  return STEP_IDS.filter((stepId) => isStepCompleted(stepId, formData));
};

// Helper function to get all incomplete steps
export const getIncompleteSteps = (formData: Record<string, any>): StepId[] => {
  return STEP_IDS.filter((stepId) => !isStepCompleted(stepId, formData));
};

// Helper function to get the next incomplete step
export const getNextIncompleteStep = (
  formData: Record<string, any>
): StepId | null => {
  const incompleteSteps = getIncompleteSteps(formData);
  return incompleteSteps.length > 0 ? incompleteSteps[0] : null;
};

export interface ApplicationStepGroup {
  title: string;
  stepIds: StepId[];
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
    title: 'Applicant Info',
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
  StepId,
  { previous: StepId | null; next: StepId | null }
> = (() => {
  const map: Record<StepId, { previous: StepId | null; next: StepId | null }> =
    {} as Record<StepId, { previous: StepId | null; next: StepId | null }>;

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
