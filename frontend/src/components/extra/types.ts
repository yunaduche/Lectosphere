
export interface Emprunt {
    id_emprunt: number;
    date_emprunt: string;
    date_retour_prevue: string;
    date_retour_effective: string | null;
    renouvele: boolean;
    Exemplaire: {
      id_exemplaire: number;
      isbn: string;
      disponibilite: string;
      Livre: {
        titre: string;
        auteurs: string[];
        editeurs: string[];
        categorie: string;
      };
    };
    User: {
      id: number;
      username: string;
    };
  }
  
  export interface AdherentInfo {
    id: number;
    nom: string;
    numero_carte: string;
    codebarre: string;
    email: string;
    numero_telephone: string;
    quartier: string;
    adresse: string;
    type_adhesion: string;
    fin_adhesion: string;
    emprunts_en_cours_ids: number[];
    emprunts_en_cours_isbns: string[];
    nombre_total_emprunts: number;
    nb_retard_retour: number;
    banni: boolean;
    cause_banissement: string | null;
    emprunt_en_cours: string;
    emprunts_en_retard: string;
    Emprunts: Emprunt[];
    adhesion_valide: boolean;
    peut_emprunter: boolean;
  }
  