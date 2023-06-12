require('dotenv').config();

// Requiring express after installing it
const express = require('express');

// Envoking the function
const app = express();

//Invoking cors to protect use security on our routes
const cors = require('cors');

//Setting up mongoose in our application
const mongoose = require('mongoose');

//Middleware
app.use(express.json());
app.use(cors());

const Post = require('./model/post')
//Using the next parameter lets us use different middleware,
//without it our middleware would get stuck at the first one.
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

//Setting up a basic route
app.get('/post', async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const post = await Post.find({});
        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    } finally{
        mongoose.disconnect();
    }
});
app.post('/post', async (req, res) => {
    try{
        await mongoose.connect(process.env.MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const {title, body, rating} = req.body;
        const newPost = await Post.create({
           title: title,
           body: body,
           rating: rating
        });
        res.send(newPost)
    } catch(error){

    } finally {
        mongoose.disconnect();
    }
});
app.delete('/post/:id', async (req, res) => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const id = req.params.id;
        const result = await Post.findOneAndDelete({ _id: id});

        //If Post not found, send error
        if (!result) {
            res.status(404).send('No book found with the given id');
            return;
        }
        // Send back the leftover post
        const postLeft = await Post.find({});
        res.send(postLeft);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    } finally {
        mongoose.disconnect();
    }
});
app.put('/post/:id', async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const id = req.params.id;
        const { title, body, rating } = req.body;

        const updatedPost = await Post.findOneAndUpdate(
            { _id: id},
            { title: title, body: body, rating: rating },
            { new: true }
        );

        if (!updatedPost) {
            res.status(404).send('No book found with the given id');
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
//Test Route
app.get('/test', (req, res) => {
    res.send('This means that it works :)');
});
//Listen for request
app.listen(process.env.PORT, () =>{
    console.log(` 🔅 Listening on Port`, process.env.PORT);
});