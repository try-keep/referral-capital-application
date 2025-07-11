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
          className={
            value === option.value
              ? 'card-with-radio-selected'
              : 'card-with-radio'
          }
        >
          <div className="flex items-center gap-[8px]">
            <div
              className={`w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                value === option.value ? 'bg-white border-white' : 'neutral-500'
              }`}
            >
              {value === option.value && (
                <div className="w-2.5 h-2.5 sm:w-2 sm:h-2 rounded-full bg-inverse" />
              )}
            </div>
            <span className="font-light">{option.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default CardWithRadio;
