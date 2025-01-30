import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, Bell } from 'lucide-react';
import logo from '../assets/logo.png';
import LogoutModal from './LogoutModal';
import { logout } from '../hooks-redux/authSlice';

// Types
interface RootState {
  auth: {
    user: {
      username: string;
      role: string;
    } | null;
  };
}

interface Notification {
  id: string;
  message: string;
}

const TopBar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);


  const notifications: Notification[] = [
    { id: '2102S', message: 'a un emprunt en retard devra être retourné aujourd\'hui' },
    { id: '1489E', message: 'a un emprunt en retard devra être retourné aujourd\'hui' }
  ];
  
  const user = useSelector((state: RootState) => state.auth.user);

  const formatRole = (role: string): string => {
    const roleMap: { [key: string]: string } = {
      'admin': 'Administrateur',
      'bibliothecaire_jeunesse': 'Bibliothécaire Jeunesse',
      'bibliothecaire_adulte': 'Bibliothécaire Adulte',
      'chef_bibliothecaire': 'Chef Bibliothécaire'
    };
    return roleMap[role] || role;
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        dispatch(logout());
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-10 flex items-center justify-between bg-white p-4 shadow-sm">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-9 w-9" />
          <h1 className="text-xl font-semibold text-[#335262]">LectOsphere</h1>
        </div>
       
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center mr-4 text-[#335262]">
              <span className="font-medium">
                {user.username} / {formatRole(user.role)}
              </span>
            </div>
          )}

          <div className="relative">
            <button 
              className="rounded-full bg-[#335262] p-2 text-white hover:bg-opacity-80 hover:text-[#e7c568] focus:outline-none focus:ring-2 focus:ring-[#e7c568]"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && notifications.length > 0 && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="p-2">
                  <h3 className="text-lg font-semibold text-[#335262] mb-2">Notifications</h3>
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-2 hover:bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">{notif.id}</span> {notif.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          
          <button
            className="rounded-full bg-[#335262] p-2 text-white hover:bg-opacity-80 hover:text-[#e7c568] focus:outline-none focus:ring-2 focus:ring-[#e7c568]"
            onClick={() => setIsLogoutModalOpen(true)}
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
     
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default TopBar;