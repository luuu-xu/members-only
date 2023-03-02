const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  member_status: { 
    type: String, 
    enum: ['regular', 'member', 'admin'],
    default: 'regular',
    required: true 
  },
});

// Export model
module.exports = mongoose.model('User', UserSchema);