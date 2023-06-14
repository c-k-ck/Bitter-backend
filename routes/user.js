require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const userrouter = express.Router();

const User = require('../model/userprofile')

// Connect to MongoDB
const connect = async () => {
    await mongoose.connect(process.env.MONGO_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

// Get user profile by ID
userrouter.get('user/:id', async (req, res) => {
    try {
        await connect();
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to retrieve user profile' });
    } finally {
        mongoose.disconnect();
    }
});

// Create a new user profile
userrouter.post('/user', async (req, res) => {
    try {
        await connect();
        const { name, email } = req.user; // retreive name and email from from auth0 JWT
        const { hometown, age, bio } = req.body;// retrieve remaining feilds from user input

        const user = new User({
            name: name,
            email: email,
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
userrouter.put('user/:id', async (req, res) => {
    try {
        const { hometown, age, bio } = req.body;

        const user = await User.findByIdAndUpdate(req.params.id, {
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

module.exports = userrouter;