const express = require('express');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const profilerouter = express.Router();

const Post = require('../model/post')

// Middleware to verify the access token
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token)
  
    if (!token) {
      return res.status(401).json({ error: "Access token is missing" });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: err.message });
      }
      console.log(user)
      req.user = user;
      next();
    });
  }
mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(error => {
  console.log('MongoDB connection error:', error);
});

profilerouter.get('/', authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find({ email: req.user.email });
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});