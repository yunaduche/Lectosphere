export interface Booki {
    isbn: string;
    titre: string;
    auteurs: string;
    editeurs: string;
    datePublication: string;
    nombrePages: string;
    langue: string;
    categorie: string;
    motsCle: string;
    description: string;
    urlPhoto: string;
    format: string;
    nombreExemplaires: number; 
  }
  
  export interface BookState {
    formData: Booki;
    books: Booki[];
    isLoading: boolean;
    loading: boolean;
    error: string | null;
    message: { type: 'success' | 'error'; content: string } | null;
  }

  export interface BookSearch {
    titre?: string;
    isbn?: string;
    auteurs?: string;
    editeurs?: string;
    categorie?: string;
    langue?: string;
    date_publication?: string;
    mots_cle?: string;
    disponible?: string;
  }
  