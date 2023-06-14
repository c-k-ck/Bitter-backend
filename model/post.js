require('dotenv').config();
console.log(process.env.LocalMONGO_DB)
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB);

//added user id to schema and added required properties to ensure userID and other required feilds are provided when creating a new post
const postSchema = new mongoose.Schema({

 email:{type: String, required: true},
  title: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, required: true },
  category: {type: String, required: true},
});

const Post = new mongoose.model("Post", postSchema);


const User = require('./userprofile')


const newTestPost = async () => {

  const userTest = await User.findOne({})
  console.log(userTest)

  const testpost = new Post({
    user_id: userTest._id,
    title: "I hate the new Spiderverse",
    description: "I've watched the new Spiderverse movie, and it was horrible, such a boring movie, would not recommend",
    rating: 1,
    category: "media"
  });

  try {
    await testpost.save();
    console.log('Data saved successfully');
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

mongoose.connection.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error);
});

mongoose.connection.once('open', async () => {
  console.log('Connected to MongoDB');
  await newTestPost();
  mongoose.connection.close();
});

module.exports = Post;