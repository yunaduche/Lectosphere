import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface RestoreStatus {
  progress: number;
  isLoading: boolean;
  error?: string;
  success?: string;
}

const DatabaseRestore = () => {
  const [status, setStatus] = useState<RestoreStatus>({
    progress: 0,
    isLoading: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.sql')) {
      setSelectedFile(file);
      setStatus(prev => ({ ...prev, error: undefined }));
    } else {
      setStatus(prev => ({
        ...prev,
        error: 'Please select a valid SQL backup file'
      }));
    }
  };

  const handleRestore = async () => {
    if (!selectedFile) return;

    setStatus({ progress: 0, isLoading: true });
    
    try {
      const formData = new FormData();
      formData.append('backup', selectedFile);

      const interval = setInterval(() => {
        setStatus(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 500);

      const response = await fetch('/api/backup/restore', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Restore failed: ${response.statusText}`);
      }

      clearInterval(interval);
      setStatus({
        progress: 100,
        isLoading: false,
        success: 'Database restored successfully',
        error: undefined
      });

      setTimeout(() => {
        setStatus({ progress: 0, isLoading: false });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 3000);

    } catch (error) {
      setStatus({
        progress: 0,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Restore failed'
      });
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-white shadow-xl rounded-xl border-0">
        <CardHeader className="pb-8">
          <CardTitle className="flex items-center gap-3 text-[#335262] text-2xl">
            <FileUp className="w-6 h-6" />
            Restaurer la base de données
          </CardTitle>
          <CardDescription className="text-gray-500 text-base">
            Restaurer votre base de données à partir d'un fichier de sauvegarde SQL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div 
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 
                ${selectedFile ? 'border-[#335262] bg-[#335262]/5' : 'border-gray-200'} 
                hover:border-[#335262] transition-all duration-300`}
            >
              <input
                type="file"
                accept=".sql"
                className="hidden"
                onChange={handleFileSelect}
                ref={fileInputRef}
              />
              <Button
                variant="ghost"
                className="w-full h-40 flex flex-col items-center justify-center gap-3 hover:bg-transparent"
                onClick={() => fileInputRef.current?.click()}
                disabled={status.isLoading}
              >
                <Upload className={`w-12 h-12 ${selectedFile ? 'text-[#335262]' : 'text-gray-400'}`} />
                <span className={`text-lg ${selectedFile ? 'text-[#335262]' : 'text-gray-600'}`}>
                  {selectedFile ? 'Fichier selectionné' : 'Selectionner une fichier de restauration'}
                </span>
                <span className="text-sm text-gray-400">
                  {selectedFile ? selectedFile.name : 'Supports .sql files'}
                </span>
              </Button>
            </div>

            <Button
              className={`w-full py-6 text-lg flex items-center gap-3 transition-all duration-300
                ${!selectedFile || status.isLoading ? 'bg-gray-100 text-gray-400' : 'bg-[#335262] hover:bg-[#335262]/90'}`}
              onClick={handleRestore}
              disabled={!selectedFile || status.isLoading}
            >
              {status.isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <FileUp className="w-5 h-5" />
              )}
              {status.isLoading ? 'Restoring...' : 'Restaurer la base de données'}
            </Button>
          </div>

          {status.isLoading && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-[#335262]">
                <span className="font-medium">Restoring database...</span>
                <span className="font-bold">{status.progress}%</span>
              </div>
              <Progress 
                value={status.progress} 
                className="h-2 bg-gray-100"
                indicatorClassName="bg-[#e7c568]"
              />
            </div>
          )}

          {status.error && (
            <Alert variant="destructive" className="bg-red-50 border-red-100">
              <AlertDescription className="text-red-600">{status.error}</AlertDescription>
            </Alert>
          )}

          {status.success && (
            <Alert className="bg-[#335262]/5 border-[#335262]/20">
              <AlertDescription className="text-[#335262] font-medium">{status.success}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseRestore;