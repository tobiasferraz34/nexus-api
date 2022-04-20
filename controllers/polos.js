const Polo = require('../models/polos');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {

    app.get('/polos/:id/alunos', Auth.verificaJWT, (req, res) => {
        if (req.permissao === permissoes.admin || req.permissao === permissoes.polo) {
            const idPolo = req.userId;
            console.log(idPolo);
            Polo.listaAlunos(idPolo, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
}