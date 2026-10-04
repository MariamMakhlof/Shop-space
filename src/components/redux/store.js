import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import cartReducer from './cartSlice';
import themeReducer from './themeSlice';

const persistCartMiddleware = (storeApi) => (next) => (action) => {
  const result = next(action);

  if (action.type.startsWith('cart/')) {
    try {
      window.localStorage.setItem(
        'functional-header-cart',
        JSON.stringify(storeApi.getState().cart.items)
      );
    } catch {}
  }

  if (action.type.startsWith('theme/')) {
    try {
      window.localStorage.setItem(
        'functional-header-theme',
        storeApi.getState().theme.mode
      );
    } catch {}
  }

  return result;
};

const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistCartMiddleware),
});

export default store;
