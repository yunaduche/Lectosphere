import React, { useState, useEffect } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BarcodesPrinting from '../pages/BarcodePDF';
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
import { Badge } from "@/components/ui/badge";
import { 
  Trash2, 
  Search,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import ExemplaireDetailModal from '../extra/ExemplaireModalChef';

interface Exemplaire {
  id_exemplaire: number;
  titre: string;
  isbn: string;
  disponibilite: 'libre' | 'en pret';
  format: string;
  section: string;
  code_barre: string;
  auteurs: string[];
  date_creation: string;
  session_nom: string;
  [key: string]: any;
}

export default function ExemplairesTable() {
  const [exemplaires, setExemplaires] = useState<Exemplaire[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExemplaire, setSelectedExemplaire] = useState<Exemplaire | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [sessionFilter, setSessionFilter] = useState<string>('all');
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [disponibiliteFilter, setDisponibiliteFilter] = useState<string>('all');

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchExemplaires();
  }, []);

  const fetchExemplaires = async () => {
    try {
      const response = await fetch('/api/ex');
      const result = await response.json();
      if (result.success) {
        setExemplaires(result.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des exemplaires:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (exemplaire: Exemplaire) => {
    setSelectedExemplaire(exemplaire);
    setIsDetailModalOpen(true);
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/ex/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchExemplaires();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };


  const uniqueSessions = Array.from(new Set(exemplaires.map(ex => ex.session_nom)));
  const uniqueSections = Array.from(new Set(exemplaires.map(ex => ex.section)));

  const filteredExemplaires = exemplaires.filter(exemplaire => {
    const matchesSearch = 
      exemplaire.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exemplaire.code_barre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exemplaire.auteurs.some(auteur => 
        auteur.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesSession = sessionFilter === 'all' || exemplaire.session_nom === sessionFilter;
    const matchesSection = sectionFilter === 'all' || exemplaire.section === sectionFilter;
    const matchesDisponibilite = disponibiliteFilter === 'all' || exemplaire.disponibilite === disponibiliteFilter;

    return matchesSearch && matchesSession && matchesSection && matchesDisponibilite;
  });

  const paginatedExemplaires = filteredExemplaires.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredExemplaires.length / ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="text-gray-500">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 space-y-6 bg-gray-50">
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par titre, code barre ou auteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
          </div>
          
          <div className="flex gap-4 flex-wrap">
            <Select value={sessionFilter} onValueChange={setSessionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les sessions</SelectItem>
                {uniqueSessions.map(session => (
                  <SelectItem key={session} value={session}>{session}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les sections</SelectItem>
                {uniqueSections.map(section => (
                  <SelectItem key={section} value={section}>{section}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={disponibiliteFilter} onValueChange={setDisponibiliteFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par disponibilité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="libre">Libre</SelectItem>
                <SelectItem value="en pret">Emprunté</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-2">
          {sessionFilter !== 'all' && (
            <Badge variant="secondary" className="px-3 py-1">
              Session: {sessionFilter}
              <button 
                onClick={() => setSessionFilter('all')}
                className="ml-2 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}
          {sectionFilter !== 'all' && (
            <Badge variant="secondary" className="px-3 py-1">
              Section: {sectionFilter}
              <button 
                onClick={() => setSectionFilter('all')}
                className="ml-2 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}
          {disponibiliteFilter !== 'all' && (
            <Badge variant="secondary" className="px-3 py-1">
              Disponibilité: {disponibiliteFilter}
              <button 
                onClick={() => setDisponibiliteFilter('all')}
                className="ml-2 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className=" rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-[#335262] text-white">
            <TableRow className="bg-[#335262] text-white">
              <TableHead className="w-12 text-white">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(paginatedExemplaires.map(ex => ex.id_exemplaire));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead className='text-white'>Titre</TableHead>
              <TableHead className='text-white'>Code Barre</TableHead>
              <TableHead className='text-white'>Format</TableHead>
              <TableHead className='text-white'>Section</TableHead>
              <TableHead className='text-white'>Disponibilité</TableHead>
              <TableHead className='text-white'>Session</TableHead>
              <TableHead className='text-white'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedExemplaires.map((exemplaire) => (
              <TableRow 
                key={exemplaire.id_exemplaire}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleRowClick(exemplaire)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={selectedIds.includes(exemplaire.id_exemplaire)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds([...selectedIds, exemplaire.id_exemplaire]);
                      } else {
                        setSelectedIds(selectedIds.filter(id => id !== exemplaire.id_exemplaire));
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{exemplaire.titre}</span>
                    <span className="text-sm text-gray-500">
                      {exemplaire.auteurs.join(', ')}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-mono">{exemplaire.code_barre}</TableCell>
                <TableCell>{exemplaire.format}</TableCell>
                <TableCell>{exemplaire.section}</TableCell>
                <TableCell>
                <Badge
                      variant={exemplaire.disponibilite === 'libre' ? 'success' : 'destructive'}
                  className={`font-medium text-white items-center ${
                    exemplaire.disponibilite === 'libre' 
                      ? 'bg-[#335262] ' 
                      : 'bg-[#e7c568] '
                  }`}
                >
                  {exemplaire.disponibilite}
                </Badge>
                </TableCell>
                <TableCell>{exemplaire.session_nom}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-gray-400 hover:text-red-600"
                    onClick={(e) => handleDelete(exemplaire.id_exemplaire, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Affichage de {((currentPage - 1) * ITEMS_PER_PAGE) + 1} à{' '}
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredExemplaires.length)} sur{' '}
          {filteredExemplaires.length} exemplaires
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bottom Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-4  bg-[#ccdbe3] shadow-lg ">
          <div className="px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600">
                {selectedIds.length} exemplaire(s) sélectionné(s)
              </span>
              <BarcodesPrinting 
                selectedExemplaires={exemplaires.filter(ex => selectedIds.includes(ex.id_exemplaire))}
                maxBarcodes={20}
              />
            </div>
            <Button 
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              className="flex items-center gap-2 ml-3"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer ({selectedIds.length})
            </Button>
          </div>
        </div>
      )}

      {/* Modal de détail */}
      <ExemplaireDetailModal
        exemplaire={selectedExemplaire}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

{/* Modal de confirmation de suppression */}
<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
      <AlertDialogDescription>
        Êtes-vous sûr de vouloir supprimer les {selectedIds.length} exemplaires sélectionnés ?
        Cette action est irréversible.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Annuler</AlertDialogCancel>
      <AlertDialogAction
        onClick={async () => {
          try {
            const response = await fetch('/api/ex/batch/delete', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ ids: selectedIds }),
            });
            
            if (response.ok) {
              setSelectedIds([]);
              await fetchExemplaires();
              setDeleteDialogOpen(false);
            }
          } catch (error) {
            console.error('Erreur lors de la suppression multiple:', error);
          }
        }}
      >
        Supprimer
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </div>
  );
}

