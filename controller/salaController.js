import { Sala } from "../model/sala.js";

class SalaController {
  constructor() {
    this.listaSalas = [];
    this.idEditando = null;
    this.idParaExcluir = null;

    this.init();
  }

  init() {
    document.getElementById("btnNovaSala").addEventListener("click", () => this.abrirModalCadastro());
    document.getElementById("btnSalvarSala").addEventListener("click", () => this.salvar());
    document.getElementById("btnConfirmarExclusao").addEventListener("click", () => this.excluir());

    this.carregarLocalStorage();
    this.renderizarSalas();
  }

  abrirModalCadastro() {
    this.idEditando = null;
    document.getElementById("formSala").reset();
    document.getElementById("modalSalaTitulo").textContent = "Cadastrar Sala";
    new bootstrap.Modal(document.getElementById("modalSala")).show();
  }

  abrirModalEdicao(sala) {
    this.idEditando = sala.id;
    document.getElementById("nomeSala").value = sala.nome;
    document.getElementById("capacidadeSala").value = sala.capacidade;
    document.getElementById("tipoSala").value = sala.tipo;
    document.getElementById("modalSalaTitulo").textContent = "Editar Sala";
    new bootstrap.Modal(document.getElementById("modalSala")).show();
  }

  abrirModalExcluir(id) {
    this.idParaExcluir = id;
    new bootstrap.Modal(document.getElementById("modalExcluirSala")).show();
  }

  salvar() {
    const nome = document.getElementById("nomeSala").value;
    const capacidade = document.getElementById("capacidadeSala").value;
    const tipo = document.getElementById("tipoSala").value;

    if (!nome || !capacidade || !tipo) {
      alert("Preencha todos os campos.");
      return;
    }

    const sala = new Sala(this.idEditando || Date.now(), nome, capacidade, tipo);

    if (this.idEditando) {
      const index = this.listaSalas.findIndex(s => s.id === this.idEditando);
      this.listaSalas[index] = sala;
    } else {
      this.listaSalas.push(sala);
    }

    this.salvarLocalStorage();
    bootstrap.Modal.getInstance(document.getElementById("modalSala")).hide();
    this.renderizarSalas();
  }

  excluir() {
    this.listaSalas = this.listaSalas.filter(s => s.id !== this.idParaExcluir);
    this.salvarLocalStorage();
    this.renderizarSalas();
  }

  salvarLocalStorage() {
    localStorage.setItem("salas", JSON.stringify(this.listaSalas));
  }

  carregarLocalStorage() {
    this.listaSalas = JSON.parse(localStorage.getItem("salas")) || [];
  }

  renderizarSalas() {
    const container = document.getElementById("salas-container");
    container.innerHTML = "";

    this.listaSalas.forEach(sala => {
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-md-4 col-lg-3";
      col.innerHTML = `
        <div class="card h-100 shadow card-sala" style="cursor: pointer;">
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <h5 class="card-title">${sala.nome}</h5>
              <p class="card-text">${sala.capacidade} lugares • ${this.converterTipo(sala.tipo)}</p>
            </div>
            <div class="d-flex justify-content-end">
              <button class="btn btn-danger btn-sm btn-excluir">
                <i class="bi bi-trash-fill"></i>
              </button>
            </div>
          </div>
        </div>
      `;

      col.querySelector(".card-sala").addEventListener("click", (e) => {
        if (e.target.closest(".btn-excluir")) return;
        this.abrirModalEdicao(sala);
      });

      col.querySelector(".btn-excluir").addEventListener("click", () => this.abrirModalExcluir(sala.id));

      container.appendChild(col);
    });
  }

  converterTipo(tipo) {
    return tipo === "1" ? "2D" : tipo === "2" ? "3D" : "Desconhecido";
  }
}

document.addEventListener("DOMContentLoaded", () => new SalaController());
