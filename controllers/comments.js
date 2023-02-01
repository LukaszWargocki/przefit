const Comment = require("../models/Comment");
// adding comments to posts
module.exports = {
  createComment: async (req, res) => {
    try {
      // create Comment object in db
      await Comment.create({
        comment: req.body.comment,
        likes: 0,
        post: req.params.id,
      });
      console.log("Comment has been added.");
      // redirect to commented post page
      res.redirect("/post/"+req.params.id);
    } catch(err) {
      console.log(err);
    }
  },
};