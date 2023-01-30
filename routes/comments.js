const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// comment routes
router.post("/createComment/:id", commentsController.createComment);

module.exports = router;