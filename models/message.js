const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const { DateTime } = require('luxon');

const MessageSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, required: true },
});

MessageSchema.virtual('timestamp_formatted').get(function() {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_FULL);
});

// Export module
module.exports = mongoose.model('Message', MessageSchema);