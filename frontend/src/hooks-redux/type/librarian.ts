
export interface Librarian {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    role: 'bibliothecaire_jeunesse' | 'bibliothecaire_adulte';
    created_at: string;
    last_login: string | null;
  }
  
  export interface LibrarianState {
    librarians: Librarian[];
    loading: boolean;
    error: string | null;
  }
  
  export const FETCH_LIBRARIANS_REQUEST = 'FETCH_LIBRARIANS_REQUEST';
  export const FETCH_LIBRARIANS_SUCCESS = 'FETCH_LIBRARIANS_SUCCESS';
  export const FETCH_LIBRARIANS_FAILURE = 'FETCH_LIBRARIANS_FAILURE';
  
  interface FetchLibrariansRequestAction {
    type: typeof FETCH_LIBRARIANS_REQUEST;
  }
  
  interface FetchLibrariansSuccessAction {
    type: typeof FETCH_LIBRARIANS_SUCCESS;
    payload: Librarian[];
  }
  
  interface FetchLibrariansFailureAction {
    type: typeof FETCH_LIBRARIANS_FAILURE;
    payload: string;
  }
  
  export type LibrarianActionTypes = 
    | FetchLibrariansRequestAction
    | FetchLibrariansSuccessAction
    | FetchLibrariansFailureAction;