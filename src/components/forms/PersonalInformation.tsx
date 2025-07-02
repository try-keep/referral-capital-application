import React, { useEffect, useState } from 'react';
import { FormData } from '@/types';

// Step 7: Personal Information
export function PersonalInformationForm({
  onNext,
  formData,
  isSubmitting,
}: {
  onNext: (data: FormData) => void;
  formData: FormData;
  isSubmitting: boolean;
}) {
  const [localData, setLocalData] = useState({
    firstName: formData.firstName || '',
    lastName: formData.lastName || '',
    email: formData.email || '',
    phone: formData.phone || '',
    dateOfBirth: formData.dateOfBirth || '',
    addressLine1: formData.addressLine1 || '',
    addressLine2: formData.addressLine2 || '',
    city: formData.city || '',
    province: formData.province || '',
    postalCode: formData.postalCode || '',
  });

  // Update local data when formData prop changes (for when user navigates back)
  useEffect(() => {
    console.log('🔄 Step7Form - formData prop changed:', formData);
    setLocalData({
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      dateOfBirth: formData.dateOfBirth || '',
      addressLine1: formData.addressLine1 || '',
      addressLine2: formData.addressLine2 || '',
      city: formData.city || '',
      province: formData.province || '',
      postalCode: formData.postalCode || '',
    });
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!localData.firstName.trim()) {
      alert('Please enter your first name');
      return;
    }
    if (!localData.lastName.trim()) {
      alert('Please enter your last name');
      return;
    }
    if (!localData.email.trim()) {
      alert('Please enter your email address');
      return;
    }
    if (!localData.phone.trim()) {
      alert('Please enter your phone number');
      return;
    }
    if (!localData.dateOfBirth.trim()) {
      alert('Please enter your date of birth');
      return;
    }
    if (!localData.addressLine1.trim()) {
      alert('Please enter your street address');
      return;
    }
    if (!localData.city.trim()) {
      alert('Please enter your city');
      return;
    }
    if (!localData.province.trim()) {
      alert('Please select your province');
      return;
    }
    if (!localData.postalCode.trim()) {
      alert('Please enter your postal code');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(localData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Basic Canadian postal code validation
    const postalCodeRegex = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/;
    if (!postalCodeRegex.test(localData.postalCode.toUpperCase())) {
      alert('Please enter a valid Canadian postal code (e.g., M5V 3A8)');
      return;
    }

    onNext(localData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            required
            value={localData.firstName}
            onChange={(e) =>
              setLocalData({ ...localData, firstName: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            required
            value={localData.lastName}
            onChange={(e) =>
              setLocalData({ ...localData, lastName: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            required
            value={localData.email}
            onChange={(e) =>
              setLocalData({ ...localData, email: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            required
            value={localData.phone}
            onChange={(e) =>
              setLocalData({ ...localData, phone: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mt-6">
        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Date of Birth *
          </label>
          <input
            type="date"
            id="dateOfBirth"
            required
            value={localData.dateOfBirth}
            onChange={(e) =>
              setLocalData({ ...localData, dateOfBirth: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
            Required
          </span>
          Address Information
        </h3>

        <div className="mb-6">
          <label
            htmlFor="addressLine1"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Street Address *
          </label>
          <input
            type="text"
            id="addressLine1"
            required
            value={localData.addressLine1}
            onChange={(e) =>
              setLocalData({ ...localData, addressLine1: e.target.value })
            }
            placeholder="123 Main Street"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="addressLine2"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Apartment, suite, etc. (Optional)
          </label>
          <input
            type="text"
            id="addressLine2"
            value={localData.addressLine2}
            onChange={(e) =>
              setLocalData({ ...localData, addressLine2: e.target.value })
            }
            placeholder="Suite 100"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              City *
            </label>
            <input
              type="text"
              id="city"
              required
              value={localData.city}
              onChange={(e) =>
                setLocalData({ ...localData, city: e.target.value })
              }
              placeholder="Toronto"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="province"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Province *
            </label>
            <select
              id="province"
              required
              value={localData.province}
              onChange={(e) =>
                setLocalData({ ...localData, province: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Province</option>
              <option value="AB">Alberta</option>
              <option value="BC">British Columbia</option>
              <option value="MB">Manitoba</option>
              <option value="NB">New Brunswick</option>
              <option value="NL">Newfoundland and Labrador</option>
              <option value="NS">Nova Scotia</option>
              <option value="ON">Ontario</option>
              <option value="PE">Prince Edward Island</option>
              <option value="QC">Quebec</option>
              <option value="SK">Saskatchewan</option>
              <option value="NT">Northwest Territories</option>
              <option value="NU">Nunavut</option>
              <option value="YT">Yukon</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="postalCode"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Postal Code *
            </label>
            <input
              type="text"
              id="postalCode"
              required
              value={localData.postalCode}
              onChange={(e) =>
                setLocalData({
                  ...localData,
                  postalCode: e.target.value.toUpperCase(),
                })
              }
              placeholder="M5V 3A8"
              pattern="[A-Z][0-9][A-Z] [0-9][A-Z][0-9]"
              maxLength={7}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
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
