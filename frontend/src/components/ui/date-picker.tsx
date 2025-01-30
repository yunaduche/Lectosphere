import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface DatePickerProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target && !target.closest('.date-picker')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleDatePicker = () => {
    setIsOpen(!isOpen);
  };

  const handleDateChange = (date: Date) => {
    onChange(date);
    setIsOpen(false);
  };

  return (
    <div className="relative date-picker">
      <button
        type="button"
        className="flex items-center text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={toggleDatePicker}
      >
        {value ? value.toLocaleDateString() : 'Select a date'}
        <Calendar className="ml-2 h-5 w-5 text-gray-400" />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-md p-4 border border-gray-300">
          <input
            type="date"
            value={value ? value.toISOString().substr(0, 10) : ''}
            onChange={(e) => handleDateChange(new Date(e.target.value))}
            className="border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-gray-700"
          />
        </div>
      )}
      {label && <label className="block text-sm font-medium text-gray-700 mt-2">{label}</label>}
    </div>
  );
};

export default DatePicker;