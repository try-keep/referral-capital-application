import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import {
  APPLICATION_STEP_GROUPS,
  APPLICATION_STEPS,
} from '../constants/application';
import { ApplicationStepId } from '@/contexts/application/types';

interface ProgressSidebarProps {
  show: boolean;
  onToggle: () => void;
  isStepCompleted: (stepId: ApplicationStepId) => boolean;
  currentStepId: ApplicationStepId;
  jumpToStep: (stepId: string) => void;
}

const ProgressSidebar: React.FC<ProgressSidebarProps> = ({
  show,
  onToggle,
  isStepCompleted,
  currentStepId,
  jumpToStep,
}) => {
  if (!show) {
    return (
      <div className="hidden lg:flex lg:col-span-1 justify-center items-start pt-4">
        <button
          onClick={onToggle}
          className="btn-primary text-sm whitespace-nowrap"
          title="Show Progress Sidebar"
        >
          <Eye className="h-4 w-4" />
          <span>Show Progress</span>
        </button>
      </div>
    );
  }

  return (
    <div className="hidden lg:block lg:col-span-2">
      <div className="bg-white rounded-lg shadow-lg p-4 h-fit max-h-[calc(100vh-3rem)] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Progress Overview
          </h3>
          <button
            onClick={onToggle}
            className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors duration-200"
            title="Hide Progress Sidebar"
          >
            <EyeOff className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4">
          {APPLICATION_STEP_GROUPS.map((group) => {
            // Get the steps for this group
            const groupSteps = group.stepIds
              .map((stepId) => {
                const step = APPLICATION_STEPS[stepId];
                return step ? { id: step.id, label: step.label } : null;
              })
              .filter(Boolean) as { id: string; label: string }[];

            // Calculate completed steps for this group
            const groupCompletedSteps = groupSteps.filter((step) =>
              isStepCompleted(step.id as ApplicationStepId)
            ).length;

            return (
              <div key={group.title} className="space-y-2">
                <div className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-sm text-gray-700">
                    {group.title}
                  </h4>
                  <span className="text-xs font-medium text-gray-500">
                    {groupCompletedSteps}/{groupSteps.length}
                  </span>
                </div>
                <div className="ml-6 space-y-1">
                  {groupSteps.map((step) => {
                    const isCompleted = isStepCompleted(
                      step.id as ApplicationStepId
                    );
                    const isCurrent = currentStepId === step.id;
                    return (
                      <button
                        key={step.id}
                        onClick={() => jumpToStep(step.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all duration-200 hover:bg-gray-50 ${
                          isCurrent
                            ? 'bg-blue-50 border border-blue-200'
                            : isCompleted
                              ? 'bg-green-50 border border-green-200'
                              : 'border border-gray-200'
                        }`}
                      >
                        <span
                          className={`text-sm ${
                            isCurrent
                              ? 'text-blue-700 font-medium'
                              : isCompleted
                                ? 'text-green-700'
                                : 'text-gray-600'
                          }`}
                        >
                          {step.label}
                        </span>
                        {isCompleted && (
                          <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                            <svg
                              className="h-3 w-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              style={{
                                marginTop: '2px',
                                marginLeft: '1px',
                              }}
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressSidebar;
