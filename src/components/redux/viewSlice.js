import { createSlice } from '@reduxjs/toolkit';

const viewSlice = createSlice({
  name: 'view',
  initialState: { mode: 'grid' },
  reducers: {
    setViewMode: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const { setViewMode } = viewSlice.actions;

export default viewSlice.reducer;
