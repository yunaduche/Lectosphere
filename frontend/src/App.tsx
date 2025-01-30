import React, { useCallback, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store, RootState } from './hooks-redux/store';
import { logout, restoreAuth } from './hooks-redux/authSlice';
import LoginPageWithBackground from './components/pages/Login';
import TopBar from './components/TopBar';
import MemberWrapper from './components/ui/MemberWrapper';
import BubbleAnimation from './components/extra/BubbleAnimation';

//b-adulte/retour

import DeweyModal, { useModalStore, useKeyboardShortcut } from './components/shortcuts/Dewey';

// SideBARS
import AdminSidebar from './components/admin/AdminSidebar';
import SidebarJeunesse from './components/jeunesse/SidebarJeunesse';
import SidebarAdulte from './components/adulte/SidebarAdulte';

// Admins

import Librarian from './components/admin/Librarian';
import ExcelImport from './components/ui/ExcelImport';
import JeunesseDashboard from './components/jeunesse/JeunesseDashboard';
import DatabaseManager from './components/admin/DatabaseManager';
import DatabaseRestore from './components/admin/Restore';
import ChefDashboard from './components/dash/ChefDash';
import AdminDashboard from './components/dash/AdminDash';

//adulte
import KeywordGenerator from './components/adulte/AdulteDashboard';
import BookList from './components/adulte/BookList';
import CirculationComponent from './components/adulte/Circulation';
import AddBookWithoutISBN from './components/pages/AddBookWithOutISBN';
import Catalogue from './components/pages/Cataloguage';
import Retour from './components/adulte/Retour';
import AdherentList from './components/adulte/AdherentList'
import BibDashboard from './components/dash/BibDash';
import GestionEmprunts from './components/adulte/Emprunt';
import ExemplaireBib from './components/adulte/ExemplaireBib'

//chef
import AcquisitionManager from './components/chef/Acquiistion'
import SessionAcquisitionManager from './components/chef/MangmentAcquistion'
import PolitiqueEmpruntComponent from './components/chef/PolitiqueEmprunt'
import SessionCard from './components/chef/SessionHead'
import LogViewer from './components/chef/Log'
import AcquisitionList from './components/chef/ExemplaireCards'
import ExemplaireChef from './components/adulte/ExemplaireChef'
import MembershipTypeManager from './components/chef/AdhesionType'
import AnnonceList from './components/chef/AnnonceList'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};


const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const userRole = useSelector((state: RootState) => state.auth.userRole);
  useKeyboardShortcut();
  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

const RoleBasedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userRole = useSelector((state: RootState) => state.auth.userRole);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const getSidebar = () => {
    switch (userRole) {
      case 'admin':
        return <AdminSidebar />;
      case 'bibliothecaire_adulte':
        return <SidebarAdulte />;
      case 'bibliothecaire_jeunesse':
        return <SidebarAdulte />;
        case 'chef_bibliothecaire':
          return <SidebarJeunesse />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full ">
      {getSidebar()}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onLogout={handleLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#ccdbe3]">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

  return (
    <Router>
      <div className="h-screen w-full overflow-hidden">
        <Routes>
          <Route path="/login" element={<LoginPageWithBackground />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <RoleBasedLayout>
                  <Routes>
                    {userRole === 'admin' && (
                      <>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/comptes-bibliothecaire" element={<Librarian />} />
                        <Route path="/admin/importer" element={<ExcelImport />} />
                        <Route path="/admin/sauvegarder" element={<DatabaseManager />} />
                        <Route path="/admin/restaurer" element={<DatabaseRestore />} />
                      </>
                    )}
                    {userRole !== 'admin' && (
                      <>
                        <Route path="/bibliothecaire/adulte/dashboard" element={<KeywordGenerator />} />
                        <Route path="/b-adulte/library-cards" element={<MemberWrapper />} />
                        <Route path="/b-adulte/a-add-book" element={<Catalogue />} />
                        <Route path="/b-adulte/list" element={<BookList />} />
                        <Route path="/b-adulte/emprunt" element={<CirculationComponent />} />
                        <Route path="/without" element={<AddBookWithoutISBN />} />
                        <Route path="/b-adulte/retour" element={<Retour />} />
                        <Route path="/b-adulte/adherents" element={<AdherentList />} /> 
                        <Route path="/b-adulte/dashboard" element={<BibDashboard />} /> 
                        <Route path="/b-adulte/liste-emprunt" element={<GestionEmprunts />} /> 
                        <Route path="/b-adulte/exemplaires" element={<ExemplaireBib />} />
                        
                      </>
                    )}
                    {userRole === 'chef_bibliothecaire' && ( 
                      <>
                        <Route path="/bibliothecaire/chef/dashboard" element={<JeunesseDashboard />} />
                        <Route path="/bibliothecaire/chef/acquisition" element={<AcquisitionManager />} />
                        <Route path="/bibliothecaire/chef/gestion-acquisition" element={<SessionAcquisitionManager />} />
                        <Route path="/bibliothecaire/chef/politique-emprunt" element={<PolitiqueEmpruntComponent />} />
                        <Route path="/bibliothecaire/chef/session-active" element={<SessionCard />} />
                        <Route path="/bibliothecaire/chef/logs" element={<LogViewer />} />
                        <Route path="/bibliothecaire/chef/sesion-lists" element={<AcquisitionList />} />
                        <Route path="/bibliothecaire/chef/exemplaires" element={<ExemplaireChef />} />
                        <Route path="/bibliothecaire/chef/dashboard" element={<ChefDashboard />} /> 
                        <Route path="/bibliothecaire/chef/adhesion" element={<MembershipTypeManager />} />
                        <Route path="/bibliothecaire/chef/annonces" element={<AnnonceList />} />
                        
                      </>
                    )}
                    
                    <Route path="*" element={<Navigate to={`/${userRole}/dashboard`} replace />} />
                  </Routes>
                </RoleBasedLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <BubbleAnimation />
      <DeweyModal />
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;