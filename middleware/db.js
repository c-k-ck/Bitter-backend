// created middleware to connect to db
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error);
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;
