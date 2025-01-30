import React, { useEffect, useState } from 'react';
import LivreForm from './LivreForm'
import { useSelector } from 'react-redux';
import axios from 'axios';
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, BookOpen, AlertCircle } from "lucide-react";


interface SessionAcquisition {
  id_session: number;
  titre: string;
  chef_bibliothecaire: string;
  date_ouverture: string;
}

interface BookStats {
  total: number;
  jeunesse: number;
  adulte: number;
}

interface RootState {
  auth: {
    user: {
      username: string;
      role: string;
    };
  };
}

interface Book {
  section: string;
  nombre_exemplaires: number;
}

const STATS_STORAGE_KEY = 'acquisition_session_stats';

const SessionAcquisitionManager: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<SessionAcquisition | null>(null);
  const [bookStats, setBookStats] = useState<BookStats>(() => {
    
    const savedStats = localStorage.getItem(STATS_STORAGE_KEY);
    return savedStats ? JSON.parse(savedStats) : { total: 0, jeunesse: 0, adulte: 0 };
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);


  useEffect(() => {
    if (bookStats) {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(bookStats));
    }
  }, [bookStats]);

  const updateStats = (section: string, nombreExemplaires: number) => {
    setBookStats(prev => {
      const newStats = {
        total: prev.total + nombreExemplaires,
        jeunesse: section === 'jeunesse' ? prev.jeunesse + nombreExemplaires : prev.jeunesse,
        adulte: section === 'adulte' ? prev.adulte + nombreExemplaires : prev.adulte
      };
      return newStats;
    });
  };

  const fetchActiveSession = async () => {
    try {
      setLoading(true);
      const sessionResponse = await axios.get('/api/acquisitions/sessions', {
        params: { statut: 'ouverte' }
      });
      const sessions = sessionResponse.data;
      
      if (sessions.length > 0) {
        const activeSession = sessions[0];
        setCurrentSession(activeSession);
      
        const booksResponse = await axios.get(`/api/acquisitions/sessions/${activeSession.id_session}/livres`);
        const books = booksResponse.data;
 
        const apiStats = calculateStatsFromBooks(books);
        const localStats = JSON.parse(localStorage.getItem(STATS_STORAGE_KEY) || '{"total":0,"jeunesse":0,"adulte":0}');
        
        setBookStats({
          total: Math.max(apiStats.total, localStats.total),
          jeunesse: Math.max(apiStats.jeunesse, localStats.jeunesse),
          adulte: Math.max(apiStats.adulte, localStats.adulte)
        });
      } else {
        setCurrentSession(null);
    
      }
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement de la session active');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatsFromBooks = (books: Book[]): BookStats => {
    return books.reduce((acc: BookStats, book: Book) => ({
      total: acc.total + (book.nombre_exemplaires || 0),
      jeunesse: acc.jeunesse + (book.section === 'jeunesse' ? (book.nombre_exemplaires || 0) : 0),
      adulte: acc.adulte + (book.section === 'adulte' ? (book.nombre_exemplaires || 0) : 0)
    }), { total: 0, jeunesse: 0, adulte: 0 });
  };

  useEffect(() => {
    fetchActiveSession();
  }, []);

  const handleCreateSession = async () => {
    if (currentSession) {
      setCreateError("Une session est déjà ouverte. Veuillez la fermer avant d'en créer une nouvelle.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/acquisitions/sessions', {
        titre: newSessionTitle
      });
      
      setCurrentSession(response.data);
   
      setShowCreateDialog(false);
      setNewSessionTitle('');
      setCreateError(null);
    } catch (err) {
      setCreateError('Erreur lors de la création de la session');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSession = async () => {
    if (!currentSession) return;

    try {
      setLoading(true);
      await axios.put(`/api/acquisitions/sessions/${currentSession.id_session}/fermer`);
      setCurrentSession(null);
 
      localStorage.setItem(`session_stats_${currentSession.id_session}`, JSON.stringify(bookStats));
      setBookStats({ total: 0, jeunesse: 0, adulte: 0 });
      localStorage.removeItem(STATS_STORAGE_KEY);
      setShowCloseDialog(false);
    } catch (err) {
      setError('Erreur lors de la fermeture de la session');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {currentSession ? (
        <Card className="border-2 border-primary/20">
          <CardHeader className="bg-primary/5">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle>Session d'acquisition active</CardTitle>
            </div>
            <CardDescription>
              Ouverte le {new Date(currentSession.date_ouverture).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="mt-4">
            <div className="space-y-4">
              <div className="pb-4 border-b">
                <h3 className="font-semibold text-lg mb-2">{currentSession.titre}</h3>
                <p className="text-sm text-gray-500">
                  Géré par: {currentSession.chef_bibliothecaire}
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="text-2xl font-bold">{bookStats.total}</p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{bookStats.jeunesse}</p>
                  <p className="text-sm text-gray-500">Jeunesse</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{bookStats.adulte}</p>
                  <p className="text-sm text-gray-500">Adulte</p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-gray-50 mt-4">
            <LivreForm 
              sessionId={currentSession.id_session} 
              onSuccess={() => {
                fetchActiveSession();
              }}
              onBookAdded={(section: string, nombreExemplaires: number) => {
                updateStats(section, nombreExemplaires);
              }}
            />
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => setShowCloseDialog(true)}
            >
              Fermer la session
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="text-center space-y-4">
          <div className="p-8 border-2 border-dashed rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Aucune session active</h3>
            <p className="text-gray-500 mb-4">
              Créez une nouvelle session pour commencer l'acquisition de livres
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              Nouvelle session
            </Button>
          </div>
        </div>
      )}

      {/* Dialog de création de session */}
      <AlertDialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nouvelle session d'acquisition</AlertDialogTitle>
            <AlertDialogDescription>
              {createError ? (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{createError}</AlertDescription>
                </Alert>
              ) : (
                "Donnez un titre à votre nouvelle session d'acquisition"
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4">
            <Input
              value={newSessionTitle}
              onChange={(e) => setNewSessionTitle(e.target.value)}
              placeholder="Titre de la session"
              className="w-full"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateSession}>
              Créer la session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de confirmation de fermeture */}
      <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la fermeture</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir fermer cette session ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleCloseSession}>
              Fermer la session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SessionAcquisitionManager;