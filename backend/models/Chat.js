const mongoose = require ("mongoose");

const chatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages: [
    {
      role: { type: String, enum: ['user', 'bot'], required: true },
      query: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model('Chat', chatSchema);
