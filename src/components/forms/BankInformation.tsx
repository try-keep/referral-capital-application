import { type FormData } from '@/types';
import { isDefined } from '@/utils';
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react';

type FlinksEventStep = 'COMPONENT_CONSENT_INTRO' | 'REDIRECT';

type FlinksEventPayload = {
  step: FlinksEventStep;
  url?: string;
  requestId?: string;
};

const TRUSTED_FLINKS_ORIGIN = new URL(
  process.env.NEXT_PUBLIC_FLINKS_IFRAME_URL || ''
).origin;

// Step 12: Bank Information
export function BankInformationForm({
  onNext,
  formData,
  isSubmitting,
}: {
  onNext: (data: FormData) => void;
  formData: FormData;
  isSubmitting: boolean;
}) {
  const [localData, setLocalData] = useState<{
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
  }>({
    bankConnectionCompleted: formData.bankConnectionCompleted || false,
    bankConnectionMethod: (formData.bankConnectionMethod || '') as
      | 'flinks'
      | 'manual'
      | '',
    loginId: formData.loginId || '',
    institution: formData.institution || '',
    bankStatements: formData.bankStatements || [],
  });

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
  // Don't show completed state if we just finished uploading (prevents flash of success screen)
  const [justUploaded, setJustUploaded] = useState(false);
  const isConnectionCompleted =
    (localData.bankConnectionCompleted === 'true' ||
      localData.bankConnectionCompleted === true) &&
    !justUploaded;

  // Update local data when formData prop changes (for when user navigates back)
  useEffect(() => {
    console.log('🔄 Step12Form - formData prop changed:', formData);
    setLocalData({
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
    if (formData.bankConnectionCompleted === 'true') {
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
        const connectionData = {
          ...localData,
          bankConnectionCompleted: 'true',
          bankConnectionMethod: 'flinks' as 'flinks',
          loginId,
          institution,
          applicationUploadId: applicationUploadId,
        };

        // Update localStorage with the connection data
        const existingData = localStorage.getItem('referralApplicationData');
        if (existingData) {
          const parsedData = JSON.parse(existingData);
          const updatedData = {
            ...parsedData,
            ...connectionData,
            applicationUploadId: applicationUploadId,
          };
          localStorage.setItem(
            'referralApplicationData',
            JSON.stringify(updatedData)
          );
          console.log('💾 Bank connection data saved to localStorage');
        }

        // Proceed to next step without delay to avoid race condition
        onNext(connectionData);
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
  }, [localData, onNext, isConnectionCompleted]);

  // Handle manual next button click for completed connections
  const handleNextClick = () => {
    onNext({
      ...localData,
      bankConnectionCompleted: 'true',
      bankConnectionMethod: localData.bankConnectionMethod || 'flinks',
      applicationUploadId: applicationUploadId,
    });
  };

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
      setJustUploaded(true); // Prevent success screen from showing
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

      // Save the bank statements to formData before proceeding
      const updatedData = {
        ...localData,
        bankConnectionCompleted: 'true',
        bankConnectionMethod: 'manual' as 'manual',
        bankStatements: uploadedStatements,
        applicationUploadId: applicationUploadId,
      };

      // Update local storage first
      const storedData = localStorage.getItem('referralApplicationData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        parsedData.bankConnectionCompleted = 'true';
        parsedData.bankConnectionMethod = 'manual';
        parsedData.bankStatements = uploadedStatements;
        localStorage.setItem(
          'referralApplicationData',
          JSON.stringify(parsedData)
        );
      }

      // Immediately navigate without showing success screen
      onNext(updatedData);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle method selection
  const handleMethodSelect = (method: 'flinks' | 'manual') => {
    setLocalData((prev) => ({ ...prev, bankConnectionMethod: method }));
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Connect Your Business Banking
        </h2>
        <p className="text-gray-600">
          Securely connect your business bank account to accelerate your
          approval process
        </p>
      </div>

      {/* Show different content based on connection status */}
      {isConnectionCompleted ? (
        // Connection already completed - show success message and next button
        <div className="text-center">
          <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <svg
                className="w-8 h-8 text-green-500 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Bank Connection Completed!
            </h3>
            <p className="text-green-600 mb-4">
              {localData.bankConnectionMethod === 'manual'
                ? 'Your bank statements have been successfully uploaded and are ready for processing.'
                : 'Your business bank account has been successfully connected. Your banking information is securely stored and ready for processing.'}
            </p>
          </div>

          <button
            onClick={handleNextClick}
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : 'Continue to Next Step'}
          </button>
        </div>
      ) : !localData.bankConnectionMethod ? (
        // Show method selection
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Flinks Option */}
            <div
              className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 hover:border-purple-400 transition-colors cursor-pointer relative shadow-lg"
              onClick={() => handleMethodSelect('flinks')}
            >
              <div className="flex items-center gap-2 text-purple-600 mb-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="text-sm font-medium">
                  Faster option. Typically approved within 24 hours
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2">
                Securely Connect your Bank Account
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Keep uses Flinks to securely view your banking history — in
                seconds with no paperwork required.
              </p>
              <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Connect your account
              </button>
              <div className="mt-4 space-y-2">
                <div className="flex items-start text-sm text-gray-700">
                  <svg
                    className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Bank-level security protects your information.
                </div>
                <div className="flex items-start text-sm text-gray-700">
                  <svg
                    className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  You control what we see - never your passwords.
                </div>
                <div className="flex items-start text-sm text-gray-700">
                  <svg
                    className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Faster approval with priority review.
                </div>
                <div className="flex items-start text-sm text-gray-700">
                  <svg
                    className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  No paperwork to download or upload.
                </div>
              </div>
            </div>

            {/* Manual Upload Option */}
            <div
              className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => handleMethodSelect('manual')}
            >
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium">
                  Up to a week to approve your application
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2">
                Manual Statement Upload
                <br />
                <br />
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Please upload your last 6 months of bank statements to help us
                review your business.
              </p>
              <button className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                Upload Bank Statements
              </button>
              <div className="mt-4 space-y-2">
                <div className="flex items-start text-sm text-gray-700">
                  <svg
                    className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Standard credit evaluation with manual review
                </div>
                <div className="flex items-start text-sm text-gray-700">
                  <svg
                    className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Your documents are protected with bank-level security
                </div>
                <div className="flex items-start text-sm text-gray-500">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Faster approval with priority review.
                </div>
                <div className="flex items-start text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-2 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  No paperwork to download or upload.
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : localData.bankConnectionMethod === 'manual' ? (
        // Show manual upload form
        <div className="space-y-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() =>
                setLocalData((prev) => ({ ...prev, bankConnectionMethod: '' }))
              }
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
          </div>

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
                  <p className="text-sm text-gray-600">+ Add more files</p>
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

          {/* Continue button (disabled until files are uploaded) */}
          <button
            disabled
            className="w-full bg-gray-200 text-gray-400 py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      ) : (
        // Connection not completed - show iframe and connection flow
        <>
          {/* Success message when connection is completed */}
          {connectionStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Bank connection successful!
                  </p>
                  <p className="text-sm text-green-600">
                    Redirecting to next step in 1 second...
                  </p>
                </div>
              </div>
            </div>
          )}

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
              src={`${process.env.NEXT_PUBLIC_FLINKS_IFRAME_URL}/v2?customerName=Keep&daysOfTransactions=Days365&scheduleRefresh=false&consentEnable=true&detailsAndStatementEnable=true&monthsOfStatements=Months12&enhancedMFA=false&maximumRetry=3&tag=${formattedFlinksTags}${skipFlinks ? '&demo=true' : ''}`}
              width="100%"
              height="600"
              frameBorder="0"
              style={{ border: 'none', borderRadius: '8px' }}
              title="Bank Connection"
            />
          </div>

          {/* Security note */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
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
        </>
      )}
    </div>
  );
}
