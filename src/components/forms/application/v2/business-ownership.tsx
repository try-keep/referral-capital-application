'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { FormData } from '@/types';
import ApplicationStepWrapper from './ApplicationStepWrapper';
import { useApplicationStep } from '@/contexts/';

const CURRENT_STEP_ID = 'business-ownership';

const BusinessOwnership = () => {
  const {
    formData,
    saveFormData,
    isStepCompleted,
    moveForward,
    isNavigating,
    moveBackward,
  } = useApplicationStep(CURRENT_STEP_ID);

  const [showPercentageQuestion, setShowPercentageQuestion] = useState(false);
  const [showRejection, setShowRejection] = useState(false);

  const [localFormData, setLocalFormData] = useState<FormData>({
    isBusinessOwner: '',
    owns_more_than_50pct: '',
  });

  useEffect(() => {
    const initialData = {
      isBusinessOwner: formData.isBusinessOwner || '',
      owns_more_than_50pct: formData.owns_more_than_50pct || '',
    };
    setLocalFormData(initialData);
  }, [formData]);

  const handleAuthorizationChange = (selection: boolean) => {
    const isBusinessOwner = selection ? 'yes' : 'no';
    const updatedData = {
      ...localFormData,
      isBusinessOwner,
      owns_more_than_50pct: '',
    };
    setLocalFormData(updatedData);
    saveFormData(updatedData);

    setShowPercentageQuestion(isBusinessOwner === 'yes');
    setShowRejection(isBusinessOwner !== 'yes');
  };

  const handlePercentageChange = (selection: boolean) => {
    const owns_more_than_50pct = selection ? 'yes' : 'no';
    const updatedData = {
      ...localFormData,
      owns_more_than_50pct,
    };
    setLocalFormData(updatedData);
    saveFormData(updatedData);
  };

  const canGoNext = isStepCompleted('business-ownership') && !isNavigating;
  const handleNext = async () => {
    try {
      await moveForward(localFormData);
    } catch (error) {
      console.error('Error moving to next step:', error);
    }
  };

  return (
    <ApplicationStepWrapper
      title="Are you an owner of the business, or are you authorized to secure capital on its behalf?"
      onNext={handleNext}
      canGoNext={canGoNext}
      isSubmitting={isNavigating}
      stepId={CURRENT_STEP_ID}
      onBack={() => {
        moveBackward();
      }}
    >
      {showRejection ? (
        <RejectionMessage />
      ) : (
        <>
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => handleAuthorizationChange(true)}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                localFormData.isBusinessOwner === 'yes'
                  ? 'bg-black text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-black hover:text-white'
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => handleAuthorizationChange(false)}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                localFormData.isBusinessOwner === 'no'
                  ? 'bg-black text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-black hover:text-white'
              }`}
            >
              No
            </button>
          </div>
          {showPercentageQuestion && (
            <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-green-700 font-medium">
                    Great! Now we need one more detail:
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 text-center mb-6">
                  Do you own 50% or more of the business?
                </h3>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handlePercentageChange(true)}
                    className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                      localFormData.owns_more_than_50pct === 'yes'
                        ? 'bg-black text-white shadow-lg transform scale-105'
                        : 'bg-white text-gray-700 hover:bg-black hover:text-white'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handlePercentageChange(false)}
                    className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                      localFormData.owns_more_than_50pct === 'no'
                        ? 'bg-black text-white shadow-lg transform scale-105'
                        : 'bg-white text-gray-700 hover:bg-black hover:text-white'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </ApplicationStepWrapper>
  );
};

const RejectionMessage = () => (
  <div className="text-center space-y-8">
    <div className="flex justify-center">
      <div className="bg-red-100 p-6 rounded-full">
        <AlertTriangle className="h-16 w-16 text-red-500" />
      </div>
    </div>

    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Authorization Required
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
        To secure business capital, you must be an owner of the business or have
        proper authorization to apply for financing on behalf of the company.
      </p>
    </div>

    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-start space-x-3">
        <Shield className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
        <div className="text-left">
          <h4 className="font-semibold text-red-800 mb-2">What you can do:</h4>
          <ul className="text-sm text-red-700 space-y-2">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Ask a business owner to complete this application</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Obtain written authorization from a business owner</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                Contact our support team to discuss alternative options
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default BusinessOwnership;
