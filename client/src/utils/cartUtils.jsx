/**
 * Helper to ensure consistent currency formatting.
 * Rounds to 2 decimal places and returns a string for display.
 * Using Math.round prevents common JS floating-point arithmetic errors.
 */
export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

/**
 * The Central Calculation Protocol.
 * Updates the state with calculated prices and persists to the vault.
 */
export const updateCart = (state) => {
  // 1. Calculate Items Price (Subtotal)
  // Sum of (Price * Quantity) for all items in the selection
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // 2. Calculate Shipping Price
  // PROTOCOL: Free delivery for orders over ₹50,000, else a flat ₹500 fee
  state.shippingPrice = addDecimals(state.itemsPrice > 50000 ? 0 : 500);

  // 3. Calculate Tax Price (18% GST for high-end appliances)
  // We use 0.18 as the multiplier for standard Indian GST on electronics
  state.taxPrice = addDecimals(Number((0.18 * state.itemsPrice).toFixed(2)));

  // 4. Calculate Total Valuation
  // Summing all components back into a final figure
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  // 5. Persistent Storage
  // Saves the entire cart state so it survives a page refresh or session restart
  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};