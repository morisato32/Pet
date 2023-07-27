const mongoose = require('mongoose')

async function main(){
   await mongoose.connect("mongodb://localhost:27017/Pet")
   console.log('Conexão com mongoose realizada com sucesso!')
}
main().catch((err) => console.log(`Ouve um erro para conectar com mongoose:${err}`))

module.exports = mongoose