const User = require('../models/User'); // requerindo o model
const dotenv = require('dotenv')
dotenv.config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// helpers
const getToken = require('../helpers/getToken')
const statusMensagens = require('../helpers/statusMensagens'); // requerindo a função
const createUserToken = require('../helpers/userSecretToken');
const getUserByToken = require('../helpers/getUserPorToken')


const userController = {
    register: async (req, res) => {

        try {
            const { nome, email, telefone, senha, confirmarSenha } = req.body

            // criptografando a senha do usuario
            const salt = await bcrypt.genSalt(12)
            const senhaHash = await bcrypt.hash(senha, salt)


            const dadosUser = {
                nome,
                email,
                telefone,
                senha: senhaHash,
                confirmarSenha,

            }

            // Validar campos obrigatórios chamando a função linha 26 a 54
            statusMensagens(req, res, () => {
                // Checar se o usuário já existe
                User.findOne({ email: email })
                    .then(user => {
                        if (user) {
                            return res.status(422).json({ message: "Por favor utilize outro email!" });
                        }


                        // Todas as validações passaram, criar usuário

                        // Código para criar usuário linha 38 a 46
                        const novoUsuario = new User({ ...dadosUser })

                        novoUsuario.save().then(() => {
                            return new Promise((resolve, reject) => {
                                createUserToken(novoUsuario, req, res).then(() => {
                                    resolve

                                }).catch((err) => {
                                    reject(err)
                                    res.status(500).json({ message: `Ouve um erro com o seu token:${err}` })
                                })


                            })


                        })

                    })




            });
            // Validar campos obrigatórios chamando a função linha 26 a 54
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro no servidor" });
        }

    },

    login: async (req, res) => {
        const { email, senha } = req.body

        if (!email) {
            return res.status(422).json({ message: "O email é obrigatório" });
        }

        if (!senha) {
            return res.status(422).json({ message: "A senha é obrigatória" });
        }

        //verificar se o usuario existe
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(422).json({ message: `Não existe nenhum usuario com esse email` })
        }
        // verificar se a senha que vem do corpo da requisição é igual que vem do usuario no banco de dados
        const verificarSenha = await bcrypt.compare(senha, user.senha)

        if (!verificarSenha) {
            return res.status(422).json({ message: `Sua senha esta incorreta!` })
        }
        // logando o usuario com o token
        await createUserToken(user, req, res)
    },

    // checkUser estamos pegando o usuario pelo token
    checkUser: async (req, res) => {
        let correntUser;

        // passando o secret com variavel de ambiente dotenv
        const secret = process.env.JWT_SECRET

        // chegar o token do usuario
        try {
            const token = getToken(req)
            const decoded = jwt.verify(token, secret)


            if (decoded) {
                correntUser = await User.findById(decoded.id)
                correntUser.senha = undefined

                res.status(200).json({ message: `Token válido`, correntUser })
            }

        } catch (error) {
            res.status(401).json({ message: `Token inválido!` })
        }
    },

    getUserId: async (req, res) => {
        const { id } = req.params

        try {
            const userId = await User.findById(id).select("-senha")

            if (userId) {
                return res.status(200).json({ userId })

            }
        } catch (error) {
            return res.status(401).json({ message: `Não existe esse usuario` })
            console.log(error)
        }





    },
    editUser: async (req, res) => {
        const { id } = req.params

        const { nome, email, telefone, senha, confirmarSenha } = req.body

        let imagem = req.file

        try {
            const token = getToken(req)


            const user = await getUserByToken(token)

         
            if (imagem) {
                user.imagem = req.file.filename
               
            }

            // Verificar se os campos obrigatórios estão presentes na requisição
            if (!nome || !email || !telefone || !senha || !confirmarSenha) {
                return res.status(400).json({ message: "Todos os campos são obrigatórios" });
            }


            user.email = email
            user.telefone = telefone



            if (senha !== confirmarSenha) {
                return res.status(422).json({ message: "A senha e a confirmação de senha não correspondem!" });
            }

            else if (senha === confirmarSenha && senha != null) {
                const salt = await bcrypt.genSalt(12)
                const senhaHash = await bcrypt.hash(senha, salt)

                // criando senha
                user.senha = senhaHash

            }

            const userExiste = User.findOne({ email: email })

            if (!userExiste) {
                return res.status(401).json({ message: `Não existe esse usuario` })
            }
           
            // atualizando o usuario
            await User.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true })
            return res.status(200).json({ message: `Usuario atualizado com sucesso` })

        } catch (error) {
            return res.status(500).json({ message: `Ouve um erro para atualizar o usuario:${error}` })
        }

    }
}


module.exports = userController