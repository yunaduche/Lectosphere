import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ModernSelect = ({ value, onChange, data }) => {
  return (
    <Select value={value} onValueChange={(value) => onChange({ target: { value } })}>
      <SelectTrigger className="w-64 h-12 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700">
        <SelectValue placeholder="Type d'événement" />
      </SelectTrigger>
      <SelectContent className="w-64 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
        <SelectGroup>
          {Object.entries(data).map(([value, { label }]) => (
            <SelectItem
              key={value}
              value={value}
              className="px-4 py-2 hover:bg-blue-100 text-gray-700 cursor-pointer"
            >
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ModernSelect;
