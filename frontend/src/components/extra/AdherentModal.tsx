import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  X, User, CreditCard, Barcode, Mail, Phone,
  MapPin, Home, Calendar, BookOpen, Clock,
  AlertTriangle, Ban, MoreVertical, Shield, Printer
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import MemberCard from '../ui/MemberCard';

interface Adherent {
  id: number;
  nom: string;
  prenom: string;
  numero_carte: string;
  codebarre: string;
  email: string;
  numero_telephone: string;
  quartier: string;
  adresse: string;
  type_adhesion: string;
  fin_adhesion: string;
  emprunts_en_cours_ids: number[];
  emprunts_en_cours_isbns: string[];
  nombre_total_emprunts: number;
  nb_retard_retour: number;
  banni: boolean;
  cause_banissement: string | null;
  photo?: string;
}

interface AdherentModalProps {
  adherent: Adherent;
  onClose: () => void;
  onUpdate: () => void;
}

const InfoItem = ({ icon: Icon, label, value, className = "" }) => (
  <div className={`flex items-center space-x-3 p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50/80 transition-colors ${className}`}>
    <Icon className="text-gray-400 shrink-0" size={20} />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-gray-900 truncate">{value}</p>
    </div>
  </div>
);

const StatItem = ({ icon: Icon, label, value, variant = "default" }) => {
  const variants = {
    default: "bg-white text-blue-600",
    success: "bg-white text-green-600",
    warning: "bg-white text-amber-600",
    danger: "bg-white text-red-600"
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${variants[variant]} bg-opacity-10`}>
          <Icon className={variants[variant]} size={20} />
        </div>
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <span className={`font-semibold ${variants[variant]}`}>{value}</span>
    </div>
  );
};

const AdherentModal: React.FC<AdherentModalProps> = ({
    adherent,
    onClose,
    onUpdate
  }) => {
    const [showBanDialog, setShowBanDialog] = useState(false);
    const [showPrintDialog, setShowPrintDialog] = useState(false);
    const [banCause, setBanCause] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const banDialogRef = useRef<HTMLDivElement>(null);
    const printDialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) &&
          banDialogRef.current && !banDialogRef.current.contains(event.target as Node) &&
          printDialogRef.current && !printDialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleBan = async () => {
    if (!banCause.trim()) {
      toast({
        title: "Erreur",
        description: "La cause du bannissement est requise",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`/api/circulations/ban/${adherent.numero_carte}`, {
        cause: banCause
      });

      setShowBanDialog(false);
      setBanCause("");
      toast({
        title: "Succès",
        description: "L'adhérent a été banni"
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Erreur",
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || "Impossible de bannir l'adhérent"
          : "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnban = async () => {
    setIsLoading(true);
    try {
      await axios.post(`/api/circulations/unban/${adherent.numero_carte}`);

      toast({
        title: "Succès",
        description: "L'adhérent a été débanni"
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Erreur",
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || "Impossible de débannir l'adhérent"
          : "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const memberCardData = {
    nom: adherent.nom,
    prenom: adherent.prenom,
    quartier: adherent.quartier,
    numeroCarte: adherent.numero_carte,
    fin_adhesion: adherent.fin_adhesion,
    photo: adherent.photo || "",
    codebarre: parseInt(adherent.codebarre)
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <div ref={modalRef} className="w-full max-w-2xl bg-white rounded-xl shadow-2xl">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#e4d568] to-[#e4b368] p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/10 rounded-full">
                  <User className="text-white" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{adherent.nom}</h2>
                  <p className="text-white/80">ID: {adherent.id}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
                      <MoreVertical size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!adherent.banni ? (
                      <DropdownMenuItem
                        className="text-red-600 cursor-pointer"
                        onClick={() => setShowBanDialog(true)}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Bannir l'adhérent
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className="text-green-600 cursor-pointer"
                        onClick={handleUnban}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Débannir l'adhérent
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => setShowPrintDialog(true)}
                    >
                      <Printer className="mr-2 h-4 w-4" />
                      Imprimer la carte
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  <X size={20} />
                </Button>
              </div>
            </div>
          </div>

    
          <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={CreditCard} label="Numéro de Carte" value={adherent.numero_carte} />
              <InfoItem icon={Barcode} label="Code Barre" value={adherent.codebarre} />
              <InfoItem icon={Mail} label="Email" value={adherent.email} className="md:col-span-2" />
              <InfoItem icon={Phone} label="Téléphone" value={adherent.numero_telephone} />
              <InfoItem icon={MapPin} label="Quartier" value={adherent.quartier} />
              <InfoItem icon={Home} label="Adresse" value={adherent.adresse} className="md:col-span-2" />
              <InfoItem icon={Calendar} label="Type d'Adhésion" value={adherent.type_adhesion} />
              <InfoItem
                icon={Clock}
                label="Validité"
                value={new Date(adherent.fin_adhesion).toLocaleDateString()}
              />
            </div>

            {/* Stats Section */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Statistiques d'Emprunt</h3>
              <StatItem
                icon={BookOpen}
                label="Emprunts en Cours"
                value={adherent.emprunts_en_cours_ids.length}
                variant="default"
              />
              <StatItem
                icon={Calendar}
                label="Nombre Total d'Emprunts"
                value={adherent.nombre_total_emprunts}
                variant="success"
              />
              <StatItem
                icon={Clock}
                label="Retards de Retour"
                value={adherent.nb_retard_retour}
                variant={adherent.nb_retard_retour > 0 ? "danger" : "success"}
              />
            </div>

          
            {adherent.banni && (
              <div className="flex items-start space-x-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl animate-pulse">
                <Ban className="text-red-500 shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold text-red-700">Adhérent Banni</h4>
                  {adherent.cause_banissement && (
                    <p className="mt-1 text-red-600">{adherent.cause_banissement}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ban Dialog */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent ref={banDialogRef}>
          <DialogHeader>
            <DialogTitle>Bannir l'adhérent</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Cause du bannissement..."
              value={banCause}
              onChange={(e) => setBanCause(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBanDialog(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleBan}
              disabled={isLoading}
            >
              {isLoading ? "Bannissement..." : "Bannir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

       {/* Print Dialog */}
       <Dialog open={showPrintDialog} onOpenChange={setShowPrintDialog}>
        <DialogContent ref={printDialogRef} className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Impression de la carte adhérent</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <MemberCard member={memberCardData} />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPrintDialog(false)}
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdherentModal;
