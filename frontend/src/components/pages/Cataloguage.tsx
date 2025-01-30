import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddBook from './AddBook';
import AddBookWithoutISBN from './AddBookWithOutISBN';

const Catalogue: React.FC = () => {
  const [activeTab, setActiveTab] = useState('addBook');

  return (
    <div className="container mx-auto ">

     
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full relative">
        <TabsList className="grid w-full grid-cols-2 relative overflow-hidden bg-gray-100 rounded-lg shadow-md">
          <div 
            className="absolute bottom-0 h-1 bg-[#335262] transition-all duration-300 ease-in-out" 
            style={{
              left: "var(--tab-underline-left, 0)",
              width: "var(--tab-underline-width, 0)",
              transform: "translateX(var(--tab-underline-translate, 0))"
            }} 
          />
          <TabsTrigger 
            value="addBook"
            className={`relative transition-colors duration-300 rounded-lg p-3 text-center 
                        ${activeTab === 'addBook' ? 'text-[#335262] font-bold bg-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const parent = e.currentTarget.parentElement;
              const parentRect = parent.getBoundingClientRect();
              document.documentElement.style.setProperty('--tab-underline-left', `${rect.left - parentRect.left}px`);
              document.documentElement.style.setProperty('--tab-underline-width', `${rect.width}px`);
            }}
            aria-selected={activeTab === 'addBook'}
          >
            Ajouter un livre avec ISBN
          </TabsTrigger>
          <TabsTrigger 
            value="addBookWithoutISBN"
            className={`relative transition-colors duration-300 rounded-lg p-3 text-center 
                        ${activeTab === 'addBookWithoutISBN' ? 'text-[#335262] font-bold bg-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const parent = e.currentTarget.parentElement;
              const parentRect = parent.getBoundingClientRect();
              document.documentElement.style.setProperty('--tab-underline-left', `${rect.left - parentRect.left}px`);
              document.documentElement.style.setProperty('--tab-underline-width', `${rect.width}px`);
            }}
            aria-selected={activeTab === 'addBookWithoutISBN'}
          >
            Ajouter un livre sans ISBN
          </TabsTrigger>
        </TabsList>
        
        <TabsContent 
          value="addBook"
          className="mt-6 transition-opacity duration-300 ease-in-out"
        >
          <AddBook />
        </TabsContent>
        <TabsContent 
          value="addBookWithoutISBN"
          className="mt-6 transition-opacity duration-300 ease-in-out"
        >
          <AddBookWithoutISBN />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Catalogue;