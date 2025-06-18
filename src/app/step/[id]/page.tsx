'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { submitApplication, type ApplicationData } from '@/lib/api';
import { searchCanadianBusinesses, formatBusinessDataForForm, type BusinessRegistryResult } from '@/lib/businessRegistry';
import { saveOrUpdateBusiness } from '@/lib/supabase';

interface FormData {
  [key: string]: string;
}

const stepTitles = {
  1: 'Loan Type',
  2: 'Business Owner',
  3: 'Business Search',
  4: 'Monthly Sales',
  5: 'Existing Loans',
  6: 'Bank Connection',
  7: 'Personal Information',
  8: 'Funding Amount',
  9: 'Funding Purpose',
  10: 'Business Details', 
  11: 'Financial Information',
  12: 'Bank Information',
  13: 'Additional Details',
  14: 'Review & Submit'
};

const stepDescriptions = {
  1: 'What type of funding are you looking for?',
  2: 'Verify your role in the business',
  3: 'Find and verify your business in the Canadian Business Registry',
  4: 'Tell us about your monthly sales',
  5: 'Tell us about any existing loan obligations',
  6: 'Connect your business banking securely',
  7: 'Tell us about yourself and your role in the business',
  8: 'How much funding do you need and when?',
  9: 'How will you use the funds?',
  10: 'Provide details about your business operations',
  11: 'Share your revenue and funding requirements',
  12: 'Banking and account information',
  13: 'Additional business information',
  14: 'Review your application before submitting'
};

export default function StepPage() {
  const router = useRouter();
  const params = useParams();
  const currentStep = parseInt(params.id as string);
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('referralApplicationData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const saveFormData = (data: FormData) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    localStorage.setItem('referralApplicationData', JSON.stringify(updatedData));
  };

  const handleNext = async (stepData: FormData) => {
    setIsSubmitting(true);
    saveFormData(stepData);
    
    if (currentStep < 14) {
      // Just move to next step for steps 1-13
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push(`/step/${currentStep + 1}`);
    } else {
      // Submit to backend for final step
      try {
        const finalData = { ...formData, ...stepData };
        const response = await submitApplication(finalData as unknown as ApplicationData);
        
        // Store application ID for success page
        localStorage.setItem('applicationId', response.applicationId.toString());
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
      router.push(`/step/${currentStep - 1}`);
    } else {
      router.push('/');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1Form onNext={handleNext} formData={formData} isSubmitting={isSubmitting} />;
      case 2:
        return <Step2Form onNext={handleNext} formData={formData} isSubmitting={isSubmitting} />;
      case 3:
        return <BusinessSearchForm onNext={handleNext} formData={formData} isSubmitting={isSubmitting} />;
      case 4:
        return <Step3Form onNext={handleNext} formData={formData} isSubmitting={isSubmitting} />;
      case 5:
        return <Step4Form onNext={handleNext} formData={formData} isSubmitting={isSubmitting} />;
      case 6:
        return <Step6Form onNext={handleNext} formData={formData} isSubmitting={isSubmitting} />;
      case 7:
        return <Step7Form onNext={handleNext} formData={formData} isSubmitting={isSubmitting} />;
      case 8:
        return <Step8Form onNext={handleNext} formData={formData} isSubmitting={isSubmitting} />;
      case 9:
        return <Step9Form onNext={handleNext} formData={formData} isSubmitting={isSubmitting} />;
      case 10:
        return <Step10Form onNext={handleNext} formData={formData} isSubmitting={isSubmitting} />;
      case 11:
        return <Step11Form onNext={handleNext} formData={formData} isSubmitting={isSubmitting} />;
      case 12:
        return <Step12Form onNext={handleNext} formData={formData} isSubmitting={isSubmitting} />;
      case 13:
        return <Step13Form onNext={handleNext} formData={formData} isSubmitting={isSubmitting} />;
      case 14:
        return <Step14Form onNext={handleNext} formData={formData} isSubmitting={isSubmitting} />;
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Step Not Found</h1>
            <button
              onClick={() => router.push('/')}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Go Home
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        showBackButton={true} 
        onBackClick={handleBack}
        backLabel={currentStep === 1 ? "Home" : "Previous"}
      />
      
      <main className="flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Step {currentStep} of 14</span>
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
              <script src="https://widget.senja.io/widget/3b59fc5b-c72d-4182-ad0e-1b90a2049069/platform.js" type="text/javascript" async></script>
              <div className="senja-embed" data-id="3b59fc5b-c72d-4182-ad0e-1b90a2049069" data-mode="shadow" data-lazyload="false" style={{display: 'block', width: '100%'}}></div>
            </div>
          )}
          
          {/* Add review widget to final steps */}
          {currentStep === 14 && (
            <div className="mt-8">
              <script src="https://widget.senja.io/widget/846e80aa-0de3-4620-9375-cddaa7715b56/platform.js" type="text/javascript" async></script>
              <div className="senja-embed" data-id="846e80aa-0de3-4620-9375-cddaa7715b56" data-mode="shadow" data-lazyload="false" style={{display: 'block', width: '100%'}}></div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// Step 10: Business Details
function Step10Form({ onNext, formData, isSubmitting }: { onNext: (data: FormData) => void, formData: FormData, isSubmitting: boolean }) {
  const [localData, setLocalData] = useState({
    businessType: formData.businessType || '',
    businessAge: formData.businessAge || '',
    numberOfEmployees: formData.numberOfEmployees || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(localData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
          What type of business do you operate? *
        </label>
        <select
          id="businessType"
          required
          value={localData.businessType}
          onChange={(e) => setLocalData({...localData, businessType: e.target.value})}
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
      
      <div className="mb-6">
        <label htmlFor="businessAge" className="block text-sm font-medium text-gray-700 mb-2">
          How long has your business been operating? *
        </label>
        <select
          id="businessAge"
          required
          value={localData.businessAge}
          onChange={(e) => setLocalData({...localData, businessAge: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select Business Age</option>
          <option value="under-1-year">Under 1 year</option>
          <option value="1-2-years">1-2 years</option>
          <option value="2-5-years">2-5 years</option>
          <option value="5-10-years">5-10 years</option>
          <option value="over-10-years">Over 10 years</option>
        </select>
      </div>
      
      <div className="mb-8">
        <label htmlFor="numberOfEmployees" className="block text-sm font-medium text-gray-700 mb-2">
          How many employees do you have? *
        </label>
        <select
          id="numberOfEmployees"
          required
          value={localData.numberOfEmployees}
          onChange={(e) => setLocalData({...localData, numberOfEmployees: e.target.value})}
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

// Step 11: Financial Information
function Step11Form({ onNext, formData, isSubmitting }: { onNext: (data: FormData) => void, formData: FormData, isSubmitting: boolean }) {
  const [localData, setLocalData] = useState({
    annualRevenue: formData.annualRevenue || '',
    cashFlow: formData.cashFlow || '',
    creditScore: formData.creditScore || '',
    timeInBusiness: formData.timeInBusiness || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(localData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <label htmlFor="annualRevenue" className="block text-sm font-medium text-gray-700 mb-2">
          What is your annual revenue? *
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">$</span>
          <input
            type="text"
            id="annualRevenue"
            required
            placeholder="500,000"
            value={localData.annualRevenue}
            onChange={(e) => setLocalData({...localData, annualRevenue: e.target.value})}
            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="cashFlow" className="block text-sm font-medium text-gray-700 mb-2">
          What is your monthly cash flow? *
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">$</span>
          <input
            type="text"
            id="cashFlow"
            required
            placeholder="25,000"
            value={localData.cashFlow}
            onChange={(e) => setLocalData({...localData, cashFlow: e.target.value})}
            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="creditScore" className="block text-sm font-medium text-gray-700 mb-2">
          What is your estimated credit score? *
        </label>
        <select
          id="creditScore"
          required
          value={localData.creditScore}
          onChange={(e) => setLocalData({...localData, creditScore: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select Credit Score Range</option>
          <option value="excellent">Excellent (750-850)</option>
          <option value="very-good">Very Good (700-749)</option>
          <option value="good">Good (650-699)</option>
          <option value="fair">Fair (600-649)</option>
          <option value="poor">Poor (below 600)</option>
        </select>
      </div>
      
      <div className="mb-8">
        <label htmlFor="timeInBusiness" className="block text-sm font-medium text-gray-700 mb-2">
          Time in business (exact) *
        </label>
        <input
          type="text"
          id="timeInBusiness"
          required
          placeholder="e.g., 3 years 6 months"
          value={localData.timeInBusiness}
          onChange={(e) => setLocalData({...localData, timeInBusiness: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Continue to Bank Information'}
        </button>
      </div>
    </form>
  );
}

// Step 12: Bank Information
function Step12Form({ onNext, formData, isSubmitting }: { onNext: (data: FormData) => void, formData: FormData, isSubmitting: boolean }) {
  const [localData, setLocalData] = useState({
    bankConnectionCompleted: formData.bankConnectionCompleted || false
  });

  const handleSkipConnection = () => {
    onNext({ ...localData, bankConnectionCompleted: 'false', skippedBankConnection: 'true' });
  };

  const handleCompleteConnection = () => {
    onNext({ ...localData, bankConnectionCompleted: 'true' });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Business Banking</h2>
        <p className="text-gray-600">
          Securely connect your business bank account to accelerate your approval process
        </p>
      </div>

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

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleCompleteConnection}
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Processing...' : 'I Connected My Bank'}
        </button>
        
        <button
          onClick={handleSkipConnection}
          disabled={isSubmitting}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Skip for Now
        </button>
      </div>

      {/* Security note */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-900">Bank-grade security</p>
            <p className="text-sm text-gray-600">Your banking information is encrypted and secure. We cannot see your login credentials.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 13: Additional Details
function Step13Form({ onNext, formData, isSubmitting }: { onNext: (data: FormData) => void, formData: FormData, isSubmitting: boolean }) {
  const [localData, setLocalData] = useState({
    businessAddress: formData.businessAddress || '',
    businessPhone: formData.businessPhone || '',
    websiteUrl: formData.websiteUrl || '',
    additionalInfo: formData.additionalInfo || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(localData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-2">
          Business Address *
        </label>
        <textarea
          id="businessAddress"
          required
          rows={3}
          placeholder="Full business address including street, city, state, zip"
          value={localData.businessAddress}
          onChange={(e) => setLocalData({...localData, businessAddress: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-700 mb-2">
          Business Phone Number *
        </label>
        <input
          type="tel"
          id="businessPhone"
          required
          placeholder="(555) 123-4567"
          value={localData.businessPhone}
          onChange={(e) => setLocalData({...localData, businessPhone: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-2">
          Website URL (Optional)
        </label>
        <input
          type="url"
          id="websiteUrl"
          placeholder="https://www.yourbusiness.com"
          value={localData.websiteUrl}
          onChange={(e) => setLocalData({...localData, websiteUrl: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="mb-8">
        <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
          Additional Information (Optional)
        </label>
        <textarea
          id="additionalInfo"
          rows={4}
          placeholder="Anything else you'd like us to know about your business or funding needs?"
          value={localData.additionalInfo}
          onChange={(e) => setLocalData({...localData, additionalInfo: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
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

// Step 14: Review & Submit
function Step14Form({ onNext, formData, isSubmitting }: { onNext: (data: FormData) => void, formData: FormData, isSubmitting: boolean }) {
  const [localData, setLocalData] = useState({
    agreesToTerms: formData.agreesToTerms === 'true',
    authorizesCreditCheck: formData.authorizesCreditCheck === 'true'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localData.agreesToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    if (!localData.authorizesCreditCheck) {
      alert('Please authorize the credit check');
      return;
    }
    onNext({
      agreesToTerms: localData.agreesToTerms.toString(),
      authorizesCreditCheck: localData.authorizesCreditCheck.toString()
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Review Your Application</h2>
        <p className="text-gray-600">
          Please review the information below and submit your application.
        </p>
      </div>

      {/* Summary of entered data */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Summary</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          {formData.loanType && (
            <div>
              <span className="font-medium">Loan Type:</span> {formData.loanType}
            </div>
          )}
          {formData.businessName && (
            <div>
              <span className="font-medium">Business:</span> {formData.businessName}
            </div>
          )}
          {formData.fundingAmount && (
            <div>
              <span className="font-medium">Funding Amount:</span> ${formData.fundingAmount}
            </div>
          )}
          {formData.firstName && formData.lastName && (
            <div>
              <span className="font-medium">Contact:</span> {formData.firstName} {formData.lastName}
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
              onChange={(e) => setLocalData({...localData, agreesToTerms: e.target.checked})}
              className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="agreesToTerms" className="text-sm text-gray-700">
              I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </label>
          </div>
          
          <div className="flex items-start">
            <input
              type="checkbox"
              id="authorizesCreditCheck"
              checked={localData.authorizesCreditCheck}
              onChange={(e) => setLocalData({...localData, authorizesCreditCheck: e.target.checked})}
              className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="authorizesCreditCheck" className="text-sm text-gray-700">
              I authorize a credit check to be performed as part of this application
            </label>
          </div>
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting || !localData.agreesToTerms || !localData.authorizesCreditCheck}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 text-lg"
          >
            {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
          </button>
        </div>
      </form>
      
      <p className="text-xs text-gray-500 text-center mt-4">
        By submitting this application, you acknowledge that all information provided is accurate and complete.
      </p>
    </div>
  );
}

// Step 3: Business Search Form (New)
function BusinessSearchForm({ onNext, formData, isSubmitting }: { onNext: (data: FormData) => void, formData: FormData, isSubmitting: boolean }) {
  const [localData, setLocalData] = useState({
    businessName: formData.businessName || '',
    businessSearchQuery: formData.businessSearchQuery || '',
    selectedBusiness: formData.selectedBusiness || '',
    businessConfirmed: formData.businessConfirmed || false
  });
  
  const [searchResults, setSearchResults] = useState<BusinessRegistryResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedBusinessData, setSelectedBusinessData] = useState<BusinessRegistryResult | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSearch = async () => {
    if (!localData.businessSearchQuery.trim()) {
      alert('Please enter a business name to search');
      return;
    }

    setIsSearching(true);
    setHasSearched(false);
    
    try {
      const results = await searchCanadianBusinesses(localData.businessSearchQuery);
      setSearchResults(results.docs);
      setHasSearched(true);
      
      if (results.docs.length === 0) {
        alert('No businesses found. Please try a different search term or continue manually.');
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
      const savedBusiness = await saveOrUpdateBusiness(selectedBusinessData, localData.businessSearchQuery);
      
      const businessData = formatBusinessDataForForm(selectedBusinessData);
      
      // Update local state with confirmed business data
      setLocalData({
        ...localData,
        businessName: businessData.businessName,
        selectedBusiness: selectedBusinessData.MRAS_ID,
        businessConfirmed: true
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
        businessAge: businessData.businessAge,
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
        juriId: selectedBusinessData.Juri_ID
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
      businessConfirmed: 'false'
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
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Find Your Business
        </h2>
        <p className="text-gray-600">
          Search the Canadian Business Registry to verify your business information
        </p>
      </div>

      {!showConfirmation ? (
        <>
          {/* Search Input */}
          <div className="mb-6">
            <label htmlFor="businessSearch" className="block text-sm font-medium text-gray-700 mb-2">
              Business Name *
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                id="businessSearch"
                placeholder="Enter your business name (e.g., RUNASO INC)"
                value={localData.businessSearchQuery}
                onChange={(e) => setLocalData({...localData, businessSearchQuery: e.target.value})}
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
                    Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}:
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
                            <h4 className="font-semibold text-gray-900">{business.Company_Name}</h4>
                            <p className="text-sm text-gray-600">
                              {business.Entity_Type} • {business.City}, {business.Reg_office_province}
                            </p>
                            <p className="text-sm text-gray-500">
                              Status: {business.Status_State} • Incorporated: {business.Date_Incorporated}
                            </p>
                            {business.BN && (
                              <p className="text-sm text-gray-500">Business Number: {business.BN}</p>
                            )}
                          </div>
                          <div className="flex items-center text-blue-600">
                            <span className="text-sm font-medium">Select</span>
                            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find your business in the Canadian Business Registry.
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
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Is this your business?</h3>
          </div>
          
          {selectedBusinessData && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h4 className="font-semibold text-gray-900 text-lg mb-3">{selectedBusinessData.Company_Name}</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Type:</span> {selectedBusinessData.Entity_Type}</p>
                <p><span className="font-medium">Location:</span> {selectedBusinessData.City}, {selectedBusinessData.Reg_office_province}</p>
                <p><span className="font-medium">Status:</span> {selectedBusinessData.Status_State}</p>
                <p><span className="font-medium">Incorporated:</span> {selectedBusinessData.Date_Incorporated}</p>
                {selectedBusinessData.BN && (
                  <p><span className="font-medium">Business Number:</span> {selectedBusinessData.BN}</p>
                )}
                <p><span className="font-medium">Jurisdiction:</span> {selectedBusinessData.Jurisdiction}</p>
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
        <div className="bg-black h-2 rounded-full" style={{width: '21%'}}></div>
      </div>
    </div>
  );
}

// Step 1: Loan Type Selection
function Step1Form({ onNext, formData, isSubmitting }: { onNext: (data: FormData) => void, formData: FormData, isSubmitting: boolean }) {
  const [localData, setLocalData] = useState({
    loanType: formData.loanType || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localData.loanType) {
      alert('Please select a loan type');
      return;
    }
    onNext(localData);
  };

  const handleLoanTypeSelect = (type: string) => {
    setLocalData({...localData, loanType: type});
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Icon */}
      <div className="flex justify-center mb-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            <div className="text-lg font-medium text-gray-700">A business loan</div>
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
            <div className="text-lg font-medium text-gray-700">A line of credit</div>
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
            <div className="text-lg font-medium text-gray-700">A bit of both</div>
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
        <div className="bg-black h-2 rounded-full" style={{width: '8%'}}></div>
      </div>
    </div>
  );
}

// Step 2: Business Owner verification
function Step2Form({ onNext, formData, isSubmitting }: { onNext: (data: FormData) => void, formData: FormData, isSubmitting: boolean }) {
  const [localData, setLocalData] = useState({
    isBusinessOwner: formData.isBusinessOwner || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localData.isBusinessOwner) {
      alert('Please select an option');
      return;
    }
    onNext(localData);
  };

  const handleOwnerSelect = (value: string) => {
    setLocalData({...localData, isBusinessOwner: value});
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Icon */}
      <div className="flex justify-center mb-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
              <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
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
              <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
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
        <div className="bg-black h-2 rounded-full" style={{width: '15%'}}></div>
      </div>
    </div>
  );
}

// Step 3: Monthly Sales
function Step3Form({ onNext, formData, isSubmitting }: { onNext: (data: FormData) => void, formData: FormData, isSubmitting: boolean }) {
  const [localData, setLocalData] = useState({
    monthlySales: formData.monthlySales || ''
  });

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
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">$</span>
            <input
              type="text"
              placeholder="100,000"
              value={localData.monthlySales}
              onChange={(e) => setLocalData({...localData, monthlySales: e.target.value})}
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
        <div className="bg-black h-2 rounded-full" style={{width: '21%'}}></div>
      </div>
    </div>
  );
}

// Step 4: Existing Loan Obligations
function Step4Form({ onNext, formData, isSubmitting }: { onNext: (data: FormData) => void, formData: FormData, isSubmitting: boolean }) {
  const [localData, setLocalData] = useState({
    hasExistingLoans: formData.hasExistingLoans || '',
    totalLoanAmount: formData.totalLoanAmount || ''
  });

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
    setLocalData({...localData, hasExistingLoans: value});
    if (value === 'no') {
      setLocalData({...localData, hasExistingLoans: value, totalLoanAmount: '0'});
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Icon */}
      <div className="flex justify-center mb-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Do you have any existing business loan obligations?
        </h2>
        <p className="text-gray-600">
          This includes business loans, lines of credit, equipment financing, or merchant cash advances
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
              <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-lg font-medium text-gray-700">Yes, I have existing loans</div>
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
              <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-lg font-medium text-gray-700">No existing loans</div>
          </button>
        </div>

        {localData.hasExistingLoans === 'yes' && (
          <div className="mb-8">
            <label className="block text-lg font-medium text-gray-700 mb-4 text-center">
              What is the total amount you currently owe?
            </label>
            <div className="relative max-w-md mx-auto">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">$</span>
              <input
                type="text"
                placeholder="50,000"
                value={localData.totalLoanAmount}
                onChange={(e) => setLocalData({...localData, totalLoanAmount: e.target.value})}
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
        <div className="bg-black h-2 rounded-full" style={{width: '28%'}}></div>
      </div>
    </div>
  );
}

// Step 5: Business Search (Placeholder)
function Step5Form({ onNext, formData, isSubmitting }: { onNext: (data: FormData) => void, formData: FormData, isSubmitting: boolean }) {
  const [localData, setLocalData] = useState({
    businessName: formData.businessName || '',
    businessSearchVerified: formData.businessSearchVerified || ''
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
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
            Business Name *
          </label>
          <input
            type="text"
            id="businessName"
            required
            placeholder="Enter your business name"
            value={localData.businessName}
            onChange={(e) => setLocalData({...localData, businessName: e.target.value})}
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
        <div className="bg-black h-2 rounded-full" style={{width: '36%'}}></div>
      </div>
    </div>
  );
}

// Step 6: Bank Connection
function Step6Form({ onNext, formData, isSubmitting }: { onNext: (data: FormData) => void, formData: FormData, isSubmitting: boolean }) {
  const [localData, setLocalData] = useState({
    bankConnected: formData.bankConnected || '',
    bankConnectionMethod: formData.bankConnectionMethod || ''
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
    setLocalData({...localData, bankConnected: value});
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Icon */}
      <div className="flex justify-center mb-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Connect Your Business Banking
        </h2>
        <p className="text-gray-600">
          Securely connect your business bank account to verify your financial information
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
            <div className="text-lg font-medium text-gray-700 mb-2">Connect Bank Account Now</div>
            <div className="text-sm text-gray-500">Securely connect using bank-grade encryption</div>
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
            <div className="text-lg font-medium text-gray-700 mb-2">Connect Later</div>
            <div className="text-sm text-gray-500">Proceed without connecting and provide manual information</div>
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
        <div className="bg-black h-2 rounded-full" style={{width: '43%'}}></div>
      </div>
    </div>
  );
}

// Step 7: Personal Information
function Step7Form({ onNext, formData, isSubmitting }: { onNext: (data: FormData) => void, formData: FormData, isSubmitting: boolean }) {
  const [localData, setLocalData] = useState({
    firstName: formData.firstName || '',
    lastName: formData.lastName || '',
    email: formData.email || '',
    phone: formData.phone || '',
    title: formData.title || '',
    ssn: formData.ssn || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(localData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            required
            value={localData.firstName}
            onChange={(e) => setLocalData({...localData, firstName: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            required
            value={localData.lastName}
            onChange={(e) => setLocalData({...localData, lastName: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            required
            value={localData.email}
            onChange={(e) => setLocalData({...localData, email: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            required
            value={localData.phone}
            onChange={(e) => setLocalData({...localData, phone: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title/Position *
          </label>
          <input
            type="text"
            id="title"
            required
            value={localData.title}
            onChange={(e) => setLocalData({...localData, title: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="ssn" className="block text-sm font-medium text-gray-700 mb-2">
            SIN (Last 4 digits) *
          </label>
          <input
            type="text"
            id="ssn"
            required
            maxLength={4}
            value={localData.ssn}
            onChange={(e) => setLocalData({...localData, ssn: e.target.value})}
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
          {isSubmitting ? 'Saving...' : 'Continue to Funding Amount'}
        </button>
      </div>
    </form>
  );
}

// Step 8: Funding Amount
function Step8Form({ onNext, formData, isSubmitting }: { onNext: (data: FormData) => void, formData: FormData, isSubmitting: boolean }) {
  const [localData, setLocalData] = useState({
    fundingAmount: formData.fundingAmount || '',
    fundingTimeline: formData.fundingTimeline || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(localData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <label htmlFor="fundingAmount" className="block text-sm font-medium text-gray-700 mb-2">
          How much funding do you need? *
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">$</span>
          <input
            type="text"
            id="fundingAmount"
            required
            placeholder="250,000"
            value={localData.fundingAmount}
            onChange={(e) => setLocalData({...localData, fundingAmount: e.target.value})}
            className="w-full pl-8 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl"
          />
        </div>
      </div>
      
      <div className="mb-8">
        <label htmlFor="fundingTimeline" className="block text-sm font-medium text-gray-700 mb-2">
          When do you need the funding? *
        </label>
        <select
          id="fundingTimeline"
          required
          value={localData.fundingTimeline}
          onChange={(e) => setLocalData({...localData, fundingTimeline: e.target.value})}
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
function Step9Form({ onNext, formData, isSubmitting }: { onNext: (data: FormData) => void, formData: FormData, isSubmitting: boolean }) {
  const [localData, setLocalData] = useState({
    fundingPurpose: formData.fundingPurpose || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(localData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <label htmlFor="fundingPurpose" className="block text-sm font-medium text-gray-700 mb-2">
          How will you use the funds? *
        </label>
        <select
          id="fundingPurpose"
          required
          value={localData.fundingPurpose}
          onChange={(e) => setLocalData({...localData, fundingPurpose: e.target.value})}
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