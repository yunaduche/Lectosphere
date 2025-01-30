import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LibrarianState, Librarian } from './type/librarian';

const initialState: LibrarianState = {
  librarians: [],
  loading: false,
  error: null,
  passwordResetStatus: 'idle',
};

const librarianSlice = createSlice({
  name: 'librarian',
  initialState,
  reducers: {
    fetchLibrariansRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchLibrariansSuccess(state, action: PayloadAction<Librarian[]>) {
      state.librarians = action.payload;
      state.loading = false;
    },
    fetchLibrariansFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    resetPasswordRequest(state) {
      state.passwordResetStatus = 'loading';
      state.error = null;
    },
    resetPasswordSuccess(state) {
      state.passwordResetStatus = 'succeeded';
    },
    resetPasswordFailure(state, action: PayloadAction<string>) {
      state.passwordResetStatus = 'failed';
      state.error = action.payload;
    },
  },
});

export const {
  fetchLibrariansRequest,
  fetchLibrariansSuccess,
  fetchLibrariansFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
} = librarianSlice.actions;

export default librarianSlice.reducer;