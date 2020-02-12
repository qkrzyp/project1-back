const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    sell: {
      type: Number,
      default: 0
    },
    photo: {
      data: Buffer,
      contentType: String
    },
    delivery: {
      type: String,
      default: "무료"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
