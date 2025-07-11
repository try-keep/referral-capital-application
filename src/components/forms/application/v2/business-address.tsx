'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Phone, Globe } from 'lucide-react';
import { FormData } from '@/types';
import ApplicationStepWrapper from './ApplicationStepWrapper';
import { useApplicationStep } from '@/contexts/';
import {
  AddressAutocompleteInput,
  AddressSuggestion,
} from '@/components/AddressAutocompleteInput';
import Input from '@/components/Input';

const CURRENT_STEP_ID = 'business-address';

const BusinessAddress = () => {
  const {
    formData,
    saveFormData,
    isStepCompleted,
    moveForward,
    isNavigating,
    moveBackward,
  } = useApplicationStep(CURRENT_STEP_ID);

  const [localFormData, setLocalFormData] = useState<FormData>({
    businessAddressLine1: '',
    businessAddressLine2: '',
    businessCity: '',
    businessProvince: '',
    businessPostalCode: '',
    businessCountry: '', // Added for address suggestions
    businessPhone: '',
    websiteUrl: '',
    businessAddress: '', // For backwards compatibility
  });

  const combineBusinessAddress = (data: FormData) => {
    const {
      businessAddressLine1,
      businessAddressLine2,
      businessCity,
      businessProvince,
      businessPostalCode,
    } = data;
    return [
      businessAddressLine1,
      businessAddressLine2,
      businessCity,
      businessProvince,
      businessPostalCode,
    ]
      .filter(Boolean)
      .join(', ');
  };

  useEffect(() => {
    const initialData = {
      businessAddressLine1: formData.businessAddressLine1 || '',
      businessAddressLine2: formData.businessAddressLine2 || '',
      businessCity: formData.businessCity || '',
      businessProvince: formData.businessProvince || '',
      businessPostalCode: formData.businessPostalCode || '',
      businessPhone: formData.businessPhone || '',
      websiteUrl: formData.websiteUrl || '',
    };
    setLocalFormData(initialData);
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...localFormData, [field]: value };
    updatedData.businessAddress = combineBusinessAddress(updatedData);
    setLocalFormData(updatedData);
    saveFormData(updatedData);
  };

  const handleSuggestionSelected = (address: AddressSuggestion) => {
    const updatedData = {
      ...localFormData,
      businessAddressLine1: address.address_line1 || '',
      businessAddressLine2: address.address_line2 || '',
      businessCity: address.city || '',
      businessProvince: address.state || '',
      businessPostalCode: address.postcode || '',
      businessCountry: address.country || '',
      businessAddress: '',
    };
    updatedData.businessAddress = combineBusinessAddress(updatedData);
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
      title="Business Address & Contact Information"
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
        <div className="space-y-4">
          <h3 className="text-lg font-light text-primary">Business Address</h3>

          <div className="space-y-4">
            {/* Street Address */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <AddressAutocompleteInput
                address={localFormData.businessAddressLine1}
                onSuggestionSelected={(address) => {
                  handleSuggestionSelected(address);
                }}
                onAddressChange={(addressLine1) => {
                  handleInputChange('businessAddressLine1', addressLine1);
                }}
                placeholder="e.g., 470 Yonge St"
                required
                className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                country="CA"
              />
            </div>
            {/* Apartment/Suite */}
            <Input
              label="Apartment, suite, etc. (Optional)"
              value={localFormData.businessAddressLine2}
              onChange={(value) =>
                handleInputChange('businessAddressLine2', value)
              }
              type="text"
              placeholder="e.g., Suite 100"
            />
            {/* City, Province, Postal Code Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* City */}
              <Input
                label="City"
                value={localFormData.businessCity}
                onChange={(value) => handleInputChange('businessCity', value)}
                type="text"
                placeholder="e.g., Toronto"
              />

              {/* Province/State */}
              <Input
                label="Province"
                value={localFormData.businessProvince}
                onChange={(value) =>
                  handleInputChange('businessProvince', value)
                }
                type="text"
                placeholder="e.g., Ontario"
              />

              {/* Postal Code */}
              <Input
                label="Postal Code"
                value={localFormData.businessPostalCode}
                onChange={(value) =>
                  handleInputChange('businessPostalCode', value)
                }
                type="text"
                placeholder="e.g., M5A 1A1"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-light text-primary">
            Business Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Business Phone */}
            <Input
              label="Business Phone Number"
              value={localFormData.businessPhone}
              onChange={(value) => handleInputChange('businessPhone', value)}
              type="tel"
              placeholder="e.g., (123) 456-7890"
              required
            />
            {/* Website URL */}
            <Input
              label="Business Website"
              value={localFormData.websiteUrl}
              onChange={(value) => handleInputChange('websiteUrl', value)}
              type="url"
              placeholder="e.g., https://yourbusiness.com"
              required
            />
          </div>
        </div>
      </div>
    </ApplicationStepWrapper>
  );
};

export default BusinessAddress;
