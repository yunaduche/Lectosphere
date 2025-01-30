import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Input from './Linput'; 

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSession: (sessionName: string) => Promise<void>;
}

const CreateSessionModal: React.FC<CreateSessionModalProps> = ({
  isOpen,
  onClose,
  onCreateSession,
}) => {
  const [sessionName, setSessionName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onCreateSession(sessionName);
      onClose();
      setSessionName('');
    } catch (error) {
     
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSessionName(e.target.value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      onClose();
      setSessionName('');
    }}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Créer une nouvelle session</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <Input
              id="sessionName"
              name="sessionName"
              type="text"
              value={sessionName}
              onChange={handleInputChange}
              label="Nom de la session"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                setSessionName('');
              }}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!sessionName || isSubmitting}
              className="bg-gradient-to-r from-[#e7c568] to-[#e4d568] hover:from-[#e4d568] hover:to-[#e7c568] text-[#335262]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer la session'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSessionModal;