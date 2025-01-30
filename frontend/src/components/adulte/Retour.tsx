import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookReturnComponent from './BookReturn';
import BookReturn from './BookReturnNumeroCarte';

const Retour: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Gestion des Exemplaires</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="1">ISBN de l'exemplaire</TabsTrigger>
          <TabsTrigger value="2">N° de Carte</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <BookReturnComponent />
        </TabsContent>
        <TabsContent value="2">
          <BookReturn />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Retour;