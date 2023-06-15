require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('../model/post');
const User = require('../model/userprofile');


mongoose.connect('mongodb://localhost:27017/Bitter', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('error', (error) => {
    console.error('Error connecting to MongoDB:', error);
});


mongoose.connection.once('open', async () => {
    console.log('Connected to MongoDB');

    // Fetch user IDs
    const users = await User.find();

    // Create posts
    const post1 = new Post({
        email: 'cfmatthews2@gmail.com',
        title: 'Singing the Blues',
        description: 'I\'m tired of this grandpa!',
        rating: 2,
        category: "Jobs & Workplaces"
    });

    const post2 = new Post({
        email: 'cfmatthews2@gmail.com',
        title: 'Software Development',
        description: 'I wanted to become a software engineer but I got all my certs through coding bootcamps. Just found out I will never be a software engineer without a four year degree from an acredited univerity. Kinda bummed.',
        rating: 3,
        category: "Education & Learning"
    });

    const post3 = new Post({
        email: 'cfmatthews2@gmail.com',
        title: 'Exploring the World',
        description: 'Recently visited some beautiful places and captured breathtaking photos.',
        rating: 4,
        category: "Travel & Hospitality"
    });

    const post4 = new Post({
        email: 'cfmatthews2@gmail.com',
        title: 'AT&T 5G',
        description: 'Feeling good today. I just my man 5 attachments. Shoutout to AT&T and their 5G network. Their lighting fast connect allows me to send multiple attachemnts quickly and recieve instant feedback from my boo!',
        rating: 5,
        category: "Retail & Shopping"
    });

    // Save posts to the database
    await post1.save();
    await post2.save();
    await post3.save();
    await post4.save();

    // Close the database connection
    mongoose.connection.close();
});
