'use client';

import React, { useState, useEffect } from 'react';
import { type FormData } from '@/types';
import ApplicationStepWrapper from './ApplicationStepWrapper';
import { useApplicationStep } from '@/contexts/';
import {
  AddressAutocompleteInput,
  AddressSuggestion,
} from '@/components/AddressAutocompleteInput';

const CURRENT_STEP_ID = 'personal-address';

export default function PersonalAddress() {
  const {
    formData,
    saveFormData,
    isStepCompleted,
    moveForward,
    isNavigating,
    moveBackward,
  } = useApplicationStep(CURRENT_STEP_ID);

  const [localFormData, setLocalFormData] = useState<FormData>({
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    postalCode: '',
  });

  useEffect(() => {
    const initialData = {
      addressLine1: formData.addressLine1 || '',
      addressLine2: formData.addressLine2 || '',
      city: formData.city || '',
      province: formData.province || '',
      postalCode: formData.postalCode || '',
    };
    setLocalFormData(initialData);
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...localFormData, [field]: value };
    setLocalFormData(updatedData);
    saveFormData(updatedData);
  };
  const handleSuggestionSelected = (address: AddressSuggestion) => {
    const updatedData = {
      ...localFormData,
      addressLine1: address.address_line1 || '',
      addressLine2: address.address_line2 || '',
      city: address.city || '',
      province: address.state || '',
      postalCode: address.postcode || '',
      country: address.country || '',
    };
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
      title="What is your personal address?"
      onNext={handleNext}
      canGoNext={!!canGoNext}
      isSubmitting={isNavigating}
      stepId={CURRENT_STEP_ID}
      onBack={() => {
        moveBackward();
      }}
    >
      <div className="w-full mx-auto space-y-8">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mt-2">
            Address Information
          </h3>
        </div>

        <div className="space-y-4">
          {/* Street Address */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address *
            </label>
            <AddressAutocompleteInput
              address={formData.addressLine1}
              onSuggestionSelected={(address) => {
                handleSuggestionSelected(address);
              }}
              onAddressChange={(addressLine1) => {
                handleInputChange('addressLine1', addressLine1);
              }}
              placeholder="e.g., 470 Yonge St"
              required
              className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
            />
          </div>
          {/* Apartment/Suite */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apartment, suite, etc. (Optional)
            </label>
            <input
              type="text"
              value={localFormData.addressLine2}
              onChange={(e) =>
                handleInputChange('addressLine2', e.target.value)
              }
              placeholder="e.g., Suite 100"
              className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
            />
          </div>
          {/* City, Province, Postal Code Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={localFormData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="e.g., Toronto"
                required
                className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              />
            </div>

            {/* Province/State */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Province *
              </label>
              <input
                type="text"
                value={localFormData.province}
                onChange={(e) => handleInputChange('province', e.target.value)}
                placeholder="e.g., Ontario"
                required
                className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              />
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code *
              </label>
              <input
                type="text"
                value={localFormData.postalCode}
                onChange={(e) =>
                  handleInputChange('postalCode', e.target.value)
                }
                placeholder="e.g., M5A 1A1"
                required
                className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </div>
    </ApplicationStepWrapper>
  );
}
