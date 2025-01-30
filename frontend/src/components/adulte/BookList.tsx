import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useToast } from "@/components/ui/use-toast";
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedPreloader from '../extra/Preloader';
import BookCard from '../extra/BookCard';
import cover from '../../assets/couverture_livre.png';
import SearchForm from '../extra/SearchForm'
import { FaBook, FaCheck, FaTimes } from "react-icons/fa";

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

interface Livre {
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
}

interface ApiResponse {
  count: number;
  books: Livre[];
}

interface CriteresRecherche {
  titre?: string;
  isbn?: string;
  auteurs?: string;
  editeurs?: string;
  categorie?: string;
  langue?: string;
  date_publication?: string;
  mots_cle?: string;
  disponible?: string;
  format?: string;
}

const LIVRES_PAR_PAGE = 21;

const BookList: React.FC = () => {
  const [livres, setLivres] = useState<Livre[]>([]);
  const [criteresRecherche, setCriteresRecherche] = useState<CriteresRecherche>({});
  const [chargement, setChargement] = useState<boolean>(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const user = useSelector((state: any) => state.auth.user);
  const userRole = useSelector((state: any) => state.auth.userRole);
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const filtrerLivresParRole = (livres: Livre[]): Livre[] => {
    switch (userRole) {
      case 'bibliothecaire_jeunesse':
        return livres.filter(livre => livre.section === 'jeunesse');
      case 'bibliothecaire_adulte':
        return livres.filter(livre => livre.section === 'adulte');
      default:
        return livres;
    }
  };

  const trierParDateCatalogage = (livres: Livre[]): Livre[] => {
    return livres.sort((a, b) => {
      const dateA = new Date(a.date_catalogage);
      const dateB = new Date(b.date_catalogage);
      return dateB.getTime() - dateA.getTime();
    });
  };

  useEffect(() => {
    recupererLivres();
  }, [userRole]);

  const recupererLivres = async () => {
    setChargement(true);
    setErreur(null);
    try {
      const reponse = await axios.get<ApiResponse>('/api/books/all');
      if (!reponse.data.books) {
        throw new Error('Format de réponse invalide');
      }

      const livresAvecPhotos = await Promise.all(
        reponse.data.books.map(async (livre) => ({
          ...livre,
          url_photo: await recupererPhotoLivre(livre.isbn, livre.url_photo)
        }))
      );

      // Filtrer par rôle, trier par date et limiter à 21 livres
      const livresFiltres = filtrerLivresParRole(livresAvecPhotos);
      const livresTriesParDate = trierParDateCatalogage(livresFiltres);
      const livresLimites = livresTriesParDate.slice(0, LIVRES_PAR_PAGE);

      setLivres(livresLimites);
    } catch (erreur) {
      setErreur(erreur instanceof Error ? erreur.message : 'Erreur inconnue');
    } finally {
      setChargement(false);
    }
  };

  const toggleBookSelection = (isbn: string) => {
    setSelectedBooks(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(isbn)) {
        newSelection.delete(isbn);
      } else {
        newSelection.add(isbn);
      }
      return newSelection;
    });
  };

  const handleDeleteSelected = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour supprimer des livres",
        variant: "destructive",
      });
      return;
    }

    setChargement(true);

    try {
      const isbnsArray = Array.from(selectedBooks);
      const response = await axios.delete('/api/books/multiple', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        data: {
          isbns: isbnsArray,
          username: user.username
        }
      });

      toast({
        title: "Succès",
        description: `${isbnsArray.length} livre(s) supprimé(s) avec succès`,
      });

      setSelectedBooks(new Set());
      await recupererLivres();
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    } finally {
      setChargement(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDeleteSingle = async (isbn: string) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour supprimer des livres",
        variant: "destructive",
      });
      return;
    }

    setChargement(true);

    try {
      const response = await fetch(`/api/books/${isbn}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          username: user.username
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      toast({
        title: "Succès",
        description: "Le livre a été supprimé avec succès",
      });

      await recupererLivres(); // Recharger la liste
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    } finally {
      setChargement(false);
    }
  };

  const recupererPhotoLivre = async (isbn: string, urlExistante: string | null): Promise<string> => {
    if (urlExistante) return urlExistante;
    try {
      const reponse = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const livre = reponse.data.items?.[0];
      return livre?.volumeInfo?.imageLinks?.thumbnail || cover;
    } catch (erreur) {
      return cover;
    }
  };

  const rechercherLivres = async () => {
    setChargement(true);
    setErreur(null);
    try {
      const reponse = await axios.get<ApiResponse>('/api/books/search', {
        params: criteresRecherche
      });

      if (!reponse.data.books) {
        throw new Error('Format de réponse invalide');
      }

      let livresAvecPhotos = await Promise.all(
        reponse.data.books.map(async (livre) => ({
          ...livre,
          url_photo: await recupererPhotoLivre(livre.isbn, livre.url_photo)
        }))
      );

      if (criteresRecherche.format === 'empruntable') {
        livresAvecPhotos = livresAvecPhotos.filter(livre => livre.format === 'empruntable');
      }

      // Filtrer par rôle, trier par date et limiter à 21 livres
      const livresFiltres = filtrerLivresParRole(livresAvecPhotos);
      const livresTriesParDate = trierParDateCatalogage(livresFiltres);
      const livresLimites = livresTriesParDate.slice(0, LIVRES_PAR_PAGE);

      setLivres(livresLimites);
    } catch (erreur) {
      setErreur(erreur instanceof Error ? erreur.message : 'Erreur de recherche');
    } finally {
      setChargement(false);
    }
  };

  const gererChangementInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCriteresRecherche(prev => ({ ...prev, [name]: value }));
  };

  const gererSoumission = (e: React.FormEvent) => {
    e.preventDefault();
    rechercherLivres();
  };

  const selectAllBooks = () => {
    setSelectedBooks(new Set(livres.map(livre => livre.isbn)));
  };

  const deselectAllBooks = () => {
    setSelectedBooks(new Set());
  };

  return (
    <AnimatedPreloader isLoading={chargement}>
      <div className="container mx-auto p-4">

        <SearchForm
          criteresRecherche={criteresRecherche}
          gererChangementInput={gererChangementInput}
          gererSoumission={gererSoumission}
        />

        {erreur && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {erreur}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {livres.length > 0 ? (
            livres.map((livre) => (
              <BookCard
                key={livre.isbn}
                livre={livre}
                isSelected={selectedBooks.has(livre.isbn)}
                onSelect={() => toggleBookSelection(livre.isbn)}
                onDelete={() => handleDeleteSingle(livre.isbn)}
                selectionMode={selectedBooks.size > 0}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              Aucun livre trouvé dans cette section.
            </div>
          )}
        </div>

        {selectedBooks.size > 0 && (
        <div 
          className="fixed z-index bottom-0  bg-white z-20  ml-[320px]  mb-6 rounded-lg"
          style={{
            animation: "popUp 0.4s ease-out"
          }}
        >
    <div className="border-4 border-[#e7c568] rounded-lg p-2 relative overflow-hidden">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FaBook className="w-4 h-4 text-[#335262]" />
        <span>{selectedBooks.size} livre(s) sélectionné(s)</span>
      </div>
      <div className="flex gap-2 justify-center mt-2">
        <Button variant="outline" size="sm" onClick={selectAllBooks} className="flex items-center gap-1">
          <FaCheck className="w-3 h-3 text-[#335262]" />
          Tout sélectionner
        </Button>
        <Button variant="outline" size="sm" onClick={deselectAllBooks} className="flex items-center gap-1">
          <FaTimes className="w-3 h-3 text-[#335262]" />
          Tout désélectionner
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => setIsDeleteDialogOpen(true)} 
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Supprimer la sélection
        </Button>
      </div>
      <style jsx>{`
        @keyframes popUp {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        .border-2::before, .border-2::after {
          content: '';
          position: absolute;
          width: 2px;
          height: 100%;
          background-color: #335262;
          top: 0;
        }
        .border-2::before {
          left: -2px;
        }
        .border-2::after {
          right: -2px;
        }
      `}</style>
    </div>
  </div>
)}

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer les {selectedBooks.size} livre(s) sélectionné(s) ?
                Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteSelected}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AnimatedPreloader>
  );
};

export default BookList;
