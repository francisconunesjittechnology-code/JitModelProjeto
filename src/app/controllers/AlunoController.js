import Aluno from "../model/Aluno.js";
import AlunoRepository from "../repositories/AlunoRepository.js";

class AlunoController {
  async findAll(request, response) {
    try {
      const result = await AlunoRepository.findAll();
      response.json(result);
    } catch (error) {
      response.json(error);
    }
  }

  async findById(request, response) {
    const id = request.params.id;
    try {
      const result = await AlunoRepository.findById(id);
      if (Object.keys(result).length == 0) {
        response.json({ message: "ID not found" });
      } else {
        response.json(result);
      }
    } catch (error) {
      response.json(error);
    }
  }

  async findByMatricula(request, response) {
    const matricula = request.params.matricula;
    try {
      const result = await AlunoRepository.findByMatricula(matricula);
      if (Object.keys(result).length == 0) {
        response.json({ message: "Matricula not found" });
      } else {
        response.json(result);
      }
    } catch (error) {
      response.json(error);
    }
  }

  async updateById(request, response) {
    const id = request.params.id;
    try {
      const exists = await AlunoRepository.findById(id);
      if (Object.keys(exists).length == 0) {
        response.json({ message: "ID not found" });
      } else {
        try {
          const aluno = new Aluno(
            request.body.matricula,
            request.body.nome,
            request.body.curso,
            request.body.semestre,
            request.body.status
          );
          await AlunoRepository.update(id, aluno);
          response.json({ message: "Success" });
        } catch (error) {
          response.json(error);
        }
      }
    } catch (error) {
      response.json(error);
    }
  }

  async deleteById(request, response) {
    const id = request.params.id;
    try {
      const exists = await AlunoRepository.findById(id);
      if (Object.keys(exists).length == 0) {
        response.json({ message: "ID not found" });
      } else {
        await AlunoRepository.delete(id);
        response.json({ message: "Success" });
      }
    } catch (error) {
      response.json(error);
    }
  }

  async store(request, response) {
    try {
      const exists = await AlunoRepository.findByMatricula(
        request.body.matricula
      );
      if (Object.keys(exists).length > 0) {
        response.json({ message: "User already registered." });
      } else {
        try {
          const aluno = new Aluno(
            request.body.matricula,
            request.body.nome,
            request.body.curso,
            request.body.semestre,
            request.body.status
          );
          await AlunoRepository.create(aluno);
          response.json({ message: "Success" });
        } catch (error) {
          response.json(error);
        }
      }
    } catch (error) {
      response.json(error);
    }
  }
}

//using singleton pattern
export default new AlunoController();
