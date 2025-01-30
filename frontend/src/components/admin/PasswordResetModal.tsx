import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

const PasswordResetModal = ({ 
  isResetModalOpen, 
  setIsResetModalOpen, 
  selectedLibrarian, 
  handleResetPassword 
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleSubmit = () => {
    if (newPassword === confirmPassword) {
      handleResetPassword(newPassword);
    }
  };

  const PasswordToggleButton = ({ shown, onClick }) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
      onClick={onClick}
    >
      {shown ? (
        <EyeOff className="h-4 w-4 text-gray-500" />
      ) : (
        <Eye className="h-4 w-4 text-gray-500" />
      )}
    </Button>
  );

  return (
    <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            {selectedLibrarian && (
              <p className="text-sm text-gray-500">
                Réinitialiser le mot de passe pour {selectedLibrarian.first_name} {selectedLibrarian.last_name}
              </p>
            )}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pr-10"
              />
              <PasswordToggleButton 
                shown={showPassword}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pr-10"
              />
              <PasswordToggleButton 
                shown={showConfirmPassword}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-red-500">
                Les mots de passe ne correspondent pas
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsResetModalOpen(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-[#e7c568] hover:bg-[#d4b55f] text-white"
            disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
          >
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordResetModal;