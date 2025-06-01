const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    item_id: { type: String, required: true, unique: true },
    total_likes: { type: Number, default: 0},
    user_ids: [String],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Like', likeSchema);
