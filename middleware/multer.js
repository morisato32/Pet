const { match } = require('assert')
const multer = require('multer')
const path = require('path')

const imagemStorage = multer.diskStorage({
    destination:(req,file,cb) =>{
        let folder = ''

        if(req.baseUrl.includes('users')){
            folder = 'users'
        }else if(req.baseUrl.includes('pets')){
            folder = 'pets'
        }

        cb(null,`public/img/${folder}`)
    },
    filename: (req,file,cb) =>{
        cb(null, Date.now() + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname))
    },
})

    const imagemUpload = multer({
       storage:imagemStorage,
        fileFilter (req,file,cb){
            if(!file.originalname.match(/\.(png|jpg)$/)){
                return cb(new Error('Por favor envie apenas png ou jpg '))
            }
            cb(undefined,true)
        }
}) 

module.exports = {imagemUpload}