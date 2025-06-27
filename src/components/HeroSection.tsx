import Image from 'next/image';

interface HeroSectionProps {
  onApplyNow: () => void;
}

export default function HeroSection({ onApplyNow }: HeroSectionProps) {
  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left side - Image */}
        <div className="order-2 lg:order-1">
          <div className="relative h-[600px] lg:h-[700px] rounded-lg overflow-hidden">
            <Image
              src="/images/cover.png"
              alt="Business owner in brewery"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Right side - Content */}
        <div className="order-1 lg:order-2 space-y-8 max-w-2xl">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight bg-gradient-to-r from-[#E28F43] via-[#F15379] to-[#914AE8] bg-clip-text text-transparent">
              2,000 Canadian Businesses
              <br />
              choose Keep each month
            </h1>
            <p className="text-xl lg:text-2xl text-gray-500 font-light">
              Fast, Easy, Flexible financing for your business
            </p>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            Don't let financing hold back your business potential. From covering
            operational needs to seizing growth opportunities, we make capital
            accessible when you need it most. Apply today to discover how much
            you can borrow.
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-gray-700">Borrow from $5K to $1.5M</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-gray-700">Same day approval</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-gray-700">
                Available to businesses with more than $10,000 per month in
                revenue
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onApplyNow}
              className="bg-green-400 hover:bg-green-500 text-black font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Apply now
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m7 7l5 5l5-5"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  No personal guarantees for
                </p>
                <p className="text-gray-600">loans up to $100K</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-600">An application with Keep</p>
                <p className="font-medium text-gray-900">
                  does not impact your credit score
                </p>
              </div>
            </div>
          </div>

          {/* Logo section */}
          <div className="flex justify-start items-center space-x-12 pt-8">
            <Image
              src="/images/maple.svg"
              alt="Maple Logo"
              width={203}
              height={57}
              className="object-contain"
            />
            <Image
              src="/images/bbb.svg"
              alt="BBB Logo"
              height={80}
              width={0}
              style={{ width: 'auto' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
