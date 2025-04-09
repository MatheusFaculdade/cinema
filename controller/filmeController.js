import { Filme } from "../model/filme.js";

const apiKey = "a49b91a95c94ea944df85263d4e787e0";
const baseUrl = "https://api.themoviedb.org/3";
const baseImageUrl = "https://image.tmdb.org/t/p/w500";

class FilmeController {
    constructor() {
        this.listaFilmes = [];
        this.idEmEdicao = null;
        this.idParaExcluir = null;

        this.init();
    }

    init() {
        document.getElementById("btnNovo").addEventListener("click", this.abrirModalCadastro.bind(this));
        document.getElementById("btnSalvarFilme").addEventListener("click", this.salvar.bind(this));
        document.getElementById("btnExcluirFilme").addEventListener("click", () => this.excluir(this.idParaExcluir));

        this.carregarFilmesDoLocalStorage();
    }

    async salvar() {
        const id = this.idEmEdicao || Date.now();
        const filme = new Filme(
            id,
            document.getElementById("titulo").value,
            document.getElementById("descricao").value,
            document.getElementById("genero").value,
            document.getElementById("classificacao").value,
            document.getElementById("duracao").value,
            document.getElementById("dataEstreia").value
        );

        if (this.idEmEdicao) {
            const index = this.listaFilmes.findIndex(f => f.id === this.idEmEdicao);
            this.listaFilmes[index] = filme;
        } else {
            this.listaFilmes.push(filme);
        }

        this.salvarNoLocalStorage();
        await this.atualizarTabela();
        this.fecharModal("idModalFilme");
    }

    salvarNoLocalStorage() {
        localStorage.setItem("filmes", JSON.stringify(this.listaFilmes));
    }

    carregarFilmesDoLocalStorage() {
        const filmesSalvos = JSON.parse(localStorage.getItem("filmes")) || [];
        this.listaFilmes = filmesSalvos;
        this.atualizarTabela();
    }

    async atualizarTabela() {
            const container = document.getElementById("filmes-container");
            container.innerHTML = "";
        
            for (const filme of this.listaFilmes) {
                const imagem = await this.buscarImagem(filme.title);
        
                const col = document.createElement("div");
                col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

                col.innerHTML = `
                    <div class="card h-100 shadow card-filme" data-id="${filme.id}">
                        <img src="${imagem}" class="card-img-top img-card" alt="${filme.title}">
                        <div class="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h5 class="card-title">${filme.title}</h5>
                                <p class="card-text">${this.converterGenero(filme.gender)} • ${filme.duration} min</p>
                                <p class="text-muted">${this.converterClassificacao(filme.classification)}</p>
                            </div>
                            <div class="d-flex justify-content-between mt-3">
                                <button class="btn btn-danger btn-sm btn-excluir" data-id="${filme.id}">
                                    <i class="bi bi-trash-fill"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
        
                container.appendChild(col);

                col.querySelector(".card-filme").addEventListener("click", (e) => {
                    if (e.target.closest(".btn-excluir")) return;
                    this.abrirModalEdicao(filme);
                });

                col.querySelector(".btn-excluir").addEventListener("click", () => {
                    this.abrirModalExcluir(filme.id);
                });

            }
        
        
    }

    async buscarImagem(titulo) {
        try {
            const response = await fetch(`${baseUrl}/search/movie?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(titulo)}`);
            const data = await response.json();
            const filme = data.results[0];
            if(!filme) {
                return "../../images/notFound.png";
            }
            return `${baseImageUrl}${filme.poster_path}`;
        } catch {
            return "../../images/notFound.png";
        }
    }

    abrirModalCadastro() {
        this.idEmEdicao = null;
        document.getElementById("formFilme").reset();
        document.getElementById("idModalFilmeTitulo").textContent = "Cadastrar Filme";
        new bootstrap.Modal(document.getElementById("idModalFilme")).show();
    }

    abrirModalEdicao(filme) {
        this.idEmEdicao = filme.id;
        document.getElementById("titulo").value = filme.title;
        document.getElementById("descricao").value = filme.description;
        document.getElementById("genero").value = filme.gender;
        document.getElementById("classificacao").value = filme.classification;
        document.getElementById("duracao").value = filme.duration;
        document.getElementById("dataEstreia").value = filme.releaseDate;
        document.getElementById("idModalFilmeTitulo").textContent = "Editar Filme";
        new bootstrap.Modal(document.getElementById("idModalFilme")).show();
    }

    abrirModalExcluir(id) {
        this.idParaExcluir = id;
        new bootstrap.Modal(document.getElementById("modalExcluirFilme")).show();
    }

    excluir(id) {
        this.listaFilmes = this.listaFilmes.filter(f => f.id !== id);
        this.salvarNoLocalStorage();
        this.atualizarTabela();
    }

    fecharModal(modalId) {
        const modalEl = document.getElementById(modalId);
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal?.hide();
    }

    formatarData(data) {
        const d = new Date(data);
        return d.toLocaleDateString("pt-BR");
    }

    converterGenero(g) {
        const generos = ["", "Ação", "Comédia", "Drama", "Ficção Científica", "Terror"];
        return generos[parseInt(g)] || "Desconhecido";
    }

    converterClassificacao(c) {
        const classif = ["", "Livre", "10 anos", "12 anos", "14 anos", "16 anos", "18 anos"];
        return classif[parseInt(c)] || "N/D";
    }
}

document.addEventListener("DOMContentLoaded", () => new FilmeController());
