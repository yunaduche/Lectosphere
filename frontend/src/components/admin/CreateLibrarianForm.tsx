import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { createLibrarian } from '../../hooks-redux/userActions';
import { RootState } from '../../hooks-redux/store';
import { 
  UserPlus, 
  User, 
  Mail, 
  Key, 
  UserCircle, 
  BookOpen,
  X,
  Loader2
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UserData {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  email: string;
  role: 'bibliothecaire_jeunesse' | 'bibliothecaire_adulte';
}

const CreateLibrarianButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className="bg-[#335262] hover:bg-[ #111646] text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
      >
        <UserPlus size={20} />
        <span></span>
      </button>
      {isModalOpen && <CreateLibrarianModal onClose={closeModal} />}
    </>
  );
};

const CreateLibrarianModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserData>({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    email: '',
    role: 'bibliothecaire_jeunesse'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setError(null);
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(createLibrarian(formData));
      onClose();
    } catch (err) {
      setError("Une erreur s'est produite lors de la création du compte");
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = "mt-2 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-blue-500 block w-full rounded-lg text-sm focus:ring-1";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full backdrop-blur-sm" id="my-modal">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-xl bg-white">
        <div className="mt-3">
          <h3 className="text-xl leading-6 font-semibold text-gray-900 flex items-center justify-center gap-2 mb-6">
            <UserPlus className="text-blue-500" size={24} />
            Créer un compte bibliothécaire
          </h3>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-5 text-slate-400" size={16} />
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Prénom"
                className={`${inputClassName} pl-10`}
                required
              />
            </div>

            <div className="relative">
              <User className="absolute left-3 top-5 text-slate-400" size={16} />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Nom"
                className={`${inputClassName} pl-10`}
                required
              />
            </div>

            <div className="relative">
              <UserCircle className="absolute left-3 top-5 text-slate-400" size={16} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nom d'utilisateur"
                className={`${inputClassName} pl-10`}
                required
              />
            </div>

            <div className="relative">
              <Key className="absolute left-3 top-5 text-slate-400" size={16} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mot de passe"
                className={`${inputClassName} pl-10`}
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-5 text-slate-400" size={16} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`${inputClassName} pl-10`}
                required
              />
            </div>

            <div className="relative">
              <BookOpen className="absolute left-3 top-5 text-slate-400" size={16} />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`${inputClassName} pl-10`}
                required
              >
                <option value="bibliothecaire_jeunesse">Bibliothécaire jeunesse</option>
                <option value="bibliothecaire_adulte">Bibliothécaire adulte</option>
              </select>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#335262] text-white text-base font-medium rounded-lg w-full shadow-sm hover:bg-[#335262] focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Créer le compte
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default CreateLibrarianButton;