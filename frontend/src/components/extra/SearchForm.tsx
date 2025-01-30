import React, { useState, useRef } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  ChevronDown,
  BookText,
  FileText,
  Barcode,
  Users,
  Building2,
  Tag,
  LayoutGrid,
  Globe,
  CalendarDays,
  Layers,
  User,
  ClipboardList,
  ShoppingBag
} from 'lucide-react';
import Input from '../myui/Linput';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";  

interface DateRange {
  start?: string;
  end?: string;
}

interface PageRange {
  min?: number;
  max?: number;
}

interface CriteresRecherche {
  titre?: string;
  description?: string;
  isbn?: string;
  auteurs?: string;
  editeurs?: string;
  mots_cle?: string;
  format?: string;
  categorie?: string;
  langue?: string;
  date_publication?: string | DateRange;
  nombre_pages?: number | PageRange;
  catalogueur_username?: string;
  date_catalogage?: string | DateRange;
  id_session_acquisition?: string;
  acquisition_status?: string;
}

interface SearchFormProps {
  criteresRecherche: CriteresRecherche;
  gererChangementInput: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  gererSoumission: (e: React.FormEvent) => void;
}

const searchFields = [
  { 
    value: 'titre', 
    label: 'Titre', 
    
    icon: BookText,
    
  },
  { 
    value: 'description', 
    label: 'Description', 
    
    icon: FileText,
    
  },
  { 
    value: 'isbn', 
    label: 'ISBN', 
    
    icon: Barcode,
    
  },
  { 
    value: 'auteurs', 
    label: 'Auteurs', 
    
    icon: Users,
    
  },
  { 
    value: 'editeurs', 
    label: 'Éditeurs', 
   
    icon: Building2,
    
  },
  { 
    value: 'mots_cle', 
    label: 'Mots-clés', 
   
    icon: Tag,
    
  },
  { 
    value: 'categorie', 
    label: 'Catégorie', 
   
    icon: LayoutGrid,
   
  },
  { 
    value: 'langue', 
    label: 'Langue', 
  
    icon: Globe,
   
  }
];

const SearchForm: React.FC<SearchFormProps> = ({
  criteresRecherche,
  gererChangementInput,
  gererSoumission
}) => {
  const [selectedField, setSelectedField] = useState(searchFields[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const Icon = selectedField.icon;
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const event = {
      target: {
        name: selectedField.value,
        value: e.target.value
      }
    } as React.ChangeEvent<HTMLInputElement>;
    gererChangementInput(event);
  };

  const handleFieldSelect = (field: typeof searchFields[0]) => {
    setSelectedField(field);
    const resetEvent = {
      target: {
        name: selectedField.value,
        value: ''
      }
    } as React.ChangeEvent<HTMLInputElement>;
    gererChangementInput(resetEvent);
  };

  const handleModalSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    
    if (formRef.current) {
      const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
      formRef.current.dispatchEvent(submitEvent);
    }
  };

  return (
    <div className="w-full max-w-4xl mb-6">
      <form onSubmit={gererSoumission} className="relative">
        {/* Barre de recherche principale */}
        <div className="relative flex items-center gap-2 bg-white rounded-xl shadow-lg p-1.5 group transition-all duration-300 hover:shadow-xl border border-gray-100">
          <div className="relative flex-1 flex items-center mt-2">
            <Icon className="absolute left-3 w-5 h-5 text-[#335262]" />
            <Input
              type="text"
              value={criteresRecherche[selectedField.value as keyof CriteresRecherche] || ''}
              onChange={handleSearchChange}
              placeholder={selectedField.placeholder}
              className="mt-3"
              label={selectedField.label}
            />
          </div>

          {/* Sélecteur de critère */}
          {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger 
          className={`
            flex items-center gap-2 px-4 py-2.5 
            text-[#335262] hover:bg-gray-50 rounded-lg
            transition-all duration-200 relative
            ${isOpen ? 'shadow-lg bg-white ring-2 ring-[#e7c568] z-40' : ''}
          `}
        >
          <span className="font-medium">{selectedField.label}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </DropdownMenuTrigger>

        <DropdownMenuContent 
          className={`
            w-64 p-1 bg-white shadow-xl rounded-xl border border-gray-100
            relative z-50 animate-in fade-in-0 zoom-in-95 duration-200
          `}
        >
          {searchFields.map((field) => {
            const FieldIcon = field.icon;
            return (
              <DropdownMenuItem
                key={field.value}
                onClick={() => handleFieldSelect(field)}
                className={`
                  flex items-center gap-3 px-4 py-3 cursor-pointer 
                  hover:bg-gray-50 rounded-lg group
                  transition-all duration-200
                  ${selectedField.value === field.value ? 'bg-gray-50' : ''}
                `}
              >
                <FieldIcon 
                  className={`
                    w-5 h-5 transition-colors duration-200
                    ${selectedField.value === field.value 
                      ? 'text-[#e7c568]' 
                      : 'text-[#335262] group-hover:text-[#e7c568]'}
                  `} 
                />
                <div className="flex flex-col">
                  <span className="font-medium">{field.label}</span>
               
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

          {/* Modal de recherche avancée */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="p-2.5 text-[#335262] hover:bg-gray-50 rounded-lg transition-colors duration-200"
                title="Recherche avancée"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] bg-white p-0 rounded-xl">
                <DialogHeader className="px-6 py-4 border-b">
                  <DialogTitle className="text-2xl font-semibold text-[#335262]">
                    Recherche avancée
                  </DialogTitle>
                </DialogHeader>
                
                <Tabs defaultValue="general"  className="w-full ">
                <TabsList className="relative px-6 border-b bg-[#e7c568] overflow-hidden">
        <div className="absolute bottom-0 h-0.5 bg-[#335262] transition-all duration-500 ease-out" 
             style={{
               left: "var(--tab-underline-left, 0)",
               width: "var(--tab-underline-width, 0)",
               transform: "translateX(var(--tab-underline-translate, 0))"
             }} 
        />
        <TabsTrigger 
          value="general" 
          className="relative data-[state=active]:text-[#335262] transition-colors duration-300
                     after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 
                     after:bg-[#335262] after:opacity-0 after:transition-opacity"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const parent = e.currentTarget.parentElement;
            const parentRect = parent.getBoundingClientRect();
            document.documentElement.style.setProperty('--tab-underline-left', `${rect.left - parentRect.left}px`);
            document.documentElement.style.setProperty('--tab-underline-width', `${rect.width}px`);
          }}
        >
          Informations générales
        </TabsTrigger>
        <TabsTrigger 
          value="metadata" 
          className="relative data-[state=active]:text-[#335262] transition-colors duration-300
                     after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 
                     after:bg-[#335262] after:opacity-0 after:transition-opacity"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const parent = e.currentTarget.parentElement;
            const parentRect = parent.getBoundingClientRect();
            document.documentElement.style.setProperty('--tab-underline-left', `${rect.left - parentRect.left}px`);
            document.documentElement.style.setProperty('--tab-underline-width', `${rect.width}px`);
          }}
        >
          Métadonnées
        </TabsTrigger>
        <TabsTrigger 
          value="acquisition" 
          className="relative data-[state=active]:text-[#335262] transition-colors duration-300
                     after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 
                     after:bg-[#335262] after:opacity-0 after:transition-opacity"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const parent = e.currentTarget.parentElement;
            const parentRect = parent.getBoundingClientRect();
            document.documentElement.style.setProperty('--tab-underline-left', `${rect.left - parentRect.left}px`);
            document.documentElement.style.setProperty('--tab-underline-width', `${rect.width}px`);
          }}
        >
          Acquisition
        </TabsTrigger>
      </TabsList>

                  <div className="px-6 py-4">
                    <TabsContent value="general" className="mt-0">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <Input
                            label="Titre"
                            name="titre"
                            value={criteresRecherche.titre || ''}
                            onChange={gererChangementInput}
                            icon={<BookText className="text-[#335262]" />}
                          />
                        </div>
                        <Input
                          label="ISBN"
                          name="isbn"
                          value={criteresRecherche.isbn || ''}
                          onChange={gererChangementInput}
                          icon={<Barcode className="text-[#335262]" />}
                        />
                        <Input
                          label="Auteurs"
                          name="auteurs"
                          value={criteresRecherche.auteurs || ''}
                          onChange={gererChangementInput}
                          icon={<Users className="text-[#335262]" />}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="metadata" className="mt-0">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Mots-clés"
                          name="mots_cle"
                          value={criteresRecherche.mots_cle || ''}
                          onChange={gererChangementInput}
                          icon={<Tag className="text-[#335262]" />}
                        />
                        <Input
                          label="Catégorie"
                          name="categorie"
                          value={criteresRecherche.categorie || ''}
                          onChange={gererChangementInput}
                          icon={<LayoutGrid className="text-[#335262]" />}
                        />
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Format
                          </label>
                          <select
                            name="format"
                            value={criteresRecherche.format || ''}
                            onChange={gererChangementInput}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#335262] transition-all duration-200"
                          >
                            <option value="">Tous les formats</option>
                            <option value="lecture sur place">Lecture sur place</option>
                            <option value="empruntable">Empruntable</option>
                          </select>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="acquisition" className="mt-0">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Catalogueur"
                          name="catalogueur_username"
                          value={criteresRecherche.catalogueur_username || ''}
                          onChange={gererChangementInput}
                          icon={<User className="text-[#335262]" />}
                        />
                        <Input
                          label="ID Session"
                          name="id_session_acquisition"
                          value={criteresRecherche.id_session_acquisition || ''}
                          onChange={gererChangementInput}
                          icon={<ClipboardList className="text-[#335262]" />}
                        />
                        <Input
                          label="Statut d'acquisition"
                          name="acquisition_status"
                          value={criteresRecherche.acquisition_status || ''}
                          onChange={gererChangementInput}
                          icon={<ShoppingBag className="text-[#335262]" />}
                        />
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>

                <div className="flex justify-end gap-3 px-6 py-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleModalSubmit}
                  className="px-4 py-2 bg-[#335262] text-white rounded-lg hover:bg-[#2a4251] transition-colors duration-200"
                >
                  Appliquer les filtres
                </button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Bouton de recherche */}
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#e7c568] text-white rounded-lg hover:bg-[#e4d568] transition-colors duration-200 font-medium"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;