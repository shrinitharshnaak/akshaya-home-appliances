import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * THE USER SCHEMA
 * The blueprint for identity and access control within the system.
 */
const userSchema = mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true // Ensures no duplicate identities in the vault
    },
    password: { 
      type: String, 
      required: true 
    },
    // Visual identifier for the User Manifest and Profile screens
    avatar: {
      type: String,
      required: false,
      default: ''
    },
    // Administrative clearance flag
    isAdmin: { 
      type: Boolean, 
      required: true, 
      default: false 
    },
    // Shipping Coordinates Vault
    addresses: [
      {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        phone: { type: String, required: true },
        country: { type: String, required: true },
        isDefault: { type: Boolean, required: true, default: false }
      }
    ],
    // Saved Inventory Assets
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
  },
  { 
    // Automatically tracks account creation and last update dates
    timestamps: true 
  }
);

/**
 * AUTHENTICATION LOGIC
 * Compares a plain-text password from a login request with the stored hash.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * SECURITY MIDDLEWARE
 * Intercepts the 'save' command to encrypt the password.
 * This runs on both user registration AND profile updates.
 */
userSchema.pre('save', async function (next) {
  // Only re-hash if the password field is actually being changed
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

export default User;