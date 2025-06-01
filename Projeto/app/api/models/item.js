const mongoose = require('mongoose')

/*
    {
    "id": "UUID",
    "user_id": "JoaoSilva",
    "titulo": "Titulo do Exemplo",
    "tipo" : "desporto",
    "descricao": "Descrição sobre o acontecimento",
    "dataCriacao": "2025-05-20",
    "dataSubmissao": "2025-05-21",
    "visible": false,
    "classificadores": ["desporto", "corrida", "outdoor"],
    "ficheiros": ["corrida1.jpg", "mapa.gpx"]
  }
*/

const itemSchema = new mongoose.Schema({
    _id: { type: String, required: true},
    user_id: { type: String, required: true },
    titulo: { type: String, required: true},
    tipo: { type: String, required: true },
    descricao: { type: String },
    dataCriacao: { type: Date, required: true },
    dataSubmissao: { type: Date, default: Date.now },
    visible: { type: Boolean, default: false },
    classificadores: [String],
    ficheiros: [String],
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 }
})

module.exports = mongoose.model('item', itemSchema)