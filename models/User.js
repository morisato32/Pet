const mongoose = require('mongoose')
const { Schema } = require('mongoose')

//model
const User = mongoose.model('User',
    new Schema({
        nome: { type: String, required: true },
        email: { type: String, required: true },
        telefone: { type: String, required: true },
        senha: { type: String, required: true },
        imagem: { type: String },
       
    },
        { timestamps: true }
    )


)

module.exports = User;