'use client';

import React, { useState, useEffect } from 'react';
import { type FormData } from '@/types';
import ApplicationStepWrapper from './ApplicationStepWrapper';
import CardWithRadio from '../../fields/CardWithRadio';
import { useApplicationStep } from '@/contexts/';

const options = [
  { value: 'Under $10K', label: 'Under $10K' },
  { value: '$10K-$25K', label: '$10K-$25K' },
  { value: '$25K-$50K', label: '$25K-$50K' },
  { value: '$50K-$100K', label: '$50K-$100K' },
  { value: '$100K+', label: '$100K+' },
];

const CURRENT_STEP_ID = 'monthly-sales';

export default function AverageMonthlySales() {
  const { formData, saveFormData, isStepCompleted, moveForward,moveBackward, isNavigating } =
    useApplicationStep(CURRENT_STEP_ID);

  const [localFormData, setLocalFormData] = useState<FormData>({
    monthlySales: '',
  });

  useEffect(() => {
    const initialData = {
      monthlySales: formData.monthlySales || '',
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
      title="What is your average monthly sales for the last 6 months?"
      onNext={handleNext}
      canGoNext={!!canGoNext}
      isSubmitting={isNavigating}
      stepId={CURRENT_STEP_ID}
      onBack={() => {
        moveBackward();
      }}
    >
      <CardWithRadio
        onChange={(value) => handleInputChange('monthlySales', value)}
        options={options}
        value={localFormData.monthlySales}
      />
    </ApplicationStepWrapper>
  );
}
