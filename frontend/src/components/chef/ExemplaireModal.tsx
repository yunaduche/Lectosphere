import React, { useState, useMemo } from 'react';
import { Search, X, BookOpen } from 'lucide-react';

interface Exemplaire {
  id_exemplaire: number;
  id_livre: number;
  isbn: string;
  disponibilite: boolean;
  format: string;
  derniers_emprunteurs: string;
  emprunteur_numero_carte: string;
  titre: string;
  date_emprunt: string;
  date_retour_prevue: string;
  bibliothecaire_emprunt_id: number;
  section: string;
  date_creation: string;
  auteurs: string;
  code_barre: string;
  preteur_username: string;
}

interface ExemplaireModalProps {
  exemplaires: Exemplaire[];
  onClose: () => void;
}

const ExemplaireModal: React.FC<ExemplaireModalProps> = ({ exemplaires, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  const safeString = (value: any): string => {
    if (typeof value === 'string') return value;
    if (value === null || value === undefined) return '';
    return String(value);
  };

  const containsSearchTerm = (text: any, term: string): boolean => {
    const safeText = safeString(text);
    return safeText.toLowerCase().includes(term.toLowerCase());
  };

  const sections = useMemo(() => {
    const uniqueSections = Array.from(new Set(exemplaires.map(ex => safeString(ex.section))));
    return ['Toutes les sections', ...uniqueSections];
  }, [exemplaires]);

  const filteredExemplaires = useMemo(() => {
    return exemplaires.filter(ex => {
      const matchesSearch = searchTerm === '' || 
        containsSearchTerm(ex.titre, searchTerm) ||
        containsSearchTerm(ex.isbn, searchTerm) ||
        containsSearchTerm(ex.auteurs, searchTerm);
      
      const matchesSection = 
        selectedSection === 'Toutes les sections' || 
        selectedSection === '' || 
        safeString(ex.section) === selectedSection;

      return matchesSearch && matchesSection;
    });
  }, [exemplaires, searchTerm, selectedSection]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col m-4">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-[#335262]" />
              <h2 className="text-2xl font-semibold text-[#335262]">Exemplaires</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher par titre, ISBN ou auteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e7c568] focus:border-transparent"
              />
            </div>

            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e7c568] focus:border-transparent bg-white min-w-[200px]"
            >
              {sections.map((section, index) => (
                <option key={index} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-auto flex-1 p-6">
          <div className="ring-1 ring-gray-200 rounded-lg overflow-hidden">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left font-semibold text-[#335262] border-b">Titre</th>
                  <th className="py-3 px-4 text-left font-semibold text-[#335262] border-b">ISBN</th>
                  <th className="py-3 px-4 text-left font-semibold text-[#335262] border-b">Section</th>
                  <th className="py-3 px-4 text-left font-semibold text-[#335262] border-b">Disponibilité</th>
                  <th className="py-3 px-4 text-left font-semibold text-[#335262] border-b">Format</th>
                  <th className="py-3 px-4 text-left font-semibold text-[#335262] border-b">Auteurs</th>
                </tr>
              </thead>
              <tbody>
                {filteredExemplaires.map((ex) => (
                  <tr key={ex.id_exemplaire} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b border-gray-100">{safeString(ex.titre)}</td>
                    <td className="py-3 px-4 border-b border-gray-100">{safeString(ex.isbn)}</td>
                    <td className="py-3 px-4 border-b border-gray-100">{safeString(ex.section)}</td>
                    <td className="py-3 px-4 border-b border-gray-100">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        ex.disponibilite 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {ex.disponibilite ? 'Disponible' : 'Indisponible'}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100">{safeString(ex.format)}</td>
                    <td className="py-3 px-4 border-b border-gray-100">{safeString(ex.auteurs)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExemplaireModal;