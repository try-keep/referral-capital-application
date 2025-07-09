'use client';

import React, { useState, useEffect } from 'react';
import { type FormData } from '@/types';
import ApplicationStepWrapper from './ApplicationStepWrapper';
import { useApplicationStep } from '@/contexts/';
import {
  CheckCircle,
  TrendingUp,
  DollarSign,
  Star,
  Search,
  Database,
  Building2,
} from 'lucide-react';

const CURRENT_STEP_ID = 'profile-analysis';

interface LoadingStepProps {
  icon: React.ComponentType<any>;
  text: string;
  delay: number;
}

const LoadingStep: React.FC<LoadingStepProps> = ({
  icon: Icon,
  text,
  delay,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    const completeTimer = setTimeout(() => {
      setIsComplete(true);
    }, delay + 800);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(completeTimer);
    };
  }, [delay]);

  return (
    <div
      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      } ${
        isComplete
          ? 'bg-green-50 border border-green-200'
          : 'bg-blue-50 border border-blue-200'
      }`}
    >
      <div
        className={`p-2 rounded-full ${
          isComplete ? 'bg-green-100' : 'bg-blue-100'
        }`}
      >
        <Icon
          className={`h-5 w-5 ${
            isComplete ? 'text-green-600' : 'text-blue-600'
          }`}
        />
      </div>
      <span
        className={`text-sm font-medium ${
          isComplete ? 'text-green-800' : 'text-blue-800'
        }`}
      >
        {text}
      </span>
      {isComplete && <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />}
    </div>
  );
};

const LoadingScreen: React.FC<{ onComplete: () => void }> = ({
  onComplete,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 5000); // 5 second delay

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="text-center space-y-8">
      {/* Animated Loading Circle */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>

      {/* Loading Steps with Animation */}
      <div className="max-w-2xl mx-auto space-y-4">
        <LoadingStep
          icon={Database}
          text="Analyzing your business profile..."
          delay={0}
        />
        <LoadingStep
          icon={Search}
          text="Searching our network of 50+ lending partners..."
          delay={1000}
        />
        <LoadingStep
          icon={TrendingUp}
          text="Calculating your funding eligibility..."
          delay={2000}
        />
        <LoadingStep
          icon={Building2}
          text="Matching you with the best loan options..."
          delay={3000}
        />
        <LoadingStep
          icon={CheckCircle}
          text="Preparing your personalized results..."
          delay={4000}
        />
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full animate-pulse transition-all duration-300"
            style={{
              background:
                'linear-gradient(to right, #f15379 0%, #e28f43 50%, #914ae8 100%)',
            }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          This may take a few moments...
        </p>
      </div>
    </div>
  );
};

const MatchScreen: React.FC = () => {
  return (
    <div className="text-center space-y-8">
      {/* Success Animation */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <div
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center animate-bounce"
            style={{ backgroundColor: 'var(--button-primary, #3b82f6)' }}
          >
            <Star className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">
          Great news! You likely qualify with our lending partners.
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Based on your business profile, we&apos;ve identified several funding
          options that match your needs. Let&apos;s gather a few more details to
          get you the best possible offers.
        </p>
      </div>

      {/* Expected Outcomes */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 max-w-3xl mx-auto border border-green-200">
        <div className="flex items-start space-x-4">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'var(--button-primary, #3b82f6)' }}
          >
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-gray-800 mb-2">
              What to expect next:
            </h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>
                Complete your application with personal and business details
              </li>
              <li>
                Connect your bank account for instant verification (optional but
                recommended)
              </li>
              <li>Receive multiple loan offers within 24-48 hours</li>
              <li>Choose the best terms and get funded in 3-5 business days</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BusinessProfileAnalysis() {
  const {
    formData,
    moveForward,
    moveBackward,
    isNavigating,
    saveFormData,
    isLoading,
  } = useApplicationStep(CURRENT_STEP_ID);

  const [localFormData, setLocalFormData] = useState<FormData>({
    tierResult: formData.tierResult || '',
  });

  const [currentPhase, setCurrentPhase] = useState<'loading' | 'match'>(
    formData.tierResult && formData.tierResult !== '' ? 'match' : 'loading'
  );

  useEffect(() => {
    const initialData = {
      tierResult: formData.tierResult || '',
    };
    setLocalFormData(initialData);

    // Update phase based on analysisFinished status
    if (formData.tierResult && formData.tierResult !== '') {
      setCurrentPhase('match');
    } else {
      setCurrentPhase('loading');
    }
  }, [formData]);

  const handleLoadingComplete = () => {
    setCurrentPhase('match');
    saveFormData({ tierResult: 'TIER_NOT_CALCULATED' });
  };

  const handleNext = async () => {
    try {
      await moveForward(localFormData);
    } catch (error) {
      console.error('Error moving to next step:', error);
    }
  };

  const canGoNext = currentPhase === 'match' && !isNavigating;

  const title =
    currentPhase === 'loading'
      ? 'Analyzing Your Business Profile'
      : 'Great news! You likely qualify with our lending partners.';

  const description =
    currentPhase === 'loading'
      ? "Based on your business profile, we've identified several funding options that match your needs. Let's gather a few more details to get you the best possible offers."
      : "We've found a lender that can help you get the funding you need.";
  return (
    <ApplicationStepWrapper
      title={title}
      description={description}
      onNext={handleNext}
      canGoNext={!!canGoNext}
      isSubmitting={isNavigating}
      stepId={CURRENT_STEP_ID}
      isLoading={isLoading}
      onBack={() => {
        moveBackward();
      }}
    >
      <>
        {currentPhase === 'loading' && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}
        {currentPhase === 'match' && <MatchScreen />}
      </>
    </ApplicationStepWrapper>
  );
}
