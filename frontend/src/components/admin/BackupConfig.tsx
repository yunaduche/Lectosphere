import React, { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Toast from '../myui/Toast';

interface BackupConfig {
  is_enabled: boolean;
  frequency: string;
  backup_path: string;
  retention_days: number;
  last_backup?: string;
}

interface ToastNotification {
  type: 'success' | 'error' | 'warning' | 'hint';
  message: string;
  subMessage?: string;
  id: number;
}

const BackupConfigForm = () => {
  const [config, setConfig] = useState<BackupConfig>({
    is_enabled: false,
    frequency: '0 0 * * *',
    backup_path: 'D:\fiche tec',
    retention_days: 7
  });
  const [hour, setHour] = useState('00');
  const [minute, setMinute] = useState('00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const formatDateInFrench = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} ${month} ${year} à ${hours}h${minutes}`;
  };

  useEffect(() => {
    fetchConfig();
    setupBackupListener();
  }, []);

  const addToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = Date.now();
    setToasts(current => [...current, { ...toast, id }]);
  };

  const removeToast = (id: number) => {
    setToasts(current => current.filter(toast => toast.id !== id));
  };

  const setupBackupListener = () => {
    
    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMinute = now.getMinutes().toString().padStart(2, '0');
      
      if (config.is_enabled && currentHour === hour && currentMinute === minute) {
        addToast({
          type: 'success',
          message: 'Sauvegarde automatique en cours',
          subMessage: `Sauvegarde vers ${config.backup_path}`
        });
      }
    }, 60000);

    return () => clearInterval(interval);
  };

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/backup-config');
      if (!response.ok) throw new Error('Erreur lors de la récupération de la configuration');
      const data = await response.json();
      setConfig(data);
      
      const [min, hr] = data.frequency.split(' ');
      setMinute(min.padStart(2, '0'));
      setHour(hr.padStart(2, '0'));
    } catch (err) {
      addToast({
        type: 'error',
        message: 'Erreur de configuration',
        subMessage: 'Impossible de charger la configuration'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedConfig = {
        ...config,
        frequency: `${minute} ${hour} * * *`
      };

      const response = await fetch('/api/backup-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isEnabled: updatedConfig.is_enabled,
          frequency: updatedConfig.frequency,
          backupPath: updatedConfig.backup_path,
          retentionDays: updatedConfig.retention_days
        })
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      
      setSuccess(true);
      const data = await response.json();
      setConfig(data);
      setIsDialogOpen(false);
      
      addToast({
        type: 'success',
        message: 'Configuration sauvegardée',
        subMessage: 'Les paramètres ont été mis à jour avec succès'
      });
    } catch (err) {
      addToast({
        type: 'error',
        message: 'Erreur de sauvegarde',
        subMessage: 'Impossible de sauvegarder la configuration'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleBackup = async (checked: boolean) => {
    try {
      const response = await fetch('/api/backup-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          isEnabled: checked
        })
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      
      const data = await response.json();
      setConfig(data);
      
      addToast({
        type: checked ? 'success' : 'warning',
        message: checked ? 'Sauvegarde automatique activée' : 'Sauvegarde automatique désactivée',
        subMessage: checked ? `Prochaine sauvegarde à ${hour}h${minute}` : undefined
      });
    } catch (err) {
      addToast({
        type: 'error',
        message: 'Erreur de mise à jour',
        subMessage: 'Impossible de modifier le statut de la sauvegarde'
      });
    }
  };

  return (
    <>
      <Card className="w-full max-w-xl mx-auto">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium text-lg">Sauvegarde Automatique</h3>
                <p className="text text-gray-500">
                  {config.is_enabled 
                    ? 'La sauvegarde automatique est activée'
                    : 'La sauvegarde automatique est désactivée'}
                </p>
                {config.last_backup && config.is_enabled && (
                  <p className="text text-gray-500">
                    Dernière sauvegarde : {formatDateInFrench(config.last_backup)}
                  </p>
                )}
              </div>
              <Switch
                checked={config.is_enabled}
                onCheckedChange={toggleBackup}
                className='bg-[#335262]'
              />
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full bg-[#335262] text-white"
                  disabled={!config.is_enabled}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurer la sauvegarde
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Configuration de la Sauvegarde Automatique</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block font-medium">Heure de sauvegarde</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={hour}
                        onChange={(e) => setHour(e.target.value.padStart(2, '0'))}
                        className="w-24"
                        placeholder="Heure"
                      />
                      <span className="flex items-center">:</span>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={minute}
                        onChange={(e) => setMinute(e.target.value.padStart(2, '0'))}
                        className="w-24"
                        placeholder="Minutes"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="backup-path" className="block font-medium">
                      Répertoire de sauvegarde
                    </label>
                    <Input
                      id="backup-path"
                      value={config.backup_path}
                      onChange={(e) => setConfig(prev => ({ ...prev, backup_path: e.target.value }))}
                      placeholder="Chemin du dossier de sauvegarde"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="retention-days" className="block font-medium">
                      Durée de rétention (jours)
                    </label>
                    <Input
                      id="retention-days"
                      type="number"
                      min="1"
                      value={config.retention_days}
                      onChange={(e) => setConfig(prev => ({ ...prev, retention_days: parseInt(e.target.value) }))}
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <AlertDescription>Configuration sauvegardée avec succès</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Enregistrement...' : 'Enregistrer la configuration'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            subMessage={toast.subMessage}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </>
  );
};

export default BackupConfigForm;