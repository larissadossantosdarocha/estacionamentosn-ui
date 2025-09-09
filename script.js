const api = "https://estacionamentosn.vercel.app/";
const main = document.querySelector("main");


function listarRotas() {
  const options = { method: 'GET', headers: { 'User-Agent': 'insomnia/11.5.0' } };

  fetch(api, options)
    .then(response => response.json())
    .then(data => {
      const rotas = data.rotas;
      mostrarRotas(rotas);
    })
    .catch(err => {
      console.error('Erro ao listar rotas:', err);
      main.innerHTML = '<p>Erro ao carregar as rotas da API.</p>';
    });
}

function mostrarRotas(rotas) {
  main.innerHTML = ''; 
  rotas.forEach(rota => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <h3>${rota.metodo} - ${rota.caminho}</h3>
      <p><strong>Método:</strong> ${rota.metodo}</p>
      <p><strong>Caminho:</strong> ${rota.caminho}</p>
    `;
    main.appendChild(card);
  });
}

function listarVeiculos() {
  const options = { method: 'GET', headers: { 'User-Agent': 'insomnia/11.5.0' } };

  fetch(`${api}veiculos`, options)
    .then(response => response.json())
    .then(data => {
      mostrarVeiculos(data);
    })
    .catch(err => {
      console.error('Erro ao listar veículos:', err);
      main.innerHTML = '<p>Erro ao carregar veículos.</p>';
    });
}

function mostrarVeiculos(veiculos) {
  main.innerHTML = '';
  veiculos.forEach(veiculo => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <h3>Placa: ${veiculo.placa}</h3>
      <p><strong>Tipo:</strong> ${veiculo.tipo}</p>
      <p><strong>Proprietário:</strong> ${veiculo.proprietario}</p>
      <p><strong>Modelo:</strong> ${veiculo.modelo}</p>
      <p><strong>Marca:</strong> ${veiculo.marca}</p>
      <p><strong>Ano:</strong> ${veiculo.ano}</p>
      <p><strong>Telefone:</strong> ${veiculo.telefone}</p>
    `;
    main.appendChild(card);
  });
}


listarVeiculos();
