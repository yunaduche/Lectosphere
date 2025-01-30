import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from './sidebarSlice';
import authReducer from './authSlice';
import librarianReducer from './librarianSlice';
import bookReducer from './bookSlice';

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    auth: authReducer,
    librarian: librarianReducer,
    book: bookReducer,
    books: bookReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;