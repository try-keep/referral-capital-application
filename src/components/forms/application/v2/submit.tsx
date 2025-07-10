import React, { useState } from 'react';
import {
  Edit,
  User,
  Building2,
  DollarSign,
  FileText,
  Shield,
  Send,
} from 'lucide-react';
import ApplicationStepWrapper from './ApplicationStepWrapper';
import { useApplicationStep } from '@/contexts';
import { isDefined } from '@/utils';
import { FormData } from '@/types';

interface VerifySubmitScreenProps {
  onEditField?: (fieldId: string) => void;
}

const CURRENT_STEP_ID = 'submit';

const VerifySubmitScreen: React.FC<VerifySubmitScreenProps> = ({
  onEditField,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formData, isNavigating, submit } =
    useApplicationStep(CURRENT_STEP_ID);

  const handleSubmit = async () => {
    if (isNavigating) return;

    setIsSubmitting(true);
    await submit();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString.replace(/\//g, '-'));
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatAddress = (data: FormData) => {
    if (!data) return '';
    try {
      const address = data;
      const parts = [
        address.addressLine1,
        address.addressLine2,
        address.city,
        address.province,
        address.postalCode,
      ].filter(Boolean);
      return parts.join(', ');
    } catch {
      return 'Not specified';
    }
  };

  const formatBusinessInfo = (businessInfoJson: string) => {
    if (!businessInfoJson) return {};
    try {
      return JSON.parse(businessInfoJson);
    } catch {
      return {};
    }
  };

  const formatLoansData = (loansDataJson: string) => {
    if (!loansDataJson) return [];
    try {
      return JSON.parse(loansDataJson);
    } catch {
      return [];
    }
  };

  const businessInfo = formatBusinessInfo(formData.businessInfo);
  const loansData = formatLoansData(formData.existingLoansData);

  const EditButton = ({ field }: { field: string }) => (
    <>
      {isDefined(onEditField) ? (
        <button
          onClick={() => onEditField(field)}
          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200"
          title="Edit this information"
        >
          <Edit className="h-4 w-4" />
        </button>
      ) : null}
    </>
  );

  return (
    <ApplicationStepWrapper
      title="Review & Submit Your Application"
      description="Please review your information below. Click any edit button to make changes, then submit your application when everything looks correct."
      isSubmitting={isNavigating}
      stepId={CURRENT_STEP_ID}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Funding Details */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Funding Details
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Funding Amount
                </span>
                <p className="text-gray-900">
                  {formData.fundingAmount || 'Not specified'}
                </p>
              </div>
              <EditButton field="fundingAmount" />
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Time in Business
                </span>
                <p className="text-gray-900">
                  {formData.timeInBusiness || 'Not specified'}
                </p>
              </div>
              <EditButton field="timeInBusiness" />
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Monthly Sales
                </span>
                <p className="text-gray-900">
                  {formData.monthlySales || 'Not specified'}
                </p>
              </div>
              <EditButton field="monthlySales" />
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Credit Score
                </span>
                <p className="text-gray-900">
                  {formData.creditScore || 'Not specified'}
                </p>
              </div>
              <EditButton field="creditScore" />
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Personal Information
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Full Name
                </span>
                <p className="text-gray-900">
                  {`${formData.firstName} ${formData.lastName}`.trim() ||
                    'Not specified'}
                </p>
              </div>
              <EditButton field="personalInfo" />
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="text-sm font-medium text-gray-700">Email</span>
                <p className="text-gray-900">
                  {formData.email || 'Not specified'}
                </p>
              </div>
              <EditButton field="email" />
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="text-sm font-medium text-gray-700">Phone</span>
                <p className="text-gray-900">
                  {formData.phone || 'Not specified'}
                </p>
              </div>
              <EditButton field="personalInfo" />
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Date of Birth
                </span>
                <p className="text-gray-900">
                  {formatDate(formData.dateOfBirth) || 'Not specified'}
                </p>
              </div>
              <EditButton field="personalInfo" />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-start p-3 bg-gray-50 rounded">
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">
                  Personal Address
                </span>
                <p className="text-gray-900">
                  {formatAddress(formData) || 'Not specified'}
                </p>
              </div>
              <EditButton field="personalAddress" />
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Business Information
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Business Name
                </span>
                <p className="text-gray-900">
                  {formData.businessName || 'Not specified'}
                </p>
              </div>
              <EditButton field="businessBasics" />
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Entity Type
                </span>
                <p className="text-gray-900">
                  {formData.businessEntityType || 'Not specified'}
                </p>
              </div>
              <EditButton field="businessEntityType" />
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Industry
                </span>
                <p className="text-gray-900">
                  {formData.businessIndustry || 'Not specified'}
                </p>
              </div>
              <EditButton field="businessBasics" />
            </div>
          </div>

          {businessInfo.streetAddress && (
            <div className="mt-4">
              <div className="flex justify-between items-start p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">
                    Business Address & Contact
                  </span>
                  <p className="text-gray-900">
                    {[
                      businessInfo.streetAddress,
                      businessInfo.apartment,
                      businessInfo.city,
                      businessInfo.province,
                      businessInfo.postalCode,
                      businessInfo.country,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  {businessInfo.phone && (
                    <p className="text-gray-900">Phone: {businessInfo.phone}</p>
                  )}
                  {businessInfo.website && (
                    <p className="text-gray-900">
                      Website: {businessInfo.website}
                    </p>
                  )}
                </div>
                <EditButton field="businessInfo" />
              </div>
            </div>
          )}
        </div>

        {/* Funding Requirements */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Funding Requirements
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Funding Timeline
                </span>
                <p className="text-gray-900">
                  {formData.fundingTimeline || 'Not specified'}
                </p>
              </div>
              <EditButton field="fundingTimeline" />
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Funding Purpose
                </span>
                <p className="text-gray-900">
                  {formData.fundingPurpose || 'Not specified'}
                </p>
              </div>
              <EditButton field="fundingPurpose" />
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Funding Type
                </span>
                <p className="text-gray-900">
                  {formData.fundingType || 'Not specified'}
                </p>
              </div>
              <EditButton field="fundingType" />
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Bank Connected
                </span>
                <p className="text-gray-900">
                  {formData.bankAccountConnected ? 'Yes' : 'No'}
                </p>
              </div>
              <EditButton field="bankAccountConnected" />
            </div>
          </div>

          {/* Existing Loans */}
          <div className="mt-4">
            <div className="flex justify-between items-start p-3 bg-gray-50 rounded">
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">
                  Existing Business Loans
                </span>
                {formData?.existingLoans?.length &&
                formData?.existingLoans?.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {loansData.map((loan: any, index: number) => (
                      <div key={index} className="bg-white p-2 rounded border">
                        <p className="text-sm">
                          <strong>{loan.lender}</strong> - {loan.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-900">
                    {formData?.existingLoans?.length || 'Not specified'}
                  </p>
                )}
              </div>
              <EditButton field="existingLoans" />
            </div>
          </div>

          {/* Business Ownership */}
          <div className="mt-4">
            <div className="flex justify-between items-start p-3 bg-gray-50 rounded">
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">
                  Business Authorization
                </span>
                <p className="text-gray-900">
                  {formData.businessOwnership === 'Yes'
                    ? 'Authorized to apply'
                    : 'Not authorized'}
                  {formData.ownershipPercentage &&
                    ` (${formData.ownershipPercentage === 'Yes' ? '50%+ owner' : 'Minority owner'})`}
                </p>
              </div>
              <EditButton field="ownershipFlow" />
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Ready to Submit Your Application
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              By submitting this application, you authorize us to share your
              information with our lending partners and to perform a soft credit
              check that won&apos;t affect your credit score.
            </p>

            <div className="space-y-2 text-sm text-gray-500">
              <p>✓ Your information is encrypted and secure</p>
              <p>✓ No impact to your credit score</p>
              <p>✓ Receive offers within 24-48 hours</p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`btn-primary text-lg px-8 py-4 ${isSubmitting ? 'opacity-50' : ''}`}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-3">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Submitting Application...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send className="h-5 w-5" />
                  <span>Submit Application</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </ApplicationStepWrapper>
  );
};

export default VerifySubmitScreen;
