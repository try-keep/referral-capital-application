import React from 'react';
import { FormData } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApplicationContext } from '@/contexts/';
import Spinner from '@/components/Spinner';

interface ApplicationStepWrapperProps {
  title: string;
  description?: string;
  onNext?: (data: FormData) => void;
  onBack?: () => void;
  canGoNext?: boolean;
  isSubmitting?: boolean;
  stepId: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

const ApplicationStepWrapper: React.FC<ApplicationStepWrapperProps> = ({
  title,
  description,
  onNext,
  onBack,
  canGoNext = true,
  isSubmitting = false,
  children,
  stepId,
  ...props
}) => {
  const { moveForward, moveBackward, isNavigating, formData } =
    useApplicationContext();

  const handleNext = async () => {
    try {
      if (onNext) {
        onNext(formData);
      } else {
        await moveForward();
      }
    } catch (error) {
      console.error('Error moving to next step:', error);
    }
  };

  const handleBack = async () => {
    try {
      if (onBack) {
        onBack();
      } else {
        await moveBackward();
      }
    } catch (error) {
      console.error('Error moving to previous step:', error);
    }
  };

  const isLoading = isNavigating || isSubmitting;

  return (
    <div
      className="w-full max-w-4xl mx-auto h-full flex flex-col justify-center gap-8"
      id={`${stepId}-step`}
    >
      <div className="text-center mt-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        {description && <p className="text-lg text-gray-600">{description}</p>}
      </div>
      {props.isLoading ? (
        <Spinner />
      ) : (
        <>
          {children}
          <div
            className={`flex items-center ${onBack ? 'justify-between' : 'justify-end'} mt-28 pt-6 border-t border-gray-200`}
          >
            {onBack && (
              <button
                onClick={handleBack}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 btn-secondary"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
            )}
            {onNext && (
              <button
                onClick={handleNext}
                disabled={!canGoNext || isLoading}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                  canGoNext && !isLoading
                    ? 'btn-primary'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ApplicationStepWrapper;
