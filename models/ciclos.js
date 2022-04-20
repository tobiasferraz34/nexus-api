const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Ciclo {
    adiciona(ciclo, res) {
        const { id_usuario, nome } = ciclo;
        let dataHoraCriacao = moment().format('YYYY-MM-DD hh:mm:ss');
        const cicloDatado = { nome, id_usuario, dataHoraCriacao };
        let sql = `SELECT * FROM ciclos WHERE nome = ?`;

        conexao.query(sql, [nome], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                if (resultados.length > 0) {
                    res.status(400).json({ msg: "Já existe um ciclo cadastrado com esse nome.", status: 400 })
                } else {
                    //Cadastro do ciclo
                    sql = `INSERT INTO ciclos SET ?`;
                    conexao.query(sql, cicloDatado, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            res.status(201).json({ status: 200, msg: "ciclo cadastrado com sucesso" });
                        }
                    });
                }
            }
        });
    }

    listaCiclos(res) {
        const sql = `SELECT ciclos.id, ciclos.nome, date_format(ciclos.dataHoraCriacao, '%d/%m/%Y') as dataHoraCriacao
                    FROM ciclos ORDER BY ciclos.id DESC`;

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    listaAlunos(id_ciclo, res) {
        const sql = `SELECT *, alunos.id AS id_aluno, alunos_certificacao.id AS id_alunoCertificacao  FROM alunos 
        INNER JOIN alunos_certificacao ON alunos.id = alunos_certificacao.id_alunoG
        WHERE alunos_certificacao.id_ciclo = ?`;

        conexao.query(sql, [id_ciclo], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    listaPendencias(id_ciclo, res) {
        const sql = `SELECT alunos.id as id_aluno, alunos.nome, GROUP_CONCAT(pendencias.nome) as pendencias, 
        alunos_certificacao.nomeInstituicao, 
        date_format(alunosxpendencias.dataHoraCriacao, '%d/%m/%Y') as dataHoraCriacao
        FROM alunosxpendencias 
        INNER JOIN alunos ON alunos.id = alunosxpendencias.id_aluno
        INNER JOIN pendencias ON pendencias.id = alunosxpendencias.id_pendencia
        INNER JOIN alunos_certificacao ON alunos_certificacao.id_alunoG = alunos.id
        WHERE alunos_certificacao.id_ciclo = ? GROUP BY alunos.id`;

        conexao.query(sql, [id_ciclo], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }
}

module.exports = new Ciclo;