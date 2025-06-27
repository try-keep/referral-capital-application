'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Declare Facebook Pixel types
declare global {
  interface Window {
    fbq: (action: string, event: string, data?: object) => void;
  }
}
import Navbar from '@/components/Navbar';
import { submitApplication, type ApplicationData } from '@/lib/api';
import {
  searchCanadianBusinesses,
  formatBusinessDataForForm,
  type BusinessRegistryResult,
} from '@/lib/businessRegistry';
import {
  saveOrUpdateBusiness,
  saveManualBusiness,
  saveApplication,
  updateApplication,
  type UserData,
} from '@/lib/supabase';
import { getUserIpAddress } from '@/lib/ipAddress';
import { searchAddresses, type GeoapifyFeature } from '@/lib/geoapify';

interface FormData {
  [key: string]: string;
}

const stepTitles = {
  1: 'Loan Type',
  2: 'Personal Information',
  3: 'Business Owner',
  4: 'Business Search',
  5: 'Business Name',
  6: 'Monthly Sales',
  7: 'Existing Loans',
  8: 'Funding Amount',
  9: 'Funding Purpose',
  10: 'Business Details',
  11: 'Financial Information',
  12: 'Bank Information',
  13: 'Additional Details',
  14: 'Review & Submit',
};

const stepDescriptions = {
  1: 'What type of funding are you looking for?',
  2: 'Tell us about yourself and your role in the business',
  3: 'Verify your role in the business',
  4: 'Find and verify your business in the Canadian Business Registry',
  5: 'Enter your legal business name manually',
  6: 'Tell us about your monthly sales',
  7: 'Tell us about any existing loan obligations',
  8: 'How much funding do you need and when?',
  9: 'How will you use the funds?',
  10: 'Provide details about your business operations',
  11: 'Share your revenue and funding requirements',
  12: 'Banking and account information',
  13: 'Additional details',
  14: 'Review your application before submitting',
};

export default function StepPage() {
  const router = useRouter();
  const params = useParams();
  const currentStep = parseInt(params.id as string);
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const saveFormData = (data: FormData) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    localStorage.setItem(
      'referralApplicationData',
      JSON.stringify(updatedData)
    );
  };

  // Check if a step is accessible based on completed previous steps
  const isStepAccessible = useCallback(
    (step: number): boolean => {
      if (step === 1) return true; // Step 1 is always accessible

      // Check if all previous steps have been completed
      const requiredFields: Record<number, (keyof FormData)[]> = {
        1: ['loanType'],
        2: [
          'firstName',
          'lastName',
          'email',
          'addressLine1',
          'city',
          'province',
          'postalCode',
        ], // Personal info with address
        3: ['isBusinessOwner'], // Business owner
        4: ['businessName'], // Business search/name (conditional: only if businessConfirmed exists)
        5: ['monthlySales'],
        6: ['hasExistingLoans'],
        7: ['fundingAmount', 'fundingTimeline'],
        8: ['fundingPurpose'],
        9: ['businessType', 'numberOfEmployees'],
        10: ['annualRevenue', 'cashFlow', 'creditScore'],
        11: ['bankConnectionCompleted'],
        12: ['businessAddress', 'businessPhone'],
        13: [], // Additional Details - no required fields
        14: ['agreesToTerms', 'authorizesCreditCheck'],
      };

      // Check all steps up to the current one
      for (let i = 2; i <= step; i++) {
        const fields = requiredFields[i] || [];

        // Special handling for conditional steps
        if (i === 4) {
          // Step 4 (manual business entry) is only required if business search wasn't verified
          // If businessConfirmed is 'true', skip step 4 validation
          if (formData.businessConfirmed === 'true') {
            continue; // Skip step 4 validation
          }
          // If businessConfirmed is 'false', then we need businessName from manual entry
          if (
            formData.businessConfirmed === 'false' &&
            !formData.businessName
          ) {
            console.log(
              `🚫 Step ${step} not accessible: missing manual businessName from step 4`
            );
            return false;
          }
          continue;
        }

        // Regular field validation
        for (const field of fields) {
          if (!formData[field]) {
            console.log(
              `🚫 Step ${step} not accessible: missing ${field} from step ${i}`
            );
            return false;
          }
        }
      }

      return true;
    },
    [formData]
  );

  useEffect(() => {
    const savedData = localStorage.getItem('referralApplicationData');
    console.log('📋 Raw saved data from localStorage:', savedData);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      console.log('📋 Loading saved form data:', parsedData);
      console.log('📋 Current step is:', currentStep);
      console.log('📋 Setting formData to:', parsedData);
      setFormData(parsedData);

      // Only check step accessibility if this is a direct URL access (not programmatic navigation)
      // Check if we came from programmatic navigation by looking for a flag
      const isProgrammaticNavigation = sessionStorage.getItem(
        'isProgrammaticNavigation'
      );
      if (isProgrammaticNavigation) {
        // Clear the flag and skip step protection
        sessionStorage.removeItem('isProgrammaticNavigation');
        console.log('⏭️ Skipping step protection - programmatic navigation');
      } else if (initialLoad) {
        // Only run step protection for direct URL access
        setTimeout(() => {
          if (!isStepAccessible(currentStep)) {
            console.log(
              `🚫 Redirecting from step ${currentStep} - requirements not met`
            );
            // Find the highest accessible step
            let accessibleStep = 1;
            for (let i = 1; i <= 14; i++) {
              if (isStepAccessible(i)) {
                accessibleStep = i;
              } else {
                break;
              }
            }
            router.push(`/step/${accessibleStep}`);
          }
        }, 100); // Small delay to ensure formData is set
      }
      setInitialLoad(false);
    } else {
      console.log('📋 No saved form data found');
      // If no saved data and not on step 1, redirect to step 1
      if (currentStep !== 1) {
        console.log(
          `🚫 No saved data, redirecting from step ${currentStep} to step 1`
        );
        router.push('/step/1');
      }
      setInitialLoad(false);
    }

    // Fire Facebook Pixel event for application start page view
    if (currentStep === 1 && typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', { content_name: 'Application Start' });
    }
  }, [currentStep, router]);

  const handleNext = async (stepData: FormData) => {
    setIsSubmitting(true);
    saveFormData(stepData);

    // NOTE: Application is only created at final submission (step 14), not here

    // Fire Facebook Pixel events at key conversion points
    if (typeof window !== 'undefined' && window.fbq) {
      if (currentStep === 1) {
        // User started the application process
        window.fbq('track', 'InitiateCheckout');
      } else if (currentStep === 2) {
        // User provided personal information - deeper engagement (moved to step 2)
        window.fbq('track', 'Lead');
      } else if (currentStep === 4) {
        // User completed business search - key conversion point (moved to step 4)
        window.fbq('track', 'ViewContent', { content_name: 'Business Search' });
      }
    }

    // Create user at step 2 for campaign management (only once per session)
    if (currentStep === 2) {
      try {
        // Check if we've already created a user for this session
        // Always create or update user data at step 2 (Personal Information + Address)
        const allFormData = { ...formData, ...stepData };
        const userIpAddress = await getUserIpAddress();

        const userData: UserData = {
          first_name: stepData.firstName || '',
          last_name: stepData.lastName || '',
          email: stepData.email || '',
          phone: stepData.phone || '',
          address_line1: stepData.addressLine1 || '',
          address_line2: stepData.addressLine2 || '',
          city: stepData.city || '',
          province: stepData.province || '',
          postal_code: stepData.postalCode || '',
          role_in_business: stepData.roleInBusiness || '',
          ownership_percentage: stepData.ownershipPercentage
            ? parseInt(stepData.ownershipPercentage)
            : undefined,
          source: 'referral_application',
          email_marketing_consent: stepData.emailMarketingConsent === 'true',
          sms_marketing_consent: stepData.smsMarketingConsent === 'true',
          ip_address: userIpAddress || undefined,
          user_agent:
            typeof window !== 'undefined'
              ? window.navigator.userAgent
              : undefined,

          // Extract UTM parameters from URL or localStorage if available
          utm_campaign:
            new URLSearchParams(window.location.search).get('utm_campaign') ||
            undefined,
          utm_source:
            new URLSearchParams(window.location.search).get('utm_source') ||
            undefined,
          utm_medium:
            new URLSearchParams(window.location.search).get('utm_medium') ||
            undefined,
          utm_content:
            new URLSearchParams(window.location.search).get('utm_content') ||
            undefined,
        };

        console.log('Creating/updating user at step 2:', userData);

        // Upsert user (create or update) to ensure address data is always saved
        const response = await fetch('/api/users/upsert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userData,
            // No applicationId - will be linked at final submission
          }),
        });

        const result = await response.json();

        if (result.success && result.user) {
          console.log('User created/updated:', result.user);
          localStorage.setItem('userId', result.user.id);
        } else {
          console.error('User upsert failed:', result.error);
        }
      } catch (error) {
        console.error('Error creating user:', error);
        // Don't block the flow if user creation fails
      }
    }

    // Trigger background compliance checks at key steps
    const triggerComplianceChecks = async () => {
      const applicationId = localStorage.getItem('applicationId');
      const allFormData = { ...formData, ...stepData };

      try {
        // Step 10: Website URL provided - trigger website compliance check
        if (currentStep === 10 && stepData.websiteUrl) {
          const businessName =
            allFormData.businessName ||
            allFormData.legalBusinessName ||
            allFormData.companyName;

          console.log('🔍 DEBUGGING Step 10 compliance trigger:');
          console.log('Step Data:', stepData);
          console.log('Website URL:', stepData.websiteUrl);
          console.log('Business Name:', businessName);
          console.log('Application ID:', applicationId);
          console.log('All Form Data:', allFormData);

          const payload = {
            businessWebsite: stepData.websiteUrl,
            businessName,
            applicationId,
          };

          console.log('API Payload:', payload);

          fetch('/api/compliance/comprehensive-check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
            .then((response) => {
              console.log(
                '✅ Comprehensive Compliance API Response Status:',
                response.status
              );
              return response.json();
            })
            .then((data) => {
              console.log(
                '✅ Comprehensive Compliance API Response Data:',
                data
              );
            })
            .catch((err) => {
              console.error('❌ Comprehensive compliance check failed:', err);
            });
        }

        // Note: AI categorization and adverse media checks are now included
        // in the comprehensive compliance check at Step 10
      } catch (error) {
        console.log('Compliance checks error:', error);
      }
    };

    // Run compliance checks in background (non-blocking)
    triggerComplianceChecks();

    // Debug logging
    console.log(`Step ${currentStep} completed with data:`, stepData);
    console.log('All form data:', { ...formData, ...stepData });

    if (currentStep < 14) {
      // Handle conditional navigation
      let nextStep = currentStep + 1;

      // If user completes business search without registry verification, go to manual entry step
      if (currentStep === 4 && stepData.businessConfirmed === 'false') {
        nextStep = 5; // Manual business name entry
      }
      // If user completes business search WITH registry verification, skip manual entry step
      else if (currentStep === 4 && stepData.businessConfirmed === 'true') {
        nextStep = 6; // Skip manual entry, go directly to Monthly Sales
      }
      // If user completes manual business name entry, continue to Monthly Sales
      else if (
        currentStep === 5 &&
        stepData.businessSearchVerified === 'manual-entry'
      ) {
        nextStep = 6; // Continue to Monthly Sales
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      // Set flag to indicate this is programmatic navigation
      sessionStorage.setItem('isProgrammaticNavigation', 'true');
      router.push(`/step/${nextStep}`);
    } else {
      // Submit to backend for final step
      try {
        const finalData = {
          ...formData,
          ...stepData,
        };
        const response = await submitApplication(
          finalData as unknown as ApplicationData
        );

        // Fire Facebook Pixel conversion event for successful application submission
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'CompleteRegistration');
        }

        // Clear form data after successful submission so user can start fresh
        localStorage.removeItem('referralApplicationData');
        localStorage.removeItem('userId');
        console.log(
          '🧹 Form data and user session cleared after successful submission'
        );

        // Store application ID for success page (after clearing old data)
        localStorage.setItem(
          'applicationId',
          response.applicationId.toString()
        );
        localStorage.setItem('submissionSuccess', 'true');

        router.push('/success');
      } catch (error) {
        console.error('Submission error:', error);
        alert('Failed to submit application. Please try again.');
      }
    }
    setIsSubmitting(false);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      // Set flag to indicate this is programmatic navigation
      sessionStorage.setItem('isProgrammaticNavigation', 'true');
      router.push(`/step/${currentStep - 1}`);
    } else {
      router.push('/');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Form
            key={`step1-${currentStep}`}
            onNext={handleNext}
            formData={formData}
            isSubmitting={isSubmitting}
          />
        );
      case 2:
        // Personal Information (moved from step 7)
        return (
          <Step7Form
            key={`step7-${currentStep}`}
            onNext={handleNext}
            formData={formData}
            isSubmitting={isSubmitting}
          />
        );
      case 3:
        // Business Owner (moved from step 2)
        return (
          <Step2Form
            key={`step2-${currentStep}`}
            onNext={handleNext}
            formData={formData}
            isSubmitting={isSubmitting}
          />
        );
      case 4:
        // Business Search (moved from step 3)
        return (
          <BusinessSearchForm
            key={`business-search-${currentStep}`}
            onNext={handleNext}
            formData={formData}
            isSubmitting={isSubmitting}
          />
        );
      case 5:
        // Step 5 is dedicated to manual business name entry (conditional)
        return (
          <Step6Form
            key={`step6-${currentStep}`}
            onNext={handleNext}
            formData={formData}
            isSubmitting={isSubmitting}
          />
        );
      case 6:
        // Monthly Sales (moved from step 5)
        return (
          <Step3Form
            key={`step3-${currentStep}`}
            onNext={handleNext}
            formData={formData}
            isSubmitting={isSubmitting}
          />
        );
      case 7:
        // Existing Loans (moved from step 6)
        return (
          <Step4Form
            key={`step4-${currentStep}`}
            onNext={handleNext}
            formData={formData}
            isSubmitting={isSubmitting}
          />
        );
      case 8:
        return (
          <Step8Form
            key={`step8-${currentStep}`}
            onNext={handleNext}
            formData={formData}
            isSubmitting={isSubmitting}
          />
        );
      case 9:
        return (
          <Step9Form
            key={`step9-${currentStep}`}
            onNext={handleNext}
            formData={formData}
            isSubmitting={isSubmitting}
          />
        );
      case 10:
        return (
          <Step10Form
            key={`step10-${currentStep}`}
            onNext={handleNext}
            formData={formData}
            isSubmitting={isSubmitting}
          />
        );
      case 11:
        return (
          <Step11Form
            key={`step11-${currentStep}`}
            onNext={handleNext}
            formData={formData}
            isSubmitting={isSubmitting}
          />
        );
      case 12:
        return (
          <Step12Form
            key={`step12-${currentStep}`}
            onNext={handleNext}
            formData={formData}
            isSubmitting={isSubmitting}
          />
        );
      case 13:
        return (
          <Step13Form
            key={`step13-${currentStep}`}
            onNext={handleNext}
            formData={formData}
            isSubmitting={isSubmitting}
          />
        );
      case 14:
        return (
          <Step14Form
            key={`step14-${currentStep}`}
            onNext={handleNext}
            formData={formData}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return <div>Step not found</div>;
    }
  };

  if (currentStep < 1 || currentStep > 14) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Step Not Found
            </h1>
            <button
              onClick={() => router.push('/')}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Go Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        showBackButton={true}
        onBackClick={handleBack}
        backLabel={currentStep === 1 ? 'Home' : 'Previous'}
      />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">
                Step {currentStep} of 14
              </span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((step) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full ${
                      step <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {stepTitles[currentStep as keyof typeof stepTitles]}
            </h1>
            <p className="text-gray-600">
              {stepDescriptions[currentStep as keyof typeof stepDescriptions]}
            </p>
          </div>

          {renderStepContent()}

          {/* Add social proof to key trust-building steps */}
          {(currentStep === 1 || currentStep === 7 || currentStep === 12) && (
            <div className="mt-8">
              <script
                src="https://widget.senja.io/widget/3b59fc5b-c72d-4182-ad0e-1b90a2049069/platform.js"
                type="text/javascript"
                async
              ></script>
              <div
                className="senja-embed"
                data-id="3b59fc5b-c72d-4182-ad0e-1b90a2049069"
                data-mode="shadow"
                data-lazyload="false"
                style={{ display: 'block', width: '100%' }}
              ></div>
            </div>
          )}

          {/* Add review widget to final steps */}
          {currentStep === 14 && (
            <div className="mt-8">
              <script
                src="https://widget.senja.io/widget/846e80aa-0de3-4620-9375-cddaa7715b56/platform.js"
                type="text/javascript"
                async
              ></script>
              <div
                className="senja-embed"
                data-id="846e80aa-0de3-4620-9375-cddaa7715b56"
                data-mode="shadow"
                data-lazyload="false"
                style={{ display: 'block', width: '100%' }}
              ></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Step 10: Business Details
function Step10Form({
  onNext,
  formData,
  isSubmitting,
}: {
  onNext: (data: FormData) => void;
  formData: FormData;
  isSubmitting: boolean;
}) {
  const [localData, setLocalData] = useState({
    businessType: formData.businessType || '',
    numberOfEmployees: formData.numberOfEmployees || '',
    websiteUrl: formData.websiteUrl || '',
  });

  // Update local data when formData prop changes (for when user navigates back)
  useEffect(() => {
    console.log('🔄 Step10Form - formData prop changed:', formData);
    setLocalData({
      businessType: formData.businessType || '',
      numberOfEmployees: formData.numberOfEmployees || '',
      websiteUrl: formData.websiteUrl || '',
    });
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(localData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <label
          htmlFor="businessType"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          What type of business do you operate? *
        </label>
        <select
          id="businessType"
          required
          value={localData.businessType}
          onChange={(e) =>
            setLocalData({ ...localData, businessType: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select Business Type</option>
          <option value="retail">Retail</option>
          <option value="restaurant">Restaurant/Food Service</option>
          <option value="professional-services">Professional Services</option>
          <option value="construction">Construction</option>
          <option value="healthcare">Healthcare</option>
          <option value="technology">Technology</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="transportation">Transportation</option>
          <option value="real-estate">Real Estate</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mb-8">
        <label
          htmlFor="numberOfEmployees"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          How many employees do you have? *
        </label>
        <select
          id="numberOfEmployees"
          required
          value={localData.numberOfEmployees}
          onChange={(e) =>
            setLocalData({ ...localData, numberOfEmployees: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select Number of Employees</option>
          <option value="just-me">Just me</option>
          <option value="2-5">2-5 employees</option>
          <option value="6-10">6-10 employees</option>
          <option value="11-25">11-25 employees</option>
          <option value="26-50">26-50 employees</option>
          <option value="51-100">51-100 employees</option>
          <option value="over-100">Over 100 employees</option>
        </select>
      </div>

      <div className="mb-8">
        <label
          htmlFor="websiteUrl"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Business Website (Optional)
        </label>
        <input
          type="text"
          id="websiteUrl"
          placeholder="trykeep.com or www.yourbusiness.com"
          value={localData.websiteUrl}
          onChange={(e) =>
            setLocalData({ ...localData, websiteUrl: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">
          Enter your business website (e.g., trykeep.com, www.example.com, or
          https://example.com). We'll format it automatically.
        </p>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Continue to Financial Information'}
        </button>
      </div>
    </form>
  );
}

// Step 4: Manual Business Name Entry (Conditional)
function Step6Form({
  onNext,
  formData,
  isSubmitting,
}: {
  onNext: (data: FormData) => void;
  formData: FormData;
  isSubmitting: boolean;
}) {
  const [localData, setLocalData] = useState({
    businessName: formData.businessName || '',
    legalBusinessName: formData.legalBusinessName || '',
  });
  const [isSubmittingInternal, setIsSubmittingInternal] = useState(false);

  // Update local data when formData prop changes (for when user navigates back)
  useEffect(() => {
    console.log('🔄 Step6Form - formData prop changed:', formData);
    setLocalData({
      businessName: formData.businessName || '',
      legalBusinessName: formData.legalBusinessName || '',
    });
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localData.legalBusinessName) {
      alert('Please enter your legal business name');
      return;
    }

    setIsSubmittingInternal(true);

    try {
      // Save manual business entry to database
      const savedBusiness = await saveManualBusiness(
        localData.legalBusinessName
      );

      onNext({
        ...localData,
        businessName: localData.legalBusinessName,
        businessSearchVerified: 'manual-entry',
        businessId: savedBusiness.id,
        legalBusinessName: localData.legalBusinessName,
      });

      console.log('✅ Manual business entry saved to database:', savedBusiness);
    } catch (error) {
      console.error('❌ Error saving manual business entry:', error);
      alert('Failed to save business information. Please try again.');
    } finally {
      setIsSubmittingInternal(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Enter Your Legal Business Name
        </h2>
        <p className="text-gray-600">
          Since we couldn't find your business in the Canadian Business
          Registry, please enter your legal business name as it appears on your
          registration documents.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="legalBusinessName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Legal Business Name *
          </label>
          <input
            type="text"
            id="legalBusinessName"
            required
            value={localData.legalBusinessName}
            onChange={(e) =>
              setLocalData({ ...localData, legalBusinessName: e.target.value })
            }
            placeholder="Enter your exact legal business name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            This should match the name on your business registration,
            incorporation papers, or other legal documents.
          </p>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting || isSubmittingInternal}
            className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isSubmitting || isSubmittingInternal
              ? 'Saving...'
              : 'Continue to Personal Information'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Step 12: Bank Information
function Step12Form({
  onNext,
  formData,
  isSubmitting,
}: {
  onNext: (data: FormData) => void;
  formData: FormData;
  isSubmitting: boolean;
}) {
  const [localData, setLocalData] = useState({
    bankConnectionCompleted: formData.bankConnectionCompleted || false,
    loginId: formData.loginId || '',
    institution: formData.institution || '',
  });

  // Track if we've already handled the redirect to prevent duplicate calls
  const hasHandledRedirect = useRef(false);

  // Track connection status for UI feedback
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'success' | 'error'
  >('connecting');

  // Check if bank connection is already completed
  const isConnectionCompleted =
    localData.bankConnectionCompleted === 'true' ||
    localData.bankConnectionCompleted === true;

  // Update local data when formData prop changes (for when user navigates back)
  useEffect(() => {
    console.log('🔄 Step12Form - formData prop changed:', formData);
    setLocalData({
      bankConnectionCompleted: formData.bankConnectionCompleted || false,
      loginId: formData.loginId || '',
      institution: formData.institution || '',
    });

    // If connection is already completed, set status to success
    if (formData.bankConnectionCompleted === 'true') {
      setConnectionStatus('success');
    }
  }, [formData]);

  // Listen for Flinks redirect event
  useEffect(() => {
    function handleFlinksRedirect(event: MessageEvent) {
      // Check if this is a Flinks redirect message
      if (
        event.data &&
        typeof event.data === 'object' &&
        event.data.step === 'REDIRECT' &&
        !hasHandledRedirect.current
      ) {
        console.log('🎉 Flinks redirect event received:', event.data);
        hasHandledRedirect.current = true;

        // Show success status
        setConnectionStatus('success');

        // Extract loginId and institution from the URL if needed
        let loginId: string = '';
        let institution: string = '';

        if (event.data.url) {
          try {
            const url = new URL(event.data.url);
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
          loginId,
          institution,
        };

        // Update localStorage with the connection data
        const existingData = localStorage.getItem('referralApplicationData');
        if (existingData) {
          const parsedData = JSON.parse(existingData);
          const updatedData = { ...parsedData, ...connectionData };
          localStorage.setItem(
            'referralApplicationData',
            JSON.stringify(updatedData)
          );
          console.log('💾 Bank connection data saved to localStorage');
        }

        // Add 2-second timeout before proceeding to next step
        setTimeout(() => {
          console.log('⏰ Proceeding to next step after 1-second timeout');
          onNext(connectionData);
        }, 2000);
      }
    }

    // Only add event listener if connection is not already completed
    if (!isConnectionCompleted) {
      window.addEventListener('message', handleFlinksRedirect);

      // Cleanup event listener on unmount
      return () => {
        window.removeEventListener('message', handleFlinksRedirect);
      };
    }
  }, [localData, onNext, isConnectionCompleted]);

  // Handle manual next button click for completed connections
  const handleNextClick = () => {
    onNext({
      ...localData,
      bankConnectionCompleted: 'true',
    });
  };

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
              Your business bank account has been successfully connected. Your
              banking information is securely stored and ready for processing.
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

          {/* Flinks iframe */}
          <div className="mb-8">
            <iframe
              src="https://trykeep-iframe.private.fin.ag/v2?customerName=Keep&daysOfTransactions=Days365&scheduleRefresh=false&consentEnable=true&detailsAndStatementEnable=true&monthsOfStatements=Months12&enhancedMFA=false&maximumRetry=3&tag=capitalApplication"
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

// Step 14: Review & Submit
function Step14Form({
  onNext,
  formData,
  isSubmitting,
}: {
  onNext: (data: FormData) => void;
  formData: FormData;
  isSubmitting: boolean;
}) {
  const [localData, setLocalData] = useState({
    agreesToTerms: formData.agreesToTerms === 'true',
    authorizesCreditCheck: formData.authorizesCreditCheck === 'true',
  });

  // Update local data when formData prop changes (for when user navigates back)
  useEffect(() => {
    console.log('🔄 Step14Form - formData prop changed:', formData);
    setLocalData({
      agreesToTerms: formData.agreesToTerms === 'true',
      authorizesCreditCheck: formData.authorizesCreditCheck === 'true',
    });
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localData.agreesToTerms) {
      alert(
        'Please confirm that all information provided is accurate and complete'
      );
      return;
    }
    if (!localData.authorizesCreditCheck) {
      alert(
        'Please authorize the credit check to proceed with your application'
      );
      return;
    }

    // Get user's IP address
    const ipAddress = await getUserIpAddress();

    onNext({
      agreesToTerms: localData.agreesToTerms.toString(),
      authorizesCreditCheck: localData.authorizesCreditCheck.toString(),
      ipAddress: ipAddress || '',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Review Your Application
        </h2>
        <p className="text-gray-600">
          Please review the information below and submit your application.
        </p>
      </div>

      {/* Summary of entered data */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Application Summary
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          {formData.loanType && (
            <div>
              <span className="font-medium">Loan Type:</span>{' '}
              {formData.loanType}
            </div>
          )}
          {formData.businessName && (
            <div>
              <span className="font-medium">Business:</span>{' '}
              {formData.businessName}
            </div>
          )}
          {formData.fundingAmount && (
            <div>
              <span className="font-medium">Funding Amount:</span> $
              {formData.fundingAmount}
            </div>
          )}
          {formData.firstName && formData.lastName && (
            <div>
              <span className="font-medium">Contact:</span> {formData.firstName}{' '}
              {formData.lastName}
            </div>
          )}
          {formData.email && (
            <div>
              <span className="font-medium">Email:</span> {formData.email}
            </div>
          )}
          {formData.phone && (
            <div>
              <span className="font-medium">Phone:</span> {formData.phone}
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-8">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="agreesToTerms"
              checked={localData.agreesToTerms}
              onChange={(e) =>
                setLocalData({ ...localData, agreesToTerms: e.target.checked })
              }
              className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="agreesToTerms" className="text-sm text-gray-700">
              I confirm that all information provided in this application is
              accurate and complete
            </label>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="authorizesCreditCheck"
              checked={localData.authorizesCreditCheck}
              onChange={(e) =>
                setLocalData({
                  ...localData,
                  authorizesCreditCheck: e.target.checked,
                })
              }
              className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="authorizesCreditCheck"
              className="text-sm text-gray-700"
            >
              I authorize Keep Technologies and its lending partners to obtain
              and use my personal and business credit information from one or
              more credit reporting agencies, including a soft or hard inquiry,
              for the purposes of assessing this application for business
              financing.
            </label>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !localData.agreesToTerms ||
              !localData.authorizesCreditCheck
            }
            className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 text-lg"
          >
            {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
          </button>
        </div>
      </form>

      <p className="text-xs text-gray-500 text-center mt-4">
        By submitting this application, you acknowledge that all information
        provided is accurate and complete.
      </p>
    </div>
  );
}

// Step 3: Business Search Form (New)
function BusinessSearchForm({
  onNext,
  formData,
  isSubmitting,
}: {
  onNext: (data: FormData) => void;
  formData: FormData;
  isSubmitting: boolean;
}) {
  const [localData, setLocalData] = useState({
    businessName: formData.businessName || '',
    businessSearchQuery: formData.businessSearchQuery || '',
    selectedBusiness: formData.selectedBusiness || '',
    businessConfirmed: formData.businessConfirmed || false,
  });

  // Update local data when formData prop changes (for when user navigates back)
  useEffect(() => {
    console.log('🔄 BusinessSearchForm - formData prop changed:', formData);
    setLocalData({
      businessName: formData.businessName || '',
      businessSearchQuery: formData.businessSearchQuery || '',
      selectedBusiness: formData.selectedBusiness || '',
      businessConfirmed: formData.businessConfirmed || false,
    });
  }, [formData]);

  const [searchResults, setSearchResults] = useState<BusinessRegistryResult[]>(
    []
  );
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedBusinessData, setSelectedBusinessData] =
    useState<BusinessRegistryResult | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSearch = async () => {
    if (!localData.businessSearchQuery.trim()) {
      alert('Please enter a business name to search');
      return;
    }

    setIsSearching(true);
    setHasSearched(false);

    try {
      const results = await searchCanadianBusinesses(
        localData.businessSearchQuery
      );
      setSearchResults(results.docs);
      setHasSearched(true);

      if (results.docs.length === 0) {
        alert(
          'No businesses found. Please try a different search term or continue manually.'
        );
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again or continue manually.');
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBusinessSelect = (business: BusinessRegistryResult) => {
    setSelectedBusinessData(business);
    setShowConfirmation(true);
  };

  const handleConfirmBusiness = async () => {
    if (!selectedBusinessData) return;

    try {
      // Save business to database
      const savedBusiness = await saveOrUpdateBusiness(
        selectedBusinessData,
        localData.businessSearchQuery
      );

      const businessData = formatBusinessDataForForm(selectedBusinessData);

      // Update local state with confirmed business data
      setLocalData({
        ...localData,
        businessName: businessData.businessName,
        selectedBusiness: selectedBusinessData.MRAS_ID,
        businessConfirmed: true,
      });

      // Save the business data and proceed to next step with ALL business information
      onNext({
        ...localData,
        businessName: businessData.businessName,
        selectedBusiness: selectedBusinessData.MRAS_ID,
        businessConfirmed: 'true',
        businessId: savedBusiness.id,

        // Pre-fill business details for later steps
        businessAddress: `${selectedBusinessData.Reg_office_city || selectedBusinessData.City}, ${selectedBusinessData.Reg_office_province}`,
        businessPhone: '', // Will be filled in step 13
        businessType: businessData.businessType,
        numberOfEmployees: '', // Will be filled in step 10

        // Business registry data for reference
        incorporationDate: selectedBusinessData.Date_Incorporated,
        businessNumber: selectedBusinessData.BN,
        entityType: selectedBusinessData.Entity_Type,
        jurisdiction: selectedBusinessData.Jurisdiction,
        registrySource: selectedBusinessData.Registry_Source,
        statusState: selectedBusinessData.Status_State,
        statusDate: selectedBusinessData.Status_Date,

        // Additional registry information
        mrasId: selectedBusinessData.MRAS_ID,
        juriId: selectedBusinessData.Juri_ID,
      });

      console.log('✅ Business saved to database:', savedBusiness);
    } catch (error) {
      console.error('❌ Error saving business:', error);
      alert('Failed to save business information. Please try again.');
    }
  };

  const handleManualEntry = () => {
    // Continue without selecting a business from registry
    onNext({
      ...localData,
      businessName: localData.businessSearchQuery,
      selectedBusiness: '',
      businessConfirmed: 'false',
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Icon */}
      <div className="flex justify-center mb-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Find Your Business
        </h2>
        <p className="text-gray-600">
          Search the Canadian Business Registry to verify your business
          information
        </p>
      </div>

      {!showConfirmation ? (
        <>
          {/* Search Input */}
          <div className="mb-6">
            <label
              htmlFor="businessSearch"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Business Name *
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                id="businessSearch"
                placeholder="Enter your business name (e.g., RUNASO INC)"
                value={localData.businessSearchQuery}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    businessSearchQuery: e.target.value,
                  })
                }
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                disabled={isSearching}
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={isSearching || !localData.businessSearchQuery.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Search Results */}
          {hasSearched && (
            <div className="mb-8">
              {searchResults.length > 0 ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Found {searchResults.length} result
                    {searchResults.length !== 1 ? 's' : ''}:
                  </h3>
                  <div className="space-y-3">
                    {searchResults.map((business, index) => (
                      <div
                        key={business.MRAS_ID}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                        onClick={() => handleBusinessSelect(business)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {business.Company_Name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {business.Entity_Type} • {business.City},{' '}
                              {business.Reg_office_province}
                            </p>
                            <p className="text-sm text-gray-500">
                              Status: {business.Status_State} • Incorporated:{' '}
                              {business.Date_Incorporated}
                            </p>
                            {business.BN && (
                              <p className="text-sm text-gray-500">
                                Business Number: {business.BN}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center text-blue-600">
                            <span className="text-sm font-medium">Select</span>
                            <svg
                              className="w-5 h-5 ml-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
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
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No businesses found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find your business in the Canadian Business
                    Registry.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleManualEntry}
              disabled={isSubmitting}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Continue Without Registry Verification
            </button>
          </div>
        </>
      ) : (
        /* Confirmation Screen */
        <div className="text-center">
          <div className="mb-6">
            <svg
              className="w-16 h-16 text-green-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Is this your business?
            </h3>
          </div>

          {selectedBusinessData && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h4 className="font-semibold text-gray-900 text-lg mb-3">
                {selectedBusinessData.Company_Name}
              </h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Type:</span>{' '}
                  {selectedBusinessData.Entity_Type}
                </p>
                <p>
                  <span className="font-medium">Location:</span>{' '}
                  {selectedBusinessData.City},{' '}
                  {selectedBusinessData.Reg_office_province}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{' '}
                  {selectedBusinessData.Status_State}
                </p>
                <p>
                  <span className="font-medium">Incorporated:</span>{' '}
                  {selectedBusinessData.Date_Incorporated}
                </p>
                {selectedBusinessData.BN && (
                  <p>
                    <span className="font-medium">Business Number:</span>{' '}
                    {selectedBusinessData.BN}
                  </p>
                )}
                <p>
                  <span className="font-medium">Jurisdiction:</span>{' '}
                  {selectedBusinessData.Jurisdiction}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowConfirmation(false)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Back to Search
            </button>
            <button
              onClick={handleConfirmBusiness}
              disabled={isSubmitting}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Yes, This is My Business'}
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

// Step 1: Loan Type Selection
function Step1Form({
  onNext,
  formData,
  isSubmitting,
}: {
  onNext: (data: FormData) => void;
  formData: FormData;
  isSubmitting: boolean;
}) {
  const [localData, setLocalData] = useState({
    loanType: formData.loanType || '',
  });

  // Update local data when formData prop changes (for when user navigates back)
  useEffect(() => {
    console.log('🔄 Step1Form - formData prop changed:', formData);
    setLocalData({
      loanType: formData.loanType || '',
    });
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localData.loanType) {
      alert('Please select a loan type');
      return;
    }
    onNext(localData);
  };

  const handleLoanTypeSelect = (type: string) => {
    setLocalData({ ...localData, loanType: type });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Icon */}
      <div className="flex justify-center mb-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Are you looking for...
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={() => handleLoanTypeSelect('business-loan')}
            className={`p-8 border-2 rounded-lg text-center transition-all hover:border-green-300 ${
              localData.loanType === 'business-loan'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl text-green-600">$</span>
              </div>
            </div>
            <div className="text-lg font-medium text-gray-700">
              A business loan
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleLoanTypeSelect('line-of-credit')}
            className={`p-8 border-2 rounded-lg text-center transition-all hover:border-green-300 ${
              localData.loanType === 'line-of-credit'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl text-green-600">$</span>
              </div>
            </div>
            <div className="text-lg font-medium text-gray-700">
              A line of credit
            </div>
          </button>
        </div>

        <div className="mb-8">
          <button
            type="button"
            onClick={() => handleLoanTypeSelect('both')}
            className={`w-full p-8 border-2 rounded-lg text-center transition-all hover:border-green-300 ${
              localData.loanType === 'both'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl text-green-600">⟲</span>
              </div>
            </div>
            <div className="text-lg font-medium text-gray-700">
              A bit of both
            </div>
          </button>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting || !localData.loanType}
            className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Next'}
          </button>
        </div>
      </form>

      {/* Progress bar */}
      <div className="mt-8 bg-gray-200 rounded-full h-2">
        <div
          className="bg-black h-2 rounded-full"
          style={{ width: '8%' }}
        ></div>
      </div>
    </div>
  );
}

// Step 2: Business Owner verification
function Step2Form({
  onNext,
  formData,
  isSubmitting,
}: {
  onNext: (data: FormData) => void;
  formData: FormData;
  isSubmitting: boolean;
}) {
  const [localData, setLocalData] = useState({
    isBusinessOwner: formData.isBusinessOwner || '',
  });

  // Update local data when formData prop changes (for when user navigates back)
  useEffect(() => {
    console.log('🔄 Step2Form - formData prop changed:', formData);
    setLocalData({
      isBusinessOwner: formData.isBusinessOwner || '',
    });
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localData.isBusinessOwner) {
      alert('Please select an option');
      return;
    }
    onNext(localData);
  };

  const handleOwnerSelect = (value: string) => {
    setLocalData({ ...localData, isBusinessOwner: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Icon */}
      <div className="flex justify-center mb-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Are you the business owner or director?
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            type="button"
            onClick={() => handleOwnerSelect('yes')}
            className={`p-8 border-2 rounded-lg text-center transition-all hover:border-green-300 ${
              localData.isBusinessOwner === 'yes'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex justify-center mb-4">
              <svg
                className="w-12 h-12 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
            </div>
            <div className="text-lg font-medium text-gray-700">Yes</div>
          </button>

          <button
            type="button"
            onClick={() => handleOwnerSelect('no')}
            className={`p-8 border-2 rounded-lg text-center transition-all hover:border-red-300 ${
              localData.isBusinessOwner === 'no'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex justify-center mb-4">
              <svg
                className="w-12 h-12 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                />
              </svg>
            </div>
            <div className="text-lg font-medium text-gray-700">No</div>
          </button>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting || !localData.isBusinessOwner}
            className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Next'}
          </button>
        </div>
      </form>

      {/* Progress bar */}
      <div className="mt-8 bg-gray-200 rounded-full h-2">
        <div
          className="bg-black h-2 rounded-full"
          style={{ width: '15%' }}
        ></div>
      </div>
    </div>
  );
}

// Step 3: Monthly Sales
function Step3Form({
  onNext,
  formData,
  isSubmitting,
}: {
  onNext: (data: FormData) => void;
  formData: FormData;
  isSubmitting: boolean;
}) {
  const [localData, setLocalData] = useState({
    monthlySales: formData.monthlySales || '',
  });

  // Update local data when formData prop changes (for when user navigates back)
  useEffect(() => {
    console.log('🔄 Step3Form - formData prop changed:', formData);
    setLocalData({
      monthlySales: formData.monthlySales || '',
    });
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localData.monthlySales) {
      alert('Please enter your monthly sales');
      return;
    }
    onNext(localData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Icon */}
      <div className="flex justify-center mb-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-600"
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
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          How much are your average monthly sales?
        </h2>
        <p className="text-gray-600">
          Please estimate your average monthly sales based on the last 6 months.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">
              $
            </span>
            <input
              type="text"
              placeholder="100,000"
              value={localData.monthlySales}
              onChange={(e) =>
                setLocalData({ ...localData, monthlySales: e.target.value })
              }
              onKeyPress={handleKeyPress}
              className="w-full pl-8 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xl"
              required
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Press ENTER</span>
          <button
            type="submit"
            disabled={isSubmitting || !localData.monthlySales}
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-8 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </form>

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

// Step 4: Existing Loan Obligations
function Step4Form({
  onNext,
  formData,
  isSubmitting,
}: {
  onNext: (data: FormData) => void;
  formData: FormData;
  isSubmitting: boolean;
}) {
  const [localData, setLocalData] = useState({
    hasExistingLoans: formData.hasExistingLoans || '',
    totalLoanAmount: formData.totalLoanAmount || '',
  });

  // Update local data when formData prop changes (for when user navigates back)
  useEffect(() => {
    console.log('🔄 Step4Form - formData prop changed:', formData);
    setLocalData({
      hasExistingLoans: formData.hasExistingLoans || '',
      totalLoanAmount: formData.totalLoanAmount || '',
    });
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localData.hasExistingLoans) {
      alert('Please select whether you have existing loans');
      return;
    }
    if (localData.hasExistingLoans === 'yes' && !localData.totalLoanAmount) {
      alert('Please enter the total amount owed');
      return;
    }
    onNext(localData);
  };

  const handleLoanStatusSelect = (value: string) => {
    setLocalData({ ...localData, hasExistingLoans: value });
    if (value === 'no') {
      setLocalData({
        ...localData,
        hasExistingLoans: value,
        totalLoanAmount: '0',
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Icon */}
      <div className="flex justify-center mb-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-600"
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
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Do you have any existing business loan obligations?
        </h2>
        <p className="text-gray-600">
          This includes business loans, lines of credit, equipment financing, or
          merchant cash advances
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            type="button"
            onClick={() => handleLoanStatusSelect('yes')}
            className={`p-8 border-2 rounded-lg text-center transition-all hover:border-blue-300 ${
              localData.hasExistingLoans === 'yes'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex justify-center mb-4">
              <svg
                className="w-12 h-12 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-lg font-medium text-gray-700">
              Yes, I have existing loans
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleLoanStatusSelect('no')}
            className={`p-8 border-2 rounded-lg text-center transition-all hover:border-green-300 ${
              localData.hasExistingLoans === 'no'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex justify-center mb-4">
              <svg
                className="w-12 h-12 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-lg font-medium text-gray-700">
              No existing loans
            </div>
          </button>
        </div>

        {localData.hasExistingLoans === 'yes' && (
          <div className="mb-8">
            <label className="block text-lg font-medium text-gray-700 mb-4 text-center">
              What is the total amount you currently owe?
            </label>
            <div className="relative max-w-md mx-auto">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">
                $
              </span>
              <input
                type="text"
                placeholder="50,000"
                value={localData.totalLoanAmount}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    totalLoanAmount: e.target.value,
                  })
                }
                className="w-full pl-8 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl text-center"
                required={localData.hasExistingLoans === 'yes'}
              />
            </div>
          </div>
        )}

        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting || !localData.hasExistingLoans}
            className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Next'}
          </button>
        </div>
      </form>

      {/* Progress bar */}
      <div className="mt-8 bg-gray-200 rounded-full h-2">
        <div
          className="bg-black h-2 rounded-full"
          style={{ width: '28%' }}
        ></div>
      </div>
    </div>
  );
}

// Step 5: Business Search (Placeholder)
function Step5Form({
  onNext,
  formData,
  isSubmitting,
}: {
  onNext: (data: FormData) => void;
  formData: FormData;
  isSubmitting: boolean;
}) {
  const [localData, setLocalData] = useState({
    businessName: formData.businessName || '',
    businessSearchVerified: formData.businessSearchVerified || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localData.businessName) {
      alert('Please enter your business name');
      return;
    }
    onNext(localData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Icon */}
      <div className="flex justify-center mb-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Find Your Business
        </h2>
        <p className="text-gray-600">
          Search for and verify your business information
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <label
            htmlFor="businessName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Business Name *
          </label>
          <input
            type="text"
            id="businessName"
            required
            placeholder="Enter your business name"
            value={localData.businessName}
            onChange={(e) =>
              setLocalData({ ...localData, businessName: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting || !localData.businessName}
            className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Continue to Bank Connection'}
          </button>
        </div>
      </form>

      {/* Progress bar */}
      <div className="mt-8 bg-gray-200 rounded-full h-2">
        <div
          className="bg-black h-2 rounded-full"
          style={{ width: '36%' }}
        ></div>
      </div>
    </div>
  );
}

// Step 6: Bank Connection (Will be removed)
function RemovedStep6Form({
  onNext,
  formData,
  isSubmitting,
}: {
  onNext: (data: FormData) => void;
  formData: FormData;
  isSubmitting: boolean;
}) {
  const [localData, setLocalData] = useState({
    bankConnected: formData.bankConnected || '',
    bankConnectionMethod: formData.bankConnectionMethod || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localData.bankConnected) {
      alert('Please select a bank connection option');
      return;
    }
    onNext(localData);
  };

  const handleConnectionSelect = (value: string) => {
    setLocalData({ ...localData, bankConnected: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Icon */}
      <div className="flex justify-center mb-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-600"
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
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Connect Your Business Banking
        </h2>
        <p className="text-gray-600">
          Securely connect your business bank account to verify your financial
          information
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-8">
          <button
            type="button"
            onClick={() => handleConnectionSelect('connect-now')}
            className={`w-full p-6 border-2 rounded-lg text-left transition-all hover:border-blue-300 ${
              localData.bankConnected === 'connect-now'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="text-lg font-medium text-gray-700 mb-2">
              Connect Bank Account Now
            </div>
            <div className="text-sm text-gray-500">
              Securely connect using bank-grade encryption
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleConnectionSelect('connect-later')}
            className={`w-full p-6 border-2 rounded-lg text-left transition-all hover:border-gray-300 ${
              localData.bankConnected === 'connect-later'
                ? 'border-gray-500 bg-gray-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="text-lg font-medium text-gray-700 mb-2">
              Connect Later
            </div>
            <div className="text-sm text-gray-500">
              Proceed without connecting and provide manual information
            </div>
          </button>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting || !localData.bankConnected}
            className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Continue to Personal Information'}
          </button>
        </div>
      </form>

      {/* Progress bar */}
      <div className="mt-8 bg-gray-200 rounded-full h-2">
        <div
          className="bg-black h-2 rounded-full"
          style={{ width: '43%' }}
        ></div>
      </div>
    </div>
  );
}

// Step 7: Personal Information
function Step7Form({
  onNext,
  formData,
  isSubmitting,
}: {
  onNext: (data: FormData) => void;
  formData: FormData;
  isSubmitting: boolean;
}) {
  const [localData, setLocalData] = useState({
    firstName: formData.firstName || '',
    lastName: formData.lastName || '',
    email: formData.email || '',
    phone: formData.phone || '',
    dateOfBirth: formData.dateOfBirth || '',
    addressLine1: formData.addressLine1 || '',
    addressLine2: formData.addressLine2 || '',
    city: formData.city || '',
    province: formData.province || '',
    postalCode: formData.postalCode || '',
  });

  // Update local data when formData prop changes (for when user navigates back)
  useEffect(() => {
    console.log('🔄 Step7Form - formData prop changed:', formData);
    setLocalData({
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      dateOfBirth: formData.dateOfBirth || '',
      addressLine1: formData.addressLine1 || '',
      addressLine2: formData.addressLine2 || '',
      city: formData.city || '',
      province: formData.province || '',
      postalCode: formData.postalCode || '',
    });
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!localData.firstName.trim()) {
      alert('Please enter your first name');
      return;
    }
    if (!localData.lastName.trim()) {
      alert('Please enter your last name');
      return;
    }
    if (!localData.email.trim()) {
      alert('Please enter your email address');
      return;
    }
    if (!localData.phone.trim()) {
      alert('Please enter your phone number');
      return;
    }
    if (!localData.dateOfBirth.trim()) {
      alert('Please enter your date of birth');
      return;
    }
    if (!localData.addressLine1.trim()) {
      alert('Please enter your street address');
      return;
    }
    if (!localData.city.trim()) {
      alert('Please enter your city');
      return;
    }
    if (!localData.province.trim()) {
      alert('Please select your province');
      return;
    }
    if (!localData.postalCode.trim()) {
      alert('Please enter your postal code');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(localData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Basic Canadian postal code validation
    const postalCodeRegex = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/;
    if (!postalCodeRegex.test(localData.postalCode.toUpperCase())) {
      alert('Please enter a valid Canadian postal code (e.g., M5V 3A8)');
      return;
    }

    onNext(localData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            required
            value={localData.firstName}
            onChange={(e) =>
              setLocalData({ ...localData, firstName: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            required
            value={localData.lastName}
            onChange={(e) =>
              setLocalData({ ...localData, lastName: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            required
            value={localData.email}
            onChange={(e) =>
              setLocalData({ ...localData, email: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            required
            value={localData.phone}
            onChange={(e) =>
              setLocalData({ ...localData, phone: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mt-6">
        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Date of Birth *
          </label>
          <input
            type="date"
            id="dateOfBirth"
            required
            value={localData.dateOfBirth}
            onChange={(e) =>
              setLocalData({ ...localData, dateOfBirth: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
            Required
          </span>
          Address Information
        </h3>

        <div className="mb-6">
          <label
            htmlFor="addressLine1"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Street Address *
          </label>
          <input
            type="text"
            id="addressLine1"
            required
            value={localData.addressLine1}
            onChange={(e) =>
              setLocalData({ ...localData, addressLine1: e.target.value })
            }
            placeholder="123 Main Street"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="addressLine2"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Apartment, suite, etc. (Optional)
          </label>
          <input
            type="text"
            id="addressLine2"
            value={localData.addressLine2}
            onChange={(e) =>
              setLocalData({ ...localData, addressLine2: e.target.value })
            }
            placeholder="Suite 100"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              City *
            </label>
            <input
              type="text"
              id="city"
              required
              value={localData.city}
              onChange={(e) =>
                setLocalData({ ...localData, city: e.target.value })
              }
              placeholder="Toronto"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="province"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Province *
            </label>
            <select
              id="province"
              required
              value={localData.province}
              onChange={(e) =>
                setLocalData({ ...localData, province: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Province</option>
              <option value="AB">Alberta</option>
              <option value="BC">British Columbia</option>
              <option value="MB">Manitoba</option>
              <option value="NB">New Brunswick</option>
              <option value="NL">Newfoundland and Labrador</option>
              <option value="NS">Nova Scotia</option>
              <option value="ON">Ontario</option>
              <option value="PE">Prince Edward Island</option>
              <option value="QC">Quebec</option>
              <option value="SK">Saskatchewan</option>
              <option value="NT">Northwest Territories</option>
              <option value="NU">Nunavut</option>
              <option value="YT">Yukon</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="postalCode"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Postal Code *
            </label>
            <input
              type="text"
              id="postalCode"
              required
              value={localData.postalCode}
              onChange={(e) =>
                setLocalData({
                  ...localData,
                  postalCode: e.target.value.toUpperCase(),
                })
              }
              placeholder="M5V 3A8"
              pattern="[A-Z][0-9][A-Z] [0-9][A-Z][0-9]"
              maxLength={7}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Continue to Funding Amount'}
        </button>
      </div>
    </form>
  );
}

// Step 8: Funding Amount
function Step8Form({
  onNext,
  formData,
  isSubmitting,
}: {
  onNext: (data: FormData) => void;
  formData: FormData;
  isSubmitting: boolean;
}) {
  const [localData, setLocalData] = useState({
    fundingAmount: formData.fundingAmount || '',
    fundingTimeline: formData.fundingTimeline || '',
  });

  // Update local data when formData prop changes (for when user navigates back)
  useEffect(() => {
    console.log('🔄 Step8Form - formData prop changed:', formData);
    setLocalData({
      fundingAmount: formData.fundingAmount || '',
      fundingTimeline: formData.fundingTimeline || '',
    });
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(localData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <label
          htmlFor="fundingAmount"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          How much funding do you need? *
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">
            $
          </span>
          <input
            type="text"
            id="fundingAmount"
            required
            placeholder="250,000"
            value={localData.fundingAmount}
            onChange={(e) =>
              setLocalData({ ...localData, fundingAmount: e.target.value })
            }
            className="w-full pl-8 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl"
          />
        </div>
      </div>

      <div className="mb-8">
        <label
          htmlFor="fundingTimeline"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          When do you need the funding? *
        </label>
        <select
          id="fundingTimeline"
          required
          value={localData.fundingTimeline}
          onChange={(e) =>
            setLocalData({ ...localData, fundingTimeline: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select Timeline</option>
          <option value="immediately">Immediately</option>
          <option value="within-30-days">Within 30 days</option>
          <option value="within-60-days">Within 60 days</option>
          <option value="within-90-days">Within 90 days</option>
          <option value="no-rush">No rush</option>
        </select>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Continue to Funding Purpose'}
        </button>
      </div>
    </form>
  );
}

// Step 9: Funding Purpose
function Step9Form({
  onNext,
  formData,
  isSubmitting,
}: {
  onNext: (data: FormData) => void;
  formData: FormData;
  isSubmitting: boolean;
}) {
  const [localData, setLocalData] = useState({
    fundingPurpose: formData.fundingPurpose || '',
  });

  // Update local data when formData prop changes (for when user navigates back)
  useEffect(() => {
    console.log('🔄 Step9Form - formData prop changed:', formData);
    setLocalData({
      fundingPurpose: formData.fundingPurpose || '',
    });
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(localData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <label
          htmlFor="fundingPurpose"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          How will you use the funds? *
        </label>
        <select
          id="fundingPurpose"
          required
          value={localData.fundingPurpose}
          onChange={(e) =>
            setLocalData({ ...localData, fundingPurpose: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select Purpose</option>
          <option value="working-capital">Working Capital</option>
          <option value="equipment-purchase">Equipment Purchase</option>
          <option value="inventory">Inventory</option>
          <option value="expansion">Business Expansion</option>
          <option value="marketing">Marketing & Advertising</option>
          <option value="debt-consolidation">Debt Consolidation</option>
          <option value="real-estate">Real Estate</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Continue to Business Details'}
        </button>
      </div>
    </form>
  );
}

// Step 11: Financial Information
function Step11Form({
  onNext,
  formData,
  isSubmitting,
}: {
  onNext: (data: FormData) => void;
  formData: FormData;
  isSubmitting: boolean;
}) {
  const [localData, setLocalData] = useState({
    annualRevenue: formData.annualRevenue || '',
    cashFlow: formData.cashFlow || '',
    creditScore: formData.creditScore || '',
  });

  // Update local data when formData prop changes (for when user navigates back)
  useEffect(() => {
    console.log('🔄 Step11Form - formData prop changed:', formData);
    setLocalData({
      annualRevenue: formData.annualRevenue || '',
      cashFlow: formData.cashFlow || '',
      creditScore: formData.creditScore || '',
    });
  }, [formData]);

  // Credit score options mapping
  const creditScoreOptions = {
    excellent: 'Excellent (750+)',
    good: 'Good (700-749)',
    fair: 'Fair (650-699)',
    'below-average': 'Below Average (600-649)',
    poor: '(551-599)',
    'very-poor': '(below 550)',
  };

  const handleCreditScoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const label = value
      ? creditScoreOptions[value as keyof typeof creditScoreOptions]
      : '';
    // Combine both value and label in the creditScore field
    const combinedValue = value && label ? `${value}|${label}` : value;
    setLocalData({
      ...localData,
      creditScore: combinedValue,
    });
  };

  // Helper function to extract the value part from combined creditScore
  const getCreditScoreValue = () => {
    if (!localData.creditScore) return '';
    return localData.creditScore.includes('|')
      ? localData.creditScore.split('|')[0]
      : localData.creditScore;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(localData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Financial Information
        </h2>
        <p className="text-gray-600">
          Help us understand your business's financial position.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="annualRevenue"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Annual Revenue *
          </label>
          <select
            id="annualRevenue"
            required
            value={localData.annualRevenue}
            onChange={(e) =>
              setLocalData({ ...localData, annualRevenue: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Revenue Range</option>
            <option value="under-100k">Under $100,000</option>
            <option value="100k-250k">$100,000 - $250,000</option>
            <option value="250k-500k">$250,000 - $500,000</option>
            <option value="500k-1m">$500,000 - $1,000,000</option>
            <option value="1m-5m">$1,000,000 - $5,000,000</option>
            <option value="over-5m">Over $5,000,000</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="cashFlow"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Monthly Cash Flow *
          </label>
          <select
            id="cashFlow"
            required
            value={localData.cashFlow}
            onChange={(e) =>
              setLocalData({ ...localData, cashFlow: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Cash Flow</option>
            <option value="positive">Positive</option>
            <option value="break-even">Break Even</option>
            <option value="negative">Negative</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="creditScore"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Personal Credit Score *
          </label>
          <select
            id="creditScore"
            required
            value={getCreditScoreValue()}
            onChange={handleCreditScoreChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Credit Score Range</option>
            <option value="excellent">Excellent (750+)</option>
            <option value="good">Good (700-749)</option>
            <option value="fair">Fair (650-699)</option>
            <option value="below-average">Below Average (600-649)</option>
            <option value="poor">(551-599)</option>
            <option value="very-poor">(below 550)</option>
          </select>
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Continue to Bank Connection'}
        </button>
      </div>
    </form>
  );
}

// Step 13: Additional Details
function Step13Form({
  onNext,
  formData,
  isSubmitting,
}: {
  onNext: (data: FormData) => void;
  formData: FormData;
  isSubmitting: boolean;
}) {
  const [localData, setLocalData] = useState({
    businessAddress: formData.businessAddress || '',
    businessPhone: formData.businessPhone || '',
    additionalInfo: formData.additionalInfo || '',
  });

  // Update local data when formData prop changes (for when user navigates back)
  useEffect(() => {
    console.log('🔄 Step13Form - formData prop changed:', formData);
    setLocalData({
      businessAddress: formData.businessAddress || '',
      businessPhone: formData.businessPhone || '',
      additionalInfo: formData.additionalInfo || '',
    });
  }, [formData]);

  // Address autocomplete state
  const [addressSuggestions, setAddressSuggestions] = useState<
    GeoapifyFeature[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [addressSelected, setAddressSelected] = useState(false);

  // Debounce address search
  useEffect(() => {
    // Don't search if an address was just selected
    if (addressSelected) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      if (localData.businessAddress && localData.businessAddress.length >= 3) {
        setIsSearching(true);
        try {
          const suggestions = await searchAddresses(localData.businessAddress);
          setAddressSuggestions(suggestions);
          setShowSuggestions(suggestions.length > 0);
        } catch (error) {
          console.error('Address search error:', error);
          setAddressSuggestions([]);
          setShowSuggestions(false);
        } finally {
          setIsSearching(false);
        }
      } else {
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localData.businessAddress, addressSelected]);

  const handleAddressSelect = (feature: GeoapifyFeature) => {
    setAddressSelected(true);
    setLocalData({
      ...localData,
      businessAddress: feature.properties.formatted,
    });
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressSelected(false); // Reset the selection flag when user types
    setLocalData({ ...localData, businessAddress: e.target.value });
    if (e.target.value.length < 3) {
      setShowSuggestions(false);
      setAddressSuggestions([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(localData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Additional Business Details
        </h2>
        <p className="text-gray-600">
          Provide additional information about your business location and
          contact details.
        </p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <label
            htmlFor="businessAddress"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Business Address *
          </label>
          <div className="relative">
            <input
              type="text"
              id="businessAddress"
              required
              value={localData.businessAddress}
              onChange={handleAddressChange}
              onFocus={() =>
                addressSuggestions.length > 0 && setShowSuggestions(true)
              }
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Start typing your business address..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {isSearching && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>

          {/* Address suggestions dropdown */}
          {showSuggestions && addressSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {addressSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleAddressSelect(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">
                    {suggestion.properties.formatted}
                  </div>
                  {suggestion.properties.country && (
                    <div className="text-sm text-gray-500 mt-1">
                      {suggestion.properties.country}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="businessPhone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Business Phone Number *
          </label>
          <input
            type="tel"
            id="businessPhone"
            required
            value={localData.businessPhone}
            onChange={(e) =>
              setLocalData({ ...localData, businessPhone: e.target.value })
            }
            placeholder="(555) 123-4567"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="additionalInfo"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Additional Information (Optional)
          </label>
          <textarea
            id="additionalInfo"
            value={localData.additionalInfo}
            onChange={(e) =>
              setLocalData({ ...localData, additionalInfo: e.target.value })
            }
            placeholder="Any additional information about your business or funding request..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Continue to Review & Submit'}
        </button>
      </div>
    </form>
  );
}
