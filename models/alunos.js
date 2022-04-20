const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Aluno {

    adicionaListaDeAlunosCertificacao(dados, res) {
        let dataHoraCriacao = moment().format('YYYY-MM-DD hh:mm:ss');
        let valores = [];

        dados.alunos.map(item => {
            valores.push([item.nome, item.cpf, dataHoraCriacao])
        });

        //Cadastro de alunos
        let sql = `INSERT INTO alunos (nome, cpf,  dataHoraCriacao) VALUES ?`;
        conexao.query(sql, [valores], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                let insertId = resultados.insertId - 1;
                let ids_alunos = [];
                for (let index = 0; index < resultados.affectedRows; index++) {
                    ids_alunos.push(insertId += 1);
                }
                console.log(ids_alunos);
                console.log(resultados);
                valores = [];

                dados.alunos.map((item, index) => {
                    valores.push([item.dataNascimento, item.rg, item.nacionalidade, item.naturalidade, item.pai, item.mae, item.situacaoTurma, item.turma, item.nomeInstituicao, dados.id_ciclo, ids_alunos[index]]);
                    console.log(ids_alunos[index]);
                });

                console.log(valores);


                //Cadastro de alunos da certificação
                let sql = `INSERT INTO alunos_certificacao (dataNascimento, rg, nacionalidade, naturalidade, pai, mae, situacaoTurma, turma, nomeInstituicao, id_ciclo, id_alunoG) VALUES ?`;
                conexao.query(sql, [valores], (erro, resultados) => {
                    if (erro) {
                        res.status(400).json(erro);
                    } else {
                        res.status(201).json({ status: 200, msg: "Lista de alunos cadastrada com sucesso!" });
                    }
                });
            }
        });

        // let dataHoraCriacao = moment().format('YYYY-MM-DD hh:mm:ss');
        // //const cicloDatado = {nome, id_usuario, dataHoraCriacao};
        // let valores = [];

        // dados.alunos.map(item => {
        //     valores.push([item.nome, item.dataNascimento, item.rg, item.cpf, item.nacionalidade, item.naturalidade, item.pai, item.mae, item.situacaoTurma, item.turma, item.nomeInstituicao, dados.id_ciclo])
        // });

        // //Cadastro de alunos da certificação
        // let sql = `INSERT INTO alunos (nome, dataNascimento, rg, cpf, nacionalidade, naturalidade, pai, mae, situacaoTurma, turma, nomeInstituicao, id_ciclo) VALUES ?`;
        // conexao.query(sql, [valores], (erro, resultados) => {
        //     if (erro) {
        //         res.status(400).json(erro);
        //     } else {
        //         res.status(201).json({ status: 200, msg: "Lista de alunos cadastrada com sucesso!" });
        //     }
        // });
    }

    adicionaAlunoPolo(aluno, res) {
        let dataHoraCriacao = moment().format('YYYY-MM-DD hh:mm:ss');
        const { data_solicitacao, cpf, nome, id_polo } = aluno;

        let sql = `SELECT * FROM alunos 
        INNER JOIN alunos_polo ON alunos.id = alunos_polo.id_alunoG
        WHERE alunos.cpf = ?`;

        conexao.query(sql, [nome, cpf], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                if (resultados.length > 0) {
                    res.status(400).json({ msg: "Já existe um aluno cadastrado com esse nome ou cpf.", status: 400 })
                } else {
                    const AlunoDatado = { cpf, nome, dataHoraCriacao };

                    //Cadastro de aluno
                    sql = `INSERT INTO alunos SET ?`;
                    conexao.query(sql, AlunoDatado, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {

                            let id_alunoG = resultados.insertId;
                            const AlunoPoloDatado = { data_solicitacao, dataHoraCriacao, id_polo, id_alunoG };
                            //Cadastro de aluno de polo
                            sql = `INSERT INTO alunos_polo SET ?`;
                            conexao.query(sql, AlunoPoloDatado, (erro, resultados) => {
                                if (erro) {
                                    res.status(400).json(erro);
                                } else {

                                    let id_alunoG = resultados.insertId;
                                    res.status(201).json({ status: 200, msg: "Aluno cadastrado com sucesso!" });
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    alteraAlunoCertificacao(id, valores, res) {
        const { checked, value } = valores;
        let aluno = {};
        checked !== '' ?  aluno = { [checked]: value } :  aluno = { observacao: valores.observacao };
    
        console.log(aluno);

        const sql = `UPDATE alunos_certificacao SET ? WHERE alunos_certificacao.id = ?`;
        conexao.query(sql, [aluno, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro })
            } else {
                res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
            }
        });
    }

    alteraAlunoPolo(id, valores, res) {
        console.log(valores);
        const { cpf, nome } = valores;

        const aluno = {}
        const sql = `UPDATE alunos SET ? WHERE alunos.id = ?`;
        conexao.query(sql, [{ nome, cpf }, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
            }
        })

        // const sql = `UPDATE alunos_polo SET ? WHERE alunos_certificacao.id = ?`;
        // conexao.query(sql, [aluno, id], (erro, resultados) => {
        //     if (erro) {
        //         res.status(400).json({ status: 400, msg: erro })
        //     } else {
        //         res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
        //     }
        // })
    }
    
    adicionarPendencia(pendencias, res) {
        console.log(pendencias.arrayIdsAlunosPendentes.length);
        //Verificar se pendência já foi registrada para o aluno
        
        let sql = `SELECT * FROM alunosxpendencias 
        WHERE alunosxpendencias.id_aluno IN (?)`;
        conexao.query(sql, [pendencias.arrayIdsAlunosPendentes], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                if (resultados.length > 0) {
                    console.log(resultados)
                    res.status(400).json({ msg: "Pendências já foram registradas para o aluno.", status: 400 })
                } else {
                    let dataHoraCriacao = moment().format('YYYY-MM-DD hh:mm:ss');
                    pendencias.arrayAlunosPendencias.map(item => {
                        item.push(dataHoraCriacao)
                    });
                    //pendencias.arrayAlunosPendencias[0].push(dataHoraCriacao);

                    //Cadastro de pendência do aluno
                    sql = `INSERT INTO alunosxpendencias (id_aluno, id_pendencia, dataHoraCriacao) VALUES ?`;
                    conexao.query(sql, [pendencias.arrayAlunosPendencias], (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            res.status(201).json({ status: 200, msg: "Pendência cadastrada com sucesso!" });
                        }
                    });
                }
            }
        });
    }
   
    vincularProva(dados, res) {
        const { id_polo, id_disciplina, anoLetivo, id_aluno, codigo_requerimento } = dados;

        let sql = `SELECT provas.id AS id_prova FROM provas WHERE provas.id_disciplina = ? and provas.serie = ?`;

        conexao.query(sql, [id_disciplina, anoLetivo], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {

                if (resultados.length > 0) {
                    let dataHoraCriacao = moment().format('YYYY-MM-DD hh:mm:ss');
                    let id_prova = parseInt(resultados[0].id_prova);
                    console.log(id_prova);

                    sql = `SELECT polosxprovasxalunos.id_prova, provas.id_disciplina FROM polosxprovasxalunos
                    INNER JOIN provas ON polosxprovasxalunos.id_prova = provas.id
                    WHERE provas.serie = ? AND provas.id_disciplina = ? AND polosxprovasxalunos.id_aluno = ?`;

                    conexao.query(sql, [codigo_requerimento, anoLetivo, id_disciplina, id_aluno], (erro, resultados) => {
                        if (erro) {
                            res.status(400).json({ status: 400, msg: erro });
                        } else {
                            if (resultados.length > 0) {
                                res.status(400).json({ status: 400, msg: 'Não é possivel cadastrar mais provas para essa disciplina e ano.' });
                            } else {

                                sql = `SELECT COUNT(polosxprovasxalunos.codigo_requerimento) AS quant_codReq FROM polosxprovasxalunos
                                INNER JOIN provas ON polosxprovasxalunos.id_prova = provas.id
                                WHERE polosxprovasxalunos.codigo_requerimento = ?`;

                                conexao.query(sql, [codigo_requerimento], (erro, resultados) => {
                                    if (erro) {
                                        res.status(400).json({ status: 400, msg: erro });
                                    } else {
                                        if (resultados.length > 0) {
                                            if (resultados[0].quant_codReq < 2) {
                                                sql = `INSERT INTO polosxprovasxalunos SET ?`;
                                                conexao.query(sql, { id_polo, id_prova, id_aluno, codigo_requerimento, dataHoraCriacao }, (erro, resultados) => {
                                                    if (erro) {
                                                        res.status(400).json(erro);
                                                    } else {
                                                        res.status(201).json({ status: 200, msg: "Prova cadastrada com sucesso!" });
                                                    }
                                                });
                                            } else {
                                                res.status(400).json({ status: 400, msg: `
                                                    Não é mais possivel cadastrar provas para esse códico de requerimento.`});
                                            }
                                        } else {
                                            res.status(400).json({ status: 400, msg: 'Nenhum resultado encontradado. 1' });
                                        }
                                    }
                                });
                            }
                        }
                    });
                } else {
                    res.status(400).json({ status: 400, msg: 'Nenhum prova foi encontrada para essa disciplina e ano letivo' });
                }
            }
        });
    }

    listaProvas(id_aluno, res) {
        const sql = `SELECT  provas.id AS id_prova, polosxprovasxalunos.codigo_requerimento, (SELECT disciplinas.nome FROM disciplinas 
            WHERE disciplinas.id = provas.id_disciplina) AS disciplina,
            concat(provas.serie, "° ANO") AS serie, date_format(provas.dataHoraCriacao, '%d/%m/%Y') as dataHoraCriacao
            FROM polosxprovasxalunos
            INNER JOIN provas ON polosxprovasxalunos.id_prova = provas.id
            WHERE polosxprovasxalunos.id_aluno = ?`;

        conexao.query(sql, [id_aluno], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    listaPendencias(id_aluno, res) {
        const sql = `SELECT alunos.id as id_aluno, alunos.nome as nome_aluno, pendencias.id as id_pendencia, pendencias.nome as pendencia, date_format(alunosxpendencias.dataHoraCriacao, '%d/%m/%Y') as dataHoraCriacao FROM alunosxpendencias 
        INNER JOIN alunos ON alunosxpendencias.id_aluno = alunos.id
        INNER JOIN pendencias ON pendencias.id = alunosxpendencias.id_pendencia
        WHERE alunosxpendencias.id_aluno = ?`;

        conexao.query(sql, [id_aluno], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
                console.log(resultados);
            }
        });
    }

}

module.exports = new Aluno;