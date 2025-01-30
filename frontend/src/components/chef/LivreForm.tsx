import React, { useState } from 'react';
import { Plus, Trash2, BookPlus, AlertCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import axios from 'axios';

interface LivreFormProps {
  sessionId: number;
  onSuccess: () => void;
  onBookAdded: (section: string, nombreExemplaires: number) => void;
}

const LivreForm: React.FC<LivreFormProps> = ({ sessionId, onSuccess, onBookAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    isbn: '',
    titre: '',
    auteurs: [] as string[],
    editeurs: [] as string[],
    format: '',
    section: '',
    nombre_exemplaires: '',
    date_publication: '',
    nombre_pages: '',
    categorie: '',
    langue: '',
    mots_cle: [] as string[],
    description: '',
    url_photo: ''
  });

  const [newAuteur, setNewAuteur] = useState('');
  const [newEditeur, setNewEditeur] = useState('');
  const [newMotCle, setNewMotCle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(`/api/acquisitions/sessions/${sessionId}/livres`, formData);
      
    
      onBookAdded(
        formData.section, 
        parseInt(formData.nombre_exemplaires) || 0
      );
      
      setOpen(false);
      setFormData({
        isbn: '',
        titre: '',
        auteurs: [],
        editeurs: [],
        format: '',
        section: '',
        nombre_exemplaires: '',
        date_publication: '',
        nombre_pages: '',
        categorie: '',
        langue: '',
        mots_cle: [],
        description: '',
        url_photo: ''
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout du livre');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAuteur = () => {
    if (newAuteur.trim()) {
      setFormData(prev => ({
        ...prev,
        auteurs: [...prev.auteurs, newAuteur.trim()]
      }));
      setNewAuteur('');
    }
  };

  const handleAddEditeur = () => {
    if (newEditeur.trim()) {
      setFormData(prev => ({
        ...prev,
        editeurs: [...prev.editeurs, newEditeur.trim()]
      }));
      setNewEditeur('');
    }
  };

  const handleAddMotCle = () => {
    if (newMotCle.trim()) {
      setFormData(prev => ({
        ...prev,
        mots_cle: [...prev.mots_cle, newMotCle.trim()]
      }));
      setNewMotCle('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <BookPlus className="mr-2 h-4 w-4" />
          Ajouter un livre
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau livre</DialogTitle>
          <DialogDescription>
            Remplissez les informations du livre à ajouter à la session d'acquisition
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* ISBN et Titre */}
            <div className="space-y-2">
              <label className="text-sm font-medium">ISBN *</label>
              <Input
                required
                value={formData.isbn}
                onChange={e => setFormData(prev => ({...prev, isbn: e.target.value}))}
                placeholder="978-2-07-054127-0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Titre *</label>
              <Input
                required
                value={formData.titre}
                onChange={e => setFormData(prev => ({...prev, titre: e.target.value}))}
                placeholder="Titre du livre"
              />
            </div>
          </div>

          {/* Auteurs */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Auteurs *</label>
            <div className="flex gap-2">
              <Input
                value={newAuteur}
                onChange={e => setNewAuteur(e.target.value)}
                placeholder="Nom de l'auteur"
              />
              <Button type="button" onClick={handleAddAuteur} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.auteurs.map((auteur, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {auteur}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      auteurs: prev.auteurs.filter((_, i) => i !== index)
                    }))}
                    className="ml-1"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Éditeurs */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Éditeurs *</label>
            <div className="flex gap-2">
              <Input
                value={newEditeur}
                onChange={e => setNewEditeur(e.target.value)}
                placeholder="Nom de l'éditeur"
              />
              <Button type="button" onClick={handleAddEditeur} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.editeurs.map((editeur, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {editeur}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      editeurs: prev.editeurs.filter((_, i) => i !== index)
                    }))}
                    className="ml-1"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Format et Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Format *</label>
              <Select
                required
                value={formData.format}
                onValueChange={value => setFormData(prev => ({...prev, format: value}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empruntable">Empruntable</SelectItem>
                  <SelectItem value="lecture sur place">Lecture sur place</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Section *</label>
              <Select
                required
                value={formData.section}
                onValueChange={value => setFormData(prev => ({...prev, section: value}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jeunesse">Jeunesse</SelectItem>
                  <SelectItem value="adulte">Adulte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Informations complémentaires */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de publication</label>
              <Input
                type="date"
                value={formData.date_publication}
                onChange={e => setFormData(prev => ({...prev, date_publication: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre de pages</label>
              <Input
                type="number"
                value={formData.nombre_pages}
                onChange={e => setFormData(prev => ({...prev, nombre_pages: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre exemplaire </label>
              <Input
                type="number"
                value={formData.nombre_exemplaires}
                onChange={e => setFormData(prev => ({...prev, nombre_exemplaires: e.target.value}))}
              />
            </div>
          </div>

          {/* Mots-clés */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Mots-clés</label>
            <div className="flex gap-2">
              <Input
                value={newMotCle}
                onChange={e => setNewMotCle(e.target.value)}
                placeholder="Ajouter un mot-clé"
              />
              <Button type="button" onClick={handleAddMotCle} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.mots_cle.map((motCle, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {motCle}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      mots_cle: prev.mots_cle.filter((_, i) => i !== index)
                    }))}
                    className="ml-1"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({...prev, description: e.target.value}))}
              placeholder="Description du livre"
              className="h-24"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ajouter le livre
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LivreForm;