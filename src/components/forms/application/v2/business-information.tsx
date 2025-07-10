'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Building2, Search, ChevronUp } from 'lucide-react';
import { FormData } from '@/types';
import ApplicationStepWrapper from './ApplicationStepWrapper';
import { useApplicationStep } from '@/contexts/';

const industryCategories = [
  {
    category: 'Automotive',
    industries: [
      'Parts and Accessories',
      'Dealership',
      'Car Washes',
      'Repair and Maintenance',
    ],
  },
  {
    category: 'Construction',
    industries: [
      'New Construction (House flipping)',
      'Renovation & Remodeling',
      'Commercial',
      'Residential',
      'General Construction',
    ],
  },
  {
    category: 'Transportation, Taxis and Trucking',
    industries: [
      'Freight Trucking',
      'Limousine',
      'Taxis',
      'Travel Agencies',
      'Other Transportation & Travel',
      'Car Rentals',
      'Towing services',
      'Uber Driver',
    ],
  },
  {
    category: 'Retail Stores',
    industries: [
      'Building Materials',
      'Electronics',
      'Fashion, Clothing, Sports Goods',
      'Grocery, Supermarkets and Bakeries',
      'Garden & Florists',
      'Liquor Store',
      'Other Retail Store',
      'Cell Phone Store',
      'Drug paraphernalia',
      'E-commerce',
      'Electronic cigarette devices',
    ],
  },
  {
    category: 'Entertainment and Recreation',
    industries: [
      'Adult Entertainment',
      'Gambling',
      'Sports Club',
      'Arts',
      'Nightclubs',
      'Event and Entertainment Sales',
    ],
  },
  {
    category: 'Utilities and Home Services',
    industries: [
      'Cleaning',
      'Plumbing, Electricians & HVAC',
      'Landscaping Services',
      'Other home services',
    ],
  },
  {
    category: 'Retail Facilities',
    industries: [
      'Beauty Salon & Barbers',
      'Dry Cleaning & Laundry',
      'Gym & Fitness Center',
      'Nails Salon',
    ],
  },
  {
    category: 'Health Services',
    industries: [
      'Dentists',
      'Doctors Offices',
      'Personal Care Services',
      'Pharmacies and Drug Stores',
      'Optometrists',
      'Other Health Services',
      'Biotechnology',
      'Diet pills and nutraceuticals',
    ],
  },
  {
    category: 'Hospitality',
    industries: ['Hotels & Inns', 'Bed and Breakfasts'],
  },
  {
    category: 'Professional Services',
    industries: [
      'Finance and Insurance',
      'IT, Media, or Publishing',
      'Legal Services',
      'Accounting',
      'Call Centers',
      'Communication Services',
      'Registered Training Organization',
      'Payday or any other financial lenders',
      'Direct Marketing',
      'Forex or share trading',
      'Staffing and Recruiting',
    ],
  },
  {
    category: 'Restaurants and Food Services',
    industries: ['Restaurants and Bars', 'Catering', 'Other Food Services'],
  },
  {
    category: 'Other',
    industries: [
      'Delivery Services',
      'Warehouse and Storage',
      'Security',
      'Data Services',
      'Funeral Services',
      'Not for Profit',
      'Firearm Sales',
      'Agriculture, Forestry, Fishing and Hunting',
      'Manufacturing',
      'Mining (except Oil and Gas)',
      'Oil and Gas Extraction',
      'Real Estate',
      'Wholesale Trade',
      'Convenience Stores',
      'Gas stations',
      'Farming',
      'Gas and Water Supply',
      'Government and Defence',
      'Auction Houses',
      'Tattoo or piercing parlours',
      'Pawn Broker',
      'Educational Services',
      'Other',
    ],
  },
];

const getAllIndustries = () => {
  const allIndustries: {
    category: string;
    industry: string;
    fullName: string;
  }[] = [];
  industryCategories.forEach((cat) => {
    cat.industries.forEach((industry) => {
      allIndustries.push({
        category: cat.category,
        industry,
        fullName: `${cat.category} - ${industry}`,
      });
    });
  });
  return allIndustries;
};

const allIndustries = getAllIndustries();

const BusinessInformation = () => {
  const { formData, saveFormData, isStepCompleted, moveForward, isNavigating } =
    useApplicationStep('business-information');

  const businessNameRef = useRef<HTMLInputElement>(null);
  const industryRef = useRef<HTMLInputElement>(null);
  const industryContainerRef = useRef<HTMLDivElement>(null);

  const [industrySearch, setIndustrySearch] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<'industry' | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const [localFormData, setLocalFormData] = useState<FormData>({
    businessName: '',
    businessIndustry: '',
  });

  // Initialize form data
  useEffect(() => {
    const initialData = {
      businessName: formData.businessName || '',
      businessIndustry: formData.businessIndustry || '',
    };
    setLocalFormData(initialData);
  }, [formData]);

  // Focus on Business name input
  useEffect(() => {
    if (businessNameRef.current) {
      businessNameRef.current.focus();
    }
  }, []);

  // Set industry search from current value
  useEffect(() => {
    if (formData.businessIndustry) {
      setIndustrySearch(formData.businessIndustry);
    }
  }, [formData.businessIndustry]);

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...localFormData, [field]: value };
    setLocalFormData(updatedData);
    saveFormData(updatedData);
  };

  const getFilteredCategories = () => {
    if (!industrySearch.trim()) {
      return industryCategories;
    }

    const searchTerm = industrySearch.toLowerCase();
    const filteredCategories = industryCategories
      .map((category) => ({
        ...category,
        industries: category.industries.filter(
          (industry) =>
            industry.toLowerCase().includes(searchTerm) ||
            category.category.toLowerCase().includes(searchTerm)
        ),
      }))
      .filter((category) => category.industries.length > 0);

    return filteredCategories;
  };

  const filteredCategories = getFilteredCategories();

  // Get flat list of selectable items for keyboard navigation
  const getSelectableItems = () => {
    const items: string[] = [];
    filteredCategories.forEach((category) => {
      category.industries.forEach((industry) => {
        items.push(`${category.category} - ${industry}`);
      });
    });
    return items;
  };

  const selectableItems = getSelectableItems();

  const handleKeyDown = (e: React.KeyboardEvent, field: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      // Move to next field or trigger onEnterPress
      switch (field) {
        case 'businessName':
          industryRef.current?.focus();
          setActiveDropdown('industry');
          break;
        case 'industry':
          if (activeDropdown === 'industry' && selectableItems.length > 0) {
            handleIndustrySelect(selectableItems[highlightedIndex]);
          }
          break;
      }
    }

    // Handle dropdown navigation
    if (field === 'industry') {
      handleDropdownKeyDown(e);
    }
  };

  const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!activeDropdown) {
        setActiveDropdown('industry');
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex((prev) =>
          prev < selectableItems.length - 1 ? prev + 1 : prev
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (activeDropdown) {
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setActiveDropdown(null);
      setHighlightedIndex(0);
    }
  };

  const handleIndustrySelect = (industryValue: string) => {
    handleInputChange('businessIndustry', industryValue);
    setIndustrySearch(industryValue);
    setActiveDropdown(null);
    setHighlightedIndex(0);
  };

  const isItemHighlighted = (categoryName: string, industry: string) => {
    const itemValue = `${categoryName} - ${industry}`;
    const itemIndex = selectableItems.findIndex((item) => item === itemValue);
    return itemIndex === highlightedIndex;
  };

  const handleIndustryInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setIndustrySearch(value);
    handleInputChange('businessIndustry', value);
    setActiveDropdown('industry');
    setHighlightedIndex(0);
  };

  const handleIndustryBlur = () => {
    setTimeout(() => {
      if (
        industryContainerRef.current &&
        !industryContainerRef.current.contains(document.activeElement)
      ) {
        setActiveDropdown(null);
        setHighlightedIndex(0);
      }
    }, 100);
  };

  const handleIndustryFocus = () => {
    setActiveDropdown('industry');
    setHighlightedIndex(0);
  };
  const handleNext = async () => {
    try {
      await moveForward(localFormData);
    } catch (error) {
      console.error('Error moving to next step:', error);
    }
  };

  const canGoNext = isStepCompleted('business-information') && !isNavigating;

  return (
    <ApplicationStepWrapper
      title="Business Information"
      onNext={handleNext}
      canGoNext={canGoNext}
      isSubmitting={isNavigating}
      stepId="business-information"
    >
      {/* Business Name Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Building2 className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Business Name</h3>
          <div className="inline-flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
            <span>Required</span>
          </div>
        </div>

        <div>
          <input
            ref={businessNameRef}
            type="text"
            value={formData.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'businessName')}
            placeholder="Your Business Name Inc."
            required={true}
            className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
          />
        </div>
      </div>

      {/* Business Industry Section */}
      <div ref={industryContainerRef} className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Search className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Business Industry
          </h3>
          <div className="inline-flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
            <span>Required</span>
          </div>
        </div>

        <div className="relative">
          <input
            ref={industryRef}
            type="text"
            value={industrySearch}
            onChange={handleIndustryInputChange}
            onFocus={handleIndustryFocus}
            onBlur={handleIndustryBlur}
            onKeyDown={(e) => handleKeyDown(e, 'industry')}
            placeholder="Search industries..."
            className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />

          {activeDropdown === 'industry' && (
            <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
              {/* Header */}
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <span className="text-gray-700 font-medium">
                  Search or select your industry
                </span>
                <ChevronUp className="h-4 w-4 text-gray-500" />
              </div>

              {/* Scrollable Content */}
              <div className="max-h-64 overflow-y-auto">
                {filteredCategories.map((category, categoryIndex) => (
                  <div key={category.category}>
                    {/* Category Header */}
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                      <h4 className="font-semibold text-gray-800 text-sm">
                        {category.category}
                      </h4>
                    </div>

                    {/* Category Items */}
                    {category.industries.map((industry, industryIndex) => {
                      const fullIndustryName = `${category.category} - ${industry}`;
                      const isHighlighted = isItemHighlighted(
                        category.category,
                        industry
                      );

                      return (
                        <button
                          key={`${category.category}-${industry}`}
                          onClick={() => handleIndustrySelect(fullIndustryName)}
                          className={`w-full px-4 py-3 text-left transition-colors duration-150 border-b border-gray-50 last:border-b-0 ${
                            isHighlighted
                              ? 'bg-blue-500 text-white'
                              : 'hover:bg-blue-50 text-gray-700'
                          }`}
                        >
                          <span className="text-sm">{industry}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}

                {filteredCategories.length === 0 && (
                  <div className="px-4 py-6 text-center text-gray-500">
                    <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No industries found</p>
                    <p className="text-xs mt-1">Try a different search term</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ApplicationStepWrapper>
  );
};

export default BusinessInformation;
