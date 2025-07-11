'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Building2, DollarSign } from 'lucide-react';
import { FormData } from '@/types';
import ApplicationStepWrapper from './ApplicationStepWrapper';
import { useApplicationStep } from '@/contexts/';
import Input from '@/components/Input';

interface Loan {
  lenderName: string;
  loanAmount: string;
}

const CURRENT_STEP_ID = 'existing-loans';

const ExistingLoans = () => {
  const {
    formData,
    saveFormData,
    isStepCompleted,
    moveForward,
    isNavigating,
    moveBackward,
  } = useApplicationStep(CURRENT_STEP_ID);

  const [localFormData, setLocalFormData] = useState<FormData>({
    hasExistingLoans: '',
    existingLoans: [] as Loan[],
  });

  useEffect(() => {
    const initialData = {
      hasExistingLoans: formData.hasExistingLoans || '',
      existingLoans: formData.existingLoans || [],
    };
    setLocalFormData(initialData);
  }, [formData]);

  const handleYesNoSelection = (selection: boolean) => {
    const hasExistingLoans = selection ? 'yes' : 'no';
    let loans = localFormData.existingLoans ?? [];
    console.log(hasExistingLoans, selection, loans);
    if (selection) {
      if (loans.length === 0) {
        loans = [{ lenderName: '', loanAmount: '' }];
      }
    } else {
      loans = [];
    }
    const updatedData = {
      ...localFormData,
      hasExistingLoans,
      existingLoans: loans,
    };
    setLocalFormData(updatedData);
    saveFormData(updatedData);
  };

  const addLoan = () => {
    const newLoan: Loan = {
      lenderName: '',
      loanAmount: '',
    };
    const updatedLoans = [...(localFormData.existingLoans ?? []), newLoan];
    const updatedData = {
      ...localFormData,
      existingLoans: updatedLoans,
    };
    setLocalFormData(updatedData);
    saveFormData(updatedData);
  };

  const removeLoan = (index: number) => {
    const updatedLoans = (localFormData.existingLoans ?? []).filter(
      (_, i) => index !== i
    );
    const updatedData = {
      ...localFormData,
      existingLoans: updatedLoans,
    };
    setLocalFormData(updatedData);
    saveFormData(updatedData);
  };

  const updateLoan = (
    index: number,
    field: 'lenderName' | 'loanAmount',
    value: string
  ) => {
    const updatedLoans = (localFormData.existingLoans ?? []).map((loan, i) =>
      i === index ? { ...loan, [field]: value } : loan
    );
    const updatedData = {
      ...localFormData,
      existingLoans: updatedLoans,
    };
    setLocalFormData(updatedData);
    saveFormData(updatedData);
  };

  const canGoNext =
    isStepCompleted(CURRENT_STEP_ID) &&
    (localFormData.hasExistingLoans === 'no' ||
      ((localFormData.existingLoans?.length ?? 0) > 0 &&
        localFormData.existingLoans?.every(
          (loan) => loan.lenderName && loan.loanAmount
        ))) &&
    !isNavigating;

  const handleNext = async () => {
    try {
      await moveForward(localFormData);
    } catch (error) {
      console.error('Error moving to next step:', error);
    }
  };

  return (
    <ApplicationStepWrapper
      title="Do you have any existing business loans?"
      description="This helps us understand your current financial commitments"
      onNext={handleNext}
      canGoNext={canGoNext}
      isSubmitting={isNavigating}
      stepId={CURRENT_STEP_ID}
      onBack={() => {
        moveBackward();
      }}
    >
      {/* Yes/No Selection */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => handleYesNoSelection(true)}
          className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg ${
            localFormData.hasExistingLoans === 'yes'
              ? 'bg-black text-white shadow-lg transform scale-105'
              : 'bg-white text-gray-700 hover:bg-black hover:text-white'
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => handleYesNoSelection(false)}
          className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg ${
            localFormData.hasExistingLoans === 'no'
              ? 'bg-black text-white shadow-lg transform scale-105'
              : 'bg-white text-gray-700 hover:bg-black hover:text-white'
          }`}
        >
          No
        </button>
      </div>
      {/* Loan Entry Forms */}
      {localFormData.hasExistingLoans === 'yes' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-light text-primary">
              Your Business Loans
            </h3>
            <button
              onClick={addLoan}
              className="flex items-center space-x-2 px-4 py-2 text-white btn-primary"
            >
              <Plus className="h-4 w-4" />
              <span>Add Loan</span>
            </button>
          </div>

          {(localFormData.existingLoans ?? []).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>
                No loans added yet. Click &quot;Add Loan&quot; to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {(localFormData.existingLoans ?? []).map((loan, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-light text-primary">
                      Loan Details
                    </h3>
                    <button
                      onClick={() => removeLoan(index)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Lender Name *"
                      value={loan.lenderName}
                      onChange={(value) =>
                        updateLoan(index, 'lenderName', value)
                      }
                      type="text"
                      placeholder="e.g., Chase Bank, SBA Loan"
                    />

                    <Input
                      label="Outstanding Amount *"
                      value={loan.loanAmount}
                      onChange={(value) =>
                        updateLoan(index, 'loanAmount', value)
                      }
                      type="text"
                      placeholder="e.g., $50,000"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </ApplicationStepWrapper>
  );
};

export default ExistingLoans;
