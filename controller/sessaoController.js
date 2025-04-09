import { Sessao } from "../model/sessao.js";

class SessaoController {
  constructor() {
    this.lista = [];
    this.idEditando = null;
    this.idParaExcluir = null;

    this.init();
  }

  init() {
    document.getElementById("btnNovaSessao").addEventListener("click", () => this.abrirModalCadastro());
    document.getElementById("btnSalvarSessao").addEventListener("click", () => this.salvar());
    document.getElementById("btnConfirmarExclusao").addEventListener("click", () => this.excluir());

    this.carregarFilmes();
    this.carregarSalas();
    this.carregarLocalStorage();
    this.renderizar();
  }

  carregarFilmes() {
    const filmes = JSON.parse(localStorage.getItem("filmes")) || [];
    const select = document.getElementById("movie");
    filmes.forEach(f => {
      const opt = document.createElement("option");
      opt.value = f.id;
      opt.text = f.title || f._title;
      select.appendChild(opt);
    });
  }

  carregarSalas() {
    const salas = JSON.parse(localStorage.getItem("salas")) || [];
    const select = document.getElementById("room");
    salas.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.text = s.nome;
      select.appendChild(opt);
    });
  }

  abrirModalCadastro() {
    this.idEditando = null;
    document.getElementById("formSessao").reset();
    document.getElementById("modalSessaoTitulo").textContent = "Cadastrar Sessão";
    new bootstrap.Modal(document.getElementById("modalSessao")).show();
  }

  abrirModalEdicao(sessao) {
    this.idEditando = sessao.id;
    document.getElementById("movie").value = sessao.filmeId;
    document.getElementById("room").value = sessao.salaId;
    document.getElementById("dateHour").value = sessao.dataHora;
    document.getElementById("price").value = sessao.preco;
    document.getElementById("language").value = sessao.idioma;
    document.getElementById("format").value = sessao.formato;

    document.getElementById("modalSessaoTitulo").textContent = "Editar Sessão";
    new bootstrap.Modal(document.getElementById("modalSessao")).show();
  }

  abrirModalExcluir(id) {
    this.idParaExcluir = id;
    new bootstrap.Modal(document.getElementById("modalExcluirSessao")).show();
  }

  salvar() {
    const filmeId = document.getElementById("movie").value;
    const salaId = document.getElementById("room").value;
    const dataHora = document.getElementById("dateHour").value;
    const preco = document.getElementById("price").value;
    const idioma = document.getElementById("language").value;
    const formato = document.getElementById("format").value;

    if (!filmeId || !salaId || !dataHora || !preco || !idioma || !formato) {
      alert("Preencha todos os campos.");
      return;
    }

    const novaSessao = new Sessao(this.idEditando || Date.now(), filmeId, salaId, dataHora, preco, idioma, formato);

    if (this.idEditando) {
      const index = this.lista.findIndex(s => s.id === this.idEditando);
      this.lista[index] = novaSessao;
    } else {
      this.lista.push(novaSessao);
    }

    this.salvarLocalStorage();
    bootstrap.Modal.getInstance(document.getElementById("modalSessao")).hide();
    this.renderizar();
  }

  excluir() {
    this.lista = this.lista.filter(s => s.id !== this.idParaExcluir);
    this.salvarLocalStorage();
    this.renderizar();
  }

  salvarLocalStorage() {
    localStorage.setItem("sessoes", JSON.stringify(this.lista));
  }

  carregarLocalStorage() {
    this.lista = JSON.parse(localStorage.getItem("sessoes")) || [];
  }

  renderizar() {
    const container = document.getElementById("sessoes-container");
    container.innerHTML = "";

    const filmes = JSON.parse(localStorage.getItem("filmes")) || [];
    const salas = JSON.parse(localStorage.getItem("salas")) || [];

    this.lista.forEach(sessao => {
      const filme = filmes.find(f => f.id == sessao.filmeId);
      const sala = salas.find(s => s.id == sessao.salaId);

      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-lg-4";

      col.innerHTML = `
        <div class="card h-100 shadow card-sessao" style="cursor: pointer;">
          <div class="card-body">
            <h5 class="card-title">${filme?.title || "Filme desconhecido"}</h5>
            <p class="card-text">
              Sala: ${sala?.nome || "Desconhecida"}<br>
              Data: ${new Date(sessao.dataHora).toLocaleString("pt-BR")}<br>
              Preço: R$ ${parseFloat(sessao.preco).toFixed(2)}<br>
              Idioma: ${sessao.idioma} | Formato: ${sessao.formato}
            </p>
            <div class="d-flex justify-content-end">
              <button class="btn btn-danger btn-sm btn-excluir">
                <i class="bi bi-trash-fill"></i>
              </button>
            </div>
          </div>
        </div>
      `;

      col.querySelector(".card-sessao").addEventListener("click", (e) => {
        if (e.target.closest(".btn-excluir")) return;
        this.abrirModalEdicao(sessao);
      });

      col.querySelector(".btn-excluir").addEventListener("click", () => this.abrirModalExcluir(sessao.id));

      container.appendChild(col);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => new SessaoController());
