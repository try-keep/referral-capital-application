'use client';

import React, { useEffect, useState } from 'react';
import { useApplicationStep } from '@/contexts/';
import ApplicationStepWrapper from '@/components/forms/application/v2/ApplicationStepWrapper';
import CardWithRadio from '../../fields/CardWithRadio';
import { FormData } from '@/types';

const fundingPurposeOptions = [
  { value: 'business-loan', label: 'A business loan' },
  { value: 'line-of-credit', label: 'A line of credit' },
  { value: 'both', label: 'Both' },
];

const CURRENT_STEP_ID = 'type-of-funding';
const TypeOfFunding = () => {
  const {
    formData,
    saveFormData,
    isStepCompleted,
    moveForward,
    isNavigating,
    moveBackward,
  } = useApplicationStep(CURRENT_STEP_ID);

  const [localFormData, setLocalFormData] = useState<FormData>({
    loanType: '',
  });

  useEffect(() => {
    setLocalFormData({
      loanType: formData.loanType || '',
    });
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...localFormData, [field]: value };
    setLocalFormData(updatedData);
    saveFormData(updatedData);
  };

  const canGoNext = isStepCompleted('type-of-funding') && !isNavigating;
  const handleNext = async () => {
    try {
      await moveForward(localFormData);
    } catch (error) {
      console.error('Error moving to next step:', error);
    }
  };

  return (
    <ApplicationStepWrapper
      title="What is the type of funding you are requesting?"
      onNext={handleNext}
      canGoNext={canGoNext}
      isSubmitting={isNavigating}
      stepId={CURRENT_STEP_ID}
      onBack={() => {
        moveBackward();
      }}
    >
      <CardWithRadio
        onChange={(value) => handleInputChange('loanType', value)}
        options={fundingPurposeOptions}
        value={localFormData.loanType}
      />
    </ApplicationStepWrapper>
  );
};

export default TypeOfFunding;
