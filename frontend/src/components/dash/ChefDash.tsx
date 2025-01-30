import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Users, Bell, BookOpen, Clock, Library } from "lucide-react";

const ChefDashboard = () => {
  const stats = {
    sessionName: "Acquisitions Q1 2025",
    adultBooks: 24567,
    childrenBooks: 12345,
    activeLibrarians: 42,
    activeAnnouncements: 15,
    newAcquisitions: 234
  };

  const StatCard = ({ title, value, icon: Icon, subtitle = "", trend = null }) => (
    <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-[#e7c568]" />
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="relative z-10">
            <p className="text-sm font-medium text-[#335262]/70 tracking-wide uppercase">{title}</p>
            <h3 className="text-3xl font-bold text-[#335262] mt-2 tracking-tight">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#335262]/60 mt-2 tracking-wide">{subtitle}</p>
            )}
          </div>
          <div className="relative">
            <div className="absolute -top-1 -right-1 w-12 h-12 bg-[#e7c568]/10 rounded-full" />
            <Icon className="h-8 w-8 text-[#e7c568] relative z-10" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-8">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <Library className="h-10 w-10 text-[#e7c568]" />
            <div>
              <h1 className="text-4xl font-bold text-[#335262] tracking-tight">Tableau de Bord Bibliothèque</h1>
              <div className="h-1 w-24 bg-[#e7c568] mt-2 rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-[#e7c568]" />
            <p className="text-[#335262]/70 text-lg">
              Session en cours: <span className="font-semibold">{stats.sessionName}</span>
            </p>
          </div>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <StatCard 
            title="Section Adulte"
            value={stats.adultBooks}
            icon={Book}
            subtitle="Total des exemplaires disponibles"
          />
          
          <StatCard 
            title="Section Jeunesse"
            value={stats.childrenBooks}
            icon={BookOpen}
            subtitle="Total des exemplaires disponibles"
          />
          
          <StatCard 
            title="Bibliothécaires"
            value={stats.activeLibrarians}
            icon={Users}
            subtitle="Professionnels actifs"
          />
          
          <StatCard 
            title="Annonces OPAC"
            value={stats.activeAnnouncements}
            icon={Bell}
            subtitle="Communications en cours"
          />
          
          <StatCard 
            title="Acquisitions"
            value={stats.newAcquisitions}
            icon={Clock}
            subtitle="Nouveautés ce mois-ci"
          />
        </div>
      </div>
    </div>
  );
};

export default ChefDashboard;