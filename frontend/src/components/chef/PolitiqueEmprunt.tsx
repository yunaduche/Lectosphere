import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen,
  RefreshCw,
  Users,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Settings2
} from 'lucide-react';

interface PolitiqueEmprunt {
  duree_emprunt_jours: number;
  nombre_renouvellement_max: number;
  nombre_exemplaires_max: number;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: number) => void;
  currentValue: number;
  title: string;
  description: string;
  fieldName: string;
  icon: React.ReactNode;
}

const EditModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  currentValue, 
  title, 
  description,
  icon,
  fieldName 
}: EditModalProps) => {
  const [value, setValue] = useState(currentValue);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {icon}
            <span>{title}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4">
          <p className="text-sm text-gray-500 mb-4">{description}</p>
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            min={0}
            className="w-full mb-6"
          />
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              onClick={() => {
                onSave(value);
                onClose();
              }}
              className="bg-[#335262] hover:bg-[#2a424f] text-white"
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const StatCard = ({ 
  icon, 
  title, 
  value, 
  description,
  onEdit 
}: { 
  icon: React.ReactNode;
  title: string;
  value: number;
  description: string;
  onEdit: () => void;
}) => (
  <Card className="group hover:shadow-lg transition-all duration-300">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-[#335262]/10 text-[#335262]">
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-gray-600">{title}</h3>
            <p className="text-3xl font-bold text-[#335262]">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Settings2 className="w-4 h-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

const PolitiqueEmpruntComponent = () => {
  const [politique, setPolitique] = useState<PolitiqueEmprunt>({
    duree_emprunt_jours: 0,
    nombre_renouvellement_max: 0,
    nombre_exemplaires_max: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    field: keyof PolitiqueEmprunt | null;
    title: string;
    description: string;
    icon: React.ReactNode;
  }>({
    isOpen: false,
    field: null,
    title: '',
    description: '',
    icon: null
  });

  useEffect(() => {
    const fetchPolitique = async () => {
      try {
        setIsLoading(true);
      
        const data = {
          duree_emprunt_jours: 14,
          nombre_renouvellement_max: 2,
          nombre_exemplaires_max: 5
        };
        setPolitique(data);
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPolitique();
  }, []);

  const handleSave = async (field: keyof PolitiqueEmprunt, value: number) => {
    try {
      setIsLoading(true);
    
      setPolitique(prev => ({ ...prev, [field]: value }));
      setSuccessMessage('Les modifications ont été enregistrées avec succès');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Une erreur est survenue lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#335262] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-blue">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#335262] mb-3">
          Politique d'Emprunt
        </h1>
        <p className="text-gray-500">
          Gérez les paramètres d'emprunt de votre bibliothèque
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<BookOpen className="w-6 h-6" />}
          title="Durée d'emprunt"
          value={politique.duree_emprunt_jours}
          description="Jours autorisés par emprunt"
          onEdit={() => setEditModal({
            isOpen: true,
            field: 'duree_emprunt_jours',
            title: 'Durée d\'emprunt',
            description: 'Définissez le nombre de jours pendant lesquels un utilisateur peut emprunter un document.',
            icon: <BookOpen className="w-5 h-5" />
          })}
        />

        <StatCard
          icon={<RefreshCw className="w-6 h-6" />}
          title="Renouvellements"
          value={politique.nombre_renouvellement_max}
          description="Nombre maximum autorisé"
          onEdit={() => setEditModal({
            isOpen: true,
            field: 'nombre_renouvellement_max',
            title: 'Renouvellements maximum',
            description: 'Définissez le nombre maximum de fois qu\'un emprunt peut être renouvelé.',
            icon: <RefreshCw className="w-5 h-5" />
          })}
        />

        <StatCard
          icon={<Users className="w-6 h-6" />}
          title="Exemplaires"
          value={politique.nombre_exemplaires_max}
          description="Maximum par utilisateur"
          onEdit={() => setEditModal({
            isOpen: true,
            field: 'nombre_exemplaires_max',
            title: 'Exemplaires maximum',
            description: 'Définissez le nombre maximum d\'exemplaires qu\'un utilisateur peut emprunter simultanément.',
            icon: <Users className="w-5 h-5" />
          })}
        />
      </div>

      {successMessage && (
        <div className="fixed bottom-4 right-4 flex items-center bg-green-50 border border-green-200 px-4 py-3 rounded-lg shadow-lg">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-700">{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 flex items-center bg-red-50 border border-red-200 px-4 py-3 rounded-lg shadow-lg">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {editModal.isOpen && editModal.field && (
        <EditModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, field: null, title: '', description: '', icon: null })}
          onSave={(value) => handleSave(editModal.field!, value)}
          currentValue={politique[editModal.field]}
          title={editModal.title}
          description={editModal.description}
          fieldName={editModal.field}
          icon={editModal.icon}
        />
      )}
    </div>
  );
};

export default PolitiqueEmpruntComponent;