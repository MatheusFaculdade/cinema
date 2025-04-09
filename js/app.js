document.addEventListener("DOMContentLoaded", () => {
    renderUltimosIngressos();
    renderProximasSessoes();
  });
  
  function renderUltimosIngressos() {
    const container = document.getElementById("ultimos-ingressos");
    const ingressos = JSON.parse(localStorage.getItem("ingressos")) || [];
    const sessoes = JSON.parse(localStorage.getItem("sessoes")) || [];
    const filmes = JSON.parse(localStorage.getItem("filmes")) || [];
  
    const ultimos = ingressos.slice(-3).reverse();
  
    container.innerHTML = "";
  
    ultimos.forEach(ingresso => {
      const sessao = sessoes.find(s => s.id == ingresso.sessaoId);
      const filme = filmes.find(f => f.id == sessao?.filmeId);
  
      const card = document.createElement("div");
      card.className = "col-12 col-md-6 col-lg-4";
      card.innerHTML = `
        <div class="card h-100 shadow">
          <div class="card-body">
            <h5 class="card-title">${ingresso.cliente}</h5>
            <p class="card-text">
              Filme: ${filme?.title || "Desconhecido"}<br>
              Data: ${new Date(sessao?.dataHora).toLocaleString("pt-BR")}<br>
              CPF: ${ingresso.cpf}
            </p>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }
  
  function renderProximasSessoes() {
    const container = document.getElementById("proximas-sessoes");
    const sessoes = JSON.parse(localStorage.getItem("sessoes")) || [];
    const filmes = JSON.parse(localStorage.getItem("filmes")) || [];
    const agora = new Date();
  
    const futuras = sessoes
      .filter(s => new Date(s.dataHora) > agora)
      .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))
      .slice(0, 3);
  
    container.innerHTML = "";
  
    futuras.forEach(sessao => {
      const filme = filmes.find(f => f.id == sessao.filmeId);
  
      const card = document.createElement("div");
      card.className = "col-12 col-md-6 col-lg-4";
      card.innerHTML = `
        <div class="card h-100 shadow">
          <div class="card-body">
            <h5 class="card-title">${filme?.title || "Desconhecido"}</h5>
            <p class="card-text">
              Data: ${new Date(sessao.dataHora).toLocaleString("pt-BR")}<br>
              Formato: ${sessao.formato}<br>
              Idioma: ${sessao.idioma}<br>
              Preço: R$ ${parseFloat(sessao.preco).toFixed(2)}
            </p>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }
  