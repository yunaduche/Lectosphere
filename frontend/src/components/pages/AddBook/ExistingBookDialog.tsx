import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ExistingBookInfo } from '../types/BookTypes';

interface ExistingBookDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  existingBook: ExistingBookInfo | null;
  onAddExemplaire: () => Promise<void>;
}

export const ExistingBookDialog: React.FC<ExistingBookDialogProps> = ({
  showDialog,
  setShowDialog,
  existingBook,
  onAddExemplaire
}) => {
  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Livre déjà existant</AlertDialogTitle>
          <AlertDialogDescription>
            {existingBook && (
              <div className="space-y-2">
                <p>Un livre avec cet ISBN existe déjà dans la bibliothèque :</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Titre : {existingBook.titre}</li>
                  <li>ISBN : {existingBook.isbn}</li>
                  <li>Auteurs : {existingBook.auteurs.join(', ')}</li>
                  <li>Nombre d'exemplaires : {existingBook.nombre_exemplaires}</li>
                  <li>Section : {existingBook.section}</li>
                </ul>
                <p>Voulez-vous ajouter un nouvel exemplaire ?</p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onAddExemplaire}>
            Ajouter un exemplaire
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};