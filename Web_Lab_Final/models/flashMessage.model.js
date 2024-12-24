const mongoose = require('mongoose');

const flashMessageSchema = new mongoose.Schema({
    type: { type: String, default: '' },  // Default is empty string
    message: { type: String, default: '' }, // Default is empty string
    createdAt: { type: Date, default: Date.now },
});

const FlashMessage = mongoose.model('FlashMessage', flashMessageSchema);

module.exports = FlashMessage;
