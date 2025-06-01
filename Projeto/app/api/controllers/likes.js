const Like = require('../models/like')

module.exports.toggleLike = async (item_id, user_id) => {
    try {
        let like = await Like.findOne({item_id: item_id});

        const hasLiked = like.user_ids.includes(user_id);

        if (hasLiked) {
            like.user_ids = like.user_ids.filter(id => id !== user_id);
            like.total_likes -= 1
        } else {
            like.user_ids.push(user_id);
            like.total_likes += 1;
        }

        return await like.save();
    } catch (error) {
        console.error("Não foi possível efetuar a operação relativa a like.")
        return null;
    }
}

module.exports.getLikesForItem = async (item_id) => {
    try {
        const likeDoc = await Like.findOne({ item_id });
        return likeDoc.total_likes;
    } catch (error) {
        console.error("Não foi possível efetuar a operação relativa a like.")
        return null;
    }
};

module.exports.hasUserLiked = async (item_id, user_id) => {
    try {
        const likeDoc = await Like.findOne({ item_id });
        return likeDoc ? likeDoc.user_ids.includes(user_id) : false;
    } catch (error) {
        console.error("Não foi possível efetuar a operação relativa a like.")
        return false;
    }
};

module.exports.save = async (like) => {
    var likes = await Like.find({_id : like._id}).exec()

    if(likes.length < 1){
        var entregaDb = new Like(like)
        return entregaDb.save()
    }
}

module.exports.deleteByItemId = async (item_id) => {
    try {
        return await Like.deleteMany({ item_id: item_id }).exec();
    } catch (error) {
        console.error("Erro ao eliminar likes do item:", error);
        throw error;
    }
};
