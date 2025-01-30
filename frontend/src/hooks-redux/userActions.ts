import axios, { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { RootState } from './store';

export const CREATE_LIBRARIAN_REQUEST = 'CREATE_LIBRARIAN_REQUEST';
export const CREATE_LIBRARIAN_SUCCESS = 'CREATE_LIBRARIAN_SUCCESS';
export const CREATE_LIBRARIAN_FAILURE = 'CREATE_LIBRARIAN_FAILURE';

interface UserData {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  email: string;
  role: 'bibliothecaire_jeunesse' | 'bibliothecaire_adulte';
}

interface CreateLibrarianRequestAction {
  type: typeof CREATE_LIBRARIAN_REQUEST;
}

interface CreateLibrarianSuccessAction {
  type: typeof CREATE_LIBRARIAN_SUCCESS;
  payload: { message: string; userId: number };
}

interface CreateLibrarianFailureAction {
  type: typeof CREATE_LIBRARIAN_FAILURE;
  payload: string;
}

type CreateLibrarianAction = 
  | CreateLibrarianRequestAction
  | CreateLibrarianSuccessAction
  | CreateLibrarianFailureAction;

export const createLibrarian = (
  userData: UserData
): ThunkAction<void, RootState, unknown, CreateLibrarianAction> => async (dispatch) => {
  dispatch({ type: CREATE_LIBRARIAN_REQUEST });
  try {
    const response = await axios.post<{ message: string; userId: number }>('/api/users/creerCompteBibliothecaire', userData);
    dispatch({
      type: CREATE_LIBRARIAN_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    const errorMessage = error instanceof AxiosError 
      ? error.response?.data?.message || 'Une erreur est survenue'
      : 'Une erreur inconnue est survenue';
    dispatch({
      type: CREATE_LIBRARIAN_FAILURE,
      payload: errorMessage
    });
  }
};