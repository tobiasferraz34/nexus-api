class Tabelas {

    init(conexao) {
        this.conexao = conexao;
        this.criarTbCiclos();
        this.criarTbUsuarios();
        this.criarTbPermissoes();
        this.criarTbPendencias();
        this.criarTbAlunos();
        this.criarTbAlunosCertificacao();
        this.criarTbAlunosPolo();
        this.criaTbAlunosxpendencias();
        this.criaTbProvas();
        this.criaTbQuestoes();
        this.criaTbAlternativas();
        this.criaTbResposta();
        this.criaTbDisciplinas();
        this.criaTbPolosxprovasxalunos();
    }

    criarTbCiclos() {
        const sql = `CREATE TABLE IF NOT EXISTS ciclos (
        id int NOT NULL AUTO_INCREMENT,
        nome varchar(50) NOT NULL DEFAULT 'CICLO - ',  
        dataHoraCriacao datetime NOT NULL,     
        status varchar(20) NOT NULL DEFAULT 'ATIVO',
        id_usuario int NOT NULL,
        PRIMARY KEY(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de ciclos criada com sucesso")
            }
        });
    } 
 
    criarTbUsuarios() {
        const sql = `CREATE TABLE IF NOT EXISTS usuarios (
            id int(11) NOT NULL AUTO_INCREMENT,
            cpf_cnpj varchar(20) NOT NULL DEFAULT '0',
            nome varchar(100) NOT NULL DEFAULT '0',
            email varchar(255) NOT NULL DEFAULT '0',
            senha varchar(255) NOT NULL DEFAULT '0',
            id_permissao int(11) NOT NULL,
            status varchar(255) DEFAULT 'ATIVO',
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de usuarios criada com sucesso");

            }
        });
    }

    criarTbPermissoes() {
        const sql = `CREATE TABLE IF NOT EXISTS permissoes (
            id int(11) NOT NULL AUTO_INCREMENT,
            nome varchar(100) NOT NULL DEFAULT '0',
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {

                console.log("Tabela de permissões criada com sucesso");
                this.verificarPermissoes();
            }
        });
    }

    verificarPermissoes() {
        const sql = `SELECT * from permissoes WHERE permissoes.nome = 'ADMIN' OR permissoes.nome = 'CERTIFICACAO'`;
        this.conexao.query(sql, (erro, resultados) => {
            if (erro) {
                console.log(erro);
            } else {
                //console.log(resultados);
                if (resultados.length === 0) {
                    this.inserirPermissoes();           
                }
                //console.log("Registros de permissoes criada com sucesso")
            }
        });
    }
          
    inserirPermissoes() {
        const sql = `
        INSERT INTO permissoes (
            id,
            nome,
            dataHoraCriacao
        )
        VALUES
            (   
                1,
                'ADMIN',
                '2022-03-16 15:51:44'
            ),
            (
                2,
                'CERTIFICACAO',
                '2022-03-16 15:51:44'
            ),
            (
                3,
                'POLO',
                '2022-03-16 15:51:44'
            )
        `;
        
        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Registros de permissoes criada com sucesso")
            }
        });
    }

    criarTbAlunos() {
        const sql = `CREATE TABLE IF NOT EXISTS alunos (
            id int(11) NOT NULL AUTO_INCREMENT,
            nome varchar(255) NOT NULL DEFAULT '0',
            cpf varchar(15) NOT NULL DEFAULT '0',
            dataHoraCriacao datetime NOT NULL, 
            PRIMARY KEY(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de alunos criada com sucesso");
            }
        });
    }

    criarTbAlunosCertificacao() {
        const sql = `CREATE TABLE IF NOT EXISTS alunos_certificacao (
            id int(11) NOT NULL AUTO_INCREMENT,
            dataNascimento DATE NOT NULL,
            rg varchar(20) NOT NULL DEFAULT '0',
            nacionalidade varchar(15) NOT NULL DEFAULT '0',
            naturalidade varchar(15) NOT NULL DEFAULT '0',
            pai varchar(255) NOT NULL DEFAULT '0',
            mae varchar(255) NOT NULL DEFAULT '0',
            situacaoTurma varchar(15) NOT NULL DEFAULT '0',
            turma varchar(255) NOT NULL DEFAULT '0',
            nomeInstituicao varchar(255) NOT NULL DEFAULT '0',
            certificado_imp TINYINT NOT NULL DEFAULT '0',
            declaracao_imp TINYINT NOT NULL DEFAULT '0',
            carimbos TINYINT NOT NULL DEFAULT '0',
            selo TINYINT NOT NULL DEFAULT '0',
            assinaturas TINYINT NOT NULL DEFAULT '0',
            listaImpresso TINYINT NOT NULL DEFAULT '0',
            etiquetaImpresso TINYINT NOT NULL DEFAULT '0',   
            id_ciclo int(11) NOT NULL,
            id_alunoG int(11) NOT NULL,
            observacao text NOT NULL DEFAULT '0',
            PRIMARY KEY(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de alunos_certificacao criada com sucesso");
            }
        });
    }  
    
    criarTbAlunosPolo() {
        const sql = `CREATE TABLE IF NOT EXISTS alunos_polo (
            id int(11) NOT NULL AUTO_INCREMENT,
            data_solicitacao date NOT NULL,  
            dataHoraCriacao datetime NOT NULL,     
            status varchar(20) NOT NULL DEFAULT 'ATIVO',
            id_polo int(11) NOT NULL,
            id_alunoG int(11) NOT NULL,
            PRIMARY KEY(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;
        
        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de alunos_polo criada com sucesso");
            }
        });
    }

    criarTbPendencias() {
        const sql = `CREATE TABLE IF NOT EXISTS pendencias (
        id int NOT NULL AUTO_INCREMENT,
        nome varchar(255) NOT NULL DEFAULT 0,  
        dataHoraCriacao datetime NOT NULL,     
        status varchar(20) NOT NULL DEFAULT 'ATIVO',
        id_usuario int NOT NULL,
        PRIMARY KEY(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de pendencias criada com sucesso")
            }
        });
    }

    criaTbAlunosxpendencias() {
        const sql = `CREATE TABLE IF NOT EXISTS alunosxpendencias (
            id int NOT NULL AUTO_INCREMENT,
            id_aluno int NOT NULL,
            id_pendencia int NOT NULL,
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
    
            this.conexao.query(sql, (erro) => {
                if (erro) {
                    console.log(erro);
                } else {
                    console.log("Tabela de alunosXPendencias criada com sucesso")
                }
            });
    }

    criaTbProvas() {
        const sql = `CREATE TABLE IF NOT EXISTS provas (
            id int NOT NULL AUTO_INCREMENT,
            id_disciplina int NOT NULL, 
            serie int NOT NULL,
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
    
            this.conexao.query(sql, (erro) => {
                if (erro) {
                    console.log(erro);
                } else {
                    console.log("Tabela de provas criada com sucesso")
                }
            });
    }
 
    criaTbQuestoes() {
        const sql = `CREATE TABLE IF NOT EXISTS questoes (
            id int NOT NULL AUTO_INCREMENT,
            enunciado text NOT NULL DEFAULT '0',
            id_prova int NOT NULL, 
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
    
            this.conexao.query(sql, (erro) => {
                if (erro) {
                    console.log(erro);
                } else {
                    console.log("Tabela de questoes criada com sucesso")
                }
            });
    }
    
    criaTbAlternativas() {
        const sql = `CREATE TABLE IF NOT EXISTS alternativas (
            id int NOT NULL AUTO_INCREMENT,
            enunciado varchar(255) NOT NULL DEFAULT '0',
            id_questao int NOT NULL, 
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
    
            this.conexao.query(sql, (erro) => {
                if (erro) {
                    console.log(erro);
                } else {
                    console.log("Tabela de alternativas criada com sucesso")
                }
            });
    }

    criaTbResposta() {
        const sql = `CREATE TABLE IF NOT EXISTS respostas (
            id int NOT NULL AUTO_INCREMENT,
            id_alternativa int NOT NULL, 
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
    
            this.conexao.query(sql, (erro) => {
                if (erro) {
                    console.log(erro);
                } else {
                    console.log("Tabela de respostas criada com sucesso")
                }
            });
    }

    criaTbDisciplinas() {
        const sql = `CREATE TABLE IF NOT EXISTS disciplinas (
            id int NOT NULL AUTO_INCREMENT,
            nome varchar(20) NOT NULL DEFAULT '0',            
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
    
            this.conexao.query(sql, (erro) => {
                if (erro) {
                    console.log(erro);
                } else {
                    console.log("Tabela de respostas criada com sucesso")
                }
            });
    }
   
    criaTbPolosxprovasxalunos() {
        const sql = `CREATE TABLE IF NOT EXISTS polosxprovasxalunos (
            id int NOT NULL AUTO_INCREMENT,
            id_polo int NOT NULL,
            id_prova int NOT NULL,
            id_aluno int NOT NULL,
            codigo_requerimento varchar(30) NOT NULL DEFAULT '0', 
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
    
            this.conexao.query(sql, (erro) => {
                if (erro) {
                    console.log(erro);
                } else {
                    console.log("Tabela de polosxprovasxalunos criada com sucesso");
                }
            });
    }

}

module.exports = new Tabelas