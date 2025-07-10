'use client';

import React, { useState, useEffect } from 'react';
import { FormData } from '@/types';
import ApplicationStepWrapper from './ApplicationStepWrapper';
import { useApplicationStep } from '@/contexts/';
import CardWithRadio from '../../fields/CardWithRadio';

const numberOfEmployeesOptions = [
  { value: 'Just me', label: 'Just me' },
  { value: '2-5 employees', label: '2-5 employees' },
  { value: '6-10 employees', label: '6-10 employees' },
  { value: '11-25 employees', label: '11-25 employees' },
  { value: '26-50 employees', label: '26-50 employees' },
  { value: '51-100 employees', label: '51-100 employees' },
  { value: 'Over 100 employees', label: 'Over 100 employees' },
];

const NumberOfEmployees = () => {
  const { formData, saveFormData, isStepCompleted, moveForward, isNavigating } =
    useApplicationStep('number-of-employees');

  const [localFormData, setLocalFormData] = useState<FormData>({
    numberOfEmployees: '',
  });

  // Initialize form data
  useEffect(() => {
    const initialData = {
      numberOfEmployees: formData.numberOfEmployees || '',
    };
    setLocalFormData(initialData);
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...localFormData, [field]: value };
    setLocalFormData(updatedData);
    saveFormData(updatedData);
  };

  const canGoNext = isStepCompleted('number-of-employees') && !isNavigating;
  const handleNext = async () => {
    try {
      await moveForward(localFormData);
    } catch (error) {
      console.error('Error moving to next step:', error);
    }
  };

  return (
    <ApplicationStepWrapper
      title="Number of Employees"
      description="How many employees does your business have?"
      onNext={handleNext}
      canGoNext={canGoNext}
      isSubmitting={isNavigating}
      stepId="number-of-employees"
    >
      <CardWithRadio
        onChange={(value) => handleInputChange('numberOfEmployees', value)}
        options={numberOfEmployeesOptions}
        value={localFormData.numberOfEmployees}
      />
    </ApplicationStepWrapper>
  );
};

export default NumberOfEmployees;
