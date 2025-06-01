const mongoose = require('mongoose');

const noticiasSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  data: { type: Date, default: Date.now },
  visible: { type: Boolean, default: true
  }
});

module.exports = mongoose.model('noticias', noticiasSchema);