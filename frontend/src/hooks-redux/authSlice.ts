import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { NavigateFunction } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'bibliothecaire_jeunesse' | 'bibliothecaire_adulte' | 'chef_bibliothecaire';
}

interface LoginResponse {
  user: User;
  redirectUrl: string;
}

interface LoginError {
  message: string;
}

export const loginUser = createAsyncThunk<
  LoginResponse,
  { username: string; password: string; navigate: NavigateFunction },
  { rejectValue: LoginError }
>(
  'api/auth/login',
  async ({ username, password, navigate }, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>('/api/auth/login', { username, password });
      
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('isAuthenticated', 'true');

      switch (response.data.user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'bibliothecaire_jeunesse':
          navigate('/bibliothecaire/adulte/dashboard');
          break;
        case 'bibliothecaire_adulte':
          navigate('/bibliothecaire/adulte/dashboard');
          break;
        case 'chef_bibliothecaire':
          navigate('/bibliothecaire/chef/dashboard');
          break;
        default:
          navigate('/');
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as LoginError);
      }
      return rejectWithValue({ message: `An unexpected error occurred: ${error.message}. Please try again.` });
    }
  }
);

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  redirectUrl: string | null;
  userRole: 'admin' | 'bibliothecaire_jeunesse' | 'bibliothecaire_adulte' | 'chef_bibliothecaire' |null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  error: null,
  redirectUrl: null,
  userRole: JSON.parse(localStorage.getItem('user') || 'null')?.role || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.redirectUrl = null;
      state.userRole = null;
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    },
    restoreAuth: (state) => {
      const storedUser = localStorage.getItem('user');
      const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
      if (storedUser && storedIsAuthenticated === 'true') {
        state.user = JSON.parse(storedUser);
        state.isAuthenticated = true;
        state.userRole = JSON.parse(storedUser).role;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        state.redirectUrl = action.payload.redirectUrl;
        state.userRole = action.payload.user.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload?.message ?? 'An error occurred during login';
        state.isAuthenticated = false;
        state.user = null;
        state.userRole = null;
        state.redirectUrl = null;
      });
  },
});

export const { logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;