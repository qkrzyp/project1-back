const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    products: [
      {
        productName: {
          type: String,
          required: true
        },
        productPrice: {
          type: Number,
          required: true
        },
        productQuantity: {
          type: Number,
          required: true
        }
      }
    ],
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    phone: {
      type: Number,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    payment: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
