import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Boxes } from '../extra/BackgroundBublles';
import { Eye, EyeOff } from 'lucide-react';
import Logo from '../../assets/logo.png'
import { loginUser } from '../../hooks-redux/authSlice';
import { RootState, AppDispatch } from '../../hooks-redux/store';
import ForgotPasswordModal from '../extra/ForgotPassword';

interface InputFieldProps {
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  isPassword?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ id, type, value, onChange, label, isPassword }) => {
  const [showPassword, setShowPassword] = useState(false);
  

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative mb-4">
      <input
        id={id}
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        value={value}
        onChange={onChange}
        className="peer w-full px-3 py-3 text-base text-gray-900 bg-white bg-opacity-80 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#e7c568] focus:border-[#e7c568] transition-all duration-200 placeholder-transparent"
        placeholder={label}
        required
      />
      <label
        htmlFor={id}
        className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all duration-200
                   peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
                   peer-focus:-top-2.5 peer-focus:translate-y-0 peer-focus:text-sm peer-focus:text-[#e7c568]"
      >
        {label}
      </label>
      {isPassword && (
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
};

const LoginPageWithBackground: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isAuthenticated, error, redirectUrl, userRole } = useSelector((state: RootState) => state.auth);
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    useEffect(() => {
      if (isAuthenticated) {
        if (redirectUrl) {
          navigate(redirectUrl);
        } else if (userRole) {
          switch (userRole) {
            case 'admin':
              navigate('/admin/dashboard');
              break;
              case 'chef_bibliothecaire':
                navigate('/admin/chef/dashboard');
                break;
            case 'bibliothecaire_jeunesse':
            case 'bibliothecaire_adulte':
              navigate('/bibliothecaire/adulte/dashboard');
              break;
            default:
              navigate('/');
          }
        } else {
          navigate('/'); 
        }
      }
    }, [isAuthenticated, redirectUrl, userRole, navigate]);
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(loginUser({ username, password, navigate }));
      };


  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Boxes />
      </div>
      <div className="relative z-10 bg-white p-8 rounded-lg shadow-md w-96 mt-16">
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
          <div className="w-28 h-28 bg-white rounded-full overflow-hidden border-4 border-gray">
            <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 mt-8">Connexion</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            id="username"
            type="text"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            label="Nom d'utilisateur"
          />
          <InputField
            id="password"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            label="Mot de passe"
            isPassword
          />
          <div className="mb-6 text-left">
          <button 
      onClick={() => setIsModalOpen(true)}
      className="text-sm text-[#335262] hover:underline"
    >
      Mot de passe oublié ?
    </button>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#e7c568] text-white py-2 rounded-md hover:bg-[#335262] transition-colors duration-300"
          >
            Se connecter
          </button>
        </form>
      </div>
      <ForgotPasswordModal 
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
  />  
    </div>
  );
};

export default LoginPageWithBackground;