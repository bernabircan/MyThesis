const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            max: 50,
        },
        profilePicture: {
            type: String,
            default: "",
        },
        categoryPath: {
            type: String,
            default: "",
        },
        coverPicture: {
            type: String,
            default: "",
        },
        followers: {
            type: Array,
            default: [],
        },

    },
    {timestamps: true}
);

module.exports = mongoose.model("Category", CategorySchema);