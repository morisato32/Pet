const mongoose = require('mongoose')
const { Schema } = require('mongoose')

//model
const Pet = mongoose.model('Pet',
    new Schema({
        name: { type: String, required: true },
        idade: { type: Number, required: true },
        peso: { type: Number, required: true },
        cor: { type: String, required: true },
        imagem: { type: Array },
        disponivel: { type: Boolean },
        user: Object,
        adocao: Object
    },
        { timestamps: true }
    )


)

module.exports = Pet;