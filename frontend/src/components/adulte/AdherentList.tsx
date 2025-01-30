import React, { useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdherentModal from '../extra/AdherentModal'; // Assurez-vous que le chemin est correct

const AdherentList = () => {
  const [adherents, setAdherents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAdherent, setSelectedAdherent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAdhesionType, setSelectedAdhesionType] = useState("");
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchAdherents = async () => {
      try {
        const response = await fetch('/api/adherents');
        const data = await response.json();
        setAdherents(data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors de la récupération des adhérents');
        setLoading(false);
      }
    };
    fetchAdherents();
  }, []);

  const filteredAdherents = adherents.filter(adherent =>
    (adherent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adherent.numero_carte.includes(searchTerm)) &&
    (selectedAdhesionType ? adherent.type_adhesion === selectedAdhesionType : true)
  );

  const indexOfLastAdherent = currentPage * itemsPerPage;
  const indexOfFirstAdherent = indexOfLastAdherent - itemsPerPage;
  const currentAdherents = filteredAdherents.slice(indexOfFirstAdherent, indexOfLastAdherent);
  const totalPages = Math.ceil(filteredAdherents.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  const getStatusColor = (date) => {
    const today = new Date();
    const endDate = new Date(date);
    const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return "bg-red-100 text-red-800";
    if (daysLeft < 30) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const handleCloseModal = () => {
    setSelectedAdherent(null);
  };

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Liste des Adhérents</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              value={selectedAdhesionType}
              onChange={(e) => setSelectedAdhesionType(e.target.value)}
              className="border rounded-md px-2 py-1"
            >
              <option value="">Tous les types</option>
              <option value="Adhesion scolaire">Adhésion scolaire</option>
              <option value="Adhesion étudiant">Adhésion étudiant</option>
              <option value="Adhesion adulte">Adhésion adulte</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Numéro de Carte</TableHead>
                <TableHead>Type d'Adhésion</TableHead>
                <TableHead>Validité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentAdherents.map((adherent) => (
                <TableRow
                  key={adherent.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedAdherent(adherent)}
                >
                  <TableCell className="font-medium">{adherent.id}</TableCell>
                  <TableCell>{adherent.nom}</TableCell>
                  <TableCell>{adherent.numero_carte}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {adherent.type_adhesion}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(adherent.fin_adhesion)}`}>
                      {new Date(adherent.fin_adhesion).toLocaleDateString()}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" /> Précédent
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2"
          >
            Suivant <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>

      {selectedAdherent && (
        <AdherentModal adherent={selectedAdherent} onClose={handleCloseModal} />
      )}
    </Card>
  );
};

export default AdherentList;
