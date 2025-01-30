import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { RootState } from '../../hooks-redux/store';
import { useSelector } from 'react-redux';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { BookOpenCheck, Save, X } from 'lucide-react';

interface Book {
  isbn: string;
  titre: string;
  auteurs: string[];
  editeurs: string[];
  format: string;
  date_publication: string;
  nombre_pages: number;
  categorie: string;
  langue: string;
  mots_cle: string[];
  description: string;
  url_photo: string | null;
  section: string;
}

interface EditBookModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const EditBookModal: React.FC<EditBookModalProps> = ({
  book,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editedBook, setEditedBook] = useState({ ...book });
  const { user, userRole } = useSelector((state: RootState) => state.auth);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; content: string } | null>(null);
  const updatedBook = { ...editedBook, username: user.username };

  const handleUpdateBook = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/books/${book.isbn}`, {
        method: 'PUT',
        body: JSON.stringify(updatedBook),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      toast({
        title: "Succès",
        description: "Le livre a été mis à jour avec succès",
      });
      onUpdate();
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du livre",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="max-w-4xl mt-6 mb-20 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border-none overflow-y-auto max-h-screen">
        <DialogHeader className="border-b pb-4 mb-6 items-center text-center ">
          <DialogTitle className="flex items-center text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
            <BookOpenCheck className="mr-3 w-8 h-8 text-blue-600 " />
            Modifier les détails du livre {editedBook.titre}
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Mettez à jour les informations de votre livre
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* First Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titre" className="text-gray-700 dark:text-gray-300">Titre</Label>
              <Input
                id="titre"
                value={editedBook.titre}
                onChange={(e) => setEditedBook({ ...editedBook, titre: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="auteurs" className="text-gray-700 dark:text-gray-300">Auteurs</Label>
              <Input
                id="auteurs"
                value={editedBook.auteurs.join(', ')}
                onChange={(e) => setEditedBook({
                  ...editedBook,
                  auteurs: e.target.value.split(',').map(a => a.trim())
                })}
                placeholder="Séparez les auteurs par des virgules"
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editeurs" className="text-gray-700 dark:text-gray-300">Éditeurs</Label>
              <Input
                id="editeurs"
                value={editedBook.editeurs.join(', ')}
                onChange={(e) => setEditedBook({
                  ...editedBook,
                  editeurs: e.target.value.split(',').map(e => e.trim())
                })}
                placeholder="Séparez les éditeurs par des virgules"
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="format" className="text-gray-700 dark:text-gray-300">Format</Label>
                <Input
                  id="format"
                  value={editedBook.format}
                  onChange={(e) => setEditedBook({ ...editedBook, format: e.target.value })}
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_publication" className="text-gray-700 dark:text-gray-300">Date de publication</Label>
                <Input
                  id="date_publication"
                  type="date"
                  value={editedBook.date_publication}
                  onChange={(e) => setEditedBook({ ...editedBook, date_publication: e.target.value })}
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Second Column */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre_pages" className="text-gray-700 dark:text-gray-300">Nombre de pages</Label>
                <Input
                  id="nombre_pages"
                  type="number"
                  value={editedBook.nombre_pages}
                  onChange={(e) => setEditedBook({
                    ...editedBook,
                    nombre_pages: parseInt(e.target.value)
                  })}
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="langue" className="text-gray-700 dark:text-gray-300">Langue</Label>
                <Input
                  id="langue"
                  value={editedBook.langue}
                  onChange={(e) => setEditedBook({ ...editedBook, langue: e.target.value })}
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categorie" className="text-gray-700 dark:text-gray-300">Catégorie</Label>
              <Input
                id="categorie"
                value={editedBook.categorie}
                onChange={(e) => setEditedBook({ ...editedBook, categorie: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mots_cle" className="text-gray-700 dark:text-gray-300">Mots-clés</Label>
              <Input
                id="mots_cle"
                value={editedBook.mots_cle.join(', ')}
                onChange={(e) => setEditedBook({
                  ...editedBook,
                  mots_cle: e.target.value.split(',').map(m => m.trim())
                })}
                placeholder="Séparez les mots-clés par des virgules"
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Description</Label>
              <Textarea
                id="description"
                value={editedBook.description}
                onChange={(e) => setEditedBook({ ...editedBook, description: e.target.value })}
                rows={4}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url_photo" className="text-gray-700 dark:text-gray-300">URL de la photo</Label>
              <Input
                id="url_photo"
                value={editedBook.url_photo || ''}
                onChange={(e) => setEditedBook({ ...editedBook, url_photo: e.target.value })}
                placeholder="URL de l'image de couverture"
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 border-t pt-4 mb-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="mr-4 text-white hover:text-white bg-[#335262]  hover:bg-[#111646]"
          >
            <X className="mr-2 w-5 h-5" /> Annuler
          </Button>
          <Button
            onClick={handleUpdateBook}
            disabled={isLoading}
            className="bg-[#e7c568] hover:bg-[#e4d568] text-white"
          >
            <Save className="mr-2 w-5 h-5" />
            {isLoading ? "Mise à jour..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookModal;
