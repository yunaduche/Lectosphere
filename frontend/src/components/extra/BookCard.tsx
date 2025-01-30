import React, { useState } from 'react';
import { BookOpen, PlusCircle, MoreVertical, Pencil, Trash2, Check } from 'lucide-react';
import cover from '../../assets/couverture_livre.png';
import EditBookModal from './EditBookModal';
import { RootState } from '../../hooks-redux/store';
import { useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger, 
  DialogFooter
} from "@/components/ui/dialog";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

interface BookCardProps {
  livre: {
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
    nombre_exemplaires: number;
    section: string;
    catalogueur_username: string;
    date_catalogage: string;
    id_session_acquisition: string | null;
    acquisition_status: string;
    exemplaires_disponibles: number;
  };
  onBookUpdate?: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
  selectionMode?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ 
  livre, 
  onBookUpdate,
  isSelected = false,
  onSelect,
  selectionMode = false
}) => {
  const { user, userRole } = useSelector((state: RootState) => state.auth);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; content: string } | null>(null);
  const [isAddExemplaireOpen, setIsAddExemplaireOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [nombreExemplaires, setNombreExemplaires] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [editedBook, setEditedBook] = useState({ ...livre });
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
 
    if (selectionMode) {
      e.preventDefault();
      onSelect?.();
    }
  };


  const handleAddExemplaires = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/exemplaire/ajouter-exemplaires', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isbn: livre.isbn,
          nombreExemplaires: parseInt(nombreExemplaires)
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Succès",
          description: `${nombreExemplaires} exemplaire(s) ajouté(s) avec succès`,
        });
        onBookUpdate?.();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout des exemplaires",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsAddExemplaireOpen(false);
    }
  };

 
  const handleDeleteBook = async () => {
    setIsLoading(true);

    if (!user) {
      setMessage({ 
        type: 'error', 
        content: 'Vous devez être connecté pour ajouter un livre'
      });
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(`/api/books/deleteOne/${livre.isbn}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` 
        },
        body: JSON.stringify({
          username: user.username
        })
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      toast({
        title: "Succès",
        description: "Le livre a été supprimé avec succès",
      });
      onBookUpdate?.();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du livre",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <Dialog>
    <DialogTrigger asChild>
      <div 
        className={`group relative cursor-pointer
          ${isSelected ? 'ring-2 p-1 rounded-lg ring-[#e7c568] bg-[#e7c568]' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Checkbox de sélection */}
        {(selectionMode || isSelected || isHovered) && (
          <div 
            className="absolute top-2 right-2 z-10 transition-opacity duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
          >
            <div className={`
              w-6 h-6 rounded border-2 flex items-center justify-center
              transition-all duration-200 cursor-pointer
              ${isSelected 
                ? 'bg-[#e7c568] border-[#e7c568]' 
                : 'border-gray-400 bg-white hover:border-blue-500]'
              }
            `}>
              {isSelected && (
                <Check className="w-4 h-4 text-white" />
              )}
            </div>
          </div>
        )}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="relative">
              <img
                src={livre.url_photo || cover}
                alt={`Couverture de ${livre.titre}`}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = cover;
                }}
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#335262]/90 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                <h2 className="text-xl font-bold mb-2 line-clamp-2">{livre.titre}</h2>
                <p className="text-sm opacity-90">{livre.auteurs.join(', ')}</p>
              </div>
            </div>

            <div className="p-4 bg-white">
              <div className="flex items-center gap-2 text-[#335262]">
                <BookOpen size={20} />
                <span className="font-medium">
                Exemplaire{livre.exemplaires_disponibles > 1 ? 's' : ''} disponible: {livre.exemplaires_disponibles}
                </span>
               
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[85vh] p-0">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-[#e4d568] to-[#e4b368]">
          <DialogTitle className="text-2xl text-center font-bold text-white">~ {livre.titre} ~</DialogTitle>
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DialogHeader>
        
        <div className="overflow-y-auto px-6 py-4 max-h-[calc(85vh-8rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img
                src={livre.url_photo || cover}
                alt={`Couverture de ${livre.titre}`}
                className="w-full rounded-lg shadow-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = cover;
                }}
              />
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#335262] rounded-lg">
                <div className="flex items-center gap-2 text-white mb-2">
                  <BookOpen className="h-5 w-5" />
                  <span className="font-medium">
                    Exemplaire{livre.exemplaires_disponibles > 1 ? 's' : ''} disponible: {livre.exemplaires_disponibles} 
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsAddExemplaireOpen(true)}
                    className="flex items-center gap-2 text-[#335262]"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
                <div className="h-px bg-white/25 my-2" />
                <p className="text-sm font-medium text-white">
                  {livre.acquisition_status}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Auteurs:</span> {livre.auteurs.join(', ')}</p>
                <p><span className="font-semibold">ISBN:</span> {livre.isbn}</p>
                <p><span className="font-semibold">Éditeurs:</span> {livre.editeurs.join(', ')}</p>
                <p><span className="font-semibold">Format:</span> {livre.format}</p>
                <p><span className="font-semibold">Date de publication:</span> {livre.date_publication}</p>
                <p><span className="font-semibold">Pages:</span> {livre.nombre_pages}</p>
                <p><span className="font-semibold">Catégorie:</span> {livre.categorie}</p>
                <p><span className="font-semibold">Langue:</span> {livre.langue}</p>
                <p>
                  <span className="font-semibold">Mots-clés:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {livre.mots_cle.map((mot, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-[#e7c568]  rounded-full text-sm shadow-sm"
                      >
                        {mot}
                      </span>
                    ))}
                  </div>
                </p>

                <p><span className="font-semibold">Section:</span> {livre.section}</p>
                <p><span className="font-semibold"></span> {livre.nombre_exemplaires} exemplaire{livre.nombre_exemplaires > 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-600">{livre.description}</p>
              </div>

              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                <p>Catalogué par {livre.catalogueur_username}</p>
                <p>Le {new Date(livre.date_catalogage).toLocaleDateString()}</p>
                {livre.id_session_acquisition && (
                  <p>ID Session: {livre.id_session_acquisition}</p>
                )}
              </div>
            </div>
          </div>

      
        </div>
      </DialogContent>

      <EditBookModal
        book={livre}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onUpdate={() => {
          onBookUpdate?.();
          setIsEditDialogOpen(false);
        }}
      />

      {/* Modal de confirmation de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce livre ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Tous les exemplaires associés seront également supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBook}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      
      <AlertDialog open={isAddExemplaireOpen} onOpenChange={setIsAddExemplaireOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ajouter des exemplaires</AlertDialogTitle>
            <AlertDialogDescription>
              Combien d'exemplaires souhaitez-vous ajouter pour "{livre.titre}" ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Input
              type="number"
              min="1"
              value={nombreExemplaires}
              onChange={(e) => setNombreExemplaires(e.target.value)}
              placeholder="Nombre d'exemplaires"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAddExemplaires}
              disabled={isLoading}
            >
              {isLoading ? "..." : "Ajouter"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default BookCard;