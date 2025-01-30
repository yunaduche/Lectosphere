import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Mistral } from '@mistralai/mistralai';
import { RootState } from '../../hooks-redux/store';
import { BookForm } from './AddBook/BookForm';
import { ExistingBookDialog } from './AddBook/ExistingBookDialog';
import { BookInfo, ExistingBookInfo, initialFormData } from '../../hooks-redux/type/BookTypes';

const AddBook: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState<BookInfo>(initialFormData);
  const [isbnBuffer, setIsbnBuffer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingBookInfo, setIsFetchingBookInfo] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; content: string } | null>(null);
  const [showExistingBookDialog, setShowExistingBookDialog] = useState(false);
  const [existingBook, setExistingBook] = useState<ExistingBookInfo | null>(null);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [keywordError, setKeywordError] = useState<string | null>(null);
  const bufferTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isbnInputRef = useRef<HTMLInputElement>(null);
  
  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY as string;
  const client = new Mistral({ apiKey });

  useEffect(() => {
    if (isbnInputRef.current) {
      isbnInputRef.current.focus();
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key >= '0' && event.key <= '9') {
        setIsbnBuffer(prev => prev + event.key);
        
        if (bufferTimeoutRef.current) {
          clearTimeout(bufferTimeoutRef.current);
        }

        bufferTimeoutRef.current = setTimeout(() => {
          if (isbnBuffer.length === 13) {
            handleIsbnComplete(isbnBuffer);
          }
          setIsbnBuffer('');
        }, 100);
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [isbnBuffer]);

  const checkIsbnExists = async (isbn: string) => {
    try {
      const response = await fetch(`/api/books/search?isbn=${isbn}`);
      const data = await response.json();
      
      if (data.books && data.books.length > 0) {
        setExistingBook(data.books[0]);
        setShowExistingBookDialog(true);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'ISBN:', error);
      setMessage({
        type: 'error',
        content: 'Erreur lors de la vérification de l\'ISBN'
      });
    }
  };

  const checkTitleExists = async (titre: string) => {
    try {
      const response = await fetch(`/api/books/search?titre=${titre}`);
      const data = await response.json();
      
      if (data.books && data.books.length > 0) {
        setExistingBook(data.books[0]);
        setShowExistingBookDialog(true);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du titre:', error);
      setMessage({
        type: 'error',
        content: 'Erreur lors de la vérification du titre'
      });
    }
  };

  const handleIsbnComplete = async (isbn: string) => {
    setFormData(prev => ({ ...prev, isbn }));
    await Promise.all([
      checkIsbnExists(isbn),
      fetchGoogleBooksInfo(isbn)
    ]);
  };

  const fetchGoogleBooksInfo = async (isbn: string) => {
    setIsFetchingBookInfo(true);
    setMessage(null);
    
    try {
      const response = await fetch(`http://localhost:9999/api/book-search/search/${isbn}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des informations du livre');
      }
  
      const bookData = await response.json();
  
      if (bookData) {
        setFormData(prev => ({
          ...prev,
          titre: bookData.titre || '',
          auteurs: bookData.auteurs || [],
          editeurs: bookData.editeur ? [bookData.editeur] : [],
          date_publication: bookData.datePublication || '',
          nombre_pages: parseInt(bookData.nbPages) || 0,
          langue: bookData.langues || '',
          url_photo: bookData.images?.thumbnail || bookData.images?.small || '',
          description: bookData.description || ''
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
      setMessage({
        type: 'error',
        content: 'Impossible de récupérer les informations du livre'
      });
    } finally {
      setIsFetchingBookInfo(false);
    }
  };

  const generateKeywords = async (description: string) => {
    if (!description.trim()) return;

    setIsGeneratingKeywords(true);
    setKeywordError(null);

    try {
      const chatResponse = await client.chat.complete({
        model: 'mistral-large-latest',
        messages: [{ 
          role: 'user', 
          content: `Tu es un expert en bibliothèque. Génère exactement 7 mots-clés pertinents (sans les numéros) pour ce livre, séparés par des virgules. Voici la description : ${description}` 
        }],
      });

      if (chatResponse.choices?.[0]?.message?.content) {
        const generatedKeywords = chatResponse.choices[0].message.content
          .split(',')
          .map(keyword => keyword.trim())
          .filter(keyword => keyword);

        if (generatedKeywords.length > 0) {
          setFormData(prev => ({
            ...prev,
            mots_cle: generatedKeywords
          }));
        } else {
          throw new Error('Aucun mot-clé n\'a été généré');
        }
      }
    } catch (error) {
      setKeywordError(error instanceof Error ? error.message : 'Erreur lors de la génération des mots-clés');
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  const handleGenerateKeywords = () => {
    if (formData.description) {
      generateKeywords(formData.description);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'isbn' && (value.length === 13 || value.length === 10)) {
      handleIsbnComplete(value);
    }
    
    if (name === 'auteurs' || name === 'editeurs' || name === 'mots_cle') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value.split(',').map(item => item.trim()) 
      }));
    } else if (name === 'nombre_pages') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: parseInt(value) || 0 
      }));
    } else if (name === 'date_publication') {
      const yearValue = value.trim();
      if (yearValue === '' || (yearValue.length === 4 && /^\d{4}$/.test(yearValue))) {
        setFormData(prev => ({ ...prev, [name]: yearValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (!user) {
      setMessage({ 
        type: 'error', 
        content: 'Vous devez être connecté pour ajouter un livre'
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          bookInfo: formData,
          username: user.username
        })
      });

      const data = await response.json();

      if (response.status === 409) {
        setExistingBook(data.book);
        setShowExistingBookDialog(true);
      } else if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'enregistrement du livre');
      } else {
        setMessage({ 
          type: 'success', 
          content: data.message || 'Livre enregistré avec succès!' 
        });
        setFormData(initialFormData);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ 
        type: 'error', 
        content: error instanceof Error ? error.message : 'Erreur lors de l\'enregistrement du livre'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewExemplaire = async () => {
    setIsLoading(true);
    
    if (!existingBook || !existingBook.isbn) {
      setMessage({ 
        type: 'error', 
        content: 'ISBN du livre existant non trouvé' 
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/books/add-exemplaire', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          isbn: existingBook.isbn,
          username: user?.username
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'ajout de l\'exemplaire');
      }

      setMessage({ 
        type: 'success', 
        content: 'Nouvel exemplaire ajouté avec succès!' 
      });
      setShowExistingBookDialog(false);
      setFormData(initialFormData);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ 
        type: 'error', 
        content: error instanceof Error ? error.message : 'Erreur lors de l\'ajout de l\'exemplaire'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BookForm
        formData={formData}
        setFormData={setFormData}
        isLoading={isLoading}
        isFetchingBookInfo={isFetchingBookInfo}
        message={message}
        isGeneratingKeywords={isGeneratingKeywords}
        keywordError={keywordError}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        handleGenerateKeywords={handleGenerateKeywords}
        handleIsbnComplete={handleIsbnComplete}
        checkTitleExists={checkTitleExists}
      />
      
      <ExistingBookDialog
        showDialog={showExistingBookDialog}
        setShowDialog={setShowExistingBookDialog}
        existingBook={existingBook}
        onAddExemplaire={handleAddNewExemplaire}
      />
    </>
  );
};

export default AddBook;