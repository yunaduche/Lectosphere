import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import Toast from '../myui/Toast'

const LoadingDots = () => (
  <span className="loading-dots inline-block">
    <span className="dot opacity-0 inline-block mr-0.5 animate-loadingDot">.</span>
    <span className="dot opacity-0 inline-block mr-0.5 animate-loadingDot animation-delay-200">.</span>
    <span className="dot opacity-0 inline-block mr-0.5 animate-loadingDot animation-delay-400">.</span>
  </span>
);

const ExcelImport = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentListIndex, setCurrentListIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [toasts, setToasts] = useState<Array<{ type: 'success' | 'error' | 'warning' | 'hint', message: string, subMessage?: string }>>([]);
  
  const requiredFields = [
    "Adhesion N°",
    "Type d'Adhesion",
    "Fin d'Adhesion le",
    "Nom",
    "Adresse",
    "Quartier",
    "Téléphone",
    "Niveau scolaire",
    "Email"
    
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const arrayBuffer = evt.target?.result as ArrayBuffer;
        const wb = XLSX.read(arrayBuffer, { type: 'array' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json(ws);
        
        const filteredData = rawData.map((row: any) => {
          const filteredRow: any = {};
          requiredFields.forEach(field => {
            if (field === "Adhesion N°") {
              let suffix = '';
              switch (row["Type d'Adhesion"]) {
                case "Adhesion scolaire":
                  suffix = 'S';
                  break;
                case "Adhesion étudiant":
                  suffix = 'E';
                  break;
                case "Adhesion scolaire SEMIPI":
                  suffix = 'S';
                  break;
                case "Adhesion scolaire vacances ":
                  suffix = 'S';
                  break;
                case "Adhesion adulte":
                  suffix = 'A';
                  break;
                default:
                  suffix = '';
              }
              filteredRow[field] = `${row[field]}${suffix}`;
            } else {
              filteredRow[field] = row[field] || '';
            }
          });
          return filteredRow;
        });
        
        setData(filteredData);
        addToast('success', 'Fichier chargé avec succès', `${filteredData.length} adhérents trouvés`);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const sendBatch = async (batch: any[]) => {
    try {
      const transformedBatch = batch.map(adherent => ({
        nom: adherent["Nom"],
        numero_carte: adherent["Adhesion N°"],
        email: adherent["Email"],
        numero_telephone: adherent["Téléphone"],
        quartier: adherent["Quartier"],
        adresse: adherent["Adresse"],
        type_adhesion: adherent["Type d'Adhesion"],
        fin_adhesion: adherent["Fin d'Adhesion le"],
      }));

      const response = await axios.post('/api/adherents/batch', transformedBatch);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du lot:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`Erreur ${error.response.status}: ${error.response.data.message || 'Erreur inconnue'}`);
      } else {
        throw new Error('Erreur de réseau ou erreur inconnue');
      }
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setProgress(0);

    const batchSize = 100;
    const totalBatches = Math.ceil(data.length / batchSize);

    let createdCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    let errors: any[] = [];

    try {
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        try {
          const result = await sendBatch(batch);
          createdCount += result.createdAdherents.length;
          updatedCount += result.updatedAdherents.length;
          if (result.errors && result.errors.length > 0) {
            errorCount += result.errors.length;
            errors = errors.concat(result.errors.map((err: any) => ({
              ...err,
              adherent: batch[err.index]
            })));
          }
        } catch (batchError) {
          console.error('Erreur lors du traitement du lot:', batchError);
          errorCount += batch.length;
          errors.push({ error: batchError.message, adherents: batch });
        }
        setProgress(((i + batchSize) / data.length) * 100);
      }
      
      if (createdCount > 0 || updatedCount > 0) {
        addToast('success', 'Importation réussie', 
          `${createdCount} nouveaux adhérents créés, ${updatedCount} adhérents mis à jour`);
      }
      
      if (errorCount > 0) {
        addToast('warning', 'Attention', `${errorCount} erreurs rencontrées lors de l'importation`);
      }

      if (errors.length > 0) {
        console.log('Détails des erreurs:', errors);
        // Vous pouvez ajouter ici une logique pour afficher les détails des erreurs à l'utilisateur
      }
    } catch (error) {
      addToast('error', 'Erreur d\'importation', 'Une erreur générale est survenue lors de l\'importation des données');
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };


  const handleSwitchList = () => {
    setCurrentListIndex((prevIndex) => (prevIndex + 1) % Math.ceil(data.length / 30));
  };

  const getCurrentPageData = () => {
    const startIndex = currentListIndex * 30;
    return data.slice(startIndex, startIndex + 30);
  };

  const addToast = (type: 'success' | 'error' | 'warning' | 'hint', message: string, subMessage?: string) => {
    setToasts(prev => [...prev, { type, message, subMessage }]);
  };

  const removeToast = (index: number) => {
    setToasts(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 bg-white rounded-lg">
  <input
    type="file"
    onChange={handleFileUpload}
    accept=".xlsx, .xls"
    className="mb-6 block w-full text-sm text-gray-500
      file:mr-4 file:py-2.5 file:px-6
      file:rounded-lg file:border-0
      file:text-sm file:font-medium
      file:bg-[#335262] file:text-white
      hover:file:bg-[#335262]/90 transition-all"
  />
  {data.length > 0 && (
    <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-[#335262] text-white">
            {requiredFields.map((field) => (
              <TableHead key={field} className="px-6 py-4 text-sm font-medium text-white">
                {field}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {getCurrentPageData().map((row, index) => (
            <TableRow 
              key={index}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {requiredFields.map((field) => (
                <TableCell key={field} className="px-6 py-4 text-sm">
                  {row[field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center p-4 bg-gray-50 border-t border-gray-100">
        <p className="text-sm text-gray-600">
          Affichage de {currentListIndex * 30 + 1} à {Math.min((currentListIndex + 1) * 30, data.length)} sur {data.length} au total.
        </p>
        <Button
          onClick={handleSwitchList}
          className="bg-[#e7c568] hover:bg-[#e7c568]/90 text-[#335262] font-medium py-2.5 px-6 rounded-lg transition-colors"
        >
          Liste suivante
        </Button>
      </div>
      {isLoading && (
        <div className="p-4 bg-white border-t border-gray-100">
          <Progress 
            value={progress} 
            className="w-full h-2 bg-gray-100 rounded-full"
            indicatorClassName="bg-[#335262] rounded-full"
          />
          <p className="text-sm text-gray-600 mt-2">Progression : {progress.toFixed(2)}%</p>
        </div>
      )}
      <div className="p-4 bg-white border-t border-gray-100">
        <Button
          onClick={handleConfirm}
          disabled={isLoading}
          className="w-full bg-[#335262] hover:bg-[#335262]/90 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <LoadingDots /> : 'Confirmer l\'importation'}
        </Button>
      </div>
    </div>
  )}
  <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
    {toasts.map((toast, index) => (
      <Toast
        key={index}
        type={toast.type}
        message={toast.message}
        subMessage={toast.subMessage}
        onClose={() => removeToast(index)}
      />
    ))}
  </div>
</div>
  );
};

export default ExcelImport;