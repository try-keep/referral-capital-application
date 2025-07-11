'use client';

import React, {
  ChangeEvent,
  DragEvent,
  useState,
  useEffect,
  useRef,
} from 'react';
import { isDefined } from '@/utils';
import { type FormData } from '@/types';
import ApplicationStepWrapper from './ApplicationStepWrapper';
import { useApplicationStep } from '@/contexts/';
import { Shield, CheckCircle, Lock } from 'lucide-react';

type FlinksEventStep = 'COMPONENT_CONSENT_INTRO' | 'REDIRECT';

type FlinksEventPayload = {
  step: FlinksEventStep;
  url?: string;
  requestId?: string;
};

const TRUSTED_FLINKS_ORIGIN = new URL(
  process.env.NEXT_PUBLIC_FLINKS_IFRAME_URL || ''
).origin;

const BankAccountConnection = () => {
  const { formData, saveFormData, moveForward, isNavigating } =
    useApplicationStep('bank-account-connection');

  const [localFormData, setLocalFormData] = useState<
    FormData & {
      bankConnectionCompleted: boolean | string;
      bankConnectionMethod: 'flinks' | 'manual' | '';
      loginId: string;
      institution: string;
      bankStatements: Array<{
        id: string;
        fileName: string;
        fileUrl: string;
        fileSize: number;
        mimeType: string;
      }>;
    }
  >({
    ...formData,
    bankConnectionCompleted: formData.bankConnectionCompleted || false,
    bankConnectionMethod: (formData.bankConnectionMethod || '') as
      | 'flinks'
      | 'manual'
      | '',
    loginId: formData.loginId || '',
    institution: formData.institution || '',
    bankStatements: formData.bankStatements || [],
  });

  const handleInputChange = (changes: Record<string, any>) => {
    const updatedData = { ...localFormData, ...changes };
    setLocalFormData(updatedData);
    saveFormData(updatedData);
    return updatedData;
  };

  // Track if we've already handled the redirect to prevent duplicate calls
  const hasHandledRedirect = useRef(false);

  // Track connection status for UI feedback
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'success' | 'error'
  >('connecting');
  const [isLoading, setIsLoading] = useState(true);

  // State for file uploads
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [applicationUploadId, setApplicationUploadId] = useState<string>('');

  // Check if bank connection is already completed
  const isConnectionCompleted =
    localFormData.bankConnectionCompleted === 'true' ||
    localFormData.bankConnectionCompleted === true;

  // Update local data when formData prop changes (for when user navigates back)
  useEffect(() => {
    console.log('🔄 BankAccountConnection - formData prop changed:', formData);
    setLocalFormData({
      ...formData,
      bankConnectionCompleted: formData.bankConnectionCompleted || false,
      bankConnectionMethod: (formData.bankConnectionMethod || '') as
        | 'flinks'
        | 'manual'
        | '',
      loginId: formData.loginId || '',
      institution: formData.institution || '',
      bankStatements: formData.bankStatements || [],
    });

    // If connection is already completed, set status to success
    if (
      formData.bankConnectionCompleted === 'true' ||
      formData.bankConnectionCompleted === true
    ) {
      setConnectionStatus('success');
    }

    // Generate or retrieve application upload ID
    const storedData = localStorage.getItem('referralApplicationData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (!parsedData.applicationUploadId) {
        // Generate new UUID for this upload session
        parsedData.applicationUploadId = crypto.randomUUID();
        localStorage.setItem(
          'referralApplicationData',
          JSON.stringify(parsedData)
        );
      }
      setApplicationUploadId(parsedData.applicationUploadId);
    }
  }, [formData]);

  // Listen for Flinks redirect event
  useEffect(() => {
    const listener = ({ data, origin }: MessageEvent) => {
      // This will help out validate that we are only processing events coming from the FLINKS iFrame.
      // Some information about the reasons to do this can be found [here](https://www.notion.so/trykeep/Some-Security-stuff-1b31b946eb89803da592ec34462f900f?source=copy_link#1b41b946eb8980ee801dc463f4cce151)
      if (isDefined(data.step) && origin === TRUSTED_FLINKS_ORIGIN) {
        handleFlinksEvent(data);
      }
    };

    function handleFlinksEvent(data: FlinksEventPayload) {
      // Check if this is a Flinks redirect message
      const isEventDataValid = data && typeof data === 'object';
      const eventStep: FlinksEventStep = data.step;

      if (
        isEventDataValid &&
        eventStep === 'REDIRECT' &&
        !hasHandledRedirect.current
      ) {
        console.log('🎉 Flinks redirect event received:', data);
        hasHandledRedirect.current = true;

        // Show success status
        setConnectionStatus('success');

        // Extract loginId and institution from the URL if needed
        let loginId: string = '';
        let institution: string = '';

        if (data.url) {
          try {
            const url = new URL(data.url);
            loginId = url.searchParams.get('loginId') || '';
            institution = url.searchParams.get('institution') || '';
            console.log('🔗 Flinks connection details:', {
              loginId,
              institution,
            });
          } catch (error) {
            console.error('Error parsing Flinks URL:', error);
          }
        }

        // Save connection data to localStorage immediately
        handleInputChange({
          bankConnectionCompleted: 'true',
          bankConnectionMethod: 'flinks' as 'flinks',
          loginId,
          institution,
          applicationUploadId: applicationUploadId,
        });

        // Let the success state render for a moment before auto-navigation
        setTimeout(() => {
          // The success state will now be shown based on isConnectionCompleted
        }, 100);
      }

      if (eventStep === 'COMPONENT_CONSENT_INTRO') {
        setIsLoading(false);
        console.log('🔄 Flinks consent intro event received:', data);
      }
    }

    // Only add event listener if connection is not already completed
    if (!isConnectionCompleted) {
      window.addEventListener('message', listener);

      // Cleanup event listener on unmount
      return () => {
        window.removeEventListener('message', listener);
      };
    }
  }, [
    localFormData,
    isConnectionCompleted,
    applicationUploadId,
    handleInputChange,
  ]);

  // Handle file selection
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      const validTypes = ['application/pdf'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length !== files.length) {
      setUploadError(
        'Some files were invalid. Please upload PDF files only, under 10MB.'
      );
    } else {
      setUploadError('');
    }

    setUploadedFiles((prev) => [...prev, ...validFiles]);
  };

  // Handle file removal
  const handleFileRemove = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle drag and drop
  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter((file) => {
      const validTypes = ['application/pdf'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length !== files.length) {
      setUploadError(
        'Some files were invalid. Please upload PDF files only, under 10MB.'
      );
    } else {
      setUploadError('');
    }

    setUploadedFiles((prev) => [...prev, ...validFiles]);
  };

  // Handle manual upload submission
  const handleManualUploadSubmit = async () => {
    if (uploadedFiles.length < 6) {
      setUploadError('Please upload at least 6 bank statements.');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const uploadPromises = uploadedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/bank-statement', {
          method: 'POST',
          headers: {
            'X-Application-Upload-ID': applicationUploadId,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload file');
        }

        return response.json();
      });

      const uploadedStatements = await Promise.all(uploadPromises);

      // Save the bank statements to formData and set connection status
      handleInputChange({
        bankConnectionCompleted: 'true',
        bankConnectionMethod: 'manual' as 'manual',
        bankStatements: uploadedStatements,
        applicationUploadId: applicationUploadId,
      });

      // Set connection status to success
      setConnectionStatus('success');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle method selection
  const handleMethodSelect = (method: 'flinks' | 'manual' | '') => {
    // Reset connection status when changing methods
    if (method === '') {
      setConnectionStatus('connecting');
      hasHandledRedirect.current = false;
      // Clear bank connection data when going back to selection
      handleInputChange({
        bankConnectionMethod: method,
        bankConnectionCompleted: false,
        loginId: '',
        institution: '',
        bankStatements: [],
      });
    } else {
      handleInputChange({ bankConnectionMethod: method });
    }
  };

  const flinksTags: Record<string, string> = {
    source: 'capitalApplication',
    userId: localStorage.getItem('userId') ?? '',
  };

  let formattedFlinksTags = '';
  for (const key in flinksTags) {
    formattedFlinksTags += `${key}=${flinksTags[key]},`;
  }

  // Check if NEXT_PUBLIC_SKIP_FLINKS is explicitly set to 'true'
  const skipFlinks = process.env.NEXT_PUBLIC_SKIP_FLINKS === 'true';

  // Create Flinks connection parameters
  const flinksConnectionParams = new URLSearchParams({
    customerName: 'Keep',
    daysOfTransactions: 'Days365',
    scheduleRefresh: 'false',
    consentEnable: 'true',
    detailsAndStatementEnable: 'true',
    monthsOfStatements: 'Months12',
    enhancedMFA: 'false',
    maximumRetry: '3',
    tag: formattedFlinksTags,
    ...(skipFlinks && { demo: 'true' }),
  });

  const canGoNext = Boolean(
    isConnectionCompleted && localFormData.bankConnectionMethod && !isNavigating
  );

  const handleNext = async () => {
    try {
      await moveForward(localFormData);
    } catch (error) {
      console.error('Error moving to next step:', error);
    }
  };

  const renderContent = () => {
    if (isConnectionCompleted) {
      return (
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="bg-green-100 p-6 rounded-full">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Bank Account Connected Successfully!
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {localFormData.bankConnectionMethod === 'manual'
                ? 'Your bank statements have been successfully uploaded and are ready for processing.'
                : 'Your business bank account has been securely connected. This helps us verify your business financial information and may improve your loan terms and approval speed.'}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-start space-x-3">
              <Shield className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
              <div className="text-left">
                <h4 className="font-semibold text-green-800 mb-2">
                  What happens next?
                </h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>
                    • We&apos;ll review your application and financial data
                  </li>
                  <li>
                    • You&apos;ll receive a preliminary decision within 24-48
                    hours
                  </li>
                  <li>
                    • Final approval and funding typically within 3-5 business
                    days
                  </li>
                  <li>• Your banking data is encrypted and secure</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (localFormData.bankConnectionMethod === 'manual') {
      return (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Upload Bank Statements
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-6 h-6 text-gray-600 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Upload Bank Statements Manually
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Please upload 6 bank statements that are no older than 6
                    months to help us understand your business.
                  </p>
                </div>
              </div>
            </div>

            {/* Upload area */}
            {uploadedFiles.length === 0 ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-lg font-medium text-gray-900 mb-1">
                  Drop the files here or upload
                </p>
                <p className="text-sm text-gray-500">Format: PDF only (10MB)</p>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  multiple
                  onChange={handleFileSelect}
                />
                <label htmlFor="file-upload">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('file-upload')?.click();
                    }}
                    className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    + Upload
                  </button>
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)}MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFileRemove(index)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                ))}

                {/* Add more files button */}
                <label htmlFor="add-more-files" className="block">
                  <input
                    id="add-more-files"
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.doc,.docx"
                    multiple
                    onChange={handleFileSelect}
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors cursor-pointer">
                    <p className="text-sm text-gray-600">
                      + Add more files (you have {uploadedFiles.length}/6)
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Error message */}
            {uploadError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{uploadError}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleManualUploadSubmit}
              disabled={uploadedFiles.length < 6 || isUploading}
              className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Submit documents'}
            </button>
          </div>
          <div className="text-center mt-4">
            <button
              onClick={() => handleMethodSelect('')}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Connect to bank instead
            </button>
          </div>
        </div>
      );
    }

    if (localFormData.bankConnectionMethod === 'flinks') {
      return (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Connect Your Bank Account
          </h2>

          <div className="mb-8" style={{ maxHeight: '600px' }}>
            {isLoading && (
              <div
                className="flex justify-center items-center flex-col gap-4 no-scrollbar "
                style={{ minHeight: '600px' }}
              >
                <p className="text-sm text-gray-500">Connecting to Flinks...</p>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            )}
            <iframe
              src={`${process.env.NEXT_PUBLIC_FLINKS_IFRAME_URL}/v2?${flinksConnectionParams.toString()}`}
              width="100%"
              height="600"
              frameBorder="0"
              style={{ border: 'none', borderRadius: '8px' }}
              title="Bank Connection"
            />
          </div>

          {/* Security note */}
          <div className="mt-1 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Bank-grade security
                </p>
                <p className="text-sm text-gray-600">
                  Your banking information is encrypted and secure. We cannot
                  see your login credentials.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={() => handleMethodSelect('')}
              className="text-gray-600 hover:text-gray-800 text-sm underline transition-colors duration-200"
            >
              Upload bank statements instead
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="bg-white border-2 border-gray-300 rounded-2xl p-8 max-w-3xl mx-auto">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 text-center">
              Connect your business bank account to:
            </h3>

            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-800 rounded-full flex-shrink-0"></div>
                <span className="text-lg text-gray-700">
                  Get approved 10x faster
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-800 rounded-full flex-shrink-0"></div>
                <span className="text-lg text-gray-700">
                  Get funded 5x faster
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-800 rounded-full flex-shrink-0"></div>
                <span className="text-lg text-gray-700">
                  More likely to get funded
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-800 rounded-full flex-shrink-0"></div>
                <span className="text-lg text-gray-700">
                  Maintain a safer connection
                </span>
              </li>
            </ul>

            <div className="pt-4">
              <button
                onClick={() => handleMethodSelect('flinks')}
                className="btn-primary w-full py-4 text-lg"
              >
                Connect your account
              </button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => handleMethodSelect('manual')}
            className="text-gray-600 hover:text-gray-800 text-lg underline transition-colors duration-200"
          >
            Upload bank statements instead
          </button>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Shield className="h-4 w-4" />
              <span>Bank-level security</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Lock className="h-4 w-4" />
              <span>256-bit encryption</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <CheckCircle className="h-4 w-4" />
              <span>Read-only access</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ApplicationStepWrapper
      title="Connect your business bank account"
      description="Funders require at least 6 months of your most recent bank statements from a business bank account"
      onNext={handleNext}
      canGoNext={canGoNext}
      isSubmitting={isNavigating}
      stepId="business-account-connection"
    >
      {renderContent()}
    </ApplicationStepWrapper>
  );
};

export default BankAccountConnection;
