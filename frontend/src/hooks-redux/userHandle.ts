import axios from 'axios';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  currentUser: any | null;
  error: string | null;
  response: string | null;
}

const initialState: UserState = {
  status: 'idle',
  currentUser: null,
  error: null,
  response: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authRequest: (state) => {
      state.status = 'loading';
    },
    authSuccess: (state, action: PayloadAction<any>) => {
      state.status = 'succeeded';
      state.currentUser = action.payload;
    },
    authFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.response = action.payload;
    },
    authError: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    authLogout: (state) => {
      state.status = 'idle';
      state.currentUser = null;
    },
    stuffAdded: (state) => {
      state.status = 'succeeded';
    },
    doneSuccess: (state, action: PayloadAction<any>) => {
      state.status = 'succeeded';
      state.currentUser = action.payload;
    },
    getDeleteSuccess: (state) => {
      state.status = 'succeeded';
    },
  },
});

export const {
  authRequest,
  authSuccess,
  authFailed,
  authError,
  authLogout,
  stuffAdded,
  doneSuccess,
  getDeleteSuccess,
} = userSlice.actions;

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (
    { fields, role }: { fields: any; role: string },
    { dispatch }
  ) => {
    dispatch(authRequest());
    try {
      const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/${role}Login`, fields, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (result.data.role) {
        dispatch(authSuccess(result.data));
      } else {
        dispatch(authFailed(result.data.message));
      }
    } catch (error) {
      dispatch(authError((error as Error).message));
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (
    { fields, role }: { fields: any; role: string },
    { dispatch }
  ) => {
    dispatch(authRequest());
    try {
      const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/${role}Reg`, fields, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (result.data.schoolName) {
        dispatch(authSuccess(result.data));
      } else if (result.data.school) {
        dispatch(stuffAdded());
      } else {
        dispatch(authFailed(result.data.message));
      }
    } catch (error) {
      dispatch(authError((error as Error).message));
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { dispatch }) => {
    dispatch(authLogout());
  }
);

export const getUserDetails = createAsyncThunk(
  'user/getUserDetails',
  async (
    { id, address }: { id: string; address: string },
    { dispatch }
  ) => {
    dispatch(authRequest());
    try {
      const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`);
      if (result.data) {
        dispatch(doneSuccess(result.data));
      }
    } catch (error) {
      dispatch(authError((error as Error).message));
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (
    { id, address }: { id: string; address: string },
    { dispatch }
  ) => {
    dispatch(authRequest());
    dispatch(authFailed("Sorry the delete function has been disabled for now."));
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (
    { fields, id, address }: { fields: any; id: string; address: string },
    { dispatch }
  ) => {
    dispatch(authRequest());
    try {
      const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`, fields, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (result.data.schoolName) {
        dispatch(authSuccess(result.data));
      } else {
        dispatch(doneSuccess(result.data));
      }
    } catch (error) {
      dispatch(authError((error as Error).message));
    }
  }
);

export const addStuff = createAsyncThunk(
  'user/addStuff',
  async (
    { fields, address }: { fields: any; address: string },
    { dispatch }
  ) => {
    dispatch(authRequest());
    try {
      const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/${address}Create`, fields, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (result.data.message) {
        dispatch(authFailed(result.data.message));
      } else {
        dispatch(stuffAdded());
      }
    } catch (error) {
      dispatch(authError((error as Error).message));
    }
  }
);

export default userSlice.reducer;