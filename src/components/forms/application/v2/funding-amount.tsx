'use client';

import React, { useState, useEffect } from 'react';
import { FormData } from '@/types';
import ApplicationStepWrapper from './ApplicationStepWrapper';
import { useApplicationStep } from '@/contexts/';
import CardWithRadio from '../../fields/CardWithRadio';

const CURRENT_STEP_ID = 'funding-amount';

const fundingAmountOptions = [
  { value: '$5K–$10K', label: '$5K–$10K' },
  { value: '$10K–$25K', label: '$10K–$25K' },
  { value: '$25K–$50K', label: '$25K–$50K' },
  { value: '$50K–$100K', label: '$50K–$100K' },
  { value: '$100K–$150K', label: '$100K–$150K' },
  { value: '$150K–$250K', label: '$150K–$250K' },
  { value: '$250K–$500K', label: '$250K–$500K' },
  { value: '$500K+', label: '$500K+' },
];

const FundingAmount = () => {
  const { formData, saveFormData, isStepCompleted, moveForward, isNavigating } =
    useApplicationStep(CURRENT_STEP_ID);

  const [localFormData, setLocalFormData] = useState<FormData>({
    fundingAmount: '',
  });

  // Initialize form data
  useEffect(() => {
    const initialData = {
      fundingAmount: formData.fundingAmount || '',
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
      title="Funding Amount"
      description="How much funding do you need?"
      onNext={handleNext}
      canGoNext={canGoNext}
      isSubmitting={isNavigating}
      stepId={CURRENT_STEP_ID}
    >
      <CardWithRadio
        onChange={(value) => handleInputChange('fundingAmount', value)}
        options={fundingAmountOptions}
        value={localFormData.fundingAmount}
      />
    </ApplicationStepWrapper>
  );
};

export default FundingAmount;
