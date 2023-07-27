const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config()

const secret = process.env.JWT_SECRET



// criando a função 
const createUserToken = async (user,req,res) =>{

    const token = jwt.sign({
       nome: user.nome,
       id: user._id
    },secret)

    // retornando o token
    return res.status(200).json({messsage:`Você esta autenticado!`,Token:token,UserId:user._id})
}

module.exports = createUserToken;
    
