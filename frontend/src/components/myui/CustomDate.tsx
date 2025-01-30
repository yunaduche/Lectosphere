import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DatePickerProps {
  value: Date | string | null;
  onChange: (date: Date) => void;
  className?: string;
}

const CustomDatePicker = ({ value, onChange, className = '' }: DatePickerProps) => {

  const parseInitialDate = (val: Date | string | null): Date => {
    if (!val) return new Date();
    if (val instanceof Date) return val;
    const parsed = new Date(val);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(parseInitialDate(value));
  const [selectedDate, setSelectedDate] = useState(parseInitialDate(value));
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parsedDate = parseInitialDate(value);
    setSelectedDate(parsedDate);
    setCurrentDate(parsedDate);
  }, [value]);

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const formatDate = (date: Date | string | null): string => {
    try {
      const d = parseInitialDate(date);
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    } catch (error) {
      return '';
    }
  };

  const changeMonth = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const handleDateSelect = (date: Date) => {
    if (!isDateDisabled(date)) {
      setSelectedDate(date);
      onChange(date);
      setIsOpen(false);
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  return (
    <div className={`relative ${className}`} ref={datePickerRef}>
      <div 
        className="flex items-center px-4 py-2 border rounded-lg cursor-pointer hover:border-blue-500 focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar className="w-5 h-5 mr-2 text-gray-500" />
        <span>{formatDate(selectedDate)}</span>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-64 mt-1 bg-white border rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-2 border-b">
            <button
              onClick={() => changeMonth(-1)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={() => changeMonth(1)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 p-2">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {getDaysInMonth(currentDate).map((date, index) => (
              <div key={index} className="text-center">
                {date ? (
                  <button
                    onClick={() => handleDateSelect(date)}
                    disabled={isDateDisabled(date)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                      ${isSelected(date) ? 'bg-blue-500 text-white' : 
                        isToday(date) ? 'border border-blue-500 text-blue-500' : 
                        isDateDisabled(date) ? 'text-gray-300 cursor-not-allowed' :
                        'hover:bg-gray-100'}`}
                  >
                    {date.getDate()}
                  </button>
                ) : (
                  <div className="w-8 h-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;