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
import {
  Shield,
  CheckCircle,
  Lock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Upload,
} from 'lucide-react';
import Image from 'next/image';

type FlinksEventStep = 'COMPONENT_CONSENT_INTRO' | 'REDIRECT';

type FlinksEventPayload = {
  step: FlinksEventStep;
  url?: string;
  requestId?: string;
};

const TRUSTED_FLINKS_ORIGIN = new URL(
  process.env.NEXT_PUBLIC_FLINKS_IFRAME_URL || ''
).origin;

const CURRENT_STEP_ID = 'bank-account-connection';

// Private sub-components for better organization
const ConnectionMethodCard: React.FC<{
  onSelectMethod: (method: 'flinks' | 'manual') => void;
}> = ({ onSelectMethod }) => {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Main card */}
      <div
        className="bg-gradient-to-b from-green-100 via-green-50 to-white border border-green-200 rounded-3xl p-8 mb-6"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgb(220 252 231), rgb(240 253 244) 25%, white 33%)',
        }}
      >
        {/* Shield icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Image
              src="/svgs/shield.svg"
              alt="Security Shield"
              width={80}
              height={80}
              className="drop-shadow-sm"
            />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-medium text-gray-900 text-center mb-8">
          Why Connect your business account?
        </h3>

        {/* Benefits grid - 2x2 layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">
              Get approved{' '}
              <span className="font-bold text-green-700">10x faster</span>
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">
              More likely to{' '}
              <span className="font-bold text-green-700">get funded</span>
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <TrendingDown className="h-6 w-6 text-green-600 rotate-180" />
            </div>
            <p className="text-sm font-medium text-gray-900">
              Get funded{' '}
              <span className="font-bold text-green-700">5x faster</span>
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <Lock className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">
              Maintain a{' '}
              <span className="font-bold text-green-700">safer connection</span>
            </p>
          </div>
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={() => onSelectMethod('flinks')}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white py-4 px-6 rounded-2xl font-semibold text-lg transition-colors duration-200 mb-6"
        >
          Connect your account
        </button>

        {/* Security features */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Bank-level security</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>256-bit encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Read-only access</span>
          </div>
        </div>
      </div>

      {/* Upload alternative */}
      <div className="text-center">
        <p className="text-gray-600">
          Prefer to upload bank statements?{' '}
          <button
            onClick={() => onSelectMethod('manual')}
            className="text-blue-600 hover:text-blue-800 font-medium underline transition-colors duration-200"
          >
            Upload
          </button>
        </p>
      </div>
    </div>
  );
};

const SuccessScreen: React.FC<{
  connectionMethod: 'flinks' | 'manual';
}> = ({ connectionMethod }) => {
  const nextSteps = [
    "We'll review your application and financial data",
    "You'll receive a preliminary decision within 24-48 hours",
    'Final approval and funding typically within 3-5 business days',
    'Your banking data is encrypted and secure',
  ];

  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      {/* Success icon */}
      <div className="flex justify-center">
        <div className="relative">
          <Image
            src="/svgs/check-green-icon.svg"
            alt="Success"
            width={100}
            height={100}
            className="drop-shadow-sm"
          />
        </div>
      </div>

      {/* Title and description */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Bank Account Connected Successfully!
        </h2>
        <p className="text-gray-600 text-lg max-w-lg mx-auto">
          {connectionMethod === 'manual'
            ? 'Your bank statements have been successfully uploaded and are ready for processing.'
            : 'Your bank account has been securely connected. This helps us verify your business financial information and may improve your loan terms and approval speed.'}
        </p>
      </div>

      {/* What happens next */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">
          What happens next:
        </h3>

        <div className="space-y-3">
          {nextSteps.map((step, index) => (
            <div
              key={index}
              className="bg-green-50 border border-green-100 rounded-2xl p-4 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-700 font-bold text-sm">
                    {index + 1}
                  </span>
                </div>
                <p className="text-gray-700 text-sm font-medium pt-1">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FlinksConnectionScreen: React.FC<{
  flinksConnectionParams: URLSearchParams;
  isLoading: boolean;
  onBack: () => void;
}> = ({ flinksConnectionParams, isLoading, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div
        className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
        style={{ minHeight: '600px' }}
      >
        {isLoading && (
          <div
            className="flex justify-center items-center flex-col gap-4"
            style={{ minHeight: '600px' }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            <p className="text-sm text-gray-500">Connecting to your bank...</p>
          </div>
        )}
        <iframe
          src={`${process.env.NEXT_PUBLIC_FLINKS_IFRAME_URL}/v2?${flinksConnectionParams.toString()}`}
          width="100%"
          height="600"
          frameBorder="0"
          style={{ border: 'none', borderRadius: '16px' }}
          title="Bank Connection"
        />
      </div>

      {/* Security note */}
      <div className="mt-6 bg-green-50 border border-green-100 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-900 mb-1">
              Bank-grade security
            </p>
            <p className="text-sm text-green-700">
              Your banking information is encrypted and secure. We cannot see
              your login credentials.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 text-sm underline transition-colors duration-200"
        >
          Upload bank statements instead
        </button>
      </div>
    </div>
  );
};

const ManualUploadScreen: React.FC<{
  uploadedFiles: File[];
  isUploading: boolean;
  uploadError: string;
  isDragging: boolean;
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: (index: number) => void;
  onDragEnter: (e: DragEvent) => void;
  onDragLeave: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  onSubmit: () => void;
  onBack: () => void;
}> = ({
  uploadedFiles,
  isUploading,
  uploadError,
  isDragging,
  onFileSelect,
  onFileRemove,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onSubmit,
  onBack,
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Info card */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Upload className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                Upload Bank Statements Manually
              </h3>
              <p className="text-sm text-blue-700">
                Please upload 6 bank statements that are no older than 6 months
                to help us understand your business.
              </p>
            </div>
          </div>
        </div>

        {/* Upload area */}
        {uploadedFiles.length === 0 ? (
          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }`}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-1">
              Drop the files here or upload
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Format: PDF only (10MB max)
            </p>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".pdf"
              multiple
              onChange={onFileSelect}
            />
            <label htmlFor="file-upload">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('file-upload')?.click();
                }}
                className="bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors font-medium"
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
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)}MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onFileRemove(index)}
                  className="text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Add more files */}
            <label htmlFor="add-more-files" className="block">
              <input
                id="add-more-files"
                type="file"
                className="hidden"
                accept=".pdf"
                multiple
                onChange={onFileSelect}
              />
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <p className="text-sm text-gray-600">
                  + Add more files (you have {uploadedFiles.length}/6)
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Error message */}
        {uploadError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-600">{uploadError}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={onSubmit}
          disabled={uploadedFiles.length < 6 || isUploading}
          className="w-full bg-gray-800 text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800"
        >
          {isUploading ? 'Uploading...' : 'Submit documents'}
        </button>

        <div className="text-center">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 underline text-sm transition-colors duration-200"
          >
            Connect to bank instead
          </button>
        </div>
      </div>
    </div>
  );
};

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
        <SuccessScreen
          connectionMethod={
            localFormData.bankConnectionMethod as 'flinks' | 'manual'
          }
        />
      );
    }

    if (localFormData.bankConnectionMethod === 'manual') {
      return (
        <ManualUploadScreen
          uploadedFiles={uploadedFiles}
          isUploading={isUploading}
          uploadError={uploadError}
          isDragging={isDragging}
          onFileSelect={handleFileSelect}
          onFileRemove={handleFileRemove}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onSubmit={handleManualUploadSubmit}
          onBack={() => handleMethodSelect('')}
        />
      );
    }

    if (localFormData.bankConnectionMethod === 'flinks') {
      return (
        <FlinksConnectionScreen
          flinksConnectionParams={flinksConnectionParams}
          isLoading={isLoading}
          onBack={() => handleMethodSelect('')}
        />
      );
    }

    return <ConnectionMethodCard onSelectMethod={handleMethodSelect} />;
  };

  return (
    <ApplicationStepWrapper
      hideProgress={isConnectionCompleted}
      title={isConnectionCompleted ? '' : 'Connect your business bank account'}
      description={
        isConnectionCompleted
          ? ''
          : 'Funders require at least 6 months of your most recent bank statements from a business bank account'
      }
      onNext={handleNext}
      canGoNext={canGoNext}
      isSubmitting={isNavigating}
      stepId={CURRENT_STEP_ID}
    >
      {renderContent()}
    </ApplicationStepWrapper>
  );
};

export default BankAccountConnection;
