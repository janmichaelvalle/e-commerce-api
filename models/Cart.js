const mongoose = require('mongoose');
const Schema = mongoose.Schema

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User ID is required."]
  },
  cartItems: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        required: [true, "Product ID is required"]
      },
      quantity: {
        type: Number,
        default: 1,
      },
      subtotal: {
        type: Number,
        required: [true, "Subtotal is required"]
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: [true, "Total price is required"]
  },
  orderedOn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Cart", cartSchema);