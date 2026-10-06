import { configureStore } from '@reduxjs/toolkit';
import viewReducer from './viewSlice';
import cartReducer from './cartSlice';
import themeReducer from './themeSlice';

const persistCartMiddleware = (storeApi) => (next) => (action) => {
  const result = next(action);

  // so store the cart items in localStorage whenever the cart state changes, 
  // we can use a middleware that listens for actions related to the cart and saves the updated cart items to localStorage. 
  // This way, we can persist the cart state across page reloads and sessions.

  //check if the action type starts with 'cart/' to determine if it's a cart-related action
  if (action.type.startsWith('cart/')) {
    try {
      // Save the cart items to localStorage 
      window.localStorage.setItem(
        'functional-header-cart',
        // get the current state of the cart items
        JSON.stringify(storeApi.getState().cart.items)
      );
    } catch { }
  }

  if (action.type.startsWith('theme/')) {
    try {
      // Save the theme mode to localStorage 
      window.localStorage.setItem(
        'functional-header-theme',
        storeApi.getState().theme.mode
      );
    } catch { }
  }

  return result;
};

const store = configureStore({
  reducer: {
    view: viewReducer,
    cart: cartReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistCartMiddleware),
});

export default store;
