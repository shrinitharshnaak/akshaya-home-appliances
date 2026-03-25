import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

// Load existing state from the vault (LocalStorage)
const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { 
      cartItems: [], 
      shippingAddress: {}, 
      paymentMethod: 'PayPal' // Defaulting to the most common gateway
    };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * ADD / UPDATE ITEM
     * If the item exists, we update the quantity.
     * Otherwise, we append the new asset to the collection.
     */
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      
      // Persist changes and recalculate totals via utility
      return updateCart(state);
    },

    /**
     * REMOVE ITEM
     * Filters out the item by its unique ID.
     */
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },

    /**
     * SAVE LOGISTICS DATA
     * Persists shipping coordinates to the state.
     */
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },

    /**
     * SAVE PAYMENT PROTOCOL
     * Stores the selected gateway (e.g., Stripe, PayPal, Razorpay).
     */
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },

    /**
     * RESET VAULT
     * Purges items after a successful transaction.
     */
    clearCartItems: (state) => {
      state.cartItems = [];
      return updateCart(state);
    },
  },
});

// Exporting actions for component dispatch
export const { 
  addToCart, 
  removeFromCart, 
  saveShippingAddress, 
  savePaymentMethod,
  clearCartItems 
} = cartSlice.actions;

export default cartSlice.reducer;