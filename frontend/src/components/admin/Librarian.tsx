import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks-redux/userReduxHooks';
import { 
  fetchLibrariansRequest, 
  fetchLibrariansSuccess, 
  fetchLibrariansFailure, 
  resetPasswordRequest, 
  resetPasswordSuccess, 
  resetPasswordFailure 
} from '../../hooks-redux/librarianSlice';
import { fetchLibrarians, resetLibrarianPassword } from '../../hooks-redux/service/librarianService';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound, Trash2, Eye, EyeOff, AlertCircle, User, Calendar, Clock, Mail, UserCircle, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CreateLibrarianButton from './CreateLibrarianForm';

const Librarian: React.FC = () => {
  const dispatch = useAppDispatch();
  const { librarians, loading, error } = useAppSelector(state => state.librarian);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedLibrarian, setSelectedLibrarian] = useState<LibrarianType | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const getLibrarians = async () => {
      dispatch(fetchLibrariansRequest());
      try {
        const data = await fetchLibrarians();
        dispatch(fetchLibrariansSuccess(data));
      } catch (error) {
        dispatch(fetchLibrariansFailure(error.message));
      }
    };
    getLibrarians();
  }, [dispatch]);

  const validatePasswords = () => {
    if (newPassword.length < 8) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validatePasswords()) return;

    dispatch(resetPasswordRequest());
    try {
      await resetLibrarianPassword(selectedLibrarian.id, newPassword);
      dispatch(resetPasswordSuccess());
      setIsResetModalOpen(false);
      setSelectedLibrarian(null);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      alert('Mot de passe réinitialisé avec succès');
    } catch (error) {
      dispatch(resetPasswordFailure(error.message));
      alert('Erreur lors de la réinitialisation du mot de passe');
    }
  };

  const handleDelete = async (librarian: LibrarianType) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${librarian.first_name} ${librarian.last_name} ?`)) {
      try {
        await deleteLibrarian(librarian.id);
        const updatedData = await fetchLibrarians();
        dispatch(fetchLibrariansSuccess(updatedData));
      } catch (error) {
        alert('Erreur lors de la suppression du bibliothécaire');
      }
    }
  };

  const openResetModal = (librarian: LibrarianType) => {
    setSelectedLibrarian(librarian);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setIsResetModalOpen(true);
  };

  const openDetailsModal = (librarian: LibrarianType) => {
    setSelectedLibrarian(librarian);
    setIsDetailsModalOpen(true);
  };

  const getRoleColor = (role: string) => {
    const roleColors = {
      admin: 'bg-purple-100 text-purple-800',
      bibliothecaire_jeunesse: 'bg-green-100 text-green-800',
      bibliothecaire_adulte: 'bg-blue-100 text-blue-800',
      chef_bibliothecaire: 'bg-yellow-100 text-yellow-800'
    };
    return roleColors[role] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#335262]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Card className="max-w-7xl mx-auto shadow-sm border rounded-xl">
        <CardContent className="p-6">
          <div className="mb-6  right-0 flex justify-end">
            <CreateLibrarianButton />
          </div>
          
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="bg-[#335262]">
                  <th className="px-6 py-4 text-left text-sm text-white font-semibold text-gray-600">Nom</th>
                  <th className="px-6 py-4 text-left text-sm text-white font-semibold text-gray-600">Prénom</th>
                  <th className="px-6 py-4 text-left text-sm text-white font-semibold text-gray-600">Nom d'utilisateur</th>
                  <th className="px-6 py-4 text-left text-sm text-white font-semibold text-gray-600">Email</th>
                  <th className="px-6 py-4 text-left text-sm text-white font-semibold text-gray-600">Rôle</th>
                  <th className="px-6 py-4 text-left text-sm text-white font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {librarians.map((librarian: LibrarianType) => (
                  <tr 
                    key={librarian.id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => openDetailsModal(librarian)}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">{librarian.last_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{librarian.first_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{librarian.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{librarian.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(librarian.role)}`}>
                        {librarian.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => openResetModal(librarian)}
                          className="p-2 text-gray-600 hover:text-[#e7c568] transition-colors rounded-full hover:bg-gray-100"
                          title="Réinitialiser le mot de passe"
                        >
                          <KeyRound size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(librarian)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors rounded-full hover:bg-red-50"
                          title="Supprimer"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Password Reset Modal */}
      <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Réinitialiser le mot de passe
            </DialogTitle>
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmer le mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {passwordError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsResetModalOpen(false)}
              className="hover:bg-gray-100"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleResetPassword}
              className="bg-[#e7c568] hover:bg-[#d4b55f] text-white"
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Détails du bibliothécaire
            </DialogTitle>
          </DialogHeader>
          {selectedLibrarian && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-center">
                <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                  <User size={48} className="text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <UserCircle className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedLibrarian.first_name} {selectedLibrarian.last_name}
                    </p>
                    <p className="text-xs text-gray-500">Nom complet</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedLibrarian.username}</p>
                    <p className="text-xs text-gray-500">Nom d'utilisateur</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedLibrarian.email}</p>
                    <p className="text-xs text-gray-500">Email</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(selectedLibrarian.created_at)}
                    </p>
                    <p className="text-xs text-gray-500">Date de création</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedLibrarian.last_login ? formatDate(selectedLibrarian.last_login) : 'Jamais connecté'}
                    </p>
                    <p className="text-xs text-gray-500">Dernière connexion</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedLibrarian.role)}`}>
                        {selectedLibrarian.role}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">Rôle</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDetailsModalOpen(false)}
              className="hover:bg-gray-100"
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Librarian;