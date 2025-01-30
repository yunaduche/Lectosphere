import React from 'react';
import DatabaseExport from './Sauvegarde';
import BookDataExport from './BookExport';
import BackupConfigForm from './BackupConfig';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const DatabaseManager = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Colonne de gauche - BackupConfig */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="h-full shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Configuration de la sauvegarde
              </h2>
              <BackupConfigForm />
            </CardContent>
          </Card>
        </div>

        {/* Colonne de droite - Exports */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Export complet */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Export de la base de données
              </h2>
              <DatabaseExport />
            </CardContent>
          </Card>

          {/* Séparateur stylisé */}
          <div className="relative py-4">
            <Separator className="my-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-gray-50 px-4 text-sm font-medium text-gray-500">
                EXPORT SPÉCIFIQUE
              </span>
            </div>
          </div>

          {/* Export spécifique */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Export des livres
              </h2>
              <BookDataExport />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DatabaseManager;