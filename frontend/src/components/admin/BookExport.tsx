import React, { useState } from 'react';
import { Book, FolderOpen, Database } from 'lucide-react';

interface ExportStatus {
  progress: number;
  isLoading: boolean;
  error?: string;
  success?: string;
  outputPath?: string;
}

const BookDataExport = () => {
  const [status, setStatus] = useState<ExportStatus>({
    progress: 0,
    isLoading: false
  });
  const [selectedPath, setSelectedPath] = useState<string>('');

  const selectDirectory = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      
      const response = await fetch('/api/backup/validate-directory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          dirName: dirHandle.name 
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la validation du dossier');
      }
  
      const data = await response.json();
      setSelectedPath(data.fullPath);
    
      const configResponse = await fetch('/api/backup/set-directory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          path: data.fullPath,
          name: dirHandle.name 
        }),
      });

      if (!configResponse.ok) {
        const errorData = await configResponse.json();
        throw new Error(errorData.error || 'Impossible de configurer le dossier de sauvegarde');
      }

    } catch (error) {
      console.error('Erreur:', error);
      setStatus(prev => ({
        ...prev,
        error: error instanceof Error ? 
          `Erreur lors de la sélection du dossier: ${error.message}` : 
          'Erreur lors de la sélection du dossier'
      }));
    }
  };

  const startExport = async () => {
    if (!selectedPath) {
      setStatus(prev => ({
        ...prev,
        error: 'Veuillez sélectionner un dossier de destination'
      }));
      return;
    }

    setStatus(prev => ({ ...prev, progress: 0, isLoading: true }));
    
    try {
      const interval = setInterval(() => {
        setStatus(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 500);

      const response = await fetch('/api/backup/export/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ outputPath: selectedPath }),
      });
      
      if (!response.ok) {
        throw new Error(`Export échoué: ${response.statusText}`);
      }

      clearInterval(interval);
      setStatus(prev => ({
        ...prev,
        progress: 100,
        isLoading: false,
        success: `Export des données des livres complété avec succès dans ${selectedPath}`,
        error: undefined,
        outputPath: selectedPath
      }));

      setTimeout(() => {
        setStatus(prev => ({ 
          ...prev, 
          success: undefined, 
          progress: 0 
        }));
      }, 3000);
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Export échoué',
        success: undefined
      }));
    }
  };

  return (
    <div className="w-full bg-white rounded-lg p-6 shadow-xl mb-6">
      {/* En-tête avec icônes explicites */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Book className="w-6 h-6 text-[#335262]" />
            <Database className="w-5 h-5 text-[#e7c568]" />
          </div>
          <h2 className="text-2xl font-bold text-[#335262]">Export des Données des notices</h2>
        </div>
       
        <p className="text-sm text-[#335262]/70 mt-1">
          Cette opération créera une sauvegarde contenant uniquement les enregistrements de la table notices
        </p>
      </div>

      {/* Sélection du dossier */}
      <div className="mb-6 items-center">
        <button
          onClick={selectDirectory}
          disabled={status.isLoading}
          className="flex items-center justify-center gap-2 p-3 bg-[#335262] hover:bg-[#335262] rounded-lg transition-all duration-300 w-full"
        >
          <FolderOpen className="w-5 h-5 text-[#e7c568]" />
          <span className="text-white font-medium">
            {selectedPath 
              ? `Dossier sélectionné: ${selectedPath}`
              : 'Choisir le dossier de destination'}
          </span>
        </button>
      </div>

      {/* Bouton d'export */}
      <div className="mb-6">
        <button
          onClick={startExport}
          disabled={status.isLoading || !selectedPath}
          className="w-full relative overflow-hidden rounded-lg p-4
            bg-[#335262] hover:bg-[#111646]
            transition-all duration-300 ease-out
            disabled:opacity-50 disabled:cursor-not-allowed
            group"
        >
          <div className="flex items-center gap-2 justify-center">
            <Book className="w-5 h-5 text-[#e7c568]" />
            <span className="text-white font-medium">Exporter les données des livres</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-[#e7c568] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </button>
      </div>

      {/* Barre de progression */}
      {status.isLoading && (
        <div className="space-y-3">
          <div className="flex justify-between text-[#335262]">
            <span>Export des données des livres en cours...</span>
            <span>{status.progress}%</span>
          </div>
          <div className="relative h-3 bg-[#335262]/20 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[#e7c568] rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${status.progress}%`,
                boxShadow: '0 0 20px rgba(231, 197, 104, 0.5)'
              }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>
      )}

      
      {status.error && (
        <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-[#335262]">{status.error}</p>
        </div>
      )}

      {status.success && (
        <div className="mt-4 p-4 bg-[#e7c568]/20 border border-[#e7c568]/50 rounded-lg">
          <p className="text-[#335262]">{status.success}</p>
        </div>
      )}
    </div>
  );
};

export default BookDataExport;