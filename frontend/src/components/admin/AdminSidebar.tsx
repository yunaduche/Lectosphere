import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toggleSidebar } from '../../hooks-redux/sidebarSlice.js';
import { LayoutDashboard, Users, BookOpen, Book, Bell, Settings, User, ChevronRight, ChevronLeft, Menu, LucideIcon } from 'lucide-react';


interface RootState {
  sidebar: {
    isExpanded: boolean;
  };
}

interface NavItem {
  name: string;
  icon: LucideIcon;
  path: string;
  badge?: number | string;
  hasSubmenu?: boolean;
  subItems?: NavItem[];
}

const AdminSidebar: React.FC = () => {
  const isExpanded = useSelector((state: RootState) => state.sidebar.isExpanded);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);

  const navItems: NavItem[] = [
    { 
      name: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/admin/dashboard'
    },
    { 
      name: 'Bibliothecaires', 
      icon: Users, 
      path: '/admin/comptes-bibliothecaire'
    },
    { 
      name: 'Membres', 
      icon: User, 
      path: '/admin/importer'
    },
    { 
      name: 'Maintenance ', 
      icon: BookOpen, 
      path: '/youth-library',
      hasSubmenu: true,
      subItems: [
        { name: 'Sauvegarde', icon: LayoutDashboard, path: '/admin/sauvegarder' },
        { name: 'Restauration', icon: Bell, path: '/admin/restaurer' },
        { name: 'Synchronisation OPAC', icon: Bell, path: '/admin/ameda' }
      
      ]
    },
    
  ];


  const isItemActive = useCallback((item: NavItem): boolean => {
    if (location.pathname === item.path) return true;
    if (item.subItems) {
      return item.subItems.some(subItem => location.pathname === subItem.path);
    }
    return false;
  }, [location.pathname]);

  const handleIconClick = useCallback((item: NavItem) => {
    if (item.hasSubmenu) {
      if (!isExpanded) {
        dispatch(toggleSidebar());
      }
      setExpandedSubmenu(prev => prev === item.name ? null : item.name);
    } else {
      navigate(item.path);
    }
  }, [isExpanded, dispatch, navigate]);

  const NavItem: React.FC<{ item: NavItem, level?: number }> = ({ item, level = 0 }) => {
    const isActive = isItemActive(item);
    const isSubmenuExpanded = expandedSubmenu === item.name;

    const handleItemClick = () => {
      if (item.hasSubmenu) {
        setExpandedSubmenu(isSubmenuExpanded ? null : item.name);
      } else {
        navigate(item.path);
      }
    };

    const content = (
      <>
        <div 
          className="relative cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleIconClick(item);
          }}
        >
          <item.icon size={20} className={`transition-all duration-300 ${isActive ? 'rotate-6' : 'group-hover:rotate-6'}`} />
          {!isExpanded && item.badge && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {item.badge}
            </span>
          )}
        </div>
        {isExpanded && (
          <>
            <span className={`ml-4 flex-1 font-medium transition-all duration-300 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
              {item.name}
            </span>
            {item.badge && (
              <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                {item.badge}
              </span>
            )}
            {item.hasSubmenu && (
              <ChevronRight size={16} className={`transition-all duration-300 ${isSubmenuExpanded ? 'rotate-90' : ''}`} />
            )}
          </>
        )}
      </>
    );

    const itemClass = `group flex items-center rounded-lg py-3 px-4 transition-all duration-300 ease-in-out ${
      isActive 
        ? 'bg-[#335262] text-white shadow-lg'
        : 'text-gray-600 hover:bg-[#111646] hover:text-[#e7c568]'
    }`;

    return (
      <>
        <div
          className={itemClass}
          onClick={handleItemClick}
          style={{ paddingLeft: `${level * 0.5 + 1}rem`, cursor: 'pointer' }}
        >
          {content}
        </div>
        {isExpanded && item.hasSubmenu && isSubmenuExpanded && item.subItems && (
          <div className="ml-4">
            {item.subItems.map((subItem) => (
              <NavItem key={subItem.name} item={subItem} level={level + 1} />
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div
      className={`flex h-full flex-col bg-white shadow-xl transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="rounded-full p-2 text-[#121646] transition-all duration-300 hover:bg-[#335262] hover:text-[#e7c568] focus:outline-none focus:ring-2 focus:ring-[#e7c568]"
        >
          {isExpanded ? <ChevronLeft size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
        {navItems.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;