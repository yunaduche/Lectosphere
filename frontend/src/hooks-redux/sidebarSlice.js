import { createSlice } from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    isExpanded: true,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isExpanded = !state.isExpanded;
    },
  },
});

export const { toggleSidebar } =sidebarSlice.actions;

//export reducer mais pa le app lui mm
export default sidebarSlice.reducer;