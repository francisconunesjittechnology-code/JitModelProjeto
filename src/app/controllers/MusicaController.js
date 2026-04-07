import Musica from "../model/Musica.js";
import MusicaRepository from "../repositories/MusicaRepository.js";

class MusicaController {
  async findAll(req, res) {
    try {
      const result = await MusicaRepository.findAll();
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }

  async store(req, res) {
    try {
      const musica = new Musica(
        req.body.nome,
        req.body.artista_id,
        req.body.arquivo,
        req.body.capa
      );

      await MusicaRepository.create(musica);
      res.json({ message: "Success" });
    } catch (error) {
      res.json(error);
    }
  }

  async search(req, res) {
    const { nome } = req.query;

    try {
      const result = await MusicaRepository.search(nome || "");
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }

  async deleteById(req, res) {
    const id = req.params.id;

    try {
      const exists = await MusicaRepository.findById(id);

      if (exists.length === 0) {
        res.json({ message: "ID not found" });
      } else {
        await MusicaRepository.delete(id);
        res.json({ message: "Deleted successfully" });
      }
    } catch (error) {
      res.json(error);
    }
  }

  async upload(req, res) {
    try {
      const { nome, artista_id } = req.body;

      const audio = req.files["audio"][0];
      const capa = req.files["capa"][0];

      const novaMusica = {
        nome,
        artista_id,
        arquivo: "/music/" + audio.filename,
        capa: "/images/" + capa.filename
      };

      await MusicaRepository.create(novaMusica);

      res.json({ message: "Upload sucesso!" });

    } catch (error) {
      res.json(error);
    }
  }

  async update(req, res) {
    const { id } = req.params;

    try {
      const { nome, artista_id } = req.body;

      let arquivo = null;
      let capa = null;

      if (req.files?.audio) {
        arquivo = "/music/" + req.files.audio[0].filename;
      }

      if (req.files?.capa) {
        capa = "/images/" + req.files.capa[0].filename;
      }

      await MusicaRepository.update(id, {
        nome,
        artista_id,
        arquivo,
        capa
      });

      res.json({ message: "Atualizado com sucesso" });

    } catch (error) {
      res.json(error);
    }
  }
}

export default new MusicaController();