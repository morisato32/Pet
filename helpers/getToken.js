const getToken = (req) =>{
    const token = req.get('Authorization').split(' ')[1]

    return token
}

module.exports = getToken;