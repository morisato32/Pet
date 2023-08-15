// Utilizando aqui desta forma para ver como posso adicionar métodos ao meu model

const mongoose = require('mongoose')

            // schema pet
const petSchema = new mongoose.Schema
   ({
        name: { type: String, required: true },
        idade: { type: Number, required: true },
        peso: { type: Number, required: true },
        cor: { type: String, required: true },
        imagem: { type: Array },
        disponivel: { type: Boolean },
        user: Object,
        adopter: Object
    },
        { timestamps: true }
    )

    // adicionando um método ao pet
petSchema.methods.speak = async function(res){
    const petSpeak = this.name
    ? `Meu nome é ${this.name}`
    : `Eu não tenho nome`

    return petSpeak
}

            // passando o schema para o model Pet
const Pet = mongoose.model('Pet',petSchema)




module.exports = Pet;