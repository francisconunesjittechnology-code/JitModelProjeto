import Artista from "../model/Artista.js";
import ArtistaRepository from "../repositories/ArtistaRepository.js";

class ArtistaController {
  async findAll(req, res) {
    try {
      const result = await ArtistaRepository.findAll();
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }

  async store(req, res) {
    try {
      const artista = new Artista(req.body.nome);
      await ArtistaRepository.create(artista);
      res.json({ message: "Success" });
    } catch (error) {
      res.json(error);
    }
  }
}

export default new ArtistaController();