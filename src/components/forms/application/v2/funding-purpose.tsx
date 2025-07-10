'use client';

import React, { useEffect, useState } from 'react';
import { useApplicationStep } from '@/contexts/';
import ApplicationStepWrapper from '@/components/forms/application/v2/ApplicationStepWrapper';
import CardWithRadio from '../../fields/CardWithRadio';
import { FormData } from '@/types';

const fundingPurposeOptions = [
  { value: 'Business expansion', label: 'Business expansion' },
  { value: 'Marketing & advertising', label: 'Marketing & advertising' },
  { value: 'Cash flow management', label: 'Cash flow management' },
  { value: 'Refinance an existing loan', label: 'Refinance an existing loan' },
  { value: 'Pay taxes', label: 'Pay taxes' },
  {
    value: 'Vehicle purchase or leasing',
    label: 'Vehicle purchase or leasing',
  },
  {
    value: 'Real estate purchases or remodeling',
    label: 'Real estate purchases or remodeling',
  },
  { value: 'Equipment purchases', label: 'Equipment purchases' },
  { value: 'Inventory purchases', label: 'Inventory purchases' },
];

const FundingPurpose = () => {
  const { formData, saveFormData, isStepCompleted, moveForward, isNavigating } =
    useApplicationStep('funding-purpose');

  const [localFormData, setLocalFormData] = useState<FormData>({
    fundingPurpose: '',
  });

  useEffect(() => {
    setLocalFormData({
      fundingPurpose: formData.fundingPurpose || '',
    });
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...localFormData, [field]: value };
    setLocalFormData(updatedData);
    saveFormData(updatedData);
  };

  const canGoNext = isStepCompleted('funding-purpose') && !isNavigating;
  const handleNext = async () => {
    try {
      await moveForward(localFormData);
    } catch (error) {
      console.error('Error moving to next step:', error);
    }
  };

  return (
    <ApplicationStepWrapper
      title="What is the primary purpose for this funding?"
      onNext={handleNext}
      canGoNext={canGoNext}
      isSubmitting={isNavigating}
      stepId="funding-purpose"
    >
      <CardWithRadio
        onChange={(value) => handleInputChange('fundingPurpose', value)}
        options={fundingPurposeOptions}
        value={localFormData.fundingPurpose}
      />
    </ApplicationStepWrapper>
  );
};

export default FundingPurpose;
