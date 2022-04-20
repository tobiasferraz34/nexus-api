const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
let jwt = require('jsonwebtoken');

class Auth { 
    login(auth, res) {
        const { email, senha } = auth;
        const sql = `
        SELECT usuarios.id, usuarios.nome, usuarios.senha, permissoes.id as id_permissao, permissoes.nome as permissao FROM usuarios 
        INNER JOIN permissoes ON usuarios.id_permissao = permissoes.id
        WHERE usuarios.email = ? and usuarios.senha = ?;`;

        conexao.query(sql, [email, senha], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                if (resultados.length > 0) {
                    let id = resultados[0].id;
                    let nome = resultados[0].nome;
                    let email = resultados[0].email;
                    let id_permissao = resultados[0].id_permissao;
                    let permissao = resultados[0].permissao;
                    
                    const token = jwt.sign({ id, email, id_permissao, permissao }, process.env.SECRET, {});

                    res.status(201).send({ auth: true, token: token, id, nome, email, id_permissao, permissao, status: 200 });
                } else {
                    res.status(400).json({ status: 400, msg: "Email ou senha estão incorretos!" });
                }
            }
        });
    }

    verificaJWT(req, res, next) {
        let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.params.token;
        if (!token) {
            res.status(401).send({ auth: false, message: 'Acesso Restrito.' });
        } else {
            jwt.verify(token, process.env.SECRET, function (err, decoded) {
                if (err) return res.status(500).send({ auth: false, message: 'Token Inválido.', status: 500 });

                // se tudo estiver ok, salva no request para uso posterior
                req.userId = decoded.id;
                req.email = decoded.email
                req.id_permissao = decoded.id_permissao
                req.permissao = decoded.permissao
                next();
            });
        }
    }
}


module.exports = new Auth;