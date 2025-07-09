'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApplicationContextProvider, useApplicationContext } from '@/contexts';
import { isDefined } from '@/utils';

function ApplicationV2PageContent() {
  const router = useRouter();

  const { currentStepId } = useApplicationContext();

  useEffect(() => {
    // Redirect to the current step
    if (isDefined(currentStepId)) {
      router.push(`/application/v2/${currentStepId}`);
    } else {
      router.push('/application/v2/funding-amount');
    }
  }, [router, currentStepId]);

  return (
    <div className="w-full max-w-4xl mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Your Application
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Let&apos;s get started with your funding application. We&apos;ll guide
          you through a few simple steps to understand your business needs.
        </p>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-500">Redirecting...</p>
        </div>
      </div>
    </div>
  );
}
export default function ApplicationV2Page() {
  return (
    <ApplicationContextProvider>
      <ApplicationV2PageContent />
    </ApplicationContextProvider>
  );
}
