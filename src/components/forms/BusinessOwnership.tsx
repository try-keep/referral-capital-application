'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { type FormData } from '@/types';

export function BusinessOwnershipForm({
  onNext,
  formData,
  isSubmitting,
  saveFormData,
}: {
  onNext: (data: FormData) => void;
  formData: FormData;
  isSubmitting: boolean;
  saveFormData: (data: FormData) => void;
}) {
  const router = useRouter();
  const [localData, setLocalData] = useState({
    isBusinessOwner: formData.isBusinessOwner || '',
    owns_more_than_50pct: formData.owns_more_than_50pct || '',
  });
  const [showNotOwnerMessage, setShowNotOwnerMessage] = useState(false);

  // Update local data when formData prop changes (for when user navigates back)
  useEffect(() => {
    console.log('🔄 BusinessOwnerForm - formData prop changed:', formData);
    setLocalData({
      isBusinessOwner: formData.isBusinessOwner || '',
      owns_more_than_50pct: formData.owns_more_than_50pct || '',
    });
  }, [formData]);

  const handleOwnerSelection = (value: 'yes' | 'no') => {
    const newLocalData = { ...localData, isBusinessOwner: value };
    setLocalData(newLocalData);
    saveFormData({ isBusinessOwner: value }); // Save to main form state immediately

    if (value === 'no') {
      setShowNotOwnerMessage(true);
    } else {
      setShowNotOwnerMessage(false);
      // Don't automatically proceed, wait for the second question
    }
  };

  const handleOwnershipSelection = (value: 'yes' | 'no') => {
    const newLocalData = { ...localData, owns_more_than_50pct: value };
    setLocalData(newLocalData);
    onNext({ ...newLocalData });
  };

  const handleStopApplication = () => {
    // This is for the "No" case where they need to click a button to continue
    setLocalData({ ...localData, isBusinessOwner: '' });
    router.push('/');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <p className="text-lg font-semibold text-gray-800 mb-4">
          Are you an owner of the business, or are you authorized to secure
          capital on its behalf?
        </p>
        <div className="space-y-4">
          <button
            data-cy="authorized-to-request-capital-yes"
            onClick={() => handleOwnerSelection('yes')}
            className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-colors ${
              localData.isBusinessOwner === 'yes'
                ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="font-semibold">Yes</span>
          </button>
          <button
            data-cy="authorized-to-request-capital-no"
            onClick={() => handleOwnerSelection('no')}
            className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-colors ${
              localData.isBusinessOwner === 'no'
                ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="font-semibold">No</span>
          </button>
        </div>
      </div>

      {localData.isBusinessOwner === 'yes' && (
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-800 mb-4">
            Do you own 50% or more of the business?
          </p>
          <div className="space-y-4">
            <button
              data-cy="owns-50-percent-or-more-yes"
              onClick={() => handleOwnershipSelection('yes')}
              className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-colors ${
                localData.owns_more_than_50pct === 'yes'
                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="font-semibold">Yes</span>
            </button>
            <button
              data-cy="owns-50-percent-or-more-no"
              onClick={() => handleOwnershipSelection('no')}
              className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-colors ${
                localData.owns_more_than_50pct === 'no'
                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="font-semibold">No</span>
            </button>
          </div>
        </div>
      )}

      {showNotOwnerMessage && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            To proceed with the application, you must be an owner of the
            business or be authorized to secure capital on its behalf.
          </p>
          <div className="mt-4">
            <button
              onClick={handleStopApplication}
              disabled={isSubmitting}
              className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Go Back'}
            </button>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="mt-8 bg-gray-200 rounded-full h-2">
        <div
          className="bg-black h-2 rounded-full"
          style={{ width: '21%' }}
        ></div>
      </div>
    </div>
  );
}
