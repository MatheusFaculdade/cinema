import { Ingresso } from "../model/ingresso.js";

class IngressoController {
  constructor() {
    this.lista = [];
    this.idEditando = null;
    this.idParaExcluir = null;

    this.init();
  }

  init() {
    document.getElementById("btnNovoIngresso").addEventListener("click", () => this.abrirModalCadastro());
    document.getElementById("btnSalvarIngresso").addEventListener("click", () => this.salvar());
    document.getElementById("btnConfirmarExclusao").addEventListener("click", () => this.excluir());

    this.carregarSessoes();
    this.carregarLocalStorage();
    this.renderizar();
  }

  carregarSessoes() {
    const sessoes = JSON.parse(localStorage.getItem("sessoes")) || [];
    const filmes = JSON.parse(localStorage.getItem("filmes")) || [];
    const select = document.getElementById("sessao");

    sessoes.forEach(sessao => {
      const filme = filmes.find(f => f.id == sessao.filmeId);
      const option = document.createElement("option");
      option.value = sessao.id;
      option.textContent = `${filme?.title || "Filme"} - ${new Date(sessao.dataHora).toLocaleString("pt-BR")}`;
      select.appendChild(option);
    });
  }

  abrirModalCadastro() {
    this.idEditando = null;
    document.getElementById("formIngresso").reset();
    document.getElementById("modalIngressoTitulo").textContent = "Novo Ingresso";
    new bootstrap.Modal(document.getElementById("modalIngresso")).show();
  }

  abrirModalEdicao(ingresso) {
    this.idEditando = ingresso.id;
    document.getElementById("sessao").value = ingresso.sessaoId;
    document.getElementById("cliente").value = ingresso.cliente;
    document.getElementById("cpf").value = ingresso.cpf;

    document.getElementById("modalIngressoTitulo").textContent = "Editar Ingresso";
    new bootstrap.Modal(document.getElementById("modalIngresso")).show();
  }

  abrirModalExcluir(id) {
    this.idParaExcluir = id;
    new bootstrap.Modal(document.getElementById("modalExcluirIngresso")).show();
  }

  salvar() {
    const sessaoId = document.getElementById("sessao").value;
    const cliente = document.getElementById("cliente").value;
    const cpf = document.getElementById("cpf").value;

    if (!sessaoId || !cliente || !cpf) {
      alert("Preencha todos os campos!");
      return;
    }

    const ingresso = new Ingresso(this.idEditando || Date.now(), sessaoId, cliente, cpf);

    if (this.idEditando) {
      const index = this.lista.findIndex(i => i.id === this.idEditando);
      this.lista[index] = ingresso;
    } else {
      this.lista.push(ingresso);
    }

    this.salvarLocalStorage();
    bootstrap.Modal.getInstance(document.getElementById("modalIngresso")).hide();
    this.renderizar();
  }

  excluir() {
    this.lista = this.lista.filter(i => i.id !== this.idParaExcluir);
    this.salvarLocalStorage();
    this.renderizar();
  }

  salvarLocalStorage() {
    localStorage.setItem("ingressos", JSON.stringify(this.lista));
  }

  carregarLocalStorage() {
    this.lista = JSON.parse(localStorage.getItem("ingressos")) || [];
  }

  renderizar() {
    const container = document.getElementById("ingressos-container");
    container.innerHTML = "";

    const sessoes = JSON.parse(localStorage.getItem("sessoes")) || [];
    const filmes = JSON.parse(localStorage.getItem("filmes")) || [];

    this.lista.forEach(ingresso => {
      const sessao = sessoes.find(s => s.id == ingresso.sessaoId);
      const filme = filmes.find(f => f.id == sessao?.filmeId);

      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-lg-4";

      col.innerHTML = `
        <div class="card h-100 shadow card-ingresso" style="cursor: pointer;">
          <div class="card-body">
            <h5 class="card-title">${ingresso.cliente}</h5>
            <p class="card-text">
              CPF: ${ingresso.cpf}<br>
              Filme: ${filme?.title || "Desconhecido"}<br>
              Sessão: ${new Date(sessao?.dataHora).toLocaleString("pt-BR")}
            </p>
            <div class="d-flex justify-content-end">
              <button class="btn btn-danger btn-sm btn-excluir">
                <i class="bi bi-trash-fill"></i>
              </button>
            </div>
          </div>
        </div>
      `;

      col.querySelector(".card-ingresso").addEventListener("click", (e) => {
        if (e.target.closest(".btn-excluir")) return;
        this.abrirModalEdicao(ingresso);
      });

      col.querySelector(".btn-excluir").addEventListener("click", () => this.abrirModalExcluir(ingresso.id));

      container.appendChild(col);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => new IngressoController());
