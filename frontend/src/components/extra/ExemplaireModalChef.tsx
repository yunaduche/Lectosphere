import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, BookOpen, Barcode, User, BookmarkIcon, Users, Clock, Library } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

interface ExemplaireDetailProps {
  exemplaire: {
    id_exemplaire: number;
    id_livre: number;
    titre: string;
    isbn: string;
    disponibilite: string;
    format: string;
    derniers_emprunteurs: string[];
    emprunteur_numero_carte: string | null;
    date_emprunt: string | null;
    date_retour_prevue: string | null;
    bibliothecaire_emprunt_id: number | null;
    section: string;
    date_creation: string;
    auteurs: string[];
    code_barre: string;
    session_acquisition_id: number;
    session_nom: string;
    preteur_username: string | null;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExemplaireDetailModal({ 
  exemplaire, 
  isOpen, 
  onClose 
}: ExemplaireDetailProps) {
  if (!exemplaire) return null;

  const formatDate = (date: string | null) => {
    if (!date) return 'Non défini';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const InfoRow = ({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon?: React.ComponentType<any> }) => (
    <div className="flex items-center space-x-2 py-1">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
      <span className="font-medium min-w-32">{label}:</span>
      <span className="text-sm">{value}</span>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold">{exemplaire.titre}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                {exemplaire.auteurs.join(', ')}
              </p>
            </div>
            <Badge 
              variant={exemplaire.disponibilite === 'libre' ? 'success' : 'destructive'}
              className="text-sm px-3 py-1"
            >
              {exemplaire.disponibilite}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Informations générales
                  </h3>
                  <div className="space-y-2">
                    <InfoRow label="ISBN" value={exemplaire.isbn || 'Non défini'} icon={Barcode} />
                    <InfoRow label="Code barre" value={exemplaire.code_barre} icon={Barcode} />
                    <InfoRow label="Format" value={exemplaire.format} icon={BookmarkIcon} />
                    <InfoRow label="Section" value={exemplaire.section} icon={Library} />
                 
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-primary" />
                    Dates importantes
                  </h3>
                  <InfoRow 
                    label="Date de cataloguage" 
                    value={formatDate(exemplaire.date_creation)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-primary" />
                    Statut d'emprunt
                  </h3>
                  {exemplaire.emprunteur_numero_carte ? (
                    <div className="space-y-2">
                      <InfoRow 
                        label="Emprunteur" 
                        value={exemplaire.emprunteur_numero_carte}
                        icon={User}
                      />
                      <InfoRow 
                        label="Date d'emprunt" 
                        value={formatDate(exemplaire.date_emprunt)}
                        icon={Calendar}
                      />
                      <InfoRow 
                        label="Retour prévu" 
                        value={formatDate(exemplaire.date_retour_prevue)}
                        icon={Calendar}
                      />
                      <InfoRow 
                        label="Bibliothécaire" 
                        value={exemplaire.preteur_username} 
                        icon={User}
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucun emprunt en cours</p>
                  )}
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-primary" />
                    Derniers emprunteurs
                  </h3>
                  {exemplaire.derniers_emprunteurs && exemplaire.derniers_emprunteurs.length > 0 ? (
                    <div className="space-y-2">
                      {exemplaire.derniers_emprunteurs.map((emprunteur, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{emprunteur}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucun historique d'emprunt</p>
                  )}
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <Library className="h-5 w-5 text-primary" />
                    Acquisition
                  </h3>
                  <div className="space-y-2">
                    <InfoRow label="Session" value={exemplaire.session_nom} />
                    
                    {exemplaire.preteur_username && (
                      <InfoRow label="Catalogueur" value={exemplaire.preteur_username} icon={User} />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}