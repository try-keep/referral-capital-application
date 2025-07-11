import { ApplicationStepInfo, StepId } from '@/constants/application';
import { FormData } from '@/types';

// Application step types
export type ApplicationStepId = StepId;

export interface ApplicationContextState {
  // Current application data
  formData: FormData;
  currentStepId: ApplicationStepId;

  // Loading states
  isNavigating: boolean;
  isLoading: boolean;

  // Step validation
  isStepCompleted: (stepId: ApplicationStepId) => boolean;

  // Navigation handlers
  moveForward: (data?: Partial<FormData>) => Promise<void>;
  moveBackward: (data?: Partial<FormData>) => Promise<void>;
  moveToStep: (
    targetStepId: ApplicationStepId,
    data?: Partial<FormData>
  ) => Promise<void>;

  // Data management
  saveFormData: (data: Partial<FormData>) => void;
  clearFormData: () => void;

  // Step information
  getTotalSteps: () => number;
  getCompletedStepsCount: () => number;
  submit: () => Promise<void>;
  getStep: (stepId: ApplicationStepId) => ApplicationStepInfo;
}
