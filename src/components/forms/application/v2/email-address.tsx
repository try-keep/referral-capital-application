'use client';

import React, { useState, useEffect } from 'react';
import { type FormData } from '@/types';
import ApplicationStepWrapper from './ApplicationStepWrapper';
import { useApplicationStep } from '@/contexts/';

const CURRENT_STEP_ID = 'email-address';

// Email validation function
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function EmailAddress() {
  const {
    formData,
    saveFormData,
    isStepCompleted,
    moveForward,
    isNavigating,
    moveBackward,
  } = useApplicationStep(CURRENT_STEP_ID);

  const [localFormData, setLocalFormData] = useState<FormData>({
    email: '',
  });
  const [emailError, setEmailError] = useState<string>('');

  useEffect(() => {
    const initialData = {
      email: formData.email || '',
    };
    setLocalFormData(initialData);
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...localFormData, [field]: value };
    setLocalFormData(updatedData);
    saveFormData(updatedData);

    // Clear error when user starts typing
    if (field === 'email') {
      setEmailError('');
    }
  };

  const handleNext = async () => {
    // Validate email before proceeding
    if (!localFormData.email.trim()) {
      setEmailError('Email address is required');
      return;
    }

    if (!isValidEmail(localFormData.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    console.log('localFormData', localFormData);
    try {
      await moveForward(localFormData);
    } catch (error) {
      console.error('Error moving to next step:', error);
    }
  };

  const canGoNext =
    isStepCompleted(CURRENT_STEP_ID) && !isNavigating && !emailError;

  return (
    <ApplicationStepWrapper
      title="What is your email address?"
      onNext={handleNext}
      canGoNext={!!canGoNext}
      isSubmitting={isNavigating}
      stepId={CURRENT_STEP_ID}
      onBack={() => {
        moveBackward();
      }}
    >
      <div className="max-w-md mx-auto w-full">
        <input
          type="email"
          value={localFormData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter work email"
          required
          className={`w-full p-4 text-lg border-2 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 ${
            emailError
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-300 focus:border-blue-500'
          }`}
        />
        {emailError && (
          <p className="text-red-500 text-sm mt-2">{emailError}</p>
        )}
      </div>
    </ApplicationStepWrapper>
  );
}
