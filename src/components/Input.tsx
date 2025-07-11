import { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type: HTMLInputTypeAttribute;
};

export default function Input({
  label,
  placeholder,
  value,
  onChange,
  type,
  ...props
}: InputProps) {
  return (
    <div>
      <label className="block text-sm font-thin text-secondary mb-2 uppercase">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full p-3 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
        {...props}
      />
    </div>
  );
}
