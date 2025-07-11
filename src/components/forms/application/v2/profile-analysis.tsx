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
import ProgressBar from '@/components/ProgressBar';
import Image from 'next/image';

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

const Benefit = ({ text, number }: { text: string; number: number }) => {
  return (
    <div
      className={`flex items-center space-x-3 p-5 rounded-2xl transition-all duration-500 bg-success`}
    >
      <span className="text-sm font-bold text-success">{number}.</span>
      <span className={`text-base font-thin text-success`}>{text}.</span>
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
      {/* Progress Bar */}
      <ProgressBar className="gradient-red-orange animate-loading-bar transition-all duration-300" />

      <p className="text-sm text-gray-500 mt-2">
        This may take a few moments...
      </p>

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
    </div>
  );
};

const MatchScreen: React.FC = () => {
  return (
    <div className="text-center space-y-4">
      {/* Success Animation */}
      <div className="flex justify-center">
        <div className="relative">
          <Image
            src="/svgs/check-green-icon.svg"
            alt="success"
            width={100}
            height={100}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">
          Great news! You likely qualify <br /> with our lending partners.
        </h2>
        <div className="flex flex-col gap-8 w-full justify-center items-center">
          <p className="text-base max-w-lg text-secondary font-extralight w-full">
            Based on your business profile, we&apos;ve identified several
            funding options that match your needs. Let&apos;s gather a few more
            details to get you the best possible offers.
          </p>
          <p className="text-base max-w-lg mx-auto text-secondary font-bold">
            What to expect next:
          </p>
        </div>
      </div>

      {/* Expected Outcomes */}
      <div className="rounded-lg sm:p-6 p-0 max-w-3xl mx-auto">
        <div className="flex items-start space-x-4">
          <div className="space-y-1 list-disc list-inside flex flex-col gap-1.5 w-full">
            <Benefit
              number={1}
              text="Complete your application with personal and business details"
            />
            <Benefit
              number={2}
              text="Connect your bank account for instant verification"
            />
            <Benefit
              number={3}
              text="Receive multiple loan offers within 24-48 hours"
            />
            <Benefit
              number={4}
              text="Choose the best terms and get funded in 3-5 business days"
            />
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

  // remove this

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
    currentPhase === 'loading' ? 'Analyzing Your Business Profile' : undefined;

  return (
    <ApplicationStepWrapper
      hideProgress
      title={title}
      onNext={currentPhase === 'loading' ? undefined : handleNext}
      canGoNext={!!canGoNext}
      isSubmitting={isNavigating}
      stepId={CURRENT_STEP_ID}
      isLoading={isLoading}
      onBack={
        currentPhase === 'loading'
          ? undefined
          : () => {
              moveBackward();
            }
      }
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
