export default function EligibilityRequirements() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        What you need to know:
      </h2>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 mt-0.5 flex-shrink-0">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
          </div>
          <span className="text-gray-700">Takes about 4 minutes</span>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 mt-0.5 flex-shrink-0">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-gray-700">Have your bank statement ready</span>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 mt-0.5 flex-shrink-0">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-gray-700">No hard credit check. No impact to credit score</span>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 mt-0.5 flex-shrink-0">
            <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-gray-700">No credit check required at this point</span>
        </div>
      </div>
    </div>
  );
}