import React from 'react';
import { X } from 'lucide-react';

interface InputProps {
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  name: string;
}

const Input: React.FC<InputProps> = ({
  id,
  type,
  value,
  onChange,
  label,
  name
}) => {
        const handleClear = () => {
          
          const event = {
            target: { value: '', name, id },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(event);
        };

  return (
    <div className="relative mb-4">
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="peer w-full px-3 py-3 text-base text-gray-900 bg-white-100 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#e7c568] focus:border-[#e7c568] transition-all duration-200 placeholder-transparent"
        placeholder={label}
      />
      {value && (
        <button
        type="button"
        onClick={handleClear}
        className="group absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full 
                   text-gray-500 hover:text-gray-700 focus:outline-none
                   transition-all duration-200 ease-in-out
                   hover:bg-white hover:bg-opacity-20"
      >
        <X size={16} className="transform transition-transform duration-200 ease-in-out group-hover:rotate-90" />
      </button>
      )}
      <label
        htmlFor={id}
        className="absolute left-3 -top-2.5 bg-white px-1 text-[15px] text-gray-500 transition-all duration-200
                   peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
                   peer-focus:-top-2.5 peer-focus:translate-y-0 peer-focus:text-[15px] peer-focus:text-[#e7c568]"
      >
        {label}
      </label>
    </div>
  );
};

export default Input;