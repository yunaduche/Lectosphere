import React from 'react';
import { Search, Book, User, Building, Calendar, Hash, Globe, BookOpen, Tag, Camera, FileText, Loader2, BarChart } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BookFormProps } from '../types/BookTypes';

export const BookForm: React.FC<BookFormProps> = ({
  formData,
  setFormData,
  isLoading,
  isFetchingBookInfo,
  message,
  isGeneratingKeywords,
  keywordError,
  handleSubmit,
  handleInputChange,
  handleGenerateKeywords,
  checkTitleExists
}) => {
  const renderInput = (
    field: keyof typeof formData,
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
              value={Array.isArray(formData[field]) ? (formData[field] as string[]).join(', ') : formData[field]}
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
            value={Array.isArray(formData[field]) ? (formData[field] as string[]).join(', ') : formData[field]}
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

  return (
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
            {renderTitleInput()}
            {renderInput('auteurs', 'Auteurs', User, 'text', 'Séparer les auteurs par des virgules')}
            {renderInput('editeurs', 'Éditeurs', Building, 'text', 'Séparer les éditeurs par des virgules')}
            {renderInput('date_publication', 'Date de publication', Calendar, 'date')}
            {renderInput('nombre_pages', 'Nombre de pages', Hash, 'number')}
            {renderInput('langue', 'Langue', Globe)}
            {renderInput('categorie', 'Catégorie', BookOpen)}
            {renderInput('mots_cle', 'Mots clés', Tag, 'text', 'Séparer les mots clés par des virgules')}
            {renderInput('url_photo', 'URL de la photo', Camera)}
          </div>

          <div className="space-y-1">
            <Label htmlFor="format" className="text-sm font-medium text-gray-700">Format</Label>
            <Select 
              defaultValue={formData.format} 
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
  );
};