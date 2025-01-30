import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { BookOpen, User, Calendar, Ban, CheckCircle2, XCircle } from 'lucide-react';

export const QuickInfo = ({ adherent }) => (
  <Card className="w-full backdrop-blur-sm bg-white/80 shadow-lg border border-gray-100">
    <CardContent className="p-6 flex items-center space-x-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-inner">
        <User className="text-white" size={28} />
      </div>
      <div className="flex-grow">
        <p className="font-semibold text-gray-900 text-lg tracking-tight">{adherent.nom}</p>
        <p className="text-sm text-gray-600 font-medium">Carte: {adherent.numero_carte}</p>
      </div>
      <div className="flex space-x-3">
        {adherent.adhesion_valide ? (
          <div className="flex items-center bg-gradient-to-r from-emerald-50 to-green-50 border border-green-100 text-green-700 px-4 py-2 rounded-xl text-sm space-x-2">
            <CheckCircle2 size={16} />
            <span className="font-medium">Valide</span>
          </div>
        ) : (
          <div className="flex items-center bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 text-red-700 px-4 py-2 rounded-xl text-sm space-x-2">
            <XCircle size={16} />
            <span className="font-medium">Expiré</span>
          </div>
        )}
        {adherent.banni && (
          <div className="flex items-center bg-gradient-to-r from-red-100 to-rose-100 border border-red-200 text-red-800 px-4 py-2 rounded-xl text-sm space-x-2">
            <Ban size={16} />
            <span className="font-medium">Banni</span>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export const DetailedInfo = ({ adherent, onBorrow }) => {
  const [isbn, setIsbn] = useState('');
  const [exemplarId, setExemplarId] = useState('');

  const infoFields = [
    ['ID', adherent.id],
    ['Email', adherent.email || 'Non renseigné'],
    ['Téléphone', adherent.numero_telephone],
    ['Quartier', adherent.quartier],
    ['Adresse', adherent.adresse],
    ['Type d\'adhésion', adherent.type_adhesion],
    ['Fin d\'adhésion', new Date(adherent.fin_adhesion).toLocaleDateString()],
    ['Emprunts en cours', adherent.emprunt_en_cours],
    ['Emprunts en retard', adherent.emprunts_en_retard],
    ['Total emprunts', adherent.nombre_total_emprunts],
    ['Nombre de retards', adherent.nb_retard_retour]
  ];

  return (
    <div className="space-y-8 bg-gradient-to-b from-white to-gray-50/50 rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="grid grid-cols-2 gap-6">
        {infoFields.map(([label, value]) => (
          <div key={label} className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-gray-100 transition-all hover:shadow-md">
            <dt className="text-sm font-medium text-gray-600 mb-1">{label}</dt>
            <dd className="text-base font-semibold text-gray-900">{value}</dd>
          </div>
        ))}
      </div>

      {adherent.peut_emprunter && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
              <BookOpen className="text-white" size={24} />
            </div>
            <h4 className="text-xl font-semibold text-gray-900">Nouvel emprunt</h4>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
              <input
                type="text"
                placeholder="Entrez l'ISBN"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ID Exemplaire</label>
              <input
                type="text"
                placeholder="ID de l'exemplaire"
                value={exemplarId}
                onChange={(e) => setExemplarId(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
          <button
            onClick={onBorrow}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg shadow-blue-500/20"
          >
            Emprunter
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailedInfo;