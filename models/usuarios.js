const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Usuario {

    adiciona(usuario, res) {
        const { email } = usuario;
        let sql = `SELECT * FROM usuarios WHERE email = ?`;
        conexao.query(sql, [email], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                if (resultados.length > 0) {
                    res.status(400).json({ msg: "Já existe um usuário cadastrado com esse email.", status: 400 })
                } else {
                    const dataHoraCriacao = moment().format('YYYY-MM-DD hh:mm:ss');
                    const usuarioDatado = { ...usuario, dataHoraCriacao }
                    sql = `INSERT INTO usuarios SET ?`;
                    conexao.query(sql, usuarioDatado, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            res.status(201).json({ status: 200, msg: "usuário cadastrado com sucesso" });
                        }
                    });
                }
            }
        });
    }
}

module.exports = new Usuario;