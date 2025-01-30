import React from 'react';
import { Clock, Search, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const RecentSearchesDropdown = ({ 
  isVisible, 
  onSelect, 
  onClose,
  onClearHistory 
}) => {
//simul
  const recentSearches = [
    {
      id: 1,
      query: "Les Misérables Victor Hugo",
      timestamp: new Date(2024, 10, 24, 14, 30),
      searchType: "titre"
    },
    {
      id: 2,
      query: "ISBN: 978-2070368228",
      timestamp: new Date(2024, 10, 24, 12, 15),
      searchType: "isbn"
    },
    {
      id: 3,
      query: "Éditions Gallimard",
      timestamp: new Date(2024, 10, 23, 16, 45),
      searchType: "editeurs"
    },
    {
      id: 4,
      query: "Albert Camus",
      timestamp: new Date(2024, 10, 23, 10, 20),
      searchType: "auteurs"
    }
  ];

  if (!isVisible) return null;

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

    if (diffInHours < 24) {
      return format(date, "'aujourd'hui à' HH:mm", { locale: fr });
    } else if (diffInHours < 48) {
      return format(date, "'hier à' HH:mm", { locale: fr });
    } else {
      return format(date, "d MMMM 'à' HH:mm", { locale: fr });
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
      <div className="p-2">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2 text-[#335262]">
            <Clock className="w-4 h-4" />
            <span className="font-medium">Recherches récentes</span>
          </div>
          <button
            onClick={onClearHistory}
            className="text-sm text-gray-500 hover:text-[#335262] flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-50 transition-colors duration-200"
          >
            <Trash2 className="w-3 h-3" />
            <span>Effacer</span>
          </button>
        </div>

        <div className="mt-1">
          {recentSearches.map((search) => (
            <button
              key={search.id}
              onClick={() => onSelect(search)}
              className="w-full px-3 py-2.5 hover:bg-gray-50 flex items-start gap-3 group transition-colors duration-200 rounded-lg"
            >
              <Search className="w-4 h-4 text-gray-400 mt-0.5 group-hover:text-[#335262] transition-colors duration-200" />
              <div className="flex flex-col items-start">
                <span className="text-[#335262] text-sm font-medium">
                  {search.query}
                </span>
                <span className="text-xs text-gray-400">
                  {formatRelativeTime(search.timestamp)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 py-2 bg-gray-50 text-xs text-gray-500 flex items-center justify-center">
        Appuyez sur <kbd className="mx-1 px-1.5 py-0.5 bg-white border border-gray-300 rounded">↵</kbd> pour rechercher
      </div>
    </div>
  );
};

export default RecentSearchesDropdown;