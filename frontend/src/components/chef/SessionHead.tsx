import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, Calendar, Plus, X, Loader2 } from 'lucide-react';
import ActiveSessionCard from './ActiveSessionCard';
import InactiveSessionCard from './InactiveSessionCard';
import CreateSessionModal from '../myui/CreateSessionModal';
import CloseSessionDialog from '../myui/CloseSessionDialog';

interface Session {
  id: number;
  nom: string;
  status: string;
  created_at: string;
  created_by: string;
}

const SessionCard: React.FC = () => {
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);

  const fetchActiveSessions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/acquisitions/active');
      setActiveSession(response.data.sessions.length > 0 ? response.data.sessions[0] : null);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors de la récupération des sessions');
      setLoading(false);
    }
  };

  const handleCloseButtonClick = () => {
    setIsCloseDialogOpen(true);
  };

  const handleConfirmClose = async () => {
    await handleCloseSession();
    setIsCloseDialogOpen(false);
  };

  const handleCloseSession = async () => {
    if (!activeSession) return;
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const alex = storedUser.username;
      await axios.post('/api/acquisitions/close', {
        sessionId: activeSession.id,
        username: alex
      });
      setActiveSession(null);
      fetchActiveSessions();
    } catch (err) {
      setError('Impossible de fermer la session');
    }
  };

  const handleCreateSession = async (sessionName: string) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const username = storedUser.username;
      const response = await axios.post('/api/acquisitions/create', {
        nom: sessionName,
        createdBy: username
      });
      setActiveSession(response.data);
    } catch (err) {
      setError('Impossible de créer une session');
      throw err; 
    }
  };

  useEffect(() => {
    fetchActiveSessions();
  }, []);

  return (
    <div className="space-y-4">
      <Card className="w-full min-h-20 flex items-center justify-between px-6 bg-gradient-to-r from-[#335262] to-[#111646] shadow-lg border-none relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e7c568] to-[#e4d568]" />
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#e7c568] opacity-10 rounded-full blur-3xl" />
        
        <div className="flex items-center space-x-6 relative z-10">
          <CardTitle className="text-2xl font-bold text-white tracking-tight">
            Gestion des Sessions
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`px-3 py-1 text-sm backdrop-blur-sm border-2 ${
              activeSession 
                ? 'border-[#e7c568] text-[#e7c568]' 
                : 'border-white/50 text-white/90'
            }`}
          >
            {activeSession ? 'Session Active' : 'Inactive'}
          </Badge>
        </div>
  
        <div className="flex items-center space-x-6 relative z-10">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-[#e7c568]" />
          ) : error ? (
            <p className="text-red-400 text-sm font-medium">{error}</p>
          ) : activeSession ? (
            <div className="flex items-center space-x-4">
              <div className="w-72 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap inline-block">
                  <span className="text-lg font-medium text-[#e7c568]">
                    {activeSession.nom} • {activeSession.nom} • {activeSession.nom}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-white/70">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {new Date(activeSession.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-[#e7c568] text-lg font-medium">
              Aucune session active
            </p>
          )}
  
          <div className="flex items-center space-x-2">
            {activeSession ? (
               <Button
               variant="destructive"
               onClick={handleCloseButtonClick}
               size="sm"
               className="bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 flex items-center space-x-2 hover:scale-105 transition-all duration-200 shadow-lg shadow-red-500/20"
             >
               <X className="h-4 w-4" />
               <span>Fermer la session</span>
             </Button>
            ) : (
              <Button
                onClick={() => setIsModalOpen(true)}
                size="sm"
                className="bg-gradient-to-r from-[#e7c568] to-[#e4d568] hover:from-[#e4d568] hover:to-[#e7c568] text-[#335262] font-medium px-4 py-2 flex items-center space-x-2 hover:scale-105 transition-all duration-200 shadow-lg shadow-[#e7c568]/20"
              >
                <Plus className="h-4 w-4" />
                <span>Nouvelle Session</span>
              </Button>
            )}
          </div>
        </div>
      </Card>
      
      {activeSession ? <ActiveSessionCard /> : <InactiveSessionCard />}

      <CreateSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateSession={handleCreateSession}
      />
      {activeSession && (
    <CloseSessionDialog
      isOpen={isCloseDialogOpen}
      onClose={() => setIsCloseDialogOpen(false)}
      onConfirm={handleCloseSession}
      sessionName={activeSession.nom}
    />
  )}
    </div>
  );
};

export default SessionCard;