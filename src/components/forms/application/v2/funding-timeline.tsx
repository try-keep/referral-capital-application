'use client';

import React, { useState, useEffect } from 'react';
import { FormData } from '@/types';
import ApplicationStepWrapper from './ApplicationStepWrapper';
import { useApplicationStep } from '@/contexts/';
import CardWithRadio from '../../fields/CardWithRadio';

const fundingTimelineOptions = [
  { value: 'Immediately', label: 'Immediately' },
  { value: '1-2 weeks', label: '1-2 weeks' },
  { value: '30 days', label: '30 days' },
  { value: 'More than 30 days', label: 'More than 30 days' },
];

const FundingTimeline = () => {
  const { formData, saveFormData, isStepCompleted, moveForward, isNavigating } =
    useApplicationStep('funding-timeline');

  const [localFormData, setLocalFormData] = useState<FormData>({
    fundingTimeline: '',
  });

  // Initialize form data
  useEffect(() => {
    const initialData = {
      fundingTimeline: formData.fundingTimeline || '',
    };
    setLocalFormData(initialData);
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...localFormData, [field]: value };
    setLocalFormData(updatedData);
    saveFormData(updatedData);
  };

  const canGoNext = isStepCompleted('funding-timeline') && !isNavigating;
  const handleNext = async () => {
    try {
      await moveForward(localFormData);
    } catch (error) {
      console.error('Error moving to next step:', error);
    }
  };

  return (
    <ApplicationStepWrapper
      title="When do you need the funding?"
      onNext={handleNext}
      canGoNext={canGoNext}
      isSubmitting={isNavigating}
      stepId="funding-timeline"
    >
      <CardWithRadio
        onChange={(value) => handleInputChange('fundingTimeline', value)}
        options={fundingTimelineOptions}
        value={localFormData.fundingTimeline}
      />
    </ApplicationStepWrapper>
  );
};

export default FundingTimeline;
