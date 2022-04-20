const Aluno = require('../models/alunos');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {

    app.post('/alunos', Auth.verificaJWT, (req, res) => {
        const dados = req.body;
        if (req.permissao === permissoes.admin || req.permissao === permissoes.certificacao) {
            Aluno.adicionaListaDeAlunosCertificacao(dados, res);
            return;
        } else if (req.permissao === permissoes.polo) {
            const id_polo = req.userId;
            Aluno.adicionaAlunoPolo({ ...dados, id_polo }, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });

    });

    app.post('/alunos/:id/pendencias', Auth.verificaJWT, (req, res) => {
        if (req.permissao === permissoes.admin || req.permissao === permissoes.certificacao) {
            const pendencias = req.body;
            Aluno.adicionarPendencia(pendencias, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });

    });         

    app.get('/alunos/:id/pendencias', Auth.verificaJWT, (req, res) => {
        if (req.permissao === permissoes.admin || req.permissao === permissoes.certificacao) {
            const idAluno = req.query.idAluno;
            console.log(idAluno)
            Aluno.listaPendencias(idAluno, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });

    });

    app.post('/alunos/:id/provas', Auth.verificaJWT, (req, res) => {
        if (req.permissao === permissoes.admin || req.permissao === permissoes.polo) {
            const dados = req.body;
            const id_polo = req.userId;
            console.log(dados);
            Aluno.vincularProva({ id_polo, ...dados }, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/alunos/:id/provas', Auth.verificaJWT, (req, res) => {
        if (req.permissao === permissoes.admin || req.permissao === permissoes.polo) {
            const idAluno = req.query.idAluno;
            console.log(idAluno);
            Aluno.listaProvas(idAluno, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });

    });


    app.put('/alunos/:id', Auth.verificaJWT, (req, res) => {
        const valores = req.body;
        const id = parseInt(req.params.id);
        console.log(id, valores);
        if (req.permissao === permissoes.admin || req.permissao === permissoes.certificacao) {
            Aluno.alteraAlunoCertificacao(id, valores, res);
            return;
        } else if (req.permissao === permissoes.polo) {
            Aluno.alteraAlunoPolo(id, valores, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });

    })
}      