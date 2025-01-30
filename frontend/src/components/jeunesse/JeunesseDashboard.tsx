import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Book, Users, Bell, BookOpen, Clock, Library, ArrowUp, ArrowDown, BookMarked } from "lucide-react";
import { useState } from 'react';

const JeunesseDashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const stats = {
    sessionName: "Acquisitions Q1 2025",
    adultBooks: 24567,
    childrenBooks: 12345,
    activeLibrarians: 42,
    activeAnnouncements: 15,
    newAcquisitions: 234,
    trends: {
      adultBooks: 12,
      childrenBooks: -5,
      activeLibrarians: 8,
      activeAnnouncements: 25,
      newAcquisitions: 15
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    subtitle = "", 
    trend = 0,
    size = "normal",
    shape = "default",
    offset = "none",
    index 
  }) => {
    const isPositive = trend >= 0;
    
    const sizeClasses = {
      large: "md:col-span-2 md:row-span-2",
      normal: "col-span-1",
      small: "col-span-1"
    };

    const shapeClasses = {
      default: "rounded-2xl",
      curved: "rounded-[2rem]",
      angular: "rounded-none",
      special: "rounded-tl-[3rem] rounded-br-[3rem]",
      wave: "rounded-t-[3rem]"
    };

    const offsetClasses = {
      none: "",
      up: "md:-mt-12",
      down: "md:mt-12"
    };
    
    return (
      <Card className={`
        group relative overflow-hidden bg-white
        hover:shadow-xl transition-all duration-500
        ${sizeClasses[size]}
        ${shapeClasses[shape]}
        ${offsetClasses[offset]}
        ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        transition-all duration-700 delay-${index * 150}
      `}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#335262]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className={`
          absolute top-0 left-0 w-1 h-full 
          ${shape === 'curved' ? 'rounded-l-[2rem]' : ''}
          ${shape === 'special' ? 'rounded-tl-[3rem]' : ''}
          bg-gradient-to-b from-[#e7c568] to-[#e7c568]/50
        `} />
        <CardContent className={`p-6 ${size === 'large' ? 'md:p-8' : ''}`}>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className={`
                p-2 rounded-xl bg-[#335262]/5 group-hover:bg-[#335262]/10 transition-colors duration-300
                ${size === 'large' ? 'p-3' : ''}
              `}>
                <Icon className={`
                  text-[#335262]
                  ${size === 'large' ? 'h-8 w-8' : 'h-6 w-6'}
                `} />
              </div>
              {trend !== undefined && (
                <div className={`
                  flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                  ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                `}>
                  {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {Math.abs(trend)}%
                </div>
              )}
            </div>
            
            <div>
              <h3 className={`
                font-bold text-[#335262] tracking-tight mb-1
                ${size === 'large' ? 'text-5xl' : 'text-4xl'}
              `}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </h3>
              <p className="text-sm font-medium text-[#335262]/70 tracking-wide">
                {title}
              </p>
            </div>

            {subtitle && (
              <p className="text-xs text-[#335262]/60 tracking-wide border-t border-[#335262]/10 pt-4">
                {subtitle}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-8">
        <header className={`
          mb-24 transform transition-all duration-700 delay-100
          ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        `}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-[#e7c568]/20 to-[#e7c568]/10 rounded-2xl">
                <Library className="h-10 w-10 text-[#e7c568]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#335262] tracking-tight">
                  Tableau de Bord Bibliothèque
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-[#e7c568] to-[#e7c568]/50 mt-2 rounded-full" />
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl shadow-sm">
              <div className="h-2 w-2 rounded-full bg-[#e7c568] animate-pulse" />
              <p className="text-[#335262]/70 text-lg">
                Session: <span className="font-semibold">{stats.sessionName}</span>
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { 
              title: "Section Adulte", 
              value: stats.adultBooks, 
              subtitle: "Total des exemplaires disponibles",
              trend: stats.trends.adultBooks,
              icon: Book,
              size: "large",
              shape: "special",
              offset: "none"
            },
            { 
              title: "Section Jeunesse", 
              value: stats.childrenBooks, 
              subtitle: "Total des exemplaires disponibles",
              trend: stats.trends.childrenBooks,
              icon: BookOpen,
              size: "normal",
              shape: "curved",
              offset: "up"
            },
            { 
              title: "Bibliothécaires", 
              value: stats.activeLibrarians, 
              subtitle: "Professionnels actifs",
              trend: stats.trends.activeLibrarians,
              icon: Users,
              size: "normal",
              shape: "angular",
              offset: "down"
            },
            { 
              title: "Annonces OPAC", 
              value: stats.activeAnnouncements, 
              subtitle: "Communications en cours",
              trend: stats.trends.activeAnnouncements,
              icon: Bell,
              size: "normal",
              shape: "wave",
              offset: "up"
            },
            { 
              title: "Acquisitions", 
              value: stats.newAcquisitions, 
              subtitle: "Nouveautés ce mois-ci",
              trend: stats.trends.newAcquisitions,
              icon: Clock,
              size: "normal",
              shape: "default",
              offset: "down"
            }
          ].map((stat, index) => (
            <StatCard
              key={stat.title}
              {...stat}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default JeunesseDashboard;