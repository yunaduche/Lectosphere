import React from 'react';
import { X } from 'lucide-react';

interface SearchBarProps {
  id: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  id,
  value,
  placeholder = 'Search...',
  onChange,
}) => {
  const handleClear = () => {
    const event = {
      target: { value: '', name: id, id },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  return (
    <div className="relative mb-4 w-full">
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="peer w-full px-4 py-3 text-base text-gray-900 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#e7c568] focus:border-[#e7c568] transition-all duration-200"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all duration-200 rounded-full bg-white shadow-sm hover:bg-gray-100"
        >
          <X size={18} className="transition-transform duration-200 ease-in-out transform group-hover:rotate-90" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
