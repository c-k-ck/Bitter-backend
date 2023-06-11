const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB);
  
const postSchema = new mongoose.Schema({
   title: String,
   body: String,
   rating: Number
})
  
const Post = new mongoose.model("Post", postSchema)
const testpost = new Post({
   title: "I hate the new Spiderverse",
   body:"I've watched the new Spiderverse movie, and it was horrible, such a boring movie, would not recommend",
   rating: 1
});
  
testpost.save();