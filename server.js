require('dotenv').config();

const PostData = require('./model/post');

// Requiring express after installing it
const express = require('express');

// Envoking the function
const app = express();

//Middleware
app.use(express.json());
//Using the next parameter lets us use different middleware,
//without it our middleware would get stuck at the first one.
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

//Setting up a basic route
app.get('/fill' , async(req, res) => {
    try{
       PostData();
       res.send("Data filled, check your database!");
    }catch(error){
        res.send('Error, please check your server');
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