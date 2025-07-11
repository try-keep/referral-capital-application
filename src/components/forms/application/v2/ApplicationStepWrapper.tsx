import React from 'react';
import { FormData } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApplicationContext } from '@/contexts/';
import Spinner from '@/components/Spinner';
import ProgressBar from '@/components/ProgressBar';
import { getCurrentStepInfo } from '@/constants/application';
import { ApplicationStepId } from '@/contexts/application/types';
import { isDefined } from '@/utils';

interface ApplicationStepWrapperProps {
  title?: string;
  description?: string;
  onNext?: (data: FormData) => void;
  onBack?: () => void;
  canGoNext?: boolean;
  isSubmitting?: boolean;
  stepId: ApplicationStepId;
  children: React.ReactNode;
  isLoading?: boolean;
  hideProgress?: boolean;
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
  const stepInfo = getCurrentStepInfo(stepId);

  return (
    <div
      className="w-full max-w-4xl mx-auto h-full flex flex-col justify-center gap-8"
      id={`${stepId}-step`}
    >
      <div className="flex flex-col gap-[24px]">
        <div
          className={`flex flex-col gap-[32px] ${
            !isDefined(title) && !isDefined(description) && props.hideProgress
              ? 'hidden'
              : ''
          }`}
        >
          <div
            className={`flex items-center gap-2 flex-col ${props.hideProgress ? 'hidden' : ''}`}
          >
            <div className="flex justify-between w-full">
              <span className="text-sm text-gray-500">
                {stepInfo.groupTitle}
              </span>
              <span className="text-sm text-gray-500">
                {stepInfo.stepIndexInGroup + 1}/{stepInfo.group?.stepIds.length}
              </span>
            </div>
            <ProgressBar
              className={`gradient-red-orange`}
              progress={stepInfo.groupProgress}
            />
          </div>

          <div className={`text-center`}>
            {isDefined(title) && (
              <h1 className="text-3xl font-semibold text-primary">{title}</h1>
            )}
            {description && (
              <p className="text-secondary font-extralight">{description}</p>
            )}
          </div>
        </div>
        {props.isLoading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col gap-[80px] w-full">
            {children}
            <div
              className={`flex items-center ${onBack ? 'justify-between' : 'justify-end'} pt-[32px] border-t border-gray-200 gap-[16px] ${!isDefined(onBack) && !isDefined(onNext) ? 'hidden' : ''}`}
            >
              {onBack && (
                <button
                  onClick={handleBack}
                  disabled={isLoading}
                  className="w-full flex items-center  justify-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 btn-secondary "
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span>Back</span>
                </button>
              )}
              {onNext && (
                <button
                  onClick={handleNext}
                  disabled={!canGoNext || isLoading}
                  className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationStepWrapper;
