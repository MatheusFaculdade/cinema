export class Sala {
    constructor(id, nome, capacidade, tipo) {
      this.id = id;
      this.nome = nome;
      this.capacidade = capacidade;
      this.tipo = tipo;
    }
    getNome() {
        return this.nome;
    }
    getCapacidade() {
        return this.capacidade;
    }
    getTipo() {
        return this.tipo;
    }
    getId() {
        return this.id;
    }
    setNome(nome) {
        this.nome = nome;
    }
    setCapacidade(capacidade) {
        this.capacidade = capacidade;
    }
    setTipo(tipo) {
        this.tipo = tipo;
    }
    setId(id) {
        this.id = id;
    }
  }
  