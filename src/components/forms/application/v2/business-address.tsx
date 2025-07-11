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
        <div className="mb-6 flex items-center space-x-2">
          <Building2 className="text-blue-500" size={20} />
          <h3 className="text-xl font-bold text-gray-800">Business Address</h3>
        </div>

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
            />
          </div>
          {/* Apartment/Suite */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apartment, suite, etc. (Optional)
            </label>
            <input
              type="text"
              value={localFormData.businessAddressLine2}
              onChange={(e) =>
                handleInputChange('businessAddressLine2', e.target.value)
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
                value={localFormData.businessCity}
                onChange={(e) =>
                  handleInputChange('businessCity', e.target.value)
                }
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
                value={localFormData.businessProvince}
                onChange={(e) =>
                  handleInputChange('businessProvince', e.target.value)
                }
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
                value={localFormData.businessPostalCode}
                onChange={(e) =>
                  handleInputChange('businessPostalCode', e.target.value)
                }
                placeholder="e.g., M5A 1A1"
                required
                className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-200 outline-none transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-6 flex items-center space-x-2">
          <Phone className="text-blue-500" size={20} />
          <h3 className="text-xl font-bold text-gray-800">
            Contact Information
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Business Phone */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Phone Number *
            </label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="tel"
                value={localFormData.businessPhone}
                onChange={(e) =>
                  handleInputChange('businessPhone', e.target.value)
                }
                placeholder="e.g., (123) 456-7890"
                required
                className="w-full p-3 pl-10 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              />
            </div>
          </div>
          {/* Website URL */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Website (Optional)
            </label>
            <div className="relative">
              <Globe
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="url"
                value={localFormData.websiteUrl}
                onChange={(e) =>
                  handleInputChange('websiteUrl', e.target.value)
                }
                placeholder="e.g., https://www.example.com"
                className="w-full p-3 pl-10 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </div>
    </ApplicationStepWrapper>
  );
};

export default BusinessAddress;
