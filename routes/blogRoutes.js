const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blogPost');

// Route for displaying all blog posts
router.get('/posts', async (req, res) => {
  try {
    const blogPosts = await BlogPost.find().sort({ date: -1 });
    res.render('posts', { blogPosts });
  } catch (err) {
    console.error("Error fetching blog posts:", err);
    res.status(500).send('Internal Server Error');
  }
});

// Add more routes for handling create, update, and delete operations as needed
// For example:

// Route for displaying a form to create a new blog post
router.get('/posts/new', (req, res) => {
  res.render('new');
});

// Route for handling the creation of a new blog post
router.post('/posts', async (req, res) => {
  try {
    const { title, content } = req.body;
    const blogPost = new BlogPost({ title, content });
    await blogPost.save();
    res.redirect('/posts');
  } catch (err) {
    console.error("Error creating blog post:", err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
