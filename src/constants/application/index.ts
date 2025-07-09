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
    id: 'analyzing',
    label: 'Analyzing Profile',
    description: 'Analyzing Your Business Profile',
    requiredFields: ['analysis'],
  },
  {
    id: 'match-result',
    label: 'Match Results',
    description: 'Perfect! You qualify for funding.',
    requiredFields: ['TierResult'],
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
      'analyzing',
      'match-result',
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
  for (let i = 0; i < APPLICATION_STEPS.length; i++) {
    const current = APPLICATION_STEPS[i].id;
    const previous = i > 0 ? APPLICATION_STEPS[i - 1].id : null;
    const next =
      i < APPLICATION_STEPS.length - 1 ? APPLICATION_STEPS[i + 1].id : null;
    map[current] = { previous, next };
  }
  return map;
})();
