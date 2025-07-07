'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Declare Facebook Pixel types
declare global {
  interface Window {
    fbq: (action: string, event: string, data?: object) => void;
  }
}

interface FormData {
  [key: string]: string;
}

export default function SuccessPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({});
  const [applicationId, setApplicationId] = useState<string>('');

  useEffect(() => {
    const savedData = localStorage.getItem('referralApplicationData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }

    const appId = localStorage.getItem('applicationId');
    if (appId) {
      setApplicationId(appId);
    }

    // Check if we actually submitted successfully
    const submissionSuccess = localStorage.getItem('submissionSuccess');
    if (!submissionSuccess) {
      router.push(process.env.NEXT_PUBLIC_HOME_URL ?? '/');
    }

    // Fire Facebook Pixel conversion events when success page loads
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'CompleteRegistration');
      window.fbq('track', 'ViewContent', { content_name: 'Success' });
    }
  }, [router]);

  const handleNewApplication = () => {
    localStorage.removeItem('referralApplicationData');
    localStorage.removeItem('applicationId');
    localStorage.removeItem('submissionSuccess');
    router.push(process.env.NEXT_PUBLIC_HOME_URL ?? '/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Application Submitted Successfully!
              </h1>
              <p className="text-gray-600 mb-6">
                Thank you for your interest in our referral capital program. We
                have received your application and will review it shortly.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                What happens next?
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-3">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                  <span>
                    Our team will review your application within 1-2 business
                    days
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                  <span>
                    If pre-qualified, we&apos;ll contact you to discuss your
                    funding options
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                  <span>Complete any additional documentation if required</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-600 font-bold text-sm">4</span>
                  <span>Receive your funding decision and terms</span>
                </li>
              </ul>
            </div>

            {applicationId && (
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <p className="text-green-800 text-sm">
                  <strong>Application ID:</strong> #{applicationId}
                </p>
              </div>
            )}

            {formData.email && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <strong>Confirmation sent to:</strong> {formData.email}
                </p>
              </div>
            )}

            <div className="text-sm text-gray-500 mb-6">
              <p>Need immediate assistance? Contact us at:</p>
              <p className="font-medium">
                support@trykeep.com | +1-866-460-5337
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => window.open('https://trykeep.com', '_blank')}
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Visit Keep Website
              </button>
              <button
                onClick={handleNewApplication}
                className="w-full bg-white text-black border border-gray-300 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Submit Another Application
              </button>
            </div>
          </div>

          {/* Social proof widget for success page */}
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
