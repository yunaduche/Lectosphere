import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface MembershipType {
  id: number;
  name: string;
}

const MembershipTypeManager = () => {
  const [types, setTypes] = useState<MembershipType[]>([
    { id: 1, name: "Adhésion Scolaire" },
    { id: 2, name: "Adhésion Adulte" },
    { id: 2, name: "Adhésion Etudiant" }
  ]);

  const [newTypeName, setNewTypeName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTypeName.trim()) {
      setTypes(prev => [...prev, { id: prev.length + 1, name: newTypeName }]);
      setNewTypeName('');
    }
  };

  const handleDelete = (id: number) => {
    setTypes(prev => prev.filter(type => type.id !== id));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-[#335262]">Types d'adhésion</h1>
      
      {/* Liste des types d'adhésion */}
      <div className="mb-8 space-y-3">
        {types.map(type => (
          <div 
            key={type.id} 
            className="p-3 rounded flex justify-between items-center border border-[#335262]/20 hover:border-[#335262]/40 transition-colors"
          >
            <span className="font-medium text-[#335262]">{type.name}</span>
            <button
              onClick={() => handleDelete(type.id)}
              className="text-[#335262] hover:text-[#e7c568] transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-[#335262]">
            Nom du type d'adhésion
          </label>
          <input
            type="text"
            value={newTypeName}
            onChange={e => setNewTypeName(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#335262] focus:border-[#335262] outline-none"
            placeholder="Entrez le nom du type d'adhésion"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#335262] text-white py-2 px-4 rounded hover:bg-[#e7c568] transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default MembershipTypeManager;