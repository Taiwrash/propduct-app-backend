const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  product_name: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

// console.log(productSchema);

module.exports = mongoose.model("Produce", productSchema);
