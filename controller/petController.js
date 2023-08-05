const Pet = require('../models/Pet')
const getToken = require('../helpers/getToken')
const getUserByToken = require('../helpers/getUserPorToken')


//OBS Todas as funçoes que utilizam banco de dados atentar que são assincronas

const petController = {
    create: async (req, res) => {
        const { name, idade, peso, cor } = req.body

        let disponivel = true

        const imagem = req.files

        //imagens uploads

        //validações

        if (!name) {
            return res.status(422).json({ message: `O nome é obrigatório!` })
        }

        if (!idade) {
            return res.status(422).json({ message: `A idade é obrigatória!` })
        }

        if (!peso) {
            return res.status(422).json({ message: `O peso é obrigatório!` })
        }

        if (!cor) {
            return res.status(422).json({ message: `A cor é obrigatória!` })
        }

        if (imagem.length === 0) {
            return res.status(422).json({ message: `A imagem é obrigatória!` })
        }

       


        const token = getToken(req)
        const user = await getUserByToken(token)
      

        const pet = new Pet({
            name,
            idade,
            peso,
            cor,
            disponivel,
            
            user: {
                _id: user._id,
                nome: user.nome,
                telefone: user.telefone,
                imagem: user.imagem,
                
            },


        })

         // passando as imagens do pet
         imagem.map((image) =>{
            pet.imagem.push(image.filename)
        })


        try {
            const novoPet = await pet.save()

            return res.status(201).json({ message: `Pet cadastrado com sucesso`, novoPet })
        } catch (error) {
            return res.status(500).json({ message: `Ouve um erro para salvar o pet:${error}` })
        }
    },
    getAll: async(req,res) =>{
        // mostrando todos os pets
        const pets = await Pet.find().sort('-createdAt') // mostra do mais novo para o mais antigo.
        return res.status(200).json({pets:pets})
    },
    getAllUserPets: async (req,res) =>{
        //primeiro temos que ver se o usuario tem permissão
        const token = getToken(req)
        const user = await getUserByToken(token)

        // pegando os pets que o usuario cadastrou
        const pets = await Pet.find({'user._id':user._id}).sort('-createdAt')

        return res.status(200).json({pets})
    }


}

module.exports = petController;