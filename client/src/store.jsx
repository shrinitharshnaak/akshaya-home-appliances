import { configureStore } from '@reduxjs/toolkit';
import cartSliceReducer from './slices/cartSlice';

/**
 * THE GLOBAL DATA VAULT
 * * This store aggregates all departmental slices (Cart, User, Orders)
 * into a single, immutable state tree.
 */
const store = configureStore({
  reducer: {
    // Manages all inventory selections and logistics data
    cart: cartSliceReducer,
    
    /** * FUTURE SCALING:
     * userLogin: userLoginReducer,
     * orderCreate: orderCreateReducer,
     * productList: productListReducer,
     */
  },

  /**
   * MIDDLEWARE CONFIGURATION
   * We keep the default middleware which includes Redux Thunk 
   * (essential for making the API calls in our services).
   */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Prevents errors when storing complex date objects
    }),

  // Enables the Redux DevTools browser extension for real-time debugging
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;