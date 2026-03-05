const mongoose = require('mongoose');

const TimbreSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String },
    arquivo: { type: String, required: true }, // caminho do arquivo
    criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Timbre', TimbreSchema);