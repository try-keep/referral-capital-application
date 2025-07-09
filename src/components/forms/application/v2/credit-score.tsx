'use client';

import React, { useState, useEffect } from 'react';
import { type FormData } from '@/types';
import ApplicationStepWrapper from './ApplicationStepWrapper';
import CardWithRadio from '../../fields/CardWithRadio';
import { useApplicationStep } from '@/contexts/';

const options = [
  { value: 'very-poor', label: '(Below 550)' },
  { value: 'poor', label: '(551-599)' },
  { value: 'below-average', label: 'Below Average (600-649)' },
  { value: 'fair', label: 'Fair (650-699)' },
  { value: 'good', label: 'Good (700-749)' },
  { value: 'excellent', label: 'Excellent (750+)' },
];

const CURRENT_STEP_ID = 'credit-score';

export default function CreditScore() {
  const {
    formData,
    saveFormData,
    isStepCompleted,
    moveForward,
    isNavigating,
    moveBackward,
  } = useApplicationStep(CURRENT_STEP_ID);

  const [localFormData, setLocalFormData] = useState<FormData>({
    creditScore: '',
  });

  useEffect(() => {
    const initialData = {
      creditScore: formData.creditScore || '',
    };
    setLocalFormData(initialData);
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...localFormData, [field]: value };
    setLocalFormData(updatedData);
    saveFormData(updatedData);
  };

  const handleNext = async () => {
    try {
      await moveForward(localFormData);
    } catch (error) {
      console.error('Error moving to next step:', error);
    }
  };

  const canGoNext = isStepCompleted(CURRENT_STEP_ID) && !isNavigating;

  return (
    <ApplicationStepWrapper
      title="What is your personal credit score?"
      onNext={handleNext}
      canGoNext={!!canGoNext}
      isSubmitting={isNavigating}
      stepId={CURRENT_STEP_ID}
      onBack={() => {
        moveBackward();
      }}
    >
      <CardWithRadio
        onChange={(value) => handleInputChange('creditScore', value)}
        options={options}
        value={localFormData.creditScore}
      />
    </ApplicationStepWrapper>
  );
}
