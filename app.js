const apiUrl = 'https://estacionamentosn-9yqova0c5-larissas-projects-0ec17445.vercel.app';
const carForm = document.getElementById('car-form');
const carList = document.getElementById('car-list');

// Função para atualizar a lista de veículos
function listarVeiculos() {
  fetch(`${apiUrl}/veiculos`)
    .then(res => res.json())
    .then(data => {
      carList.innerHTML = ''; // Limpa a lista
      data.forEach(veiculo => {
        const li = document.createElement('li');
        li.textContent = `Placa: ${veiculo.placa} | Modelo: ${veiculo.modelo}`;
        carList.appendChild(li);
      });
    })
    .catch(err => console.error('Erro ao listar veículos:', err));
}

// Função para registrar novo veículo
carForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const placa = document.getElementById('placa').value;
  const modelo = document.getElementById('modelo').value;

  fetch(`${apiUrl}/veiculos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ placa, modelo })
  })
    .then(res => res.json())
    .then(data => {
      console.log('Veículo registrado:', data);
      carForm.reset(); // Limpa o formulário
      listarVeiculos(); // Atualiza a lista
    })
    .catch(err => console.error('Erro ao registrar veículo:', err));
});

// Inicializa a lista ao carregar a página
listarVeiculos();
