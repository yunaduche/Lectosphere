import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, RefreshCw, Database, BookOpen, Activity } from "lucide-react";

const AdminDashboard = () => {
  const data = {
    activeLibrarians: 12,
    lastBackup: new Date('2025-01-15T14:30:00'),
    lastSync: new Date('2025-01-15T13:45:00'),
    totalBooks: 24567,
    activeUsers: 892
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen  p-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-[#335262] mb-2">
          Tableau de bord
        </h1>
        <p className="text-[#335262]/60">
          Système de gestion de bibliothèque
        </p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-6 auto-rows-[minmax(120px,auto)]">
        {/* Grande carte des bibliothécaires actifs */}
        <Card className="md:col-span-2 border-2 border-[#335262]/20 transform hover:scale-[1.02] transition-transform duration-300">
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-xl font-medium text-[#335262]">
              Bibliothécaires actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mt-4">
              <div className="p-4 rounded-full bg-[#e7c568]/10">
                <Users className="h-8 w-8 text-[#e7c568]" />
              </div>
              <div className="text-4xl font-bold text-[#335262]">
                {data.activeLibrarians}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carte de la dernière sauvegarde - plus haute */}
        <Card className="md:col-span-4 border-2 border-[#335262]/20 transform hover:scale-[1.02] transition-transform duration-300">
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-xl font-medium text-[#335262]">
              Dernière sauvegarde
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <div className="p-4 rounded-full bg-[#e7c568]/10">
                  <Database className="h-8 w-8 text-[#e7c568]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#335262]">
                    {formatDate(data.lastBackup)}
                  </div>
                  <div className="text-sm text-[#335262]/60">
                    Sauvegarde automatique
                  </div>
                </div>
              </div>
              <div className="hidden md:block p-4 rounded-lg bg-[#335262]/5">
                <Activity className="h-16 w-16 text-[#335262]/20" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carte de synchronisation OPAC - large */}
        <Card className="md:col-span-4 border-2 border-[#335262]/20 transform hover:scale-[1.02] transition-transform duration-300">
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-xl font-medium text-[#335262]">
              Synchronisation OPAC - SGB
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <div className="p-4 rounded-full bg-[#e7c568]/10">
                  <RefreshCw className="h-8 w-8 text-[#e7c568]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#335262]">
                    {formatDate(data.lastSync)}
                  </div>
                  <div className="text-sm text-[#335262]/60">
                    Dernière mise à jour
                  </div>
                </div>
              </div>
              <div className="hidden md:flex flex-col items-end">
                <div className="text-sm font-medium text-[#335262]/60">
                  Statut
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-sm font-medium">Synchronisé</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carte des statistiques - petite */}
        <Card className="md:col-span-2 border-2 border-[#335262]/20 transform hover:scale-[1.02] transition-transform duration-300">
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-xl font-medium text-[#335262]">
              Collection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mt-4">
              <div className="p-4 rounded-full bg-[#e7c568]/10">
                <BookOpen className="h-8 w-8 text-[#e7c568]" />
              </div>
              <div>
                <div className="text-3xl font-bold text-[#335262]">
                  {data.totalBooks.toLocaleString()}
                </div>
                <div className="text-sm text-[#335262]/60">
                  Ouvrages
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;