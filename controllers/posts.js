// dependencies
const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

module.exports = {
  // get users posts from DB and render profile page
  getProfile: async (req, res) => {
    try {
      // get user posts from DB
      const posts = await Post.find({ user: req.user.id });
      // render a profile page with pulled posts
      res.render("profile.ejs", { posts: posts, user: req.user })
    } catch (err) {
      console.log(err);
    }
  },
  // get recent posts from DB and render feed page
  getFeed: async (req, res) => {
    try {
      // TODO: filter feed according to diet preferences
      // get posts from DB in counterchronological order
      const posts = await Post.find().sort({ createdOn: "desc" }).lean();
      // render a feed page with pulled posts
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  // get specific post from DB and render post page
  getPost: async (req, res) => {
    try {
      // get specific post from DB
      const post = await Post.findById(req.params.id);
      // get comments relating to post from DB and sort in counterchronological order
      const comments = await Comment.find({ post: req.params.id }).sort({ createdOn: "desc"}).lean();
      // render individual post page
      res.render("post.ejs", { post: post, user: req.user, comments: comments });
    } catch(err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // upload an image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // create Post in DB
      await Post.create({
        title: req.body.title,
        ingredients: req.body.ingredients,
        restrictedFor: req.body.restrictedFor,
        tags: req.body.tags,
        instructions: req.body.instructions,
        imageLink: result.secure_url,
        cloudinaryId: result.public_id,
        prepTime: req.body.prepTime,
        cookingTime: req.body.cookingTime,
        likes: 0,
        allergies: req.body.allergies,
        user: req.user.id,
      });
      console.log("Post published!");
      // redirect to publishing user's profile page
      res.redirect("/profile");
    } catch(err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      // find post in DB and increment ["likes"] property by 1
      await Post.fidOneAndUpdate(
        { _id: req.params.id },
        { $inc: {likes: 1} },
      );
      console.log("+1 Likes");
      // send user to liked post's page
      res.redirect(`/post/${req.params.id}`);
    } catch(err) {
      console.log(err);
    }
  },
  // delete the post
  deletePost: async (req, res) => {
    try {
      // find the post in DB by it's ID
      let post = await Post.findById({ _id: req.params.id });
      // delete post's image from Cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // delete the post from MongoDB
      await Post.remove({ _id: req.params.id });
      console.log("Post deleted!");
      // redirect user to profile page
      res.redirect("/profile");
    } catch(err) {
      console.log(err);
    }
  },
};