const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    _id: { type: String, required: true},
    user_id: { type: String, required: true },
    item_id: { type: String, required: true},
    descricao: { type: String },
    dataSubmissao: { type: Date, default: Date.now },
})

module.exports = mongoose.model('comment', commentSchema)