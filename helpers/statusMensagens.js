const statusMensagens = (req, res, next) => {
    const { nome, email, telefone, senha, confirmarSenha } = req.body;

    if (!nome) {
        return res.status(422).json({ message: "O nome é obrigatório" });
    }
    if (!email) {
        return res.status(422).json({ message: "O email é obrigatório" });
    }

    if (!telefone) {
        return res.status(422).json({ message: "O telefone é obrigatório" });
    }
    if (!senha) {
        return res.status(422).json({ message: "A senha é obrigatória" });
    }
    if (!confirmarSenha) {
        return res
            .status(422)
            .json({ message: "A confirmação de senha é obrigatória" });
    }

    if (senha !== confirmarSenha) {
        return res
            .status(422)
            .json({ message: "A senha e a confirmação de senha não correspondem!" });
    }

    // Todas as validações passaram, siga para o próximo middleware
    next();
};

module.exports = statusMensagens;




