
interface Emprunt {
    id_emprunt: number;
    numero_carte: string;
    code_barre_exemplaire: string;
    id_exemplaire: number;
    titre: string;
    date_emprunt: string;
    date_retour_prevue: string;
    date_retour_effective: string | null;
    nombre_renouvellement: number;
    username_bibliothecaire: string;
    statut_emprunt: string;
    est_retard: boolean;
  }
  
 
  import React, { useState, useEffect } from 'react';
  import { Search, Info } from 'lucide-react';
  
  const GestionEmprunts: React.FC = () => {
    const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
    const [filteredEmprunts, setFilteredEmprunts] = useState<Emprunt[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'tous' | 'en_cours' | 'en_retard'>('tous');
  
    useEffect(() => {
      fetchEmprunts();
    }, []);
  
    const fetchEmprunts = async () => {
      try {
        const response = await fetch('/api/listemprunt');
        const data = await response.json();
        if (data.success) {
          setEmprunts(data.data);
          setFilteredEmprunts(data.data);
          setTotalCount(data.count);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des emprunts:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      let filtered = emprunts;
  
      if (filter === 'en_cours') {
        filtered = emprunts.filter(e => e.statut_emprunt === 'en_cours' && !e.est_retard);
      } else if (filter === 'en_retard') {
        filtered = emprunts.filter(e => e.est_retard);
      }
  
      if (searchTerm) {
        filtered = filtered.filter(e => 
          e.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.numero_carte.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.username_bibliothecaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.code_barre_exemplaire.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
  
      setFilteredEmprunts(filtered);
    }, [searchTerm, filter, emprunts]);
  
    const formatDate = (date: string | null) => {
      if (!date) return 'Non retourné';
      return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };
  
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }
  
    return (
      <div className="p-6 max-w-full mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
           
            <div className="bg-blue-50 rounded-lg px-4 py-2 flex items-center">
              <Info className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-blue-700 font-medium">Total: {totalCount} emprunts</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher par titre, numéro de carte, code barre..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              {['tous', 'en_cours', 'en_retard'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption as any)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === filterOption
                      ? 'bg-[#335262] text-white'
                      : 'bg-[#111646] text-white hover:bg-gray-200'
                  }`}
                >
                  {filterOption.replace('_', ' ').charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
  
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#335262]">
              <tr>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white text-gray-500 uppercase">Titre</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 text-white uppercase">N° Carte</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 text-white text-white uppercase">Code Barre</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 text-white uppercase">ID Exemplaire</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 text-white uppercase">Date Emprunt</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 text-white uppercase">Retour Prévu</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase text-white ">Retour Effectif</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 text-white uppercase">Renouvellements</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 text-white uppercase">Bibliothécaire</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 text-white uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmprunts.map((emprunt) => (
                <tr key={emprunt.id_emprunt} className="hover:bg-gray-50">
                  
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{emprunt.titre}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{emprunt.numero_carte}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{emprunt.code_barre_exemplaire}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{emprunt.id_exemplaire}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(emprunt.date_emprunt)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(emprunt.date_retour_prevue)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {emprunt.date_retour_effective ? formatDate(emprunt.date_retour_effective) : 
                      <span className="text-yellow-600">Non retourné</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{emprunt.nombre_renouvellement}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{emprunt.username_bibliothecaire}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      emprunt.est_retard
                        ? 'bg-red-100 text-red-800'
                        : emprunt.statut_emprunt === 'en_cours'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {emprunt.est_retard ? 'En retard' : emprunt.statut_emprunt.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default GestionEmprunts;