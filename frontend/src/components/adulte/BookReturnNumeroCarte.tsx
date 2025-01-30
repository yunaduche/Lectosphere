import { useState } from 'react';
import { Search, Book, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Book {
  id_exemplaire: number;
  isbn: string;
  titre: string;
  date_emprunt: string;
  date_retour_prevue: string;
}

const BookReturn = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const searchAdherent = async () => {
    setError('');
    setMessage('');
    try { 
      const response = await fetch(`/api/circulations/adherent-books/${cardNumber}`);
      if (!response.ok) throw new Error('Adhérent non trouvé');
      const data = await response.json();
      setBooks(data.data);
    } catch (error) {
      setError('Erreur lors de la recherche de l\'adhérent');
    }
  };

  const returnBook = async () => {
    if (!selectedBook) return;
    try {
      const response = await fetch('/api/circulations/retour-exemplaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exemplaireId: selectedBook.id_exemplaire }),
      });
      if (!response.ok) throw new Error('Erreur lors du retour du livre');
      const data = await response.json();
      setMessage(data.message);
      setBooks(books.filter(book => book.id_exemplaire !== selectedBook.id_exemplaire));
      setSelectedBook(null);
    } catch (error) {
      setError('Erreur lors du retour du livre');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold mb-4">Retour de livre</h2>
      
      <div className="flex space-x-2">
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="Numéro de carte"
          className="flex-grow px-3 py-2 border rounded-md"
        />
        <button
          onClick={searchAdherent}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {books.length > 0 && !selectedBook && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Livres empruntés :</h3>
          {books.map((book) => (
            <div
              key={book.id_exemplaire}
              className="flex justify-between items-center p-2 border rounded-md hover:bg-gray-100 cursor-pointer"
              onClick={() => setSelectedBook(book)}
            >
              <div>
                <p className="font-medium">{book.titre}</p>
                <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
              </div>
              <Book className="w-5 h-5 text-blue-500" />
            </div>
          ))}
        </div>
      )}

      {selectedBook && (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedBook(null)}
            className="flex items-center text-blue-500 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour à la liste
          </button>
          <h3 className="text-lg font-semibold">Détails du livre :</h3>
          <p><strong>Titre :</strong> {selectedBook.titre}</p>
          <p><strong>ISBN :</strong> {selectedBook.isbn}</p>
          <p><strong>Date d'emprunt :</strong> {selectedBook.date_emprunt}</p>
          <p><strong>Date de retour prévue :</strong> {selectedBook.date_retour_prevue}</p>
          <button
            onClick={returnBook}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Retourner ce livre
          </button>
        </div>
      )}
    </div>
  );
};

export default BookReturn;