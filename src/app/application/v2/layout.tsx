'use client';

import React, { useState } from 'react';
import { APPLICATION_STEPS } from '@/constants/application';
import ProgressSidebar from '@/components/ProgressSidebar';
import DevView from '@/components/DevView';
import { FormData } from '@/types';
import { ApplicationContextProvider, useApplicationContext } from '@/contexts/';
import { ApplicationStepId } from '@/contexts/application/types';
import { user } from '@/client';

interface ApplicationLayoutProps {
  children: React.ReactNode;
}

const stepChangeSideEffects = async (
  stepId: ApplicationStepId,
  data: FormData
) => {
  console.debug('Step changed to:', stepId, data);
  await user.upsert(data);
};

// Inner component that uses the context
const ApplicationLayoutContent: React.FC<ApplicationLayoutProps> = ({
  children,
}) => {
  const [showProgressSidebar, setShowProgressSidebar] = useState(true);

  const {
    formData,
    currentStepId,
    isStepCompleted,
    moveToStep,
    getTotalSteps,
    getCompletedStepsCount,
  } = useApplicationContext();

  const toggleProgressSidebar = () => {
    setShowProgressSidebar((prev) => !prev);
  };

  const jumpToStep = async (stepId: string) => {
    try {
      await moveToStep(stepId as any);
    } catch (error) {
      console.error('Error jumping to step:', error);
    }
  };

  const totalSteps = getTotalSteps();
  const completedSteps = getCompletedStepsCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-none mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Progress */}
          <ProgressSidebar
            show={showProgressSidebar}
            onToggle={toggleProgressSidebar}
            completedSteps={completedSteps}
            totalSteps={totalSteps}
            applicationSteps={APPLICATION_STEPS}
            isStepCompleted={isStepCompleted}
            currentStepId={currentStepId}
            jumpToStep={jumpToStep}
          />
          {/* Main Content */}
          <div className="col-span-1 lg:col-span-12 lg:col-start-3 lg:col-end-11">
            <div className="bg-white rounded-lg shadow-lg p-6 min-h-[500px] flex flex-col max-w-4xl mx-auto">
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full">{children}</div>
              </div>
            </div>
          </div>
          {/* Right Sidebar - Dev View */}
          <DevView data={formData} title="Application Data" />
        </div>
      </div>
    </div>
  );
};

// Main layout component that provides the context
export default function ApplicationLayout({
  children,
}: ApplicationLayoutProps) {
  return (
    <ApplicationContextProvider
      initialStepId="funding-amount"
      onStepChange={(stepId, data) => {
        stepChangeSideEffects(stepId, data);
      }}
      onComplete={(data) => {
        console.debug('Application completed:', data);
      }}
    >
      <ApplicationLayoutContent>{children}</ApplicationLayoutContent>
    </ApplicationContextProvider>
  );
}
