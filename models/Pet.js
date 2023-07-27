const mongoose = require('mongoose')
const { Schema } = require('mongoose')

//model
const Pet = mongoose.model('Pet',
    new Schema({
        nome: { type: String, required: true },
        idade: { type: Number, required: true },
        peso: { type: Number, required: true },
        imagem: { type: Array },
        avaliacao: { type: Boolean },
        User: Object,
        adocao: Object
    },
        { timestamps: true }
    )


)

module.exports = Pet;