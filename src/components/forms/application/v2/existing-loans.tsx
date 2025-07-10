'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Building2, DollarSign } from 'lucide-react';
import { FormData } from '@/types';
import ApplicationStepWrapper from './ApplicationStepWrapper';
import { useApplicationStep } from '@/contexts/';

interface Loan {
  lenderName: string;
  loanAmount: string;
}

const ExistingLoans = () => {
  const { formData, saveFormData, isStepCompleted, moveForward, isNavigating } =
    useApplicationStep('existing-loans');

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
    isStepCompleted('existing-loans') &&
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
      title="Existing Business Loans"
      description="Do you have any existing business loans?"
      onNext={handleNext}
      canGoNext={canGoNext}
      isSubmitting={isNavigating}
      stepId="existing-loans"
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
            <h3 className="text-lg font-semibold text-gray-900">
              Your Business Loans
            </h3>
            <button
              onClick={addLoan}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
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
                    <h4 className="font-medium text-gray-900">Loan Details</h4>
                    <button
                      onClick={() => removeLoan(index)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lender Name
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={loan.lenderName}
                          onChange={(e) =>
                            updateLoan(index, 'lenderName', e.target.value)
                          }
                          placeholder="e.g., Chase Bank, SBA Loan"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Outstanding Amount
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={loan.loanAmount}
                          onChange={(e) =>
                            updateLoan(index, 'loanAmount', e.target.value)
                          }
                          placeholder="e.g., $50,000"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
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
