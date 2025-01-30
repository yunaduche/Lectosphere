import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StudentState {
  studentsList: any[];
  loading: boolean;
  error: string | null;
  response: string | null;
  statestatus: 'idle' | 'added';
}

const initialState: StudentState = {
  studentsList: [],
  loading: false,
  error: null,
  response: null,
  statestatus: "idle",
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    stuffDone: (state) => {
      state.loading = false;
      state.error = null;
      state.response = null;
      state.statestatus = "added";
    },
    getSuccess: (state, action: PayloadAction<any[]>) => {
      state.studentsList = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
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
    underStudentControl: (state) => {
      state.loading = false;
      state.response = null;
      state.error = null;
      state.statestatus = "idle";
    }
  },
});

export const {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  underStudentControl,
  stuffDone,
} = studentSlice.actions;

export const studentReducer = studentSlice.reducer;