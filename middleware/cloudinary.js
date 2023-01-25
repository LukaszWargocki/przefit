// image storage @ cloudinary
const cloudinary = require("cloudinary").v2;

// get access to config
require("dotenv").config({ path: "./config/.env" });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
// export module
module.exports = cloudinary;