import React, { useState, useEffect } from 'react';
import { Search, Book, User, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BookInfo {
  id_exemplaire: number;
  disponibilite: string;
  numero_carte: string;
  nom_adherent: string | null;
  date_emprunt: string;
  date_retour_prevue: string;
}

const BookReturnComponent: React.FC = () => {
  const [isbn, setIsbn] = useState('');
  const [bookInfos, setBookInfos] = useState<BookInfo[]>([]);
  const [returnMessage, setReturnMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedExemplaire, setSelectedExemplaire] = useState<number | null>(null);
  const [lastIsbn, setLastIsbn] = useState(''); // Pour éviter les recherches en double

  const handleScan = async (isbnToSearch: string) => {
    if (!isbnToSearch || isbnToSearch === lastIsbn) return;
    
    try {
      setLastIsbn(isbnToSearch);
      const response = await fetch(`/api/circulations/return-info/${isbnToSearch}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setBookInfos(data.data);
        setError('');
        setSelectedExemplaire(null);
      } else {
        setError('Aucune information trouvée pour cet ISBN');
        setBookInfos([]);
      }
    } catch (err) {
      setError('Erreur lors de la récupération des informations du livre');
      setBookInfos([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsbn(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isbn.trim()) {
      e.preventDefault();
      handleScan(isbn.trim());
    }
  };

  const handleReturn = async () => {
    if (selectedExemplaire === null) {
      setError('Veuillez sélectionner un exemplaire à retourner');
      return;
    }

    try {
      const response = await fetch('/api/circulations/retour', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exemplaireId: selectedExemplaire }),
      });
      
      if (!response.ok) throw new Error('Erreur lors du retour du livre');
      
      const data = await response.json();
      setReturnMessage(data.message);
      setBookInfos([]);
      setIsbn('');
      setSelectedExemplaire(null);
      setLastIsbn('');
    } catch (err) {
      setError('Erreur lors du retour du livre');
    }
  };

  useEffect(() => {
    const input = document.querySelector('input');
    if (input) {
      input.focus();
    }
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Retour de livre</h1>
      
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Scannez l'ISBN"
          value={isbn}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-grow"
          autoFocus
        />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {bookInfos.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            {bookInfos.length} exemplaire(s) trouvé(s). Veuillez sélectionner l'exemplaire à retourner :
          </p>
          
          {bookInfos.map((bookInfo) => (
            <Card 
              key={bookInfo.id_exemplaire}
              className={`mb-4 cursor-pointer transition-all ${
                selectedExemplaire === bookInfo.id_exemplaire 
                  ? 'ring-2 ring-primary'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedExemplaire(bookInfo.id_exemplaire)}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Book className="mr-2" />
                  Exemplaire #{bookInfo.id_exemplaire}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <p><strong>Disponibilité:</strong> {bookInfo.disponibilite}</p>
                  <p><strong>Numéro de carte:</strong> {bookInfo.numero_carte}</p>
                  <p><strong>Nom de l'adhérent:</strong> {bookInfo.nom_adherent || 'Non spécifié'}</p>
                  <p><strong>Date d'emprunt:</strong> {bookInfo.date_emprunt}</p>
                  <p className="col-span-2"><strong>Date de retour prévue:</strong> {bookInfo.date_retour_prevue}</p>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button 
            onClick={handleReturn} 
            className="w-full"
            disabled={selectedExemplaire === null}
          >
            <CheckCircle className="mr-2 h-4 w-4" /> 
            Confirmer le retour de l'exemplaire #{selectedExemplaire}
          </Button>
        </div>
      )}

      {returnMessage && (
        <Alert className="mt-4">
          <AlertDescription>{returnMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default BookReturnComponent;