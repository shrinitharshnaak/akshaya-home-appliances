import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import generateToken from '../utils/generateToken.js';

/**
 * @desc    Auth user & get token (Login)
 * @route   POST /api/users/login
 * @access  Public
 */
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Authentication Failure: Invalid email or password.');
  }
});

/**
 * @desc    Register a new user
 * @route   POST /api/users
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Identity Conflict: User already exists in the vault.');
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Protocol Error: Invalid user data provided.');
  }
});

/**
 * @desc    Get user profile data
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
    });
  } else {
    res.status(404);
    throw new Error('Registry Error: User not found.');
  }
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.avatar = req.body.avatar || user.avatar;
    
    if (req.body.password) {
      user.password = req.body.password; 
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      avatar: updatedUser.avatar,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('Update Failed: User profile not found.');
  }
});

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Security Violation: Administrative accounts cannot be purged.');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User successfully removed from registry.' });
  } else {
    res.status(404);
    throw new Error('Deletion Failed: Target user not found.');
  }
});

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('Registry Error: User not found.');
  }
});

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('Update Failed: User not found.');
  }
});

/**
 * @desc    Fetch user addresses
 * @route   GET /api/users/addresses
 * @access  Private
 */
export const getUserAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json(user.addresses);
  } else {
    res.status(404);
    throw new Error('Registry Error: User not found.');
  }
});

/**
 * @desc    Add new address
 * @route   POST /api/users/addresses
 * @access  Private
 */
export const addUserAddress = asyncHandler(async (req, res) => {
  const { address, city, postalCode, phone, country, isDefault } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    if (isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }
    const newAddress = { address, city, postalCode, phone, country, isDefault };
    user.addresses.push(newAddress);
    await user.save();
    res.status(201).json(user.addresses);
  } else {
    res.status(404);
    throw new Error('Registry Error: User not found.');
  }
});

/**
 * @desc    Update an address
 * @route   PUT /api/users/addresses/:id
 * @access  Private
 */
export const updateUserAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const addr = user.addresses.id(req.params.id);
    if (addr) {
      if (req.body.isDefault) {
        user.addresses.forEach(a => a.isDefault = false);
      }
      addr.address = req.body.address || addr.address;
      addr.city = req.body.city || addr.city;
      addr.postalCode = req.body.postalCode || addr.postalCode;
      addr.phone = req.body.phone || addr.phone;
      addr.country = req.body.country || addr.country;
      addr.isDefault = req.body.isDefault !== undefined ? req.body.isDefault : addr.isDefault;

      await user.save();
      res.json(user.addresses);
    } else {
      res.status(404);
      throw new Error('Address not found.');
    }
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
});

/**
 * @desc    Remove an address
 * @route   DELETE /api/users/addresses/:id
 * @access  Private
 */
export const deleteUserAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);
    await user.save();
    res.json(user.addresses);
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
});

/**
 * @desc    Get user wishlist
 * @route   GET /api/users/wishlist
 * @access  Private
 */
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  if (user) {
    res.json(user.wishlist);
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
});

/**
 * @desc    Add product to wishlist
 * @route   POST /api/users/wishlist
 * @access  Private
 */
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);
  if (user) {
    if (user.wishlist.includes(productId)) {
      res.status(400);
      throw new Error('Product already in wishlist.');
    }
    user.wishlist.push(productId);
    await user.save();
    res.status(201).json({ message: 'Added to wishlist' });
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
});

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/users/wishlist/:id
 * @access  Private
 */
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.id);
    await user.save();
    res.json({ message: 'Removed from wishlist' });
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
});

/**
 * @desc    Fetch all reviews written by user
 * @route   GET /api/users/reviews
 * @access  Private
 */
export const getUserReviews = asyncHandler(async (req, res) => {
  const products = await Product.find({ 'reviews.user': req.user._id });
  
  const userReviews = products.map(p => {
    const review = p.reviews.find(r => r.user.toString() === req.user._id.toString());
    return {
      _id: review._id,
      productName: p.name,
      productId: p._id,
      productImage: p.image,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt
    };
  });

  res.json(userReviews);
});