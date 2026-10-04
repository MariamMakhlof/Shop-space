import { createSelector, createSlice } from '@reduxjs/toolkit';

const CART_STORAGE_KEY = 'functional-header-cart';

function loadCartFromStorage() {
  try {
    if (typeof window === 'undefined') return [];

    const savedItems = JSON.parse(
      window.localStorage.getItem(CART_STORAGE_KEY) || '[]'
    );

    if (!Array.isArray(savedItems)) return [];

    return savedItems.filter(({ product, quantity }) => (
      product &&
      Number.isFinite(product.id) &&
      Number.isFinite(product.price) &&
      Number.isInteger(quantity) &&
      quantity > 0
    ));
  } catch {
    return [];
  }
}

const initialState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const item = state.items.find((entry) => entry.product.id === product.id);

      if (item) {
        item.quantity += 1;
      } else {
        state.items.push({ product, quantity: 1 });
      }
    },
    changeCartQuantity: (state, action) => {
      const { productId, amount } = action.payload;
      const item = state.items.find((entry) => entry.product.id === productId);

      if (!item) return;

      item.quantity += amount;
      if (item.quantity <= 0) {
        state.items = state.items.filter(
          (entry) => entry.product.id !== productId
        );
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (entry) => entry.product.id !== action.payload
      );
    },
  },
});

export const { addToCart, changeCartQuantity, removeFromCart } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectTotalQuantity = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + item.quantity, 0)
);

export const selectTotalAmount = createSelector(
  [selectCartItems],
  (items) =>
    items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
);

export default cartSlice.reducer;
