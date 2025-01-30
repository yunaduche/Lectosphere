export interface BookInfo {
    isbn: string;
    titre: string;
    auteurs: string[];
    editeurs: string[];
    format: 'lecture sur place' | 'empruntable';
    date_publication: string;
    nombre_pages: number;
    categorie: string;
    langue: string;
    mots_cle: string[];
    description: string;
    url_photo: string;
    section: 'adulte' | 'jeunesse';
    nombre_exemplaires: number;
  }
  
  export interface ExistingBookInfo extends BookInfo {
    nombre_exemplaires: number;
  }
  
  export const initialFormData: BookInfo = {
    isbn: '',
    titre: '',
    auteurs: [],
    editeurs: [],
    format: 'empruntable',
    date_publication: '',
    nombre_pages: 0,
    categorie: '',
    langue: '',
    mots_cle: [],
    description: '',
    url_photo: '',
    section: 'adulte',
    nombre_exemplaires: 1
  };
  
  export interface MessageState {
    type: 'success' | 'error';
    content: string;
  }