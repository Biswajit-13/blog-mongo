const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const multer = require("multer");
const port = 3000; // You can change this port if needed

const baseUrl = "http://localhost:3000";

// Set up the EJS view engine
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // Serve images from the 'uploads' folder

//configure multer
const upload = multer({
  dest: "uploads/", // Destination folder to save uploaded files
  limits: {
    fileSize: 2 * 1024 * 1024, // Limit file size to 2MB (adjust as needed)
  },
});

// Your MongoDB connection string
const connectionString =
  "mongodb+srv://BiswajitPaul:Bishupaul13@blogcluster.8thlqqf.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB cluster
MongoClient.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    console.log("Connected to MongoDB cluster successfully!");
    const db = client.db("blogPost"); // Replace 'your-database-name' with the actual name of your database

    // Set up the EJS view engine
    app.set("view engine", "ejs");
    app.use(express.urlencoded({ extended: true }));

    // Route for displaying a form to create a new blog post
    app.get("/posts/new", (req, res) => {
      res.render("new"); // Assuming you have a view named 'new.ejs' to render the form
    });

    //route for handling submission of post
    app.post("/posts", upload.single("blogPicture"), (req, res) => {
      const { title, content, category } = req.body;
      const blogPicture = req.file
        ? `${baseUrl}/uploads/${req.file.filename}`
        : undefined; // Add the base URL to the filename

      // ... rest of the code ...
      const collection = db.collection("blogPost");

      const newPost = {
        title,
        content,
        category,
        blogPicture,
        date: new Date(),
      };

      // ... rest of the code ...

      collection
        .insertOne(newPost)
        .then((result) => {
          console.log("Document inserted successfully:", result.insertedId);
          res.redirect(`/posts/${result.insertedId}`); // Redirect to the list of all posts after successful insertion
        })
        .catch((error) => {
          console.error("Error inserting document:", error);
          res
            .status(500)
            .send("An error occurred while creating the new post.");
        });
    });

    //route for displaying the posts
    app.get('/posts', (req, res) => {
      const selectedCategory = req.query.category || ''; // Get the category from the query parameters
    
      const collection = db.collection('blogPost');
    
      // If a category is selected, filter posts based on that category
      const query = selectedCategory ? { category: selectedCategory } : {};
    
      collection
        .find(query)
        .sort({ date: -1 })
        .toArray()
        .then((blogPosts) => {
          // Fetch unique categories
          collection
            .distinct('category')
            .then((categories) => {
              res.render('posts', { blogPosts, selectedCategory, categories });
            })
            .catch((error) => {
              console.error('Error fetching categories:', error);
              res.status(500).send('An error occurred while fetching categories.');
            });
        })
        .catch((error) => {
          console.error('Error fetching blog posts:', error);
          res.status(500).send('An error occurred while fetching blog posts.');
        });
    });
    
    

    //displaying full post
    app.get("/posts/:postId", (req, res) => {
      const postId = req.params.postId;

      // Convert the postId to ObjectId (required for querying by _id)
      try {
        const objectId = new ObjectId(postId);

        const collection = db.collection("blogPost"); // Replace 'your-collection-name' with the desired collection name

        collection
          .findOne({ _id: objectId })
          .then((post) => {
            if (!post) {
              // Post with the given ID not found
              return res.status(404).send("Post not found");
            }

            // Render the view to display the full post content
            res.render("fullPost", { post });
          })
          .catch((error) => {
            console.error("Error fetching the post:", error);
            res.status(500).send("An error occurred while fetching the post.");
          });
      } catch (error) {
        console.error("Invalid postId:", error);
        res.status(400).send("Invalid postId.");
      }
    });
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
