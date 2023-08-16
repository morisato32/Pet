const Pet = require('../models/Pet')
const getToken = require('../helpers/getToken')
const getUserByToken = require('../helpers/getUserPorToken')
const ObjectId = require('mongoose')


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
        imagem.map((image) => {
            pet.imagem.push(image.filename)


        })


        try {
            const novoPet = await pet.save()
            // teste de adição de métodos no schema
            // chamando o método
            //const message = await pet.speak()
            return res.status(201).json({ message: `Pet cadastrado com sucesso`, novoPet })
        } catch (error) {
            return res.status(500).json({ message: `Ouve um erro para salvar o pet:${error}` })
        }
    },
    getAll: async (req, res) => {
        // mostrando todos os pets
        const pets = await Pet.find().sort('-createdAt') // mostra do mais novo para o mais antigo.
        return res.status(200).json({ pets: pets })
    },
    getAllUserPets: async (req, res) => {
        //primeiro temos que ver se o usuario tem permissão
        const token = getToken(req)

        user = await getUserByToken(token)


        // pegando os pets que o usuario cadastrou
        const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt')

        return res.status(200).json({ pets })
    },
    getAllUserAdoptions: async (req, res) => {
        //primeiro temos que ver se o usuario tem permissão
        const token = getToken(req)

        user = await getUserByToken(token)


        // pegando os pets que o usuario adotou
        const pets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt')

        return res.status(200).json({ pets })
    },

    getPetById: async (req, res) => {
        const { id } = req.params

        // chegando se o id é válido
        if (!ObjectId.isValidObjectId(id)) {
            return res.status(422).json({ message: `id invalido!` })
        }

        const pet = await Pet.findOne({ _id: id })

        // chegando se o pet existe
        if (!pet) {
            res.status(404).json({ message: `Pet não encontrado!` })
        }

        return res.status(200).json({ pet })
    },

    petRemoveById: async (req, res) => {
        const { id } = req.params


        // chegando se o id é válido
        if (!ObjectId.isValidObjectId(id)) {
            return res.status(422).json({ message: `id invalido!` })
        }

        // chegando se o pet existe
        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: `Pet não encontrado!` })
        }

        // chegando se o usuario logado registrou o token
        const token = getToken(req)
        const user = await getUserByToken(token)


        // verifica se o pet cadastrado é mesmo do usuario, se não for retorna a mensagem a baixo
        if (pet.user._id.toString() !== user._id.toString()) {
            return res.status(422).json({ message: `Houve um problema em processar sua solicitação, tente novamente!` })
        }

        await Pet.findByIdAndRemove(id)



        return res.status(200).json({ message: `Pede removido com sucesso!` })


    },

    petUpdateById: async (req, res) => {
        const { id } = req.params
        const { name, idade, peso, cor, disponivel } = req.body

        const imagem = req.files

        const updatePet = {}

        // chegando se o id é válido
        if (!ObjectId.isValidObjectId(id)) {
            return res.status(422).json({ message: `id invalido!` })
        }

        // chegando se o pet existe
        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: `Pet não encontrado!` })
        }

        // chegando se o usuario logado registrou o token
        const token = getToken(req)
        const user = await getUserByToken(token)


        // verifica se o pet cadastrado é mesmo do usuario, se não for retorna a mensagem a baixo
        if (pet.user._id.toString() !== user._id.toString()) {
            return res.status(422).json({ message: `Houve um problema em processar sua solicitação, tente novamente!` })
        }

        //validações

        if (!name) {
            return res.status(422).json({ message: `O nome é obrigatório!` })
        } else {
            updatePet.name = name
        }

        if (!idade) {
            return res.status(422).json({ message: `A idade é obrigatória!` })
        } else {
            updatePet.idade = idade
        }

        if (!peso) {
            return res.status(422).json({ message: `O peso é obrigatório!` })
        } else {
            updatePet.peso = peso
        }

        if (!cor) {
            return res.status(422).json({ message: `A cor é obrigatória!` })
        } else {
            updatePet.cor = cor
        }

        if (imagem.length === 0) {
            return res.status(422).json({ message: `A imagem é obrigatória!` })
        } else {
            updatePet.imagem = []

            imagem.map((image) => {
                updatePet.imagem.push(image.filename)
            })

        }

        await Pet.findByIdAndUpdate(id, updatePet)

        return res.status(200).json({ message: `Pet atualizado com sucesso!` })

    },

    agendamentoPet: async (req, res) => {
        //pegando o id do pet pelo endpoint
        const { id } = req.params
        // checando se o pet existe, se ele é meu
        const pet = await Pet.findOne({ _id: id })

        // se não for manda o status com a mensagem
        if (!pet) {
            return res.status(404).json({ message: `Pet não encontrado!` })
        }

        // pegando o token do usuario
        const token = getToken(req)
        const user = await getUserByToken(token)

        // checando para que o usuario não consiga agendar uma visita para seu próprio pet
        if (pet.user._id.equals(user._id)) {
            return res.status(422).json({ message: `Você não pode agendar uma visita para o seu proprio pet!` })
        }

        // checando se o usuario não já agendou a visita
        if (pet.adopter) {
            if (pet.adopter._id.equals(user._id)) {
                return res.status(422).json({ message: `Você já agendou uma visita para esse pet!` })
            }
        }

        // adicionando o usuario ao pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            imagem: user.imagem

        }

        // adicionando as modificações no banco
        await Pet.findByIdAndUpdate(id, pet)

        return res.status(200).json({
            message: `Voce agendou uma visita com sucesso, entre em contato com  ${pet.user.nome} pelo telefone ${pet.user.telefone}`

        })

    },

    concluindoAdocao: async (req, res) => {
        const { id } = req.params

        // checando se o pet existe, se ele é meu
        const pet = await Pet.findOne({ _id: id })

        // se não for manda o status com a mensagem
        if (!pet) {
            return res.status(404).json({ message: `Pet não encontrado!` })
        }


        // pegando o token do usuario
        const token = getToken(req)
        const user = await getUserByToken(token)

        // verifica se o pet cadastrado é mesmo do usuario, se não for retorna a mensagem a baixo
        if (pet.user._id.toString() !== user._id.toString()) {
            return res.status(422).json({ message: `Houve um problema em processar sua solicitação, tente novamente!` })
        }

        // pet não esta mais disponivel
        pet.disponivel = false

        // concluindo a adoção

        await Pet.findByIdAndUpdate(id,pet)

        return res.status(200).json({message:`Adoção concluída com sucesso!`})





    }


}

module.exports = petController;