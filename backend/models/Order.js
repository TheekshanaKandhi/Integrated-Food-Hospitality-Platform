const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },
    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ],
    totalPrice: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      default: "Placed"
    },
    customerName: {
      type: String,
      required: true
    },
    deliveryAddress: {
      type: String,
      required: true
    },
    paymentMethod: {
      type: String,
      default: "Cash on Delivery"
    },
    paymentStatus: {
      type: String,
      default: "Pending"
    },
    invoiceNumber: {
      type: String,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", orderSchema);