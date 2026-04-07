import connection from "../../config/database/connection.js";

class AlunoRepository {
  queryAluno(sql, params = "") {
    return new Promise((resolve, reject) => {
      connection.query(sql, params, (error, result) => {
        if (error) {
          const erro = {
            erro: "SQL - reject",
            message: error.message,
          };
          return reject(erro);
        } else {
          const row = JSON.parse(JSON.stringify(result.rows));
          return resolve(row);
        }
      });
    });
  }

  create(aluno) {
    const sql =
      "INSERT INTO alunos (matricula,nome,curso,status,semestre) VALUES ($1,$2,$3,$4,$5);";
    return this.queryAluno(sql, [
      aluno.matricula,
      aluno.nome,
      aluno.curso,
      aluno.status,
      aluno.semestre,
    ]);
  }

  findAll() {
    const sql = "SELECT * FROM alunos ORDER BY id ASC;";
    return this.queryAluno(sql);
  }

  findById(id) {
    const sql = "SELECT * FROM alunos WHERE id = $1;";
    return this.queryAluno(sql, [id]);
  }

  findByMatricula(matricula) {
    const sql = "SELECT * FROM alunos WHERE matricula = $1;";
    return this.queryAluno(sql, [matricula]);
  }

  update(id, aluno) {
    const sql =
      "UPDATE alunos SET matricula=$1,nome=$2, curso=$3, status=$4, semestre=$5 WHERE id = $6;";
    return this.queryAluno(sql, [
      aluno.matricula,
      aluno.nome,
      aluno.curso,
      aluno.status,
      aluno.semestre,
      id,
    ]);
  }
  delete(id) {
    const sql = "DELETE FROM alunos WHERE id = $1;";
    return this.queryAluno(sql, [id]);
  }
}

export default new AlunoRepository();
