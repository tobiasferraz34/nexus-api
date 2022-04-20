const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Prova {
    buscaPorId(id, res) {
        const sql = `SELECT questoes.enunciado AS questao, 
        GROUP_CONCAT(alternativas.enunciado) AS alternativas,
        (SELECT alternativas.enunciado FROM alternativas 
        WHERE respostas.id_alternativa = alternativas.id) AS gabarrito
        FROM questoes 
        LEFT JOIN provas ON questoes.id_prova = provas.id
        LEFT JOIN alternativas ON questoes.id = alternativas.id_questao
        LEFT JOIN respostas ON alternativas.id_questao = respostas.id
        LEFT JOIN disciplinas ON provas.id_disciplina = disciplinas.id
        WHERE questoes.id_prova = ? GROUP BY respostas.id ORDER BY questoes.id`;

        conexao.query(sql, [id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                if (resultados.length > 0) {
                    let result = [];
                    let alternativas = [];
                    for (let index = 0; index < resultados.length; index++) {
                        console.log(resultados[index].questao, resultados[index].alternativas);
                        alternativas = resultados[index].alternativas.split(',');
                        result.push({ questao: resultados[index].questao, alternativas, gabarito: resultados[index].gabarrito });
                    }
                    console.log(result);
                    res.status(200).json({ status: 200, result });
                } else {
                    res.status(400).json({ status: 400, msg: "Não foi encontrada nenhuma informação." });
                }

            }
        });
    }


}

module.exports = new Prova;