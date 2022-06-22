const mongoose = require("mongoose");

const CategoryReqSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
        type: String,
        required: true,
    },

   
  },
  { timestamps: true }
);

module.exports = mongoose.model("CategoryReq", CategoryReqSchema);