const Ciclo = require('../models/ciclos');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.post('/ciclos', Auth.verificaJWT, (req, res) => {
        if (req.permissao === permissoes.admin || req.permissao === permissoes.certificacao) {
            const id_usuario = req.userId;
            const ciclo = { ...req.body, id_usuario };
            Ciclo.adiciona(ciclo, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });

    });

    app.get('/ciclos', Auth.verificaJWT, (req, res) => {
        if (req.permissao === permissoes.admin || req.permissao === permissoes.certificacao) {
            Ciclo.listaCiclos(res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/ciclos/:id/alunos', Auth.verificaJWT, (req, res) => {
        if (req.permissao === permissoes.admin || req.permissao === permissoes.certificacao) {
            const idCiclo = req.query.idCiclo;
            //console.log(idCiclo)
            Ciclo.listaAlunos(idCiclo, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/ciclos/:id/pendencias', Auth.verificaJWT, (req, res) => {
        if (req.permissao === permissoes.admin || req.permissao === permissoes.certificacao) {
            const idCiclo = req.query.idCiclo;
            //console.log(idCiclo)
            Ciclo.listaPendencias(idCiclo, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
}