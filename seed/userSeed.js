require('dotenv').config();
const mongoose = require('mongoose');
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
  
    // Create users
    const user1 = new User({
      name: 'John Appleseed',
      email: 'johnnyapp@example.com',
      username: 'johnnytest', 
      hometown: 'New York',
      age: 30,
      bio: 'I love coding and exploring new technologies.',
    });
  
    const user2 = new User({
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      username: 'djangojane',
      hometown: 'Los Angeles',
      age: 25,
      bio: 'Passionate about photography and travel.',
    });

    const user3 = new User({
        name: 'Gloria Hallelujah',
        email: 'glohalle@example.com',
        username: 'notglorilla',
        hometown: 'Memphis',
        age: 21,
        bio: 'Memphis! Memphis! Memphis! Memphis! Memphis! Nothin but Memphis!',
      });
    
  
    // Save users to the database
    await user1.save();
    await user2.save();
    await user3.save();
  
    // Close the database connection
    mongoose.connection.close();
  });
  

