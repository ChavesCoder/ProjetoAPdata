// Estrutura de dados de exemplo (substitua com os dados reais que você tiver)
// Estrutura de dados com valores por cidade e ano

// Labels do gráfico
const labels = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// Função para criar o gráfico inicial
async function criarGraficoInicial() {
    const cidadeSelecionada1 = document.getElementById('selectCidade1').value;
    const cidadeSelecionada2 = document.getElementById('selectCidade2').value;
    const cidadeSelecionada3 = document.getElementById('selectCidade3').value;
    const cidadeSelecionada4 = document.getElementById('selectCidade4').value;
    const anoSelecionado = document.getElementById('selectAno').value;

    const response = await fetch(`/variacao/${anoSelecionado}/${cidadeSelecionada1}/${cidadeSelecionada2}/${cidadeSelecionada3}/${cidadeSelecionada4}`);
    const dadosPorCidade = await response.json();
    console.log('Dados recebidos:', dadosPorCidade[0].municipio);

    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    const config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: cidadeSelecionada1,
                    data: dadosPorCidade[cidadeSelecionada1][anoSelecionado],
                    borderColor: 'rgb(124, 42, 163)',
                    backgroundColor: 'rgba(77, 44, 91, 0.5)',
                },
                {
                    label: cidadeSelecionada2,
                    data: dadosPorCidade[cidadeSelecionada2][anoSelecionado],
                    borderColor: '#36a2eb',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                },
                {
                    label: cidadeSelecionada3,
                    data: dadosPorCidade[cidadeSelecionada3][anoSelecionado],
                    borderColor: 'rgba(225, 199, 32)',
                    backgroundColor: 'rgba(225, 199, 32, 0.5)',
                },
                {
                    label: cidadeSelecionada4,
                    data: dadosPorCidade[cidadeSelecionada4][anoSelecionado],
                    borderColor: 'rgb(24, 62, 135)',
                    backgroundColor: 'rgba(24, 62, 135, 0.5)',
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Índice de Valorização de Apartamentos - Últimos 12 Meses',
                }
            }
        }
    };

    return new Chart(
        document.getElementById('meuGrafico'),
        config
    );
}


// Inicializar gráfico
// let meuGrafico = criarGraficoInicial();

// Função para atualizar o gráfico quando qualquer opção mudar
// Função para calcular a soma dos valores de uma cidade
function calcularSoma(cidade, ano) {
    const dados = dadosPorCidade[cidade][ano];
    return dados.reduce((acc, val) => acc + val, 0);
}

// Função para atualizar o gráfico e as informações
function buscarDados() {
    const anoSelecionado = document.getElementById('selectAno').value;
    const cidadeSelecionada1 = document.getElementById('selectCidade1').value;
    const cidadeSelecionada2 = document.getElementById('selectCidade2').value;
    const cidadeSelecionada3 = document.getElementById('selectCidade3').value;
    const cidadeSelecionada4 = document.getElementById('selectCidade4').value;

    // if (!dadosPorCidade[cidadeSelecionada1] || !dadosPorCidade[cidadeSelecionada2] || !dadosPorCidade[cidadeSelecionada3] || !dadosPorCidade[cidadeSelecionada4]) {
    //     return;
    // }

    // Atualiza os dados do gráfico
    meuGrafico.data.datasets[0].data = dadosPorCidade[cidadeSelecionada1][anoSelecionado];
    meuGrafico.data.datasets[1].data = dadosPorCidade[cidadeSelecionada2][anoSelecionado];
    meuGrafico.data.datasets[2].data = dadosPorCidade[cidadeSelecionada3][anoSelecionado];
    meuGrafico.data.datasets[3].data = dadosPorCidade[cidadeSelecionada4][anoSelecionado];

    // Atualiza a label do gráfico com o nome da cidade
    meuGrafico.data.datasets[0].label = `${cidadeSelecionada1}`;
    meuGrafico.data.datasets[1].label = `${cidadeSelecionada2}`;
    meuGrafico.data.datasets[2].label = `${cidadeSelecionada3}`;
    meuGrafico.data.datasets[3].label = `${cidadeSelecionada4}`;

    // Atualiza a soma das cidades nas spans
    document.getElementById('somaCidade1').textContent = `${cidadeSelecionada1}: +${calcularSoma(cidadeSelecionada1, anoSelecionado).toFixed(2)}%`;
    document.getElementById('somaCidade2').textContent = `${cidadeSelecionada2}: +${calcularSoma(cidadeSelecionada2, anoSelecionado).toFixed(2)}%`;
    document.getElementById('somaCidade3').textContent = `${cidadeSelecionada3}: +${calcularSoma(cidadeSelecionada3, anoSelecionado).toFixed(2)}%`;
    document.getElementById('somaCidade4').textContent = `${cidadeSelecionada4}: +${calcularSoma(cidadeSelecionada4, anoSelecionado).toFixed(2)}%`;

    // Atualiza o gráfico
    meuGrafico.update();
}

// Inicializar gráfico
let meuGrafico = criarGraficoInicial();


// Função para atualizar o gráfico de "Domicílio Próprio"
let chart2; 

function atualizarGraficoDomicilio(domicilioProprio) {
    const data2 = {
        labels: ['Com Domicílio Próprio', 'Sem Domicílio Próprio'],
        datasets: [{
            data: [domicilioProprio, 100 - domicilioProprio],
            backgroundColor: ['#2896df', '#09629d'],
            borderWidth: 1
        }]
    };

    const config2 = {
        type: 'doughnut',
        data: data2,
        options: {
            cutout: '60%',
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Percentual de Residências Próprias',
                },
                tooltip: {
                    enabled: true
                },
            }
        }
    };

    // Se o gráfico já existir, destrói o antigo antes de criar um novo
    if (chart2) {
        chart2.destroy(); // Destroi o gráfico antigo para recriar com novos dados
    }

    // Cria o gráfico com os novos dados
    chart2 = new Chart(
        document.getElementById('donutChart2'),
        config2
    );
}

// Função para buscar os dados da cidade e atualizar o dashboard
function buscarDadosCidade() {
    var cidadeEscolhida = document.getElementById("select_cidade").value;
  
    fetch(`/dashboard/dadosCidade/${cidadeEscolhida}`, {
        method: "GET"
    })
    .then(function (resposta) {
        if (resposta.ok) {
            resposta.json().then(function (dados) {
                console.log(dados);
                // Atualize o dashboard e os gráficos com os dados
                atualizarDashboard(dados);
            });
        } else {
            console.error("Erro ao buscar dados da cidade");
        }
    })
    .catch(function (erro) {
        console.error("Erro na requisição:", erro);
    });
}

// Função para atualizar o conteúdo do dashboard com os dados da cidade
function atualizarDashboard(dados) {
    let mediaFormatada = Number(dados.mediaDomicilio);
    let preco1quarto = dados.precoMedioUmDormitorio;
    let preco2quarto = dados.precoMedioDoisDormitorios;
    let preco3quarto = dados.precoMedioTresDormitorios;
    let preco4quarto = dados.precoMedioQuatroDormitorios;
    
    document.getElementById("mediaMoradores").innerText = mediaFormatada.toFixed(2);
    document.getElementById("umDormitorio").innerText = "R$ " + preco1quarto.toFixed(2);
    document.getElementById("doisDormitorio").innerText = "R$ " + preco2quarto.toFixed(2);
    document.getElementById("tresDormitorio").innerText = "R$ " + preco3quarto.toFixed(2);
    document.getElementById("quatroDormitorio").innerText = "R$ " + preco4quarto.toFixed(2);
    
    // Atualiza o gráfico de Domicílio Próprio
    atualizarGraficoDomicilio(Number(dados.totalMoradoresProprio));
}
