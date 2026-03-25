import mongoose from 'mongoose';

/**
 * REVIEW SCHEMA
 * Nested within the product to keep feedback data localized and fast to query.
 */
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

/**
 * PRODUCT SCHEMA
 * The primary blueprint for all inventory assets in the system.
 */
const productSchema = mongoose.Schema(
  {
    // The administrative user who initialized this asset
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true, // Flexibility maintained: No Enum constraints
    },
    description: {
      type: String,
      required: true,
    },
    // Array of nested Review objects
    reviews: [reviewSchema],
    
    // Aggregated metrics for performance and UI sorting
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    // Automatically tracks 'createdAt' and 'updatedAt' for inventory age
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;