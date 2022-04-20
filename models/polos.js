const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Polo {

    listaAlunos(id_polo, res) {
        const sql = `SELECT alunos.id, alunos.nome, alunos.cpf, alunos_polo.data_solicitacao,
        date_format(alunos_polo.data_solicitacao, '%d/%m/%Y') as data_solicitacao,
        date_format(alunos_polo.dataHoraCriacao, '%Y-%m-%d') as inputDataHoraCriacao
        FROM alunos 
        INNER JOIN alunos_polo ON alunos.id = alunos_polo.id_alunoG
        WHERE alunos_polo.id_polo = ?`;

        conexao.query(sql, [id_polo], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }
}

module.exports = new Polo;