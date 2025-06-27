import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function MeetingSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      <div
        className="flex items-center justify-center p-4"
        style={{ minHeight: 'calc(100vh - 80px)' }}
      >
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-8">
            <svg
              className="h-10 w-10 text-green-600"
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

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meeting Scheduled Successfully!
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Thank you for scheduling a meeting with our team. We're excited to
            discuss your business financing needs and help you find the perfect
            solution.
          </p>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              What Happens Next?
            </h2>

            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <span className="text-blue-600 text-sm font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Confirmation Email
                  </h3>
                  <p className="text-gray-600">
                    You'll receive a calendar invitation with meeting details
                    shortly.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <span className="text-blue-600 text-sm font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Preparation</h3>
                  <p className="text-gray-600">
                    Our team will review your information and prepare
                    personalized financing options.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <span className="text-blue-600 text-sm font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Your Meeting</h3>
                  <p className="text-gray-600">
                    We'll discuss your business goals and present tailored
                    funding solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Need to Make Changes?
            </h3>
            <p className="text-gray-600 mb-4">
              If you need to reschedule or have any questions before our
              meeting, please don't hesitate to reach out.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@trykeep.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Email Support
              </a>

              <a
                href="tel:+1-555-KEEP-123"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Call Us
              </a>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Return to Home
            </Link>

            <p className="text-sm text-gray-500">
              Looking for immediate funding?
              <Link
                href="/step/1"
                className="text-blue-600 hover:text-blue-800 underline ml-1"
              >
                Start your application
              </Link>
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Trusted by thousands of businesses
            </p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="text-xs text-gray-400">
                🔒 Bank-level Security
              </div>
              <div className="text-xs text-gray-400">⚡ Fast Approval</div>
              <div className="text-xs text-gray-400">🤝 Dedicated Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
