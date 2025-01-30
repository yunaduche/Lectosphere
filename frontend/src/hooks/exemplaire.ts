import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Exemplaire {
  session_acquisition_id: number;
  session_nom: string;
  exemplaire_count: number;
  id_exemplaire: number;
  id_livre: number;
  isbn: string;
  disponibilite: string;
  format: string;
  auteurs: string[];
  titre: string;
  date_emprunt: string | null;
}

export const useFetchAcquisitions = () => {
  const [acquisitions, setAcquisitions] = useState<Exemplaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAcquisitions = async () => {
      try {
        const response = await axios.get('/acquisitions');
        setAcquisitions(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAcquisitions();
  }, []);

  return { acquisitions, loading, error };
};
