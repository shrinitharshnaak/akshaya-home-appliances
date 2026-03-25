import jwt from 'jsonwebtoken';

/**
 * TOKEN GENERATION PROTOCOL
 * Encodes the User's unique ID into a signed JWT.
 * This token acts as a digital passport for the user.
 */
const generateToken = (id) => {
  // Security Check: Ensure the secret exists in the environment
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('CRITICAL ERROR: JWT_SECRET is not defined in the environment variables.');
    // In development, this fallback prevents the app from crashing immediately, 
    // but a defined secret is required for production security.
  }

  /**
   * jwt.sign() creates the token.
   * @param {Object} payload - The data we want to store (User ID).
   * @param {String} secret - The private key used to sign the token.
   * @param {Object} options - Configuration like expiration.
   */
  return jwt.sign({ id }, secret || 'fallback_secret_for_development_only', {
    expiresIn: '30d', // Session remains valid for 30 days
  });
};

export default generateToken;