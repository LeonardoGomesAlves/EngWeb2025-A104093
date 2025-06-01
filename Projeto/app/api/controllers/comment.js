const Comment = require('../models/comment');
const Item = require('../models/item');
const { v4: uuidv4 } = require('uuid');

module.exports.upload_comment = async (comment) => {
    try{
        const newComment = new Comment({
            _id: uuidv4(),
            user_id: comment.user_id,
            item_id: comment.item_id,
            descricao: comment.descricao,
            dataSubmissao: new Date()
        })
        return await newComment.save();
    }catch(err){
        console.error('Erro ao comentar',err)
          throw err;
    }
};

module.exports.getCommentsByItem = async (item_id) => {
    try {
        return await Comment.find({ item_id: item_id })
                          .sort({ dataSubmissao: -1 })
                          .exec();
    } catch (error) {
        console.error('Erro ao buscar comentários:', error);
        throw error;
    }
}

module.exports.findById = (id) => {
    return Comment.findById(id).exec();
}

module.exports.deleteById = (id) => {
    return Comment.findByIdAndDelete(id).exec();
}

module.exports.deleteByItemId = async (item_id) => {
    try {
        return await Comment.deleteMany({ item_id: item_id }).exec();
    } catch (error) {
        console.error('Erro ao eliminar comentários do item:', error);
        throw error;
    }
}

module.exports.getCommentsFromUser = user_id => {
    return Comment.find({ user_id: user_id }).exec()
}