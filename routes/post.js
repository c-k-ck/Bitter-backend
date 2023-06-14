require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const postrouter = express.Router();

const Post = require('../model/post');
const User = require('../model/userprofile');

//Setting up a basic route
postrouter.get('/', async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const posts = await Post.find({});
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  } finally {
    mongoose.disconnect();
  }
});

postrouter.post('/', async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const { user_id, title, description, rating, category} = req.body;

    // added functionality to check if user exists 
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        error:
          "User not found"
      })
    }

    const newPost = await Post.create({
      user_id: user_id,
      title: title,
      description: description,
      rating: rating,
      category: category,
    });

    // update recentPosts array in the user object
    user.recentPosts.unshift(newPost._id);

    if (user.recentPosts.length > 5) {
      user.recentPosts.pop(); //removes last post ID from the array
    }
    await user.save();

    res.send(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  } finally {
    mongoose.disconnect();
  }
});

postrouter.delete('/:id', async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const id = req.params.id;
    const result = await Post.findOneAndDelete({ _id: id });

    if (!result) {
      res.status(404).send('No post found with the given id');
      return;
    }

    const postsLeft = await Post.find({});
    res.send(postsLeft);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  } finally {
    mongoose.disconnect();
  }
});

postrouter.put('/:id', async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const id = req.params.id;
    const { title, body, rating, category } = req.body;

    const updatedPost = await Post.findOneAndUpdate(
      { _id: id },
      { title: title, body: body, rating: rating, category: category },
      { new: true }
    );

    if (!updatedPost) {
      res.status(404).send('No post found with the given id');
      return;
    }

    const posts = await Post.find({});
    res.send(posts);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  } finally {
    mongoose.disconnect();
  }
});


//like and unlike functionality
postrouter.post('/:id/like', async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId); // Find the post by its ID
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const user = await User.findById(userId); // Find the user by their ID
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user has already liked the post
    const liked = user.likes.includes(postId);

    // remove like if user already liked post
    if (liked) {
      const index = user.likes.indexOf(postId); // Find the index of the post ID in the user's likes array
      user.likes.splice(index, 1);
      post.likes -= 1;

      // If the user has not liked the post, add the like
    } else {
      user.likes.push(postId);
      post.likes += 1;
    }

    await user.save();
    await post.save(); 

    res.json({ liked: !liked, likesCount: post.likes }); // Return the updated liked status and the current like count of the post
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  } finally {
    mongoose.disconnect(); // Disconnect from the MongoDB database
  }
});

//recent posts functionality
postrouter.get('/recent/:id', async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const userID = req.params.id

    const user = await User.findById(userID).populate('recentPosts');
    if (!user) {
      return res.status(404).json({error: 'User not found'})
    }

    res,json(user.recentPosts);

  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
    
  } finally {
    mongoose.disconnect();
  }
});


module.exports = postrouter;
