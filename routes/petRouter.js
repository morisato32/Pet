const router = require('express').Router()

const petController = require('../controller/petController')

// middlewares
const verifyToken = require('../helpers/verifyToken')

const {imagemUpload} = require('../middleware/multer')

router.post('/create',verifyToken,imagemUpload.array('imagem'),petController.create)
router.get('/',petController.getAll)
router.get('/mypets',verifyToken,petController.getAllUserPets)

module.exports = router;