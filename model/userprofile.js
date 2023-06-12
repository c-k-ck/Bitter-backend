//Modularize your code by putting your schema and model in its own separate file and requiring the schema into your server.
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, require: true},
    email: {type: String, require: true},
    hometown: {type: String, require: true},
    age: {type: Number, require: true},
    bio: {type: String, require: true},
});