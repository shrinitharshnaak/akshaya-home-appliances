import mongoose from 'mongoose';

/**
 * THE ORDER SCHEMA
 * Defines the structure for finalized transactions, including line items,
 * logistics data, and financial statuses.
 */
const orderSchema = mongoose.Schema(
  {
    // Link to the user who placed the order
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true, 
      ref: 'User' 
    },
    
    // Array of purchased assets
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],

    // Logistics & Destination coordinates
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      phone: { type: String, required: true }, // Verified: Matches Frontend Screen
      country: { type: String, required: false }, 
    },

    // Financial Protocol Data
    paymentMethod: { 
      type: String, 
      required: true 
    },
    
    // Payment Gateway Response Storage (Essential for Reconciliation)
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },

    // Price Breakdowns (Matching cartUtils logic)
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },

    // Transaction Status
    isPaid: { 
      type: Boolean, 
      required: true, 
      default: false 
    },
    paidAt: { 
      type: Date 
    },

    // Fulfillment Status
    isDelivered: { 
      type: Boolean, 
      required: true, 
      default: false 
    },
    deliveredAt: { 
      type: Date 
    },
    // Administrative Nullification
    isCancelled: { 
      type: Boolean, 
      required: true, 
      default: false 
    },
    cancelledAt: { 
      type: Date 
    },
  },
  { 
    // Automatically generates 'createdAt' and 'updatedAt' fields
    timestamps: true 
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;