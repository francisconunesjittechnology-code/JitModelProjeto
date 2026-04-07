import connection from "../../config/database/connection.js";

class ArtistaRepository {
  query(sql, params = "") {
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

  create(artista) {
    const sql = "INSERT INTO artistas (nome) VALUES ($1);";
    return this.query(sql, [artista.nome]);
  }

  findAll() {
    const sql = "SELECT * FROM artistas ORDER BY id ASC;";
    return this.query(sql);
  }

  findById(id) {
    const sql = "SELECT * FROM artistas WHERE id = $1;";
    return this.query(sql, [id]);
  }

  delete(id) {
    const sql = "DELETE FROM artistas WHERE id = $1;";
    return this.query(sql, [id]);
  }
}

export default new ArtistaRepository();