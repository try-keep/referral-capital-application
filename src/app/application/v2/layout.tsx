'use client';

import React, { useState } from 'react';
import { APPLICATION_STEPS } from '@/constants/application';
import ProgressSidebar from '@/components/ProgressSidebar';
import DevView from '@/components/DevView';
import { FormData } from '@/types';
import { ApplicationContextProvider, useApplicationContext } from '@/contexts/';
import { ApplicationStepId } from '@/contexts/application/types';
import { user } from '@/client';
import { useColorfulBackground } from '@/hooks/';
import Image from 'next/image';

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

  const { formData, currentStepId, isStepCompleted, moveToStep } =
    useApplicationContext();
  const { getPageContainerProps } = useColorfulBackground();

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

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
      style={getPageContainerProps()}
    >
      <div className="max-w-none mx-auto px-6 py-6">
        <div className="flex flex-col items-center justify-center mt-[68px] max-w[720px] w-full">
          <div className="flex justify-center mb-12 ">
            <Image
              src="/svgs/logos/full-keep-logo.svg"
              alt="Keep Capital"
              width={42}
              height={140}
              className="h-10 w-auto"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
            {/* Left Sidebar - Progress */}
            <ProgressSidebar
              show={showProgressSidebar}
              onToggle={toggleProgressSidebar}
              isStepCompleted={isStepCompleted}
              currentStepId={currentStepId}
              jumpToStep={jumpToStep}
            />
            {/* Main Content */}
            <div className="col-span-1 lg:col-span-12 lg:col-start-3 lg:col-end-11">
              <div className=" bg-transparent sm:bg-white rounded-2xl  p-6 min-h-[500px] flex flex-col max-w-4xl mx-auto sm:border border-0 border-soft">
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full">{children}</div>
                </div>
              </div>
            </div>
            {/* Right Sidebar - Dev View */}
            {/*     <DevView data={formData} title="Application Data" /> */}
          </div>
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
