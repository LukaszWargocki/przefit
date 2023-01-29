const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: [String], required: true },
  restrictedFor: [String],
  tags: [String],
  instructions: { type: [String], required: true },
  imageLink: { type: String, required: true },
  cloudinaryId: { type: String, required: true },
  prepTime: { type: Number, required: true },
  cookingTime: { type: Number, required: true },
  likes: { type: Number, required: true },
  createdOn: { type: Date, default: Date.now },
  allergies: [String],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Post", PostSchema);