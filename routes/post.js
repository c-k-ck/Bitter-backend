const express = require('express');
const mongoose = require('mongoose');

const postrouter = express.Router();

const Post = require('../model/post')

mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(error => {
  console.log('MongoDB connection error:', error);
});

postrouter.get('/', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

postrouter.post('/', async (req, res) => {
  try {
    const { title, description, rating, category } = req.body;
    const newPost = await Post.create({
      title: title,
      description: description,
      category: category,
      rating: rating,
    });
    res.send(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

postrouter.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Post.findOneAndDelete({ _id: id });

    if (!result) {
      res.status(404).send('No post found with the given id');
      return;
    }

    const postsLeft = await Post.find({});
    res.status(204).send(postsLeft);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

postrouter.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, rating, category } = req.body;

    const updatedPost = await Post.findOneAndUpdate(
      { _id: id },
      { title: title, description: description, rating: rating, category: category },
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
  }
});

module.exports = postrouter;