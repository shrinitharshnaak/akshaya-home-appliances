import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getUserReviews,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

/**
 * BASE USER ROUTE
 * POST: Public - Register a new account.
 * GET: Admin Only - Fetch the complete user manifest.
 */
router.route('/')
  .post(registerUser)
  .get(protect, admin, getUsers);

/**
 * AUTHENTICATION ENDPOINT
 * POST: Public - Verify credentials and issue JWT.
 */
router.post('/login', authUser);

/**
 * USER PROFILE ENDPOINTS
 * Access: Private (Any logged-in user)
 * GET: Retrieve own profile data.
 * PUT: Update own name, email, or password.
 */
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

/**
 * ADDRESS MANAGEMENT
 */
router.route('/addresses')
  .get(protect, getUserAddresses)
  .post(protect, addUserAddress);

router.route('/addresses/:id')
  .put(protect, updateUserAddress)
  .delete(protect, deleteUserAddress);

/**
 * WISHLIST / LISTS
 */
router.route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.route('/wishlist/:id')
  .delete(protect, removeFromWishlist);

/**
 * USER REVIEWS
 */
router.get('/reviews', protect, getUserReviews);

/**
 * ADMINISTRATIVE USER MANAGEMENT
 * Access: Private/Admin Only
 * GET: Fetch details of a specific user.
 * PUT: Administrative override of user data (e.g., granting Admin status).
 * DELETE: Permanent removal of a user account.
 */
router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router;