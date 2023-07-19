const { Schema, model } = require('mongoose');

const blogPostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  blogPicture: { type: String, required: true }, // New field for the blog picture URL
  category: { type: String, required: true }, // New field for the category
  date: { type: Date, default: Date.now },
});

const BlogPost = model('BlogPost', blogPostSchema);

module.exports = BlogPost;
