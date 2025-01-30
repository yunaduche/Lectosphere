import React, { useState, useEffect, useRef } from 'react';
import { Search, Book, User, Building, Calendar, Hash, Globe, BookOpen, Tag, BarChart, Camera, FileText, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mistral } from '@mistralai/mistralai';
import { deweyClasses } from '../../hooks-redux/type/deweyCategorie'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSelector } from 'react-redux';
import { RootState } from '../../hooks-redux/store';

interface BookInfo {
  isbn: string;
  titre: string;
  auteurs: string[];
  editeurs: string[];
  format: 'lecture sur place' | 'empruntable';
  date_publication: string;
  nombre_pages: number;
  categorie: string;
  langue: string;
  mots_cle: string[];
  numero_classe: '',
  description: string;
  url_photo: string;
  section: 'adulte' | 'jeunesse';
  nombre_exemplaires: number;
}

interface ExistingBookInfo extends BookInfo {
  nombre_exemplaires: number;
}



const initialFormData: BookInfo = {
  isbn: '',
  titre: '',
  auteurs: [],
  editeurs: [],
  format: 'empruntable',
  date_publication: '',
  nombre_pages: 0,
  categorie: '',
  langue: '',
  mots_cle: [],
  description: '',
  url_photo: '',
  numero_classe: '',
  section: 'adulte',
  nombre_exemplaires: 1
};



interface AddBookProps {
  userRole: 'bibliothecaire_jeunesse' | 'bibliothecaire_adulte';
  username: string;
}

const AddBook: React.FC = () => {
  const { user, userRole } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState<BookInfo>(initialFormData);
  const [isbnBuffer, setIsbnBuffer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingBookInfo, setIsFetchingBookInfo] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; content: string } | null>(null);
  const [showExistingBookDialog, setShowExistingBookDialog] = useState(false);
  const [existingBook, setExistingBook] = useState<ExistingBookInfo | null>(null);
  const bufferTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isbnInputRef = useRef<HTMLInputElement>(null);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [keywordError, setKeywordError] = useState<string | null>(null);
  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY as string;
  const [showExemplairesDialog, setShowExemplairesDialog] = useState(false);
  const [nombreExemplaires, setNombreExemplaires] = useState(1);
  const [isAddingExemplaires, setIsAddingExemplaires] = useState(false);

  
 
  const renderTitleInput = () => (
    <div className="space-y-1">
      <Label htmlFor="titre" className="text-sm font-medium text-gray-700">Titre</Label>
      <div className="flex">
        <div className="relative flex-1">
          <div className="absolute top-2 left-2 pointer-events-none">
            <Book className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            id="titre"
            name="titre"
            value={formData.titre}
            onChange={handleInputChange}
            className="pl-8"
            placeholder="Titre du livre"
          />
        </div>
        <Button
          type="button"
          onClick={() => checkTitleExists(formData.titre)}
          disabled={!formData.titre}
          className="ml-2"
          variant="outline"
        >
          Vérifier
        </Button>
      </div>
    </div>
  );
  
  const checkTitleExists = async (titre: string) => {
    try {
      const response = await fetch(`/api/books/search?titre=${titre}`);
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
  


  const debugLog = (message: string, data?: any) => {
    console.log(`[Debug] ${message}`, data || '');
  };

  const generateKeywords = async (description: string) => {
    debugLog('Début de generateKeywords avec description:', description);
    
    if (!description.trim()) {
      debugLog('Description vide, annulation');
      return;
    }

    setIsGeneratingKeywords(true);
    setKeywordError(null);

    try {
      debugLog('Tentative de connexion à l\'API Mistral');
      const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
      
      if (!apiKey) {
        throw new Error('Clé API Mistral non trouvée');
      }

      const client = new Mistral({ apiKey });
      
      debugLog('Envoi de la requête à l\'API Mistral');
      const chatResponse = await client.chat.complete({
        model: 'mistral-large-latest',
        messages: [{ 
          role: 'user', 
          content: `Tu es un expert en bibliothèque. Génère exactement 7 mots-clés pertinents (sans les numéros) pour ce livre, séparés par des virgules. Voici la description : ${description}` 
        }],
      });

      debugLog('Réponse reçue de l\'API:', chatResponse);

      if (chatResponse.choices?.[0]?.message?.content) {
        const generatedKeywords = chatResponse.choices[0].message.content
          .split(',')
          .map(keyword => keyword.trim())
          .filter(keyword => keyword); 

        debugLog('Mots-clés générés:', generatedKeywords);

        if (generatedKeywords.length > 0) {
          setFormData(prev => {
            debugLog('Mise à jour du formData avec les nouveaux mots-clés');
            return {
              ...prev,
              mots_cle: generatedKeywords
            };
          });
        } else {
          throw new Error('Aucun mot-clé n\'a été généré');
        }
      } else {
        throw new Error('La réponse de l\'API ne contient pas les données attendues');
      }
    } catch (err) {
      debugLog('Erreur lors de la génération des mots-clés:', err);
      setKeywordError(err instanceof Error ? err.message : 'Erreur lors de la génération des mots-clés');
    } finally {
      setIsGeneratingKeywords(false);
      debugLog('Fin de la génération des mots-clés');
    }
  };

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

  const ExistingBookDialog = () => (
    <AlertDialog open={showExistingBookDialog} onOpenChange={setShowExistingBookDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Livre déjà existant</AlertDialogTitle>
          <AlertDialogDescription>
            {existingBook && (
              <div className="space-y-2">
                <p>Un livre avec cet ISBN existe déjà dans la bibliothèque :</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Titre : {existingBook.titre}</li>
                  <li>ISBN : {existingBook.isbn}</li>
                  <li>Auteurs : {existingBook.auteurs.join(', ')}</li>
                  <li>Nombre d'exemplaires : {existingBook.nombre_exemplaires}</li>
                  <li>Section : {existingBook.section}</li>
                </ul>
                <p>Voulez-vous ajouter des exemplaires ?</p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            setShowExemplairesDialog(true);
            setShowExistingBookDialog(false);
          }}>
            Ajouter des exemplaires
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  //  Dialog pour le nombre d'exemplaires
  const ExemplairesDialog = () => (
    <Dialog open={showExemplairesDialog} onOpenChange={setShowExemplairesDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter des exemplaires</DialogTitle>
          <DialogDescription>
            Spécifiez le nombre d'exemplaires à ajouter pour ce livre
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nombreExemplaires">Nombre d'exemplaires</Label>
            <Input
              id="nombreExemplaires"
              type="number"
              min="1"
              max="100" //
              value={nombreExemplaires}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value > 0) {
                  setNombreExemplaires(value);
                }
              }}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setShowExemplairesDialog(false);
              setNombreExemplaires(1);
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleAddNewExemplaire}
            disabled={isAddingExemplaires || nombreExemplaires < 1}
          >
            {isAddingExemplaires ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              'Confirmer'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  const handleGenerateKeywords = () => {
    if (formData.description) {
      generateKeywords(formData.description);
    }
  };

 
  const handleDeweyChange = (value: string) => {
  
    const cleanValue = value.replace(/\D/g, '').slice(0, 3);
    
    if (cleanValue.length === 3) {
      const deweyClass = deweyClasses.find(item => item.code === cleanValue);
      if (deweyClass) {
        setFormData((prev: BookInfo) => ({
          ...prev,
          numero_classe: cleanValue,
          categorie: deweyClass.title
        } as BookInfo));
      }
    } else {
      // Mettre à jour le numéro de classe 
      setFormData((prev: BookInfo) => ({
        ...prev,
        numero_classe: cleanValue,
        categorie: '' 
      } as BookInfo));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    debugLog(`Changement dans le champ ${name}:`, value);
    
    if (name === 'isbn' && (value.length === 13 || value.length === 10)) {
      handleIsbnComplete(value);
    }

    if (name === 'numero_classe') {
      handleDeweyChange(value);
      return;
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
      const response = await fetch('/api/notice/livres', { 
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          livre: {
            ...formData,
            catalogueur_username: user.username 
          },
          nombreExemplaires: 1, 
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
    setIsAddingExemplaires(true);
    
    if (!existingBook || !existingBook.isbn) {
      setMessage({ 
        type: 'error', 
        content: 'ISBN du livre existant non trouvé' 
      });
      setIsAddingExemplaires(false);
      return;
    }
  
    try {
      const livreData = {
        isbn: existingBook.isbn,
        titre: existingBook.titre,
        auteurs: existingBook.auteurs,
        editeurs: existingBook.editeurs,
        format: existingBook.format,
        date_publication: existingBook.date_publication,
        nombre_pages: existingBook.nombre_pages,
        categorie: existingBook.categorie,
        langue: existingBook.langue,
        mots_cle: existingBook.mots_cle,
        description: existingBook.description,
        url_photo: existingBook.url_photo,
        numero_classe: existingBook.numero_classe,
        section: existingBook.section || 'adulte',
        nombre_exemplaires: existingBook.nombre_exemplaires
      };
  
   
      const response = await fetch('/api/notice/livres', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          livre: livreData,
          nombreExemplaires: nombreExemplaires,
          username: user?.username,
          operation: 'ajout_exemplaires', 
          existingIsbn: existingBook.isbn // Ajout de l'ISBN existant
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'ajout des exemplaires');
      }
  
      const data = await response.json();
  
      setMessage({ 
        type: 'success', 
        content: `${nombreExemplaires} exemplaire(s) ajouté(s) avec succès!` 
      });
      setShowExemplairesDialog(false);
      setShowExistingBookDialog(false);
      setFormData(initialFormData);
    } catch (error) {
      console.error('Erreur détaillée:', error);
      setMessage({ 
        type: 'error', 
        content: error instanceof Error ? error.message : 'Erreur lors de l\'ajout des exemplaires'
      });
    } finally {
      setIsAddingExemplaires(false);
    }
  };



  const renderInput = (
    field: keyof BookInfo, 
    label: string, 
    icon: React.ElementType, 
    type: string = 'text',
    placeholder?: string
  ) => (
    <div className="space-y-1">
      <Label htmlFor={field} className="text-sm font-medium text-gray-700 flex justify-between items-center">
        <span>{label}</span>
        {field === 'mots_cle' && isGeneratingKeywords && (
          <span className="text-blue-500 text-xs flex items-center">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Génération en cours...
          </span>
        )}
      </Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {React.createElement(icon, { className: "h-4 w-4 text-gray-400" })}
        </div>
        {field === 'mots_cle' ? (
          <div className="flex gap-2">
            <Input
              type={type}
              id={field}
              name={field}
              value={typeof formData[field] === 'object' ? (formData[field] as string[]).join(', ') : formData[field]}
              onChange={handleInputChange}
              className="pl-9 text-sm"
              placeholder={placeholder || `Saisir ${label.toLowerCase()}`}
              disabled={isGeneratingKeywords}
            />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={handleGenerateKeywords}
              disabled={isGeneratingKeywords || !formData.description}
            >
              Générer
            </Button>
          </div>
        ) : (
          <Input
            type={type}
            id={field}
            name={field}
            value={typeof formData[field] === 'object' ? (formData[field] as string[]).join(', ') : formData[field]}
            onChange={handleInputChange}
            className="pl-9 text-sm"
            placeholder={placeholder || `Saisir ${label.toLowerCase()}`}
          />
        )}
      </div>
      {field === 'mots_cle' && keywordError && (
        <p className="text-xs text-red-500 mt-1">{keywordError}</p>
      )}
    </div>
  );

    return (
      <>
         <Card className="w-full max-w-3xl mx-auto shadow-md">
        <CardHeader className="pb-4">
          <h2 className="text-xl font-semibold text-center">
            Ajouter un nouveau livre - Section {formData.section}
          </h2>
          <p className="text-sm text-gray-500 text-center">
            Scannez l'ISBN ou saisissez-le manuellement, puis complétez les informations du livre
          </p>
          {isFetchingBookInfo && (
            <div className="text-sm text-blue-500 text-center mt-2 flex items-center justify-center gap-2">
              <span className="animate-spin">⌛</span>
              Récupération des informations du livre...
            </div>
          )}
        </CardHeader>
          
          <CardContent className="pb-4">
            {message && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mb-4">
                <AlertDescription>{message.content}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderInput('isbn', 'ISBN', BarChart, 'text', 'Scanner ou saisir l\'ISBN')}
                {renderTitleInput('titre', 'Titre', Book)}
                {renderInput('auteurs', 'Auteurs', User, 'text', 'Séparer les auteurs par des virgules')}
                {renderInput('editeurs', 'Éditeurs', Building, 'text', 'Séparer les éditeurs par des virgules')}
                {renderInput('date_publication', 'Date de publication', Calendar, 'date')}
                {renderInput('nombre_pages', 'Nombre de pages', Hash, 'number')}
                {renderInput('langue', 'Langue', Globe)}
               
                {renderInput('mots_cle', 'Mots clés', Tag, 'text', 'Séparer les mots clés par des virgules')}
                {renderInput('url_photo', 'URL de la photo', Camera)}
                <div className="space-y-1">
        <Label htmlFor="numero_classe" className="text-sm font-medium text-gray-700">
          Numéro de classe Dewey
        </Label>
        <div className="relative">
          <div className="absolute left-2 top-2.5 pointer-events-none">
            <Hash className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            id="numero_classe"
            name="numero_classe"
            value={formData.numero_classe}
            onChange={handleInputChange}
            className="pl-8 text-sm w-full"
            placeholder="Entrez un numéro à 3 chiffres"
            inputMode="numeric" // Active le clavier numérique sur mobile
          />
        </div>
      </div>
              </div>

             
      <div className="space-y-1">
        <Label htmlFor="categorie" className="text-sm font-medium text-gray-700">
          Catégorie
        </Label>
        <div className="relative">
          <div className="absolute left-2 top-2.5 pointer-events-none">
            <BookOpen className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            id="categorie"
            name="categorie"
            value={formData.categorie}
            readOnly
            className="pl-8 text-sm w-full bg-gray-50"
          />
        </div>
      </div>
              <div className="space-y-1">
                <Label htmlFor="format" className="text-sm font-medium text-gray-700">Format</Label>
                <Select 
                  defaultValue="empruntable" 
                  onValueChange={(value: 'lecture sur place' | 'empruntable') => 
                    setFormData(prev => ({ ...prev, format: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empruntable">Empruntable</SelectItem>
                    <SelectItem value="lecture sur place">Lecture sur place</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-4">
  {/* Nombre d'exemplaires */}
  <div className="relative flex-1">
  <Label htmlFor="section" className="text-sm font-medium text-gray-700">
      Nombre d'exemplaire
    </Label>
    <div className="absolute  left-0 pl-3 flex items-center pointer-events-none">
      <Hash className="h-4 w-4 text-gray-400" />
    </div>
    <Input
      type="number"
      id="nombre_exemplaires"
      name="nombre_exemplaires"
      value={formData.nombre_exemplaires}
      onChange={handleInputChange}
      className="pl-9 text-sm w-full"
      min="1"
      placeholder="Nombre d'exemplaires à créer"
    />
  </div>

  

  {/* Section */}
  <div className="flex-1">
    <Label htmlFor="section" className="text-sm font-medium text-gray-700">
      Section
    </Label>
    <Select 
      value={formData.section}
      onValueChange={(value: 'adulte' | 'jeunesse') =>
        setFormData(prev => ({ ...prev, section: value }))
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Sélectionner la section" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="adulte">Adulte</SelectItem>
        <SelectItem value="jeunesse">Jeunesse</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>

              
              <div className="space-y-1">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
                <div className="relative">
                  <div className="absolute top-2 left-2 pointer-events-none">
                    <FileText className="h-4 w-4 text-gray-400" />
                  </div>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="pl-8 h-24 resize-none text-sm"
                    placeholder="Description du livre"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full"
              onClick={handleSubmit}
            >
              {isLoading ? 'Enregistrement en cours...' : 'Enregistrer le livre'}
            </Button>
          </CardFooter>
        </Card>
      <ExistingBookDialog />
      <ExemplairesDialog />
      </>
    );
  };

  export default AddBook;