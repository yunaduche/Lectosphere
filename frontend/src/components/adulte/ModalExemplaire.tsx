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

interface ConfirmAddExemplaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookTitle: string;
}

const ConfirmAddExemplaireModal: React.FC<ConfirmAddExemplaireModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  bookTitle
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ajouter un nouvel exemplaire ?</AlertDialogTitle>
          <AlertDialogDescription>
            Un livre avec cet ISBN existe déjà : "{bookTitle}". 
            Voulez-vous ajouter un nouvel exemplaire de ce livre ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Ajouter un exemplaire</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmAddExemplaireModal;