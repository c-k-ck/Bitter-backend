//Modularize your code by putting your schema and model in its own separate file and requiring the schema into your server.
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB);

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    hometown: { type: String },
    age: { type: Number },
    bio: { type: String },
});

const User = new mongoose.model("User", userSchema);
const testUser = new User({
    name: 'Ms. Ruby',
    email: 'ms.ruby@gmail.com',
    hometown: 'Memphis',
    age: 22,
    bio: "Ms. Ruby sings the blues so you don't have to",
});

mongoose.connection.on('error', (error) => {
    console.error('Error connecting to MongoDB:', error);
});

mongoose.connection.once('open', async () => {
    console.log('Connected to MongoDB');

    try {
        await testUser.save();
    } catch (error) {
        console.error("Error creating user:", error)
    }
});

module.exports = User;