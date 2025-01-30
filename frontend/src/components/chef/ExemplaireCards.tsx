import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExemplaireModal from './ExemplaireModal';
import { Book } from 'lucide-react';

interface Exemplaire {
  id_exemplaire: number;
  id_livre: number;
  isbn: string;
  disponibilite: boolean;
  format: string;
  derniers_emprunteurs: string;
  emprunteur_numero_carte: string;
  titre: string;
  date_emprunt: string;
  date_retour_prevue: string;
  bibliothecaire_emprunt_id: number;
  section: string;
  date_creation: string;
  auteurs: string;
  code_barre: string;
  preteur_username: string;
}

interface Acquisition {
  session_acquisition_id: number;
  session_nom: string;
  exemplaire_count: number;
  exemplaires: Exemplaire[];
}

const AcquisitionList: React.FC = () => {
  const [acquisitions, setAcquisitions] = useState<Acquisition[]>([]);
  const [selectedSession, setSelectedSession] = useState<Exemplaire[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAcquisitions = async () => {
      try {
        const response = await axios.get('/api/ex/acquisitions');
        setAcquisitions(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des acquisitions:', error);
      }
    };
    fetchAcquisitions();
  }, []);

  const handleCardClick = (exemplaires: Exemplaire[]) => {
    setSelectedSession(exemplaires);
    setShowModal(true);
  };

  return (
    <div className=" ">
      <h1 className="text-3xl font-bold mb-8 text-[#335262]">Sessions d'acquisition</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {acquisitions.map((acq, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(acq.exemplaires)}
            className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-[#335262] opacity-80"></div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-[#335262] mb-2 group-hover:text-[#e7c568] transition-colors">
                    {acq.session_nom}
                  </h2>
                  <p className="text-gray-600 flex items-center">
                    <Book className="w-4 h-4 mr-2 text-[#e7c568]" />
                    <span>{acq.exemplaire_count} exemplaires</span>
                  </p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#e7c568] opacity-0 group-hover:opacity-80 transition-opacity"></div>
            </div>
          </div>
        ))}
      </div>
      {showModal && <ExemplaireModal exemplaires={selectedSession} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default AcquisitionList;