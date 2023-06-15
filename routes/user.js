require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const userrouter = express.Router();

const User = require('../model/userprofile')

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
    
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
});

// Get user profile by ID
userrouter.get('/', async (req, res) => {
    let email = req.query.email
    await mongoose.connect(process.env.MONGO_DB)
    try {
        const user = await User.findOne({email: email}).exec();

        res.json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Failed to retrieve user profile' });
    }
});

// Create a new user profile
userrouter.post('/', async (req, res) => {
    await mongoose.connect(process.env.MONGO_DB)
    try {
        const { name, email } = req.user; // retreive name and email from from auth0 JWT
        const { username, hometown, age, bio } = req.body;// retrieve remaining feilds from user input

        // Check if the user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const user = new User({
            name: name,
            email: email,
            username: username,
            hometown: hometown,
            age: age,
            bio: bio,
        });
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create new user profile' })
    }
});

// Update user profile by ID
userrouter.put('/:id', async (req, res) => {
    console.log(req.params.id)
    try {
        const { hometown, age, bio } = req.body;
        const user = await User.findByIdAndUpdate( req.params.id, {
            hometown,
            age,
            bio
        }, { new: true });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user profile' });
    }
});

// Delete user profile by ID
userrouter.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user profile' });
    }
});

// retrieve user's recent posts
userrouter.get('/:id/recentPosts', async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id).populate('recentPosts');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user.recentPosts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve user\'s recent posts' });
    }
});

// retrieve user's liked posts
userrouter.get('/:id/likes', async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).populate('likes');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user.likes);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});

module.exports = userrouter;