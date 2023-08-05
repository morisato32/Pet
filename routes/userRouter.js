const router =  require('express').Router()

//controller
const userController = require('../controller/userController')

//middleware multer
const {imagemUpload} = require('../middleware/multer')

//middleware -- helpers
const verifyToken = require('../helpers/verifyToken')

 router.post('/register',userController.register)
 router.post('/login',userController.login)
 router.get('/checkuser',userController.checkUser)
 router.get('/:id',userController.getUserId)
 router.patch('/edit/:id',verifyToken,imagemUpload.single('imagem'),userController.editUser)
 module.exports = router;