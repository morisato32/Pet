const router =  require('express').Router()

//controller
const userController = require('../controller/userController')

 router.post('/register',userController.register)
 router.post('/login',userController.login)

 module.exports = router;