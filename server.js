require('dotenv').config()

// Requiring express after installing it
const express = require('express')
const workoutRoutes = require('./routes/workouts')

// Envoking the function
const app = express();

//Middleware
app.use(express.json());
//Using the next parameter lets us use different middleware,
//without it our middleware would get stuck at the first one.
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next();
})

//Setting up a basic route

//Listen for request
app.listen(process.env.PORT, () =>{
    console.log(`Listening on Port`, process.env.PORT)
});