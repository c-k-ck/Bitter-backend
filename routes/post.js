const express = require('express');
const mongoose = require('mongoose');

const postrouter = express.Router();


const Post = require('../model/post');
const User = require('../model/userprofile');


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
  }
});

postrouter.post('/', async (req, res) => {


    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const {title, description, rating, category} = req.body;
    let email = req.user.email;
    // added functionality to check if user exists 
    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      return res.status(404).json({
        error:
          "User not found"
      })
    }


    const newPost = await Post.create({
      email: req.user.email,
      title: title,
      description: description,
      category: category,
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

});

postrouter.delete('/:id', async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const id = req.params.id;
    const result = await Post.findOneAndDelete({ email: email });

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
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const postId = req.params.id
    const { title, description, rating, category } = req.body;
    const email = req.user.email

    const updatedPost = await Post.findOneAndUpdate(
       postId,
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


//like and unlike functionality
postrouter.post('/like', async (req, res) => {
  let email = req.user.email;
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

 
 

    const post = await Post.findOne({email: email}); // Find the post by user email
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const user = await User.findOne({email: email}); // Find the user by their ID
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user has already liked the post
    const liked = user.likes.includes({email: email});

    // remove like if user already liked post
    if (liked) {
      const index = user.likes.indexOf({email: email}); // Find the index of the post ID in the user's likes array
      user.likes.splice(index, 1);
      post.likes -= 1;

      // If the user has not liked the post, add the like
    } else {
      user.likes.push({email: email});
      post.likes += 1;
    }

    await user.save();
    await post.save(); 

    res.json({ liked: !liked, likesCount: post.likes }); // Return the updated liked status and the current like count of the post
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

//recent posts functionality
// postrouter.get('/recent/:id', async (req, res) => {
//   try {
//     await mongoose.connect(process.env.MONGO_DB, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     const userID = req.params.id

//     const user = await User.findById(userID).populate('recentPosts');
//     if (!user) {
//       return res.status(404).json({error: 'User not found'})
//     }

//     res.json(user.recentPosts);

//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Internal Server Error');
    
//   } 
// });


module.exports = postrouter;

