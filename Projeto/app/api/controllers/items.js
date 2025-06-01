var Item = require('../models/item')
var fs = require('fs')
var path = require('path')
var jszip = require('jszip')

module.exports.countDocuments = () => {
  return Item.countDocuments().exec();
}

module.exports.countDocumentsPublic = () => {
  return Item.countDocuments({visible : true}).exec();
}

module.exports.countDocumentsPrivate = () => {
    return Item.countDocuments({visible : false}).exec();
  }

module.exports.findAll = () => {
    return Item
        .find()
        .sort({dataSubmissao: -1})
        .exec()
}

module.exports.findAllPublic = () => {
    return Item
        .find({ visible: true})
        .sort({dataSubmissao: -1})
        .exec()
}

module.exports.findAllForUsers = (username, filtros = {}) => {
    let query = {}

    if (filtros.tipo) {
        if (Array.isArray(filtros.tipo)) {
            query.tipo = { $in: filtros.tipo.map(t => t.toLowerCase()) }
        } else {
            query.tipo = filtros.tipo.toLowerCase()
        }
    }

    if (filtros.classificador) {
        let classificadores;
        if (Array.isArray(filtros.classificador)) {
            classificadores = filtros.classificador.map(c => c.toLowerCase());
        } else {
            classificadores = [filtros.classificador.toLowerCase()];
        }
        query.classificadores = { $in: classificadores }
    }

    console.log(query)


    return Item.aggregate([
        {
            $match: {
                $and: [
                    query,
                    {
                        $or: [
                            { visible: true },
                            { user_id: username }
                        ]
                    }
                ]
            }
        },
        {
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'item_id',
                as: 'likeData'
            }
        },
        {
            $addFields: {
                total_likes: { 
                    $ifNull: [{ $arrayElemAt: ["$likeData.total_likes", 0] }, 0] 
                },
                hasLiked: {
                    $cond: {
                        if: {
                            $and: [
                                { $gt: [{ $size: "$likeData" }, 0] }, // Existe documento de like
                                username ? { $in: [username, { $arrayElemAt: ["$likeData.user_ids", 0] }] } : false
                            ]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                likeData: 0
            }
        },
        {
            $sort: { dataSubmissao: -1 }
        }
    ]).exec()
} 

module.exports.findById = async (id) => {
    const results = await Item.aggregate([
        {
            $match: { _id: id }
        },
        {
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'item_id',
                as: 'likeData'
            }
        },
        {
            $addFields: {
                total_likes: { 
                    $ifNull: [{ $arrayElemAt: ["$likeData.total_likes", 0] }, 0] 
                }
            }
        },
        {
            $project: {
                likeData: 0
            }
        }
    ]).exec();

    return results[0] || null;
}

module.exports.update = (id, data) => {
    return Item
        .findByIdAndUpdate(id, data, {new: true})
        .exec()
}

module.exports.delete = async (id) => {
    const Like = require('./likes');
    const Comment = require('./comment');

    var item = await Item
        .findByIdAndDelete(id, {new : true})
        .exec()

    // remover ficheiro do sistema e dados relacionados
    if (item) {
        const pasta = path.join(__dirname, '..', 'repository', id)
        if (fs.existsSync(pasta)) {
            fs.rmSync(pasta, { recursive: true, force: true })
        }

        // Eliminar likes associados ao item
        try {
            await Like.deleteByItemId(id);
        } catch (error) {
            console.error("Erro ao eliminar likes:", error);
        }

        // Eliminar comentários associados ao item
        try {
            await Comment.deleteByItemId(id);
        } catch (error) {
            console.error("Erro ao eliminar comentários:", error);
        }
    }

    return item
}

module.exports.save = async (item) => {
    var items = await Item.find({_id: item._id}).exec()

    if (items.length < 1) {
        var itemsDb = new Item(item)
        return itemsDb.save()
    }
}

module.exports.export = async (id) => {
    var item = await Item.findOne({_id: id}).lean().exec() // lean para ficar um objeto simples

    var manifesto = { ...item }
    delete manifesto._id
    delete manifesto.__v
    delete manifesto.dataSubmissao
    delete manifesto.views
    delete manifesto.downloads
    delete manifesto.visible

    const repoPrefix = `/repository/${id}/`
    for (let i = 0; i < manifesto.ficheiros.length; i++) {
        if (manifesto.ficheiros[i].startsWith(repoPrefix)) {
            manifesto.ficheiros[i] = manifesto.ficheiros[i].slice(repoPrefix.length)
        }
    }

    var zip = new jszip()
    zip.file('manifesto-SIP.json', JSON.stringify(manifesto, null, 2))

    var pasta = path.join(__dirname, '..', 'repository', id)
    
    function adicionarFicheirosAoZip(dir, zipFolder) {
        var items = fs.readdirSync(dir, { withFileTypes: true })

        for (const file of items) {
            var fullPath = path.join(dir, file.name)
            // criar subpasta
            if (file.isDirectory()) {
                var subZip = zipFolder.folder(file.name)
                adicionarFicheirosAoZip(fullPath, subZip)
            } else {
                var fileData = fs.readFileSync(fullPath)
                zipFolder.file(file.name, fileData)
            }
        }
    }

    if (fs.existsSync(pasta)) {
        adicionarFicheirosAoZip(pasta, zip)
    }

    return await zip.generateAsync({ type: 'nodebuffer' })
}

module.exports.getPublicItems = async (filtros = {}) => {
    var query = { visible: true }

    if (filtros.tipo) {
        if (Array.isArray(filtros.tipo)) {
            query.tipo = { $in: filtros.tipo.map(t => t.toLowerCase()) }
        } else {
            query.tipo = filtros.tipo.toLowerCase()
        }
    }

    if (filtros.classificador) {
        let classificadores;
        if (Array.isArray(filtros.classificador)) {
            classificadores = filtros.classificador.map(c => c.toLowerCase());
        } else {
            classificadores = [filtros.classificador.toLowerCase()];
        }
        query.classificadores = { $in: classificadores }
    }

    return Item.aggregate([
        {
            $match: query
        },
        {
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'item_id',
                as: 'likeData'
            }
        },
        {
            $addFields: {
                total_likes: { 
                    $ifNull: [{ $arrayElemAt: ["$likeData.total_likes", 0] }, 0] 
                }
            }
        },
        {
            $project: {
                likeData: 0
            }
        },
        {
            $sort: { dataSubmissao: -1 }
        }
    ]).exec()
}

module.exports.getByUserId = async (_user_id, filtros = {}) => {
    let query = { user_id: _user_id, visible: true }

    if (filtros.tipo) {
        if (Array.isArray(filtros.tipo)) {
            query.tipo = { $in: filtros.tipo.map(t => t.toLowerCase()) }
        } else {
            query.tipo = filtros.tipo.toLowerCase()
        }
    }

    if (filtros.classificador) {
        let classificadores;
        if (Array.isArray(filtros.classificador)) {
            classificadores = filtros.classificador.map(c => c.toLowerCase());
        } else {
            classificadores = [filtros.classificador.toLowerCase()];
        }
        query.classificadores = { $in: classificadores }
    }

    console.log(filtros)
    
    return Item.aggregate([
        {
            $match: query
        },
        {
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'item_id',
                as: 'likeData'
            }
        },
        {
            $addFields: {
                total_likes: { 
                    $ifNull: [{ $arrayElemAt: ["$likeData.total_likes", 0] }, 0] 
                }
            }
        },
        {
            $project: {
                likeData: 0
            }
        },
        {
            $sort: { dataSubmissao: -1 }
        }
    ]).exec()
}

module.exports.getByUserIdBySameUser = async (_user_id, filtros = {}) => {
    let query = { user_id: _user_id }

    if (filtros.tipo) {
        if (Array.isArray(filtros.tipo)) {
            query.tipo = { $in: filtros.tipo.map(t => t.toLowerCase()) }
        } else {
            query.tipo = filtros.tipo.toLowerCase()
        }
    }

    if (filtros.classificador) {
        let classificadores;
        if (Array.isArray(filtros.classificador)) {
            classificadores = filtros.classificador.map(c => c.toLowerCase());
        } else {
            classificadores = [filtros.classificador.toLowerCase()];
        }
        query.classificadores = { $in: classificadores }
    }

    return Item.aggregate([
        {
            $match: query
        },
        {
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'item_id',
                as: 'likeData'
            }
        },
        {
            $addFields: {
                total_likes: { 
                    $ifNull: [{ $arrayElemAt: ["$likeData.total_likes", 0] }, 0] 
                },
                hasLiked: {
                    $cond: {
                        if: {
                            $and: [
                                { $gt: [{ $size: "$likeData" }, 0] },
                                { $in: [_user_id, { $arrayElemAt: ["$likeData.user_ids", 0] }] }
                            ]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                likeData: 0
            }
        },
        {
            $sort: { dataSubmissao: -1 }
        }
    ]).exec()
}

module.exports.changeVisibility = async (userId, id, visible) => {
    try {
        const item = await Item.findById(id).exec();
        
        if (!item) {
            throw new Error('Item não encontrado');
        }
        
        if (item.user_id !== userId) {
            throw new Error('Não autorizado: apenas o proprietário pode alterar a visibilidade');
        }
        
        return Item
            .findByIdAndUpdate(
                id, 
                { visible: visible }, 
                { new: true }
            )
            .exec();
    } catch (error) {
        throw error;
    }
}

module.exports.incrementViews = (id) => {
    return Item.findByIdAndUpdate(
        id, 
        { $inc: { views: 1 } },
        { new: true }
    ).exec();
};

module.exports.incrementDownloads = (id) => {
    return Item.findByIdAndUpdate(
        id, 
        { $inc: { downloads: 1 } },
        { new: true }
    ).exec();
};

module.exports.getItemStats = (id) => {
    return Item.findById(id)
        .select('views downloads titulo')
        .exec();
};
  

module.exports.getTopViewed = (limit = 5) => {
    return Item.find({ visible: true })
        .sort({ views: -1 })
        .limit(limit)
        .select('titulo views user_id')
        .exec();
};
  
module.exports.getTopDownloaded = (limit = 5) => {
    return Item.find({ visible: true })
        .sort({ downloads: -1 })
        .limit(limit)
        .select('titulo downloads user_id')
        .exec();
};
  
module.exports.getTotalStats = async () => {
    const totalViews = await Item.aggregate([
        { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    const totalDownloads = await Item.aggregate([
        { $group: { _id: null, total: { $sum: '$downloads' } } }
    ]);

    return {
        totalViews: totalViews[0]?.total || 0,
        totalDownloads: totalDownloads[0]?.total || 0
    };
};