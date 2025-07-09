'use client';

import React, { useState, useEffect } from 'react';
import { type FormData } from '@/types';
import ApplicationStepWrapper from './ApplicationStepWrapper';
import CardWithRadio from '../../fields/CardWithRadio';
import { useApplicationStep } from '@/contexts/';

const options = [
  { value: '< 6 months', label: 'Less than 6 months' },
  { value: '6–12 months', label: '6–12 months' },
  { value: '1–3 years', label: '1–3 years' },
  { value: '3+ years', label: '3+ years' },
];

const CURRENT_STEP_ID = 'time-in-business';

export default function TimeInBusiness() {
  const { formData, saveFormData, isStepCompleted, moveForward, isNavigating ,moveBackward} =
    useApplicationStep(CURRENT_STEP_ID);

  const [localFormData, setLocalFormData] = useState<FormData>({
    timeInBusiness: '',
  });

  useEffect(() => {
    const initialData = {
      timeInBusiness: formData.timeInBusiness || '',
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
      title="How much funding do you need?"
      description="Select the amount that best fits your business needs"
      onNext={handleNext}
      canGoNext={!!canGoNext}
      isSubmitting={isNavigating}
      stepId={CURRENT_STEP_ID}
      onBack={() => {
        moveBackward();
      }}
    >
      <CardWithRadio
        onChange={(value) => handleInputChange('timeInBusiness', value)}
        options={options}
        value={localFormData.timeInBusiness}
      />
    </ApplicationStepWrapper>
  );
}
