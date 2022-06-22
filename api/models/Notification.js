const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    receiverId: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      max: 500,
    },
    senderId: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      
    },
    isNew: {
      type: String,
      default:"T"
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);