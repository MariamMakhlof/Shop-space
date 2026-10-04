import { createSlice } from '@reduxjs/toolkit';

const THEME_STORAGE_KEY = 'functional-header-theme';

function loadTheme() {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark'
      ? 'dark'
      : 'light';
  } catch {
    return 'light';
  }
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: loadTheme() },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
    },
    setTheme: (state, action) => {
      state.mode = action.payload === 'dark' ? 'dark' : 'light';
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export const selectTheme = (state) => state.theme.mode;

export default themeSlice.reducer;
