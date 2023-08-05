const jwt = require('jsonwebtoken')

const User = require('../models/User')

const dotenv = require('dotenv')
 dotenv.config()

 const secret = process.env.JWT_SECRET

// get user by jwt token
const getUserByToken = async (token) =>{
    if (!token) {
        res.status(401).json({ message: `Acesso Negado!` })
    }

    const decoded = jwt.verify(token,secret)

    const UserId = decoded.id

    const user = User.findById({_id:UserId}).select("-senha")

    return user
}

module.exports = getUserByToken;