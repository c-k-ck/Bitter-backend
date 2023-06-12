require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const postrouter = express.Router();

const Post = require('../model/post');

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
    const { title, body, rating } = req.body;
    const newPost = await Post.create({
      title: title,
      body: body,
      rating: rating,
    });
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
    const { title, body, rating } = req.body;

    const updatedPost = await Post.findOneAndUpdate(
      { _id: id },
      { title: title, body: body, rating: rating },
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

module.exports = postrouter;
