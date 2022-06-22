const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            max: 500,
            required: true,
        },
        extraText: {
            type: String,
            max: 1000,
        },
        img: {
            type: String,
        },
        likes: {
            type: Array,
            default: [],
        },
        categoryId: {
            type: String,
            required: false,
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("Post", PostSchema);