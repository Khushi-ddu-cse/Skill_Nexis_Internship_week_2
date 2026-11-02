
const mongoose = require("mongoose");

// Define Note Schema
const noteSchema = new mongoose.Schema(
  {
    // Note title
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 120
    },

    // Note content
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000
    },

    // Reference to the user who owns the note
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Export Note Model
module.exports = mongoose.model("Note", noteSchema);
