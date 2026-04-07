class Aluno {
  _matricula;
  _nome;
  _curso;
  _semestre;
  _status;

  constructor(matricula, nome, curso, semestre, status) {
    this._matricula = matricula;
    this._nome = nome;
    this._curso = curso;
    this._semestre = semestre;
    this._status = status;
  }

  get matricula() {
    return this._matricula;
  }
  get nome() {
    return this._nome;
  }
  get curso() {
    return this._curso;
  }
  get semestre() {
    return this._semestre;
  }
  get status() {
    return this._status;
  }

  set matricula(matricula) {
    this._matricula = matricula;
  }
  set nome(nome) {
    this._nome = nome;
  }
  set curso(curso) {
    this._curso = curso;
  }
  set semestre(semestre) {
    this._semestre = semestre;
  }
  set status(status) {
    this._status = status;
  }
}

export default Aluno;
