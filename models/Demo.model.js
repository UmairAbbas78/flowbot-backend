const mongoose = require('mongoose');

const DemoSchema = new mongoose.Schema({
  prompt: String,
  explanation: String,
  appName: String,
  videoPath: String,
  url: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Demo', DemoSchema);
