import React, { useState } from 'react';
import { AlertCircle, BookOpen } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { QuickInfo, DetailedInfo } from '../extra/AdherentsDetail';

const CirculationComponent = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [adherentInfo, setAdherentInfo] = useState(null);
  const [isbn, setIsbn] = useState('');
  const [exemplarId, setExemplarId] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const bibliothecaireId = useSelector((state) => state.auth.user?.id);

  const fetchAdherentInfo = async () => {
    try {
      const response = await axios.get(`/api/circulations/adherent/${cardNumber}`);
      setAdherentInfo(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors de la recherche de l\'adhérent');
      setAdherentInfo(null);
    }
  };

  const handleBorrow = async () => {
    if (!adherentInfo) {
      setError('Veuillez d\'abord rechercher un adhérent');
      return;
    }
    try {
      const response = await axios.post('/api/circulations/emprunt', {
        adherentId: adherentInfo.id,
        exemplaireId: exemplarId,
        bibliothecaireId
      });
      setSuccess(`Livre "${response.data.livre.titre}" emprunté avec succès`);
      setError(null);
      fetchAdherentInfo();
    } catch (err) {
      setError('Erreur lors de l\'emprunt du livre');
      setSuccess(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Numéro de carte"
            className="flex-1 p-2 border rounded"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <button
            onClick={fetchAdherentInfo}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Rechercher
          </button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4">
          <BookOpen className="h-4 w-4" />
          <AlertTitle>Succès</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {adherentInfo && (
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-pointer">
              <QuickInfo adherent={adherentInfo} />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Détails de l'adhérent</DialogTitle>
            </DialogHeader>
            <DetailedInfo 
              adherent={adherentInfo} 
              onBorrow={handleBorrow} 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CirculationComponent;