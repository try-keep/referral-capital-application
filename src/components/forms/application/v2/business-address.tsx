'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Building2, Search, ChevronUp } from 'lucide-react';
import { FormData } from '@/types';
import ApplicationStepWrapper from './ApplicationStepWrapper';
import { useApplicationStep } from '@/contexts/';

const BusinessAddress = () => {
  const { formData, saveFormData, isStepCompleted, moveForward, isNavigating } =
    useApplicationStep('business-address');

  const [localFormData, setLocalFormData] = useState<FormData>({});

  const canGoNext = isStepCompleted('business-address') && !isNavigating;
  const handleNext = async () => {
    try {
      await moveForward(localFormData);
    } catch (error) {
      console.error('Error moving to next step:', error);
    }
  };

  return (
    <ApplicationStepWrapper
      title="Business Address & Contact Information"
      onNext={handleNext}
      canGoNext={canGoNext}
      isSubmitting={isNavigating}
      stepId="business-address"
    >
      <p>WIP</p>
    </ApplicationStepWrapper>
  );
};

export default BusinessAddress;
