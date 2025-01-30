import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Book, User, Building, Calendar, Hash, Globe, BookOpen, Tag, BarChart, Camera, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateFormField, fetchBookByISBN, addBook, resetForm, addExemplaire } from '../../hooks-redux/bookSlice';
import { RootState, AppDispatch } from '../../hooks-redux/store';
import { Booki } from '../../hooks-redux/type/book';
import ConfirmAddExemplaireModal from '../adulte/ModalExemplaire';

const AddBook: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { formData, isLoading, error, message } = useSelector((state: RootState) => state.book);
  const isbnInputRef = useRef<HTMLInputElement>(null);
  const isbnBufferRef = useRef<string>('');
  const bufferTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isbnInputRef.current) {
      isbnInputRef.current.focus();
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key >= '0' && event.key <= '9') {
        isbnBufferRef.current += event.key;
        
        if (bufferTimeoutRef.current) {
          clearTimeout(bufferTimeoutRef.current);
        }

        bufferTimeoutRef.current = setTimeout(() => {
          if (isbnBufferRef.current.length === 13) {
            dispatch(updateFormField({ field: 'isbn', value: isbnBufferRef.current }));
            dispatch(fetchBookByISBN(isbnBufferRef.current));
          }
          isbnBufferRef.current = '';
        }, 100);
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'isbn' || name === 'nombrePages') {
      newValue = value.replace(/\D/g, '');
    }

    dispatch(updateFormField({ field: name as keyof Booki, value: newValue }));
    
    if (name === 'isbn' && newValue.length === 13) {
      dispatch(fetchBookByISBN(newValue));
    }
  };

  const handleFormatChange = (value: string) => {
    dispatch(updateFormField({ field: 'format', value }));
  };

  const renderInput = (field: keyof Booki, label: string, icon: React.ElementType, type: string = 'text') => (
    <div className="space-y-1">
      <Label htmlFor={field} className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {React.createElement(icon, { className: "h-4 w-4 text-gray-400" })}
        </div>
        <Input
          type={type}
          id={field}
          name={field}
          value={formData[field]}
          onChange={handleInputChange}
          className="pl-9 text-sm"
          placeholder={!formData[field] ? 'À remplir manuellement' : ''}
          ref={field === 'isbn' ? isbnInputRef : undefined}
        />
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bookDataToSubmit = {
      ...formData,
      auteurs: formData.auteurs.split(',').map(auteur => auteur.trim()),
      editeurs: formData.editeurs.split(',').map(editeur => editeur.trim())
    };
    
    try {
      await dispatch(addBook(bookDataToSubmit)).unwrap();
    } catch (error) {
      if (error === 'Un livre avec cet ISBN existe déjà') {
        setIsModalOpen(true);
      }
    }
  };

  const handleAddExemplaire = async () => {
    try {
      await dispatch(addExemplaire(formData.isbn)).unwrap();
      setIsModalOpen(false);
      dispatch(resetForm());
    } catch (error) {
      // Gérer l'erreur
    }
  };

  return (
    <>
    <Card className="w-full max-w-3xl mx-auto shadow-md">
      <CardHeader className="pb-4">
        <h2 className="text-xl font-semibold text-center">Ajouter une nouvelle notice</h2>
        <p className="text-sm text-gray-500 text-center">Scannez l'ISBN ou saisissez-le manuellement, puis complétez les champs manquants</p>
      </CardHeader>
      
      <CardContent className="pb-4">
        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mb-4">
            <AlertDescription>{message.content}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderInput('isbn', 'ISBN', BarChart)}
            {renderInput('titre', 'Titre', Book)}
            {renderInput('auteurs', 'Auteurs (séparés par des virgules)', User)}
            {renderInput('editeurs', 'Éditeur', Building)}
            {renderInput('datePublication', 'Date de publication', Calendar)}
            {renderInput('nombrePages', 'Nombre de pages', Hash, 'number')}
            {renderInput('langue', 'Langue', Globe)}
            {renderInput('categorie', 'Catégorie', BookOpen)}
            {renderInput('motsCle', 'Mots clés', Tag)}
            {renderInput('urlPhoto', 'URL de la photo', Camera)}
            
            <div className="space-y-1">
              <Label htmlFor="format" className="text-sm font-medium text-gray-700">Format</Label>
              <Select onValueChange={handleFormatChange} value={formData.format}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lecture sur place">Lecture sur place</SelectItem>
                  <SelectItem value="empruntable">Empruntable</SelectItem>
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
                placeholder={!formData.description ? 'Description du livre' : ''}
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
          {isLoading ? 'Chargement...' : 'Enregistrer le livre'}
        </Button>
      </CardFooter>
    </Card>
    <ConfirmAddExemplaireModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAddExemplaire}
        bookTitle={formData.titre}
      />
    </>
  );
};

export default AddBook;