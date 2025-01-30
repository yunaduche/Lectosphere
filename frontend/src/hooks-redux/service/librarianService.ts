
import axios from 'axios';
import { Librarian } from '../type/librarian';

const API_URL = '/api/users/bibliothecaires';

export const fetchLibrarians = async (): Promise<Librarian[]> => {
  const response = await axios.get<Librarian[]>(API_URL);
  return response.data;
};

export const resetLibrarianPassword = async (id: number, newPassword: string) => {
  const response = await fetch(`/api/users/reinitialiserMotDePasse/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newPassword }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la réinitialisation du mot de passe');
  }

  return await response.json();
};