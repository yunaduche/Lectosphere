import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, Filter, User, Search, ChevronDown, ChevronUp } from 'lucide-react';
import moment from 'moment';
import SearchBar from '../myui/SearchBar'
import ModernSelect from '../myui/Select';
import CustomDatePicker from '../myui/CustomDate'
import 'moment/locale/fr';

const EVENT_TYPES = {
  modification_livre: { label: 'Modification Notice', color: 'bg-blue-100 text-blue-700 border border-blue-300' },
  suppression_livre: { label: 'Suppression Notice', color: 'bg-red-100 text-red-700 border border-red-300' },
  suppression_exemplaire: { label: 'Suppression Exemplaire', color: 'bg-red-50 text-red-600 border border-red-200' },
  ouverture_session_acquisition: { label: 'Ouverture Session', color: 'bg-green-100 text-green-700 border border-green-300' },
  fermeture_session_acquisition: { label: 'Fermeture Session', color: 'bg-yellow-100 text-yellow-700 border border-yellow-300' },
  emprunt: { label: 'Emprunt', color: 'bg-purple-100 text-purple-700 border border-purple-300' },
  retour: { label: 'Retour', color: 'bg-indigo-100 text-indigo-700 border border-indigo-300' },
  renouvellement: { label: 'Renouvellement', color: 'bg-orange-100 text-orange-700 border border-orange-300' }
};

const DiffViewer = ({ oldData, newData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const VISIBLE_ITEMS = 2;

  const changes = Object.entries(newData).reduce((acc, [key, newValue]) => {
    const oldValue = oldData[key];
    if (formatValue(oldValue) !== formatValue(newValue)) {
      acc.push({ field: key, old: oldValue, new: newValue });
    }
    return acc;
  }, []);

  if (changes.length === 0) return <span className="text-gray-500">Aucune modification</span>;

  const visibleChanges = isExpanded ? changes : changes.slice(0, VISIBLE_ITEMS);
  const hasMoreChanges = changes.length > VISIBLE_ITEMS;
  

  return (
    <div className="space-y-1.5">
      {visibleChanges.map(({ field, old, new: newVal }, index) => (
        <div key={index} className="text-sm flex items-baseline gap-2">
          <span className="font-medium min-w-[100px]">{formatFieldName(field)}:</span>
          <div className="flex gap-2 items-center">
            <span className="text-red-600 line-through">{formatValue(old)}</span>
            <span className="text-gray-400">→</span>
            <span className="text-green-600">{formatValue(newVal)}</span>
          </div>
        </div>
      ))}
      
      {hasMoreChanges && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mt-1"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Voir moins
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Voir {changes.length - VISIBLE_ITEMS} modification{changes.length - VISIBLE_ITEMS > 1 ? 's' : ''} supplémentaire{changes.length - VISIBLE_ITEMS > 1 ? 's' : ''}
            </>
          )}
        </button>
      )}
    </div>
  );
};


const formatFieldName = field => ({
  isbn: 'ISBN', titre: 'Titre', format: 'Format', langue: 'Langue',
  auteurs: 'Auteurs', section: 'Section', editeurs: 'Éditeurs',
  mots_cle: 'Mots-clés', categorie: 'Catégorie', url_photo: 'Photo',
  description: 'Description', nombre_pages: 'Pages',
  date_catalogage: 'Date catalogage', date_publication: 'Date publication',
  catalogueur_username: 'Catalogueur'
})[field] || field;
const next = ">>"
  const prev= "<<"

const formatValue = value => {
  if (value === null) return 'Non renseigné';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
  if (value instanceof Date) return moment(value).format('DD/MM/YYYY HH:mm');
  return String(value);
};

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('search');
  const [selectedDate, setSelectedDate] = useState(moment());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useState({
    eventType: '',
    startDate: '',
    endDate: '',
    username: '',
    limit: 15,
    offset: 0
  });

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let endpoint = '/api/logs/';
      let params = new URLSearchParams();

      switch (viewMode) {
        case 'today':
          endpoint += 'today';
          break;
        case 'date':
          endpoint += `date/${selectedDate.format('YYYY-MM-DD')}`;
          break;
        case 'search':
          endpoint += 'search';
          params = new URLSearchParams({ ...searchParams, query: searchQuery });
          break;
        default:
          endpoint += 'recent';
      }

      const response = await fetch(`${endpoint}?${params}`);
      if (!response.ok) throw new Error('Erreur lors du chargement des logs');
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [viewMode, selectedDate, searchParams, searchQuery]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="px-6 py-4">
      {/* Header avec les filtres */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
          <button
  onClick={() => setViewMode('search')}
  className={`relative overflow-hidden flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors
    ${viewMode === 'search' ? 'text-white' : 'text-black hover:text-[#e7c568]'}`}
  style={{ border: viewMode === 'search' ? '4px solid #335262' : 'none' }}
>
  <span
    className={`absolute inset-0 bg-[#e7c568] transform transition-transform duration-300 ${
      viewMode === 'search' ? 'translate-x-0' : '-translate-x-full'
    }`}
  ></span>
  <span className="relative flex items-center z-10">
    <Filter className="w-4 h-4 mr-2" />
    Recherche
  </span>
</button>

<button
  onClick={() => setViewMode('today')}
  className={`relative overflow-hidden flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors
    ${viewMode === 'today' ? 'text-white' : 'text-black hover:text-[#e7c568]'}`}
  style={{ border: viewMode === 'today' ? '4px solid #335262' : 'none' }}
>
  <span
    className={`absolute inset-0 bg-[#e7c568] transform transition-transform duration-300 ${
      viewMode === 'today' ? 'translate-x-0' : '-translate-x-full'
    }`}
  ></span>
  <span className="relative flex items-center z-10">
    <Clock className="w-4 h-4 mr-2" />
    Aujourd'hui
  </span>
</button>

<button
  onClick={() => setViewMode('date')}
  className={`relative overflow-hidden flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors
    ${viewMode === 'date' ? 'text-white' : 'text-black hover:text-[#e7c568]'}`}
  style={{ border: viewMode === 'date' ? '4px solid #335262' : 'none' }}
>
  <span
    className={`absolute inset-0 bg-[#e7c568] transform transition-transform duration-300 ${
      viewMode === 'date' ? 'translate-x-0' : '-translate-x-full'
    }`}
  ></span>
  <span className="relative flex items-center z-10">
    <Calendar className="w-4 h-4 mr-2" />
    Par date
  </span>
</button>

          </div>
        </div>

        <div className="flex gap-4">
        <div className="flex-1 relative">

<Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

<SearchBar

  id="global-search"

  value={searchQuery}

  onChange={(e) => setSearchQuery(e.target.value)}

  placeholder="Recherche globale..."

/>

</div>

          {viewMode === 'search' && (
            <>
              
                <ModernSelect 
                value={searchParams.eventType}
                onChange={(e) => setSearchParams(prev => ({ ...prev, eventType: e.target.value }))}
                data={EVENT_TYPES}
                />
             <CustomDatePicker
  value={searchParams.startDate}
  onChange={(date) =>
    setSearchParams((prev) => ({
      ...prev,
      startDate: date.toISOString().split('T')[0], // Format ISO (YYYY-MM-DD)
    }))
  }
  className="mb-4"
/>
            </>
          )}

          {viewMode === 'date' && (
              <CustomDatePicker 
      value={selectedDate}
      onChange={setSelectedDate}
      className="w-64"
    />
          )}
        </div>
      </div>

      {/* Table des logs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#335262] border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Utilisateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log, index) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {moment(log.timestamp).format('DD/MM/YYYY HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${EVENT_TYPES[log.event_type]?.color || 'bg-gray-100'}`}>
                      {EVENT_TYPES[log.event_type]?.label || log.event_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <DiffViewer oldData={log.details?.anciens_champs || {}} newData={log.details?.nouveaux_champs || {}} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t">
          <div className="flex items-center">
            <span className="text-sm text-gray-700">
              Affichage de {searchParams.offset + 1} à {Math.min(searchParams.offset + searchParams.limit, searchParams.offset + logs.length)} entrées
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSearchParams(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }))}
              disabled={searchParams.offset === 0}
              className="px-4 py-2 text-sm font-medium rounded-md border 
                       disabled:bg-gray-100 disabled:text-gray-400
                       enabled:hover:bg-gray-50 enabled:text-gray-700"
            >
              {prev}
            </button>
            <button
              onClick={() => setSearchParams(prev => ({ ...prev, offset: prev.offset + prev.limit }))}
              disabled={logs.length < searchParams.limit}
              className="px-4 py-2 text-sm font-medium rounded-md border
                       disabled:bg-gray-100 disabled:text-gray-400
                       enabled:hover:bg-gray-50 enabled:text-gray-700"
            >
              {next}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogViewer;