require('dotenv').config();

// Requiring express after installing it
const express = require('express');

// Envoking the function
const app = express();

//Invoking cors to protect use security on our routes
const cors = require('cors');

//Setting up mongoose in our application
const mongoose = require('mongoose');

//Importing the routes we have
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

//Importing jwt middleware
const { verifyJwt, getUserInfo } = require('./authentication');

//Middleware
app.use(express.json());
app.use(cors());
app.use(verifyJwt);
app.use(getUserInfo);

// Setting up the Routes
app.use('/post', postRoutes)
app.use('/user', userRoutes)


//Using the next parameter lets us use different middleware,
//without it our middleware would get stuck at the first one.
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

//Test Route
app.get('/test', (req, res) => {
    res.send('This means that it works :)');
});
//Listen for request
app.listen(process.env.PORT, () =>{
    console.log(` 🔅 Listening on Port`, process.env.PORT);
});