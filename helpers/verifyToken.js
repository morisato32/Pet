const jwt = require('jsonwebtoken')
const getToken = require('./getToken')

const dotenv = require('dotenv')
dotenv.config()

// middleware validade token!
const verifyToken = (req, res, next) => {

    if (!req.get('Authorization')) {
        res.status(401).json({ message: `Acesso Negado!` })
    }

    const token = getToken(req)
   

    if (!token) {
        res.status(401).json({ message: `Acesso Negado!` })

        return token
    }

    try {
        const secret = process.env.JWT_SECRET

        const decoded = jwt.verify(token, secret)

        req.user = decoded
        

        next()
    } catch (error) {
        res.status(400).json({ message: `Token inválido!` })

    }

}

module.exports = verifyToken;