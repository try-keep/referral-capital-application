import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  FC,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  APPLICATION_V2_ROUTES_MAP,
  APPLICATION_STEPS,
} from '@/constants/application';
import { FormData } from '@/types/form-data';
import { ApplicationContextState, ApplicationStepId } from './types';
import { ApplicationData, submitApplication } from '@/lib/api';
import { user } from '@/client';
import { APPLICATION_MOCK } from '@/test/fixtures/applicationFixture';

// Context creation
const ApplicationContext = createContext<ApplicationContextState | null>(null);

// Provider props
interface ApplicationContextProviderProps {
  children: ReactNode;
  initialStepId?: ApplicationStepId;
  onStepChange?: (stepId: ApplicationStepId, data: FormData) => void;
  onComplete?: (data: FormData) => void;
}

// Local storage key
const STORAGE_KEY = 'referralApplicationData';

// Helper functions
const loadFromStorage = (): FormData => {
  if (typeof window === 'undefined') return {};

  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : {};
  } catch (error) {
    console.error('Error loading application data from localStorage:', error);
    return {};
  }
};

const saveToStorage = (data: FormData): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving application data to localStorage:', error);
  }
};

const getStepRequiredFields = (stepId: ApplicationStepId): string[] => {
  const step = APPLICATION_STEPS.find((s) => s.id === stepId);
  return step?.requiredFields || [];
};

const isStepValid = (stepId: ApplicationStepId, data: FormData): boolean => {
  const requiredFields = getStepRequiredFields(stepId);
  return (
    requiredFields.length === 0 || requiredFields.every((field) => data[field])
  );
};

export const ApplicationContextProvider: FC<
  ApplicationContextProviderProps
> = ({
  children,
  initialStepId = APPLICATION_STEPS[0].id,
  onStepChange,
  onComplete,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({});
  const [currentStepId, setCurrentStepId] =
    useState<ApplicationStepId>(initialStepId);
  const [isNavigating, setIsNavigating] = useState(false);

  // Load initial data from localStorage
  useEffect(() => {
    const savedData = loadFromStorage();
    setFormData(savedData);

    // Set current step from saved data or initial
    if (
      savedData.currentStepId &&
      APPLICATION_STEPS.some((s) => s.id === savedData.currentStepId)
    ) {
      setCurrentStepId(savedData.currentStepId);
    }
  }, []);

  // Update form data
  const saveFormData = (data: Partial<FormData>) => {
    console.log('updating form data with', data, formData);
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    saveToStorage(updatedData);
  };

  // Clear all form data
  const clearFormData = () => {
    const clearedData = { currentStepId };
    setFormData(clearedData);
    saveToStorage(clearedData);
  };

  // Check if a step is completed
  const isStepCompleted = (stepId: ApplicationStepId): boolean => {
    return isStepValid(stepId, formData);
  };

  // Get current step information
  const getCurrentStep = () => {
    return APPLICATION_STEPS.find((s) => s.id === currentStepId);
  };

  // Get step index
  const getStepIndex = (stepId: ApplicationStepId): number => {
    return APPLICATION_STEPS.findIndex((s) => s.id === stepId);
  };

  // Get total steps count
  const getTotalSteps = (): number => {
    return APPLICATION_STEPS.length;
  };

  // Get completed steps count
  const getCompletedStepsCount = (): number => {
    return APPLICATION_STEPS.filter((step) => isStepCompleted(step.id)).length;
  };

  // Navigation handlers
  const moveForward = async (data?: Partial<FormData>): Promise<void> => {
    if (isNavigating) return;

    try {
      setIsNavigating(true);

      const routeInfo = APPLICATION_V2_ROUTES_MAP[currentStepId];
      const nextStepId = routeInfo.next as ApplicationStepId;

      // Validate current step
      if (!isStepCompleted(currentStepId)) {
        throw new Error(`Step ${currentStepId} is not completed`);
      }

      // Update form data if provided
      if (data) {
        saveFormData({ ...data, currentStepId: nextStepId });
      }

      // Get next step
      if (!routeInfo?.next) {
        // This is the last step, trigger completion
        if (onComplete) {
          onComplete(formData);
        }
        return;
      }

      // Update current step
      setCurrentStepId(nextStepId);

      // Call step change callback
      if (onStepChange) {
        onStepChange(nextStepId, { ...formData, ...data });
      }

      // Navigate to next step
      router.push(`/application/v2/${nextStepId}`);
    } catch (error) {
      console.error('Error moving forward:', error);
      throw error;
    } finally {
      console.log('setting is navigating to false as navigation is complete');

      setIsNavigating(false);
    }
  };

  const moveBackward = async (data?: Partial<FormData>): Promise<void> => {
    if (isNavigating) return;

    try {
      setIsNavigating(true);

      // Update form data if provided
      if (data) {
        saveFormData(data);
      }

      // Get previous step
      const routeInfo = APPLICATION_V2_ROUTES_MAP[currentStepId];
      if (!routeInfo?.previous) {
        throw new Error('No previous step available');
      }

      const previousStepId = routeInfo.previous as ApplicationStepId;

      // Update current step
      setCurrentStepId(previousStepId);

      // Call step change callback
      if (onStepChange) {
        onStepChange(previousStepId, { ...formData, ...data });
      }

      // Navigate to previous step
      router.push(`/application/v2/${previousStepId}`);
    } catch (error) {
      console.error('Error moving backward:', error);
      throw error;
    } finally {
      setIsNavigating(false);
    }
  };

  const moveToStep = async (
    targetStepId: ApplicationStepId,
    data?: Partial<FormData>
  ): Promise<void> => {
    if (isNavigating) return;

    try {
      setIsNavigating(true);

      // Update form data if provided
      if (data) {
        saveFormData(data);
      }

      // Validate target step exists
      if (!APPLICATION_STEPS.some((s) => s.id === targetStepId)) {
        throw new Error(`Invalid step ID: ${targetStepId}`);
      }

      // Update current step
      setCurrentStepId(targetStepId);

      // Call step change callback
      if (onStepChange) {
        onStepChange(targetStepId, { ...formData, ...data });
      }

      // Navigate to target step
      router.push(`/application/v2/${targetStepId}`);
    } catch (error) {
      console.error('Error moving to step:', error);
      throw error;
    } finally {
      setIsNavigating(false);
    }
  };

  const submit = async (): Promise<void> => {
    if (isNavigating) return;

    try {
      //REMOVE THIS
      await user.upsert({
        firstName: 'cesar',
        lastName: 'test',
        email: `cesar.test.${Date.now()}@test.com`,
      });
      const finalData = {
        ...APPLICATION_MOCK,
        ...formData,
      };
      //REMOVE THIS

      const response = await submitApplication(
        finalData as unknown as ApplicationData
      );

      // Fire Facebook Pixel conversion event for successful application submission
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'CompleteRegistration');
      }

      // Clear form data after successful submission so user can start fresh
      localStorage.removeItem('referralApplicationData');
      localStorage.removeItem('userId');
      console.log(
        '🧹 Form data and user session cleared after successful submission'
      );

      // Store application ID for success page (after clearing old data)
      localStorage.setItem('applicationId', response.applicationId.toString());
      localStorage.setItem('submissionSuccess', 'true');

      router.push('/success');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const contextValue: ApplicationContextState = {
    formData,
    currentStepId,
    isNavigating,
    isStepCompleted,
    moveForward,
    moveBackward,
    moveToStep,
    saveFormData,
    clearFormData,
    getCurrentStep,
    getStepIndex,
    getTotalSteps,
    getCompletedStepsCount,
    submit,
  };

  return (
    <ApplicationContext.Provider value={contextValue}>
      {children}
    </ApplicationContext.Provider>
  );
};

// Hook to use the application context
export const useApplicationContext = (): ApplicationContextState => {
  const context = useContext(ApplicationContext);

  if (!context) {
    throw new Error(
      'useApplicationContext must be used within an ApplicationContextProvider'
    );
  }

  return context;
};

// Hook for step-specific data management
export const useApplicationStep = (stepId: ApplicationStepId) => {
  const context = useApplicationContext();

  const isCurrentStep = context.currentStepId === stepId;
  const isCompleted = context.isStepCompleted(stepId);
  const stepIndex = context.getStepIndex(stepId);
  const step = APPLICATION_STEPS.find((s) => s.id === stepId);

  return {
    ...context,
    isCurrentStep,
    isCompleted,
    stepIndex,
    step,
    stepData: context.formData,
  };
};
