'use client';

import React, { useState, useEffect } from 'react';
import { type FormData } from '@/types';
import ApplicationStepWrapper from './ApplicationStepWrapper';
import { useApplicationStep } from '@/contexts/';
import Input from '@/components/Input';

const CURRENT_STEP_ID = 'personal-details';

export default function PersonalDetails() {
  const {
    formData,
    saveFormData,
    isStepCompleted,
    moveForward,
    isNavigating,
    moveBackward,
  } = useApplicationStep(CURRENT_STEP_ID);

  const [localFormData, setLocalFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    const initialData = {
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      phone: formData.phone || '',
      dateOfBirth: formData.dateOfBirth || '',
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
      title="Enter your information"
      onNext={handleNext}
      canGoNext={!!canGoNext}
      isSubmitting={isNavigating}
      stepId={CURRENT_STEP_ID}
      onBack={() => {
        moveBackward();
      }}
    >
      <div className="w-full mx-auto space-y-8">
        {/* Name Section */}
        <div className="space-y-6">
          <div className="mb-4">
            <h3 className="text-lg font-light text-primary">Full Name</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={localFormData.firstName}
              onChange={(value) => handleInputChange('firstName', value)}
              type="text"
              placeholder="Enter first name"
            />

            <Input
              label="Last Name"
              value={localFormData.lastName}
              onChange={(value) => handleInputChange('lastName', value)}
              type="text"
              placeholder="Enter last name"
            />
          </div>
        </div>

        {/* Phone Section */}
        <div className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-light text-primary">
              Additional Details
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              value={localFormData.phone}
              onChange={(value) => handleInputChange('phone', value)}
              type="tel"
              placeholder="(555) 123-4567"
            />

            <Input
              label="Date of Birth"
              value={localFormData.dateOfBirth}
              onChange={(value) => handleInputChange('dateOfBirth', value)}
              type="date"
              placeholder="Select your date of birth"
            />
          </div>
        </div>
      </div>
    </ApplicationStepWrapper>
  );
}
