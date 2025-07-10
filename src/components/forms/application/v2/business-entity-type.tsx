'use client';

import React, { useState, useEffect } from 'react';
import { FormData } from '@/types';
import ApplicationStepWrapper from './ApplicationStepWrapper';
import { useApplicationStep } from '@/contexts/';
import CardWithRadio from '../../fields/CardWithRadio';

const entityTypeOptions = [
  { value: 'Sole Proprietorship', label: 'Sole Proprietorship' },
  { value: 'Partnership', label: 'Partnership' },
  { value: 'Corporation', label: 'Corporation' },
  { value: 'Cooperative', label: 'Cooperative' },
  { value: 'Not-for-Profit Corporation', label: 'Not for profit corporation' },
  { value: 'Other', label: 'Other' },
];

const BusinessEntityType = () => {
  const { formData, saveFormData, isStepCompleted, moveForward, isNavigating } =
    useApplicationStep('business-entity-type');

  const [localFormData, setLocalFormData] = useState<FormData>({
    entityType: '',
  });

  // Initialize form data
  useEffect(() => {
    const initialData = {
      entityType: formData.entityType || '',
    };
    setLocalFormData(initialData);
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...localFormData, [field]: value };
    setLocalFormData(updatedData);
    saveFormData(updatedData);
  };

  const canGoNext = isStepCompleted('business-entity-type') && !isNavigating;
  const handleNext = async () => {
    try {
      await moveForward(localFormData);
    } catch (error) {
      console.error('Error moving to next step:', error);
    }
  };

  return (
    <ApplicationStepWrapper
      title="Business Entity Type"
      description="What is your business entity type?"
      onNext={handleNext}
      canGoNext={canGoNext}
      isSubmitting={isNavigating}
      stepId="business-entity-type"
    >
      <CardWithRadio
        onChange={(value) => handleInputChange('entityType', value)}
        options={entityTypeOptions}
        value={localFormData.entityType}
      />
    </ApplicationStepWrapper>
  );
};

export default BusinessEntityType;
