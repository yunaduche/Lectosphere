import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  status: 'idle' | 'loading' | 'added' | 'success' | 'failed' | 'error';
  userDetails: any[];
  tempDetails: any[];
  loading: boolean;
  currentUser: any | null;
  currentRole: string | null;
  error: string | null;
  response: string | null;
  darkMode: boolean;
}

const initialState: UserState = {
  status: 'idle',
  userDetails: [],
  tempDetails: [],
  loading: false,
  currentUser: JSON.parse(localStorage.getItem('user') || 'null'),
  currentRole: (JSON.parse(localStorage.getItem('user') || '{}') as any).role || null,
  error: null,
  response: null,
  darkMode: true
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      authRequest: (state) => {
        state.status = 'loading';
      },
      underControl: (state) => {
        state.status = 'idle';
        state.response = null;
      },
      stuffAdded: (state, action: PayloadAction<any>) => {
        state.status = 'added';
        state.response = null;
        state.error = null;
        state.tempDetails = action.payload;
      },
      authSuccess: (state, action: PayloadAction<any>) => {
        state.status = 'success';
        state.currentUser = action.payload;
        state.currentRole = action.payload.role;
        localStorage.setItem('user', JSON.stringify(action.payload));
        state.response = null;
        state.error = null;
      },
      authFailed: (state, action: PayloadAction<string>) => {
        state.status = 'failed';
        state.response = action.payload;
      },
      authError: (state, action: PayloadAction<string>) => {
        state.status = 'error';
        state.error = action.payload;
      },
      authLogout: (state) => {
        localStorage.removeItem('user');
        state.currentUser = null;
        state.status = 'idle';
        state.error = null;
        state.currentRole = null;
      },
      doneSuccess: (state, action: PayloadAction<any[]>) => {
        state.userDetails = action.payload;
        state.loading = false;
        state.error = null;
        state.response = null;
      },
      getDeleteSuccess: (state) => {
        state.loading = false;
        state.error = null;
        state.response = null;
      },
      getRequest: (state) => {
        state.loading = true;
      },
      getFailed: (state, action: PayloadAction<string>) => {
        state.response = action.payload;
        state.loading = false;
        state.error = null;
      },
      getError: (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      },
      toggleDarkMode: (state) => {
        state.darkMode = !state.darkMode;
      }
    },
  });
  

export const {
  authRequest,
  underControl,
  stuffAdded,
  authSuccess,
  authFailed,
  authError,
  authLogout,
  doneSuccess,
  getDeleteSuccess,
  getRequest,
  getFailed,
  getError,
  toggleDarkMode
} = userSlice.actions;

export default userSlice.reducer;