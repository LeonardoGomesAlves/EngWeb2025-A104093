const Noticias = require('../models/noticia');

module.exports.getAll = () => {
    return Noticias.find().sort({ data: -1 }).exec();
};

module.exports.getVisible = () => {
    return Noticias.find({ visible: true }).sort({ data: -1 }).exec();
};

module.exports.getById = (id) => {
    return Noticias.findById(id).exec();
};

module.exports.create = (newsData) => {
    console.log(newsData)
    const news = new Noticias(newsData);
    return news.save();
};

module.exports.update = (id, newsData) => {
    return Noticias.findByIdAndUpdate(id, newsData, { new: true }).exec();
};

module.exports.delete = (id) => {
    return Noticias.findByIdAndDelete(id).exec();
};

module.exports.countDocuments = () => {
    return Noticias.countDocuments().exec();
};