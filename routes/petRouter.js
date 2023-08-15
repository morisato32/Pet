const router = require('express').Router()

const petController = require('../controller/petController')

// middlewares
const verifyToken = require('../helpers/verifyToken')

const {imagemUpload} = require('../middleware/multer')

router.post('/create',verifyToken,imagemUpload.array('imagem'),petController.create)
router.get('/',petController.getAll)
router.get('/mypets',verifyToken,petController.getAllUserPets)
router.get('/myadoptions',verifyToken,petController.getAllUserAdoptions)
router.get('/:id',petController.getPetById)
router.delete('/delete/:id',verifyToken,petController.petRemoveById)
router.patch('/patch/:id',verifyToken,imagemUpload.array('imagem'),petController.petUpdateById)
router.patch('/agendamento/:id',verifyToken,petController.agendamentoPet)
router.patch('/concluindoAdocao/:id',verifyToken,petController.concluindoAdocao)
module.exports = router;