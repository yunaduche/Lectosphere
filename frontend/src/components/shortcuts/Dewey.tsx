
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { create } from 'zustand';


interface DeweyCell {
  code: string;
  title: string;
  color: string;
}

interface ModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

// Store
const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

// Composant principal de la grille
const DeweyGrid: React.FC = () => {
  const colorScheme = {
    '000': 'bg-neutral-800 hover:bg-neutral-700',
    '100': 'bg-amber-800 hover:bg-amber-700',
    '200': 'bg-red-800 hover:bg-red-700',
    '300': 'bg-orange-800 hover:bg-orange-700',
    '400': 'bg-yellow-700 hover:bg-yellow-600',
    '500': 'bg-green-800 hover:bg-green-700',
    '600': 'bg-emerald-800 hover:bg-emerald-700',
    '700': 'bg-purple-800 hover:bg-purple-700',
    '800': 'bg-blue-800 hover:bg-blue-700',
    '900': 'bg-slate-800 hover:bg-slate-700',
  };

  const deweyGrid: DeweyCell[][] = [
    [
      { code: '000', title: 'Information Communication', color: colorScheme['000'] },
      { code: '100', title: 'Philosophie', color: colorScheme['100'] },
      { code: '200', title: 'Religion', color: colorScheme['200'] },
      { code: '300', title: 'Sciences sociales', color: colorScheme['300'] },
      { code: '400', title: 'Langues', color: colorScheme['400'] },
      { code: '500', title: 'Sciences', color: colorScheme['500'] },
      { code: '600', title: 'Technologies', color: colorScheme['600'] },
      { code: '700', title: 'Arts et loisirs', color: colorScheme['700'] },
      { code: '800', title: 'Littérature', color: colorScheme['800'] },
      { code: '900', title: 'Histoire et géographie', color: colorScheme['900'] },
    ],
    [
      { code: '010', title: 'Bibliographie', color: colorScheme['000'] },
      { code: '110', title: 'Métaphysique', color: colorScheme['100'] },
      { code: '210', title: 'Philosophie religion', color: colorScheme['200'] },
      { code: '310', title: 'Statistiques', color: colorScheme['300'] },
      { code: '410', title: 'Linguistique', color: colorScheme['400'] },
      { code: '510', title: 'Mathématiques', color: colorScheme['500'] },
      { code: '610', title: 'Médecine', color: colorScheme['600'] },
      { code: '710', title: 'Urbanisme', color: colorScheme['700'] },
      { code: '810', title: 'Littérature américaine', color: colorScheme['800'] },
      { code: '910', title: 'Géographie', color: colorScheme['900'] },
    ],
    [
      { code: '020', title: 'Bibliothéconomie', color: colorScheme['000'] },
      { code: '120', title: 'Théorie connaissance', color: colorScheme['100'] },
      { code: '220', title: 'Bible', color: colorScheme['200'] },
      { code: '320', title: 'Science politique', color: colorScheme['300'] },
      { code: '420', title: 'Anglais', color: colorScheme['400'] },
      { code: '520', title: 'Astronomie', color: colorScheme['500'] },
      { code: '620', title: 'Ingénierie', color: colorScheme['600'] },
      { code: '720', title: 'Architecture', color: colorScheme['700'] },
      { code: '820', title: 'Littérature anglaise', color: colorScheme['800'] },
      { code: '920', title: 'Biographie', color: colorScheme['900'] },
    ],
    [
      { code: '030', title: 'Encyclopédies', color: colorScheme['000'] },
      { code: '130', title: 'Parapsychologie', color: colorScheme['100'] },
      { code: '230', title: 'Théologie chrétienne', color: colorScheme['200'] },
      { code: '330', title: 'Économie', color: colorScheme['300'] },
      { code: '430', title: 'Allemand', color: colorScheme['400'] },
      { code: '530', title: 'Physique', color: colorScheme['500'] },
      { code: '630', title: 'Agriculture', color: colorScheme['600'] },
      { code: '730', title: 'Sculpture', color: colorScheme['700'] },
      { code: '830', title: 'Littérature allemande', color: colorScheme['800'] },
      { code: '930', title: 'Histoire ancienne', color: colorScheme['900'] },
    ],
    [
      { code: '040', title: 'Non attribuée', color: colorScheme['000'] },
      { code: '140', title: 'Écoles philosophiques', color: colorScheme['100'] },
      { code: '240', title: 'Théologie morale', color: colorScheme['200'] },
      { code: '340', title: 'Droit', color: colorScheme['300'] },
      { code: '440', title: 'Français', color: colorScheme['400'] },
      { code: '540', title: 'Chimie', color: colorScheme['500'] },
      { code: '640', title: 'Économie domestique', color: colorScheme['600'] },
      { code: '740', title: 'Dessin', color: colorScheme['700'] },
      { code: '840', title: 'Littérature française', color: colorScheme['800'] },
      { code: '940', title: 'Histoire Europe', color: colorScheme['900'] },
    ],
    [
      { code: '050', title: 'Publications série', color: colorScheme['000'] },
      { code: '150', title: 'Psychologie', color: colorScheme['100'] },
      { code: '250', title: 'Églises locales', color: colorScheme['200'] },
      { code: '350', title: 'Administration', color: colorScheme['300'] },
      { code: '450', title: 'Italien', color: colorScheme['400'] },
      { code: '550', title: 'Sciences Terre', color: colorScheme['500'] },
      { code: '650', title: 'Gestion', color: colorScheme['600'] },
      { code: '750', title: 'Peinture', color: colorScheme['700'] },
      { code: '850', title: 'Littérature italienne', color: colorScheme['800'] },
      { code: '950', title: 'Histoire Asie', color: colorScheme['900'] },
    ],
    [
      { code: '060', title: 'Organisations', color: colorScheme['000'] },
      { code: '160', title: 'Logique', color: colorScheme['100'] },
      { code: '260', title: 'Théologie sociale', color: colorScheme['200'] },
      { code: '360', title: 'Services sociaux', color: colorScheme['300'] },
      { code: '460', title: 'Espagnol', color: colorScheme['400'] },
      { code: '560', title: 'Paléontologie', color: colorScheme['500'] },
      { code: '660', title: 'Génie chimique', color: colorScheme['600'] },
      { code: '760', title: 'Gravure', color: colorScheme['700'] },
      { code: '860', title: 'Littérature espagnole', color: colorScheme['800'] },
      { code: '960', title: 'Histoire Afrique', color: colorScheme['900'] },
    ],
    [
      { code: '070', title: 'Médias, journalisme', color: colorScheme['000'] },
      { code: '170', title: 'Éthique', color: colorScheme['100'] },
      { code: '270', title: 'Histoire église', color: colorScheme['200'] },
      { code: '370', title: 'Éducation', color: colorScheme['300'] },
      { code: '470', title: 'Latin', color: colorScheme['400'] },
      { code: '570', title: 'Sciences vie', color: colorScheme['500'] },
      { code: '670', title: 'Fabrication', color: colorScheme['600'] },
      { code: '770', title: 'Photographie', color: colorScheme['700'] },
      { code: '870', title: 'Littérature latine', color: colorScheme['800'] },
      { code: '970', title: 'Histoire Amérique Nord', color: colorScheme['900'] },
    ],
    [
      { code: '080', title: 'Recueils généraux', color: colorScheme['000'] },
      { code: '180', title: 'Philosophie ancienne', color: colorScheme['100'] },
      { code: '280', title: 'Confessions', color: colorScheme['200'] },
      { code: '380', title: 'Commerce', color: colorScheme['300'] },
      { code: '480', title: 'Grec', color: colorScheme['400'] },
      { code: '580', title: 'Botanique', color: colorScheme['500'] },
      { code: '680', title: 'Produits spécifiques', color: colorScheme['600'] },
      { code: '780', title: 'Musique', color: colorScheme['700'] },
      { code: '880', title: 'Littérature grecque', color: colorScheme['800'] },
      { code: '980', title: 'Histoire Amérique Sud', color: colorScheme['900'] },
    ],
    [
      { code: '090', title: 'Manuscrits rares', color: colorScheme['000'] },
      { code: '190', title: 'Philosophie moderne', color: colorScheme['100'] },
      { code: '290', title: 'Autres religions', color: colorScheme['200'] },
      { code: '390', title: 'Coutumes', color: colorScheme['300'] },
      { code: '490', title: 'Autres langues', color: colorScheme['400'] },
      { code: '590', title: 'Zoologie', color: colorScheme['500'] },
      { code: '690', title: 'Construction', color: colorScheme['600'] },
      { code: '790', title: 'Loisirs', color: colorScheme['700'] },
      { code: '890', title: 'Autres littératures', color: colorScheme['800'] },
      { code: '990', title: 'Histoire autres régions', color: colorScheme['900'] },
    ],
  ];

  return (
    <div className="max-h-[75vh] overflow-y-auto">
      <div className="grid grid-cols-10 gap-1 p-4 bg-gray-100 rounded-lg">
        {/* En-têtes des colonnes - fixées en haut */}
        <div className="col-span-10 grid grid-cols-10 gap-1 mb-2 sticky top-0 bg-gray-100 p-2 shadow-md z-10">
          {Object.entries(colorScheme).map(([code, color]) => (
            <div 
              key={code} 
              className={`${color} p-2 rounded-md text-white text-center font-bold`}
            >
              {code}
            </div>
          ))}
        </div>
    
        {deweyGrid.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <div
                key={`${rowIndex}-${cellIndex}`}
                className={`${cell.color} p-2 rounded-md shadow-sm transition-all duration-200 text-white cursor-pointer hover:scale-105`}
              >
                <div className="text-xs font-medium opacity-80">{cell.code}</div>
                <div className="text-sm font-semibold mt-1 line-clamp-2">{cell.title}</div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Composant modal principal
const DeweyModal: React.FC = () => {
  const { isOpen, close } = useModalStore();
  
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-7xl max-h-screen overflow-hidden">
        <DialogHeader className="pb-2">
          <DialogTitle>Classification décimale de Dewey</DialogTitle>
        </DialogHeader>
        <DeweyGrid />
      </DialogContent>
    </Dialog>
  );
};

// Hook pour le raccourci clavier
export const useKeyboardShortcut = () => {
  const { open } = useModalStore();
 
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        open();
      }
    };
   
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);
};

// Exports
export { useModalStore };
export default DeweyModal;