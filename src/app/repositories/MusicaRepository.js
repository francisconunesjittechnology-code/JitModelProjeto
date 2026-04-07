import connection from "../../config/database/connection.js";

class MusicaRepository {
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

  create(musica) {
    const sql = `
      INSERT INTO musicas (nome, artista_id, arquivo, capa)
      VALUES ($1, $2, $3, $4);
    `;

    return this.query(sql, [
      musica.nome,
      musica.artista_id,
      musica.arquivo,
      musica.capa,
    ]);
  }

  findAll() {
    const sql = `
      SELECT 
        musicas.id,
        musicas.nome,
        artistas.nome AS artista,
        musicas.arquivo,
        musicas.capa
      FROM musicas
      LEFT JOIN artistas ON artistas.id = musicas.artista_id
      ORDER BY musicas.id ASC;
    `;

    return this.query(sql);
  }

  findById(id) {
    const sql = `
      SELECT * FROM musicas WHERE id = $1;
    `;

    return this.query(sql, [id]);
  }

  delete(id) {
    const sql = `
      DELETE FROM musicas WHERE id = $1;
    `;

    return this.query(sql, [id]);
  }

  search(nome) {
    const sql = `
      SELECT 
        musicas.id,
        musicas.nome,
        artistas.nome AS artista,
        musicas.arquivo,
        musicas.capa
      FROM musicas
      LEFT JOIN artistas ON artistas.id = musicas.artista_id
      WHERE 
        musicas.nome ILIKE $1
        OR artistas.nome ILIKE $1
      ORDER BY musicas.id ASC;
    `;

    return this.query(sql, [`%${nome}%`]);
  }

  update(id, musica) {
    let sql = "UPDATE musicas SET nome = $1, artista_id = $2";
    const params = [musica.nome, musica.artista_id];

    let index = 3;

    if (musica.arquivo) {
      sql += `, arquivo = $${index}`;
      params.push(musica.arquivo);
      index++;
    }

    if (musica.capa) {
      sql += `, capa = $${index}`;
      params.push(musica.capa);
      index++;
    }

    sql += ` WHERE id = $${index}`;
    params.push(id);

    return this.query(sql, params);
  }
}

export default new MusicaRepository();