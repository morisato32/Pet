const createUserToken = require('../helpers/userSecretToken');
const User = require('../models/User'); // requerindo o model
const statusMensagens = require('../helpers/statusMensagens'); // requerindo a função
const bcrypt = require('bcrypt')

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
        const user =  await User.findOne({email:email})
        
        if(!user){
           return res.status(422).json({message:`Não existe nenhum usuario com esse email`})
        }

        const verificarSenha = await bcrypt.compare(senha,user.senha)

        if(!verificarSenha){
            return res.status(422).json({message:`Sua senha esta incorreta!`})
        }

    await createUserToken(user,req,res)
       }
}


module.exports = userController