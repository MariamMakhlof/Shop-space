import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'products',
  initialState: { viewOption: 'grid' },
  reducers: {
    setViewOption: (state, action) => {
      state.viewOption = action.payload;
    },
  },
});

export const { setViewOption } = productSlice.actions;

export default productSlice.reducer;
