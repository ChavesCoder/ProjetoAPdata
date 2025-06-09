// Estrutura de dados de exemplo (substitua com os dados reais que você tiver)
// Estrutura de dados com valores por cidade e ano
const dadosPorCidade = {
    "São Paulo": {
      "2022": [1.1, 1.2, 1.3, 1.25, 1.4, 1.5, 1.4, 1.35, 1.25, 1.3, 1.4, 1.5],
      "2023": [1.2, 1.3, 1.35, 1.5, 1.45, 1.55, 1.5, 1.45, 1.35, 1.4, 1.5, 1.6],
      "2024": [1.15, 1.25, 1.3, 1.45, 1.4, 1.5, 1.45, 1.4, 1.3, 1.35, 1.45, 1.55]
    },
    "Barueri": {
      "2022": [1.0, 1.1, 1.25, 1.3, 1.2, 1.3, 1.4, 1.35, 1.25, 1.4, 1.2, 1.1],
      "2023": [0.55, 0.83, 0.66, 0.52, 0.60, 0.88, 0.86, 0.74, 0.76, 0.96, 0.72, 0.69],
      "2024": [1.05, 1.15, 1.25, 1.3, 1.2, 1.3, 1.4, 1.35, 1.25, 1.3, 1.4, 1.5]
    },
    "Campinas": {
      "2022": [0.49, 0.23, 0.44, 0.55, 0.91, 1.27, 1.34, 1.07, 0.59, 0.48, 0.47, 0.49],
      "2023": [1.05, 1.1, 1.25, 1.3, 1.2, 1.3, 1.4, 1.35, 1.25, 1.3, 1.4, 1.5],
      "2024": [1.0, 1.05, 1.2, 1.25, 1.15, 1.25, 1.35, 1.3, 1.2, 1.25, 1.35, 1.45]
    },
    "Diadema": {
      "2022": [0.6, 0.7, 0.8, 0.85, 0.75, 0.8, 0.9, 0.85, 0.8, 0.85, 0.9, 1.0],
      "2023": [0.76, 0.16, 0.01, 0.08, 0.42, 0.34, 0.41, 0.47, 0.75, 0.86, 0.61, 0.21],
      "2024": [0.55, 0.65, 0.75, 0.8, 0.7, 0.75, 0.85, 0.8, 0.75, 0.8, 0.85, 0.95]
    },
    "Guarujá": {
      "2022": [0.7, 0.75, 0.9, 0.95, 0.85, 0.9, 1.0, 0.95, 0.9, 0.95, 1.0, 1.1],
      "2023": [-0.44, 0.21, 1.10, 1.56, 0.96, 0.13, 0.55, 0.16, 0.87, 0.75, 1.18, 1.17],
      "2024": [0.7, 0.75, 0.9, 0.95, 0.85, 0.9, 1.0, 0.95, 0.9, 0.95, 1.0, 1.1]
    },
    "Guarulhos": {
      "2022": [0.8, 0.85, 1.0, 1.05, 0.95, 1.0, 1.1, 1.05, 1.0, 1.05, 1.1, 1.2],
      "2023": [0.60, 0.55, 0.49, 0.40, 0.14, 0.37, 0.69, 1.10, 1.06, 0.96, 0.49, 0.45],
      "2024": [0.8, 0.85, 1.0, 1.05, 0.95, 1.0, 1.1, 1.05, 1.0, 1.05, 1.1, 1.2]
    },
    "Osasco": {
      "2022": [0.75, 0.8, 0.95, 1.0, 0.9, 0.95, 1.05, 1.0, 0.95, 1.0, 1.05, 1.15],
      "2023": [0.52, 0.63, 0.75, 1.19, 0.74, 0.80, 0.48, 0.63, 0.55, 0.63, 0.69, 0.63],
      "2024": [0.78, 0.83, 0.98, 1.03, 0.93, 0.98, 1.08, 1.03, 0.98, 1.03, 1.08, 1.18]
    },
    "Praia Grande": {
      "2022": [0.55, 0.6, 0.7, 0.75, 0.65, 0.7, 0.8, 0.75, 0.7, 0.75, 0.8, 0.9],
      "2023": [0.34, 1.02, 1.22, 1.07, 0.99, 0.99, 1.10, 0.61, 0.44, 0.73, 1.01, 0.80],
      "2024": [0.58, 0.63, 0.73, 0.78, 0.68, 0.73, 0.83, 0.78, 0.73, 0.78, 0.83, 0.93]
    },
    "Ribeirão Preto": {
      "2022": [0.7, 0.75, 0.9, 0.95, 0.85, 0.9, 1.0, 0.95, 0.9, 0.95, 1.0, 1.1],
      "2023": [0.75, 0.8, 0.95, 1.0, 0.9, 0.95, 1.05, 1.0, 0.95, 1.0, 1.05, 1.15],
      "2024": [0.73, 0.78, 0.93, 0.98, 0.88, 0.93, 1.03, 0.98, 0.93, 0.98, 1.03, 1.13]
    },
    "Santo André": {
      "2022": [0.8, 0.85, 1.0, 1.05, 0.95, 1.0, 1.1, 1.05, 1.0, 1.05, 1.1, 1.2],
      "2023": [0.85, 0.9, 1.05, 1.1, 1.0, 1.05, 1.15, 1.1, 1.05, 1.1, 1.15, 1.25],
      "2024": [0.83, 0.88, 1.03, 1.08, 0.98, 1.03, 1.13, 1.08, 1.03, 1.08, 1.13, 1.23]
    },
    "Santos": {
      "2022": [1.0, 1.1, 1.25, 1.3, 1.2, 1.3, 1.4, 1.35, 1.25, 1.3, 1.4, 1.5],
      "2023": [1.1, 1.2, 1.3, 1.35, 1.25, 1.35, 1.45, 1.4, 1.3, 1.35, 1.45, 1.55],
      "2024": [1.08, 1.18, 1.28, 1.33, 1.23, 1.33, 1.43, 1.38, 1.28, 1.33, 1.43, 1.53]
    },
    "São Bernardo do Campo": {
      "2022": [0.85, 0.9, 1.05, 1.1, 1.0, 1.05, 1.15, 1.1, 1.05, 1.1, 1.15, 1.25],
      "2023": [0.9, 0.95, 1.1, 1.15, 1.05, 1.1, 1.2, 1.15, 1.1, 1.15, 1.2, 1.3],
      "2024": [0.88, 0.93, 1.08, 1.13, 1.03, 1.08, 1.18, 1.13, 1.08, 1.13, 1.18, 1.28]
    },
    "São Caetano do Sul": {
      "2022": [0.8, 0.85, 1.0, 1.05, 0.95, 1.0, 1.1, 1.05, 1.0, 1.05, 1.1, 1.2],
      "2023": [0.85, 0.9, 1.05, 1.1, 1.0, 1.05, 1.15, 1.1, 1.05, 1.1, 1.15, 1.25],
      "2024": [0.83, 0.88, 1.03, 1.08, 0.98, 1.03, 1.13, 1.08, 1.03, 1.08, 1.13, 1.23]
    },
    "São José do Rio Preto": {
      "2022": [0.6, 0.65, 0.75, 0.8, 0.7, 0.75, 0.85, 0.8, 0.75, 0.8, 0.85, 0.95],
      "2023": [0.65, 0.7, 0.8, 0.85, 0.75, 0.8, 0.9, 0.85, 0.8, 0.85, 0.9, 1.0],
      "2024": [0.63, 0.68, 0.78, 0.83, 0.73, 0.78, 0.88, 0.83, 0.78, 0.83, 0.88, 0.98]
    },
    "São José dos Campos": {
      "2022": [0.7, 0.75, 0.9, 0.95, 0.85, 0.9, 1.0, 0.95, 0.9, 0.95, 1.0, 1.1],
      "2023": [0.75, 0.8, 0.95, 1.0, 0.9, 0.95, 1.05, 1.0, 0.95, 1.0, 1.05, 1.15],
      "2024": [0.73, 0.78, 0.93, 0.98, 0.88, 0.93, 1.03, 0.98, 0.93, 0.98, 1.03, 1.13]
    },
    "São Vicente": {
      "2022": [0.55, 0.6, 0.7, 0.75, 0.65, 0.7, 0.8, 0.75, 0.7, 0.75, 0.8, 0.9],
      "2023": [0.6, 0.65, 0.75, 0.8, 0.7, 0.75, 0.85, 0.8, 0.75, 0.8, 0.85, 0.95],
      "2024": [0.58, 0.63, 0.73, 0.78, 0.68, 0.73, 0.83, 0.78, 0.73, 0.78, 0.83, 0.93]
    }
  };
  
// Labels do gráfico
const labels = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];


if(sessionStorage.getItem("TIPO_USUARIO") == "Comum") {
  document.getElementById("cadastroMenu").style.display = "none";
}

function redirecionarCadastro() {
    const fkEmpresa = sessionStorage.getItem("FK_EMPRESA");
  
    if (!fkEmpresa) {
      alert("Você precisa estar logado para continuar.");
      window.location.href = "login.html";
      return;
    }
  
    if (fkEmpresa == "1") {
      window.location.href = "cadastrarEmpresa.html";
    } else {
      window.location.href = "cadastrarUsuario.html";
    }
  };
// Função para criar o gráfico inicial
function criarGraficoInicial() {
    const cidadeSelecionada1 = document.getElementById('selectCidade1').value;
    const cidadeSelecionada2 = document.getElementById('selectCidade2').value;
    const cidadeSelecionada3 = document.getElementById('selectCidade3').value;
    const cidadeSelecionada4 = document.getElementById('selectCidade4').value;
    const anoSelecionado = document.getElementById('selectAno').value;

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
                    borderColor: 'rgba(225, 199, 032)',
                    backgroundColor: 'rgba(225, 199, 032, 0.5)',
                },
                {
                    label: cidadeSelecionada4,
                    data: dadosPorCidade[cidadeSelecionada4][anoSelecionado],
                    borderColor: 'rgb(24, 062, 135)',
                    backgroundColor: 'rgb(24, 062, 135, 0.5)',
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

    if (!dadosPorCidade[cidadeSelecionada1] || !dadosPorCidade[cidadeSelecionada2] || !dadosPorCidade[cidadeSelecionada3] || !dadosPorCidade[cidadeSelecionada4]) {
        return;
    }

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
