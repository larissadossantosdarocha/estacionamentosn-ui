document.addEventListener('DOMContentLoaded', () => {
    const veiculosContainer = document.getElementById('veiculos-container');
    const novoVeiculoBtn = document.getElementById('novo-veiculo-btn');
    const cadastroVeiculoSection = document.getElementById('cadastro-veiculo');
    const cancelarBtn = document.getElementById('cancelar-btn');
    const formCadastro = document.getElementById('form-cadastro');
    
    // Mock para a lista de veículos (substitua por uma chamada à API)
    let veiculos = [
        { placa: 'AAA0000', entrada: '22/08/2025 08:00', saida: '22/08/2025 10:00', valorHora: 10, total: 20 },
        { placa: 'AAL2525', entrada: '22/08/2025 08:00', saida: '22/08/2025 10:00', valorHora: 10, total: 20 },
        { placa: 'AAA1358', entrada: '22/08/2025 08:00', saida: '22/08/2025 10:00', valorHora: 10, total: 20 }
    ];

    // Função para exibir a lista de veículos
    function exibirVeiculos() {
        veiculosContainer.innerHTML = '';
        veiculos.forEach(veiculo => {
            const veiculoDiv = document.createElement('div');
            veiculoDiv.classList.add('veiculo-item');
            veiculoDiv.innerHTML = `
                <strong>${veiculo.placa}</strong><br>
                Entrada: ${veiculo.entrada}<br>
                Saída: ${veiculo.saida}<br>
                Valor Hora: R$ ${veiculo.valorHora},00<br>
                Total: R$ ${veiculo.total},00
            `;
            veiculosContainer.appendChild(veiculoDiv);
        });
    }

    // Chamada para exibir veículos na tela
    exibirVeiculos();

    // Exibir a tela de cadastro de novo veículo
    novoVeiculoBtn.addEventListener('click', () => {
        cadastroVeiculoSection.classList.remove('hidden');
    });

    // Cancelar o cadastro e esconder a tela
    cancelarBtn.addEventListener('click', () => {
        cadastroVeiculoSection.classList.add('hidden');
    });

    // Salvar o novo veículo
    formCadastro.addEventListener('submit', (e) => {
        e.preventDefault();

        const placa = document.getElementById('placa').value;
        const entrada = document.getElementById('entrada').value;
        const saida = document.getElementById('saida').value;
        const valorHora = parseFloat(document.getElementById('valor-hora').value);

        const novoVeiculo = {
            placa,
            entrada,
            saida,
            valorHora,
            total: calcularTotal(valorHora, entrada, saida)
        };

        veiculos.push(novoVeiculo);
        exibirVeiculos();
        cadastroVeiculoSection.classList.add('hidden');
        formCadastro.reset();
    });

    // Função para calcular o total com base no valor da hora
    function calcularTotal(valorHora, entrada, saida) {
        const dataEntrada = new Date(entrada);
        const dataSaida = new Date(saida);
        const horasEstacionado = (dataSaida - dataEntrada) / (1000 * 60 * 60); // em horas
        return valorHora * horasEstacionado;
    }
});

fetch('URL_DA_API/veiculos')
    .then(response => response.json())
    .then(data => {
        veiculos = data;
        exibirVeiculos();
    });
// Substitua 'URL_DA_API/veiculos' pela URL real da sua API
current.end = range.end
      current.index = Math.min(current.index, range.index)

      let indiceImagem = 0;

function mudarImagem(n) {
    const imagens = document.querySelectorAll('.carrossel-imagens img');
    const totalImagens = imagens.length;
}