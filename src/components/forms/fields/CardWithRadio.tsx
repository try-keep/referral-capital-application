import React from 'react';

interface CardWithRadioProps {
  options: {
    label: string;
    value: string;
  }[];
  value: string;
  onChange: (value: string) => void;
}

const CardWithRadio: React.FC<CardWithRadioProps> = ({
  options,
  value,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onChange(option.value)}
          className={`p-4 rounded-lg text-left transition-all duration-200 shadow-md hover:shadow-lg ${
            value === option.value
              ? 'text-white shadow-lg transform scale-105'
              : 'bg-white text-gray-700 hover:text-white'
          }`}
          style={{
            backgroundColor:
              value === option.value ? 'var(--button-primary)' : 'white',
            color: value === option.value ? 'white' : 'rgb(55, 65, 81)', // Explicitly set text color
          }}
          onMouseEnter={(e) => {
            if (value !== option.value) {
              e.currentTarget.style.backgroundColor = 'var(--button-primary)';
              e.currentTarget.style.color = 'white';
            }
          }}
          onMouseLeave={(e) => {
            if (value !== option.value) {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = 'rgb(55, 65, 81)'; // text-gray-700
            }
          }}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{option.label}</span>
            <div
              className={`w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                value === option.value
                  ? 'bg-white border-white'
                  : 'border-gray-300'
              }`}
            >
              {value === option.value && (
                <div
                  className="w-2.5 h-2.5 sm:w-2 sm:h-2 rounded-full"
                  style={{ backgroundColor: 'var(--button-primary)' }}
                />
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default CardWithRadio;
