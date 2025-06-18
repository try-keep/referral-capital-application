"use client";

import React, { useState, useEffect } from 'react';

// Declare Facebook Pixel types
declare global {
  interface Window {
    fbq: (action: string, event: string, data?: object) => void;
  }
}
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import EligibilityRequirements from '@/components/EligibilityRequirements';
import EligibilityCriteria from '@/components/EligibilityCriteria';
import Image from 'next/image';

export default function Home() {
  const [currentStep, setCurrentStep] = useState('landing'); // 'landing', 'eligibility', 'form', 'completed'
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Set initial state based on current URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const step = urlParams.get('step');
    if (step === 'eligibility') {
      setCurrentStep('eligibility');
      // Fire Facebook Pixel event for eligibility page view
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'ViewContent', { content_name: 'Eligibility Check' });
      }
    } else if (step === 'application') {
      setCurrentStep('form');
      // Fire Facebook Pixel event for application form page view
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'ViewContent', { content_name: 'Application Form' });
      }
    } else if (step === 'completed') {
      setCurrentStep('completed');
      // Fire Facebook Pixel event for completion page view
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'ViewContent', { content_name: 'Application Completed' });
      }
    } else if (step === 'success') {
      // Redirect to dedicated success page
      router.replace('/success');
      return;
    } else {
      setCurrentStep('landing');
      // Fire Facebook Pixel event for homepage view
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'ViewContent', { content_name: 'Homepage' });
      }
    }
    setIsLoading(false);
  }, []);

  const handleApplyNow = () => {
    setCurrentStep('eligibility');
    router.push('/?step=eligibility');
    
    // Fire Facebook Pixel event for eligibility step
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout');
    }
  };

  const handleLetsDoThis = () => {
    // Redirect to our multi-step form instead of HubSpot
    router.push('/step/1');
    
    // Fire Facebook Pixel event for application form step
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead');
    }
  };

  const handleBackToLanding = () => {
    setCurrentStep('landing');
    router.push('/');
  };

  const handleBackToEligibility = () => {
    setCurrentStep('eligibility');
    router.push('/?step=eligibility');
  };

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const step = urlParams.get('step');
      if (step === 'eligibility') {
        setCurrentStep('eligibility');
      } else if (step === 'application') {
        setCurrentStep('form');
      } else {
        setCurrentStep('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Show loading state while determining which page to show
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (currentStep === 'form') {
    // Redirect to our multi-step form
    router.push('/step/1');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Redirecting to application...</div>
      </div>
    );
  }

  if (currentStep === 'eligibility') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar 
          showBackButton={true} 
          onBackClick={handleBackToLanding}
        />
        <main className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Welcome, let's see if we can help
              </h1>
            </div>
            
            <div className="space-y-8">
              <EligibilityRequirements />
              <EligibilityCriteria />

              {/* Bottom section with continue button */}
              <div className="flex justify-center pt-8">
                <button 
                  onClick={handleLetsDoThis}
                  className="bg-green-400 hover:bg-green-500 text-black font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  Let's do this
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (currentStep === 'completed') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Application Submitted Successfully!
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Thank you for your application. Our team will review it and get back to you within 24 hours.
                </p>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">What happens next?</h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <span className="text-gray-700">Our team reviews your application within 24 hours</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <span className="text-gray-700">We'll contact you to discuss your financing options</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <span className="text-gray-700">Funds can be available as soon as the same day</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection onApplyNow={handleApplyNow} />
        <TestimonialsSection />
      </main>
      
      <Footer />
    </div>
  );
}
