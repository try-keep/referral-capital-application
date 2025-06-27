import Image from 'next/image';

interface NavbarProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  backLabel?: string;
}

export default function Navbar({
  showBackButton = false,
  onBackClick,
  backLabel = 'Back',
}: NavbarProps) {
  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="max-w-7xl mx-auto w-full">
        {showBackButton && onBackClick ? (
          // Layout with back button - logo in center
          <div className="flex items-center justify-between">
            <button
              onClick={onBackClick}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {backLabel}
            </button>

            <Image
              src="/images/keep-logo.svg"
              alt="Keep Logo"
              width={100}
              height={32}
              priority
            />

            <div className="w-16"></div>
          </div>
        ) : (
          // Layout without back button - logo on left
          <div className="flex items-center">
            <Image
              src="/images/keep-logo.svg"
              alt="Keep Logo"
              width={100}
              height={32}
              priority
            />
          </div>
        )}
      </div>
    </header>
  );
}
