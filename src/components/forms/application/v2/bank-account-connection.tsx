'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FormData } from '@/types';
import ApplicationStepWrapper from './ApplicationStepWrapper';
import { useApplicationStep } from '@/contexts/';

const CURRENT_STEP_ID = 'bank-account-connection';

const BankAccountConnection = () => {
  const { formData, saveFormData, isStepCompleted, moveForward, isNavigating } =
    useApplicationStep('bank-account-connection');

  const [localFormData, setLocalFormData] = useState<FormData>({});

  const canGoNext = isStepCompleted('bank-account-connection') && !isNavigating;
  const handleNext = async () => {
    try {
      await moveForward(localFormData);
    } catch (error) {
      console.error('Error moving to next step:', error);
    }
  };

  return (
    <ApplicationStepWrapper
      title="Bank Account Connection"
      description="Connect your business bank account"
      onNext={handleNext}
      canGoNext={canGoNext}
      isSubmitting={isNavigating}
      stepId={CURRENT_STEP_ID}
    >
      <p>WIP</p>
    </ApplicationStepWrapper>
  );
};

export default BankAccountConnection;
