import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const InactiveSession = () => {
  return (
    <div className="min-h-screen bg-slate-100 p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl p-8 flex flex-col items-center justify-center space-y-6 shadow-lg">
        <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-slate-600" />
        </div>
        
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-semibold text-slate-800">
            Aucune session active
          </h2>
          
          <p className="text-slate-600 text-lg">
            Vous n'avez pas de session en cours. Veuillez créer une nouvelle session pour accéder à cette fonctionnalité.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default InactiveSession;