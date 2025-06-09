
// Labels do gráfico
const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// Variável global para armazenar os dados da API
let dadosGlobais = [];
let meuGrafico = null;

// Função auxiliar para buscar dados da cidade de forma segura
function obterDadosCidade(dadosPorCidade, nomeCidade, ano) {
    // Filtrar todos os registros da cidade específica para o ano específico
    const dadosCidade = dadosPorCidade.filter(item => {
        // Extrair o ano da data (assumindo formato '01-01-2022')
        const anoDoItem = item.data.split('-')[2];
        return item.municipio === nomeCidade && anoDoItem === ano;
    });
    
    if (dadosCidade.length === 0) {
        console.warn(`Dados não encontrados para ${nomeCidade} no ano ${ano}`);
        return new Array(12).fill(0); // Array com 12 zeros
    }
    
    // Ordenar por mês (extrair mês da data '01-01-2022' -> mês = '01')
    dadosCidade.sort((a, b) => {
        const mesA = parseInt(a.data.split('-')[0]);
        const mesB = parseInt(b.data.split('-')[0]);
        return mesA - mesB;
    });
    
    // Extrair os valores e converter para números
    const valores = dadosCidade.map(item => parseFloat(item.totalMultiplicadoPor100));
    
    console.log(`Dados encontrados para ${nomeCidade} no ano ${ano}:`, valores);
    
    return valores;
}

// Função para calcular a soma dos valores de uma cidade
function calcularSoma(dadosPorCidade, nomeCidade, ano) {
    const dados = obterDadosCidade(dadosPorCidade, nomeCidade, ano);
    return dados.reduce((acc, val) => acc + val, 0);
}


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
async function criarGraficoInicial() {
    const cidadeSelecionada1 = document.getElementById('selectCidade1').value;
    const cidadeSelecionada2 = document.getElementById('selectCidade2').value;
    const cidadeSelecionada3 = document.getElementById('selectCidade3').value;
    const cidadeSelecionada4 = document.getElementById('selectCidade4').value;
    const anoSelecionado = document.getElementById('selectAno').value;

    try {
        const response = await fetch(`/variacao/${anoSelecionado}/${cidadeSelecionada1}/${cidadeSelecionada2}/${cidadeSelecionada3}/${cidadeSelecionada4}`);
        const dadosPorCidade = await response.json();
        
        // Armazenar dados globalmente para uso em outras funções
        dadosGlobais = dadosPorCidade;
        
        // DEBUG: Verificar estrutura dos dados
        console.log('Dados recebidos - Total de registros:', dadosPorCidade.length);
        console.log('Ano selecionado:', anoSelecionado);
        console.log('Cidades encontradas:', [...new Set(dadosPorCidade.map(item => item.municipio))]);
        console.log('Anos encontrados:', [...new Set(dadosPorCidade.map(item => item.data.split('-')[2]))]);
        
        // Debug adicional: verificar dados filtrados por ano
        const dadosDoAno = dadosPorCidade.filter(item => item.data.split('-')[2] === anoSelecionado);
        console.log(`Registros encontrados para o ano ${anoSelecionado}:`, dadosDoAno.length);

        const config = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: cidadeSelecionada1,
                        data: obterDadosCidade(dadosPorCidade, cidadeSelecionada1, anoSelecionado),
                        borderColor: 'rgb(124, 42, 163)',
                        backgroundColor: 'rgba(77, 44, 91, 0.5)',
                    },
                    {
                        label: cidadeSelecionada2,
                        data: obterDadosCidade(dadosPorCidade, cidadeSelecionada2, anoSelecionado),
                        borderColor: '#36a2eb',
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    },
                    {
                        label: cidadeSelecionada3,
                        data: obterDadosCidade(dadosPorCidade, cidadeSelecionada3, anoSelecionado),
                        borderColor: 'rgba(225, 199, 32)',
                        backgroundColor: 'rgba(225, 199, 32, 0.5)',
                    },
                    {
                        label: cidadeSelecionada4,
                        data: obterDadosCidade(dadosPorCidade, cidadeSelecionada4, anoSelecionado),
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
                        text: `Índice de Valorização de Apartamentos - ${anoSelecionado}`,
                    }
                }
            }
        };

        // Se já existe um gráfico, destroi antes de criar novo
        if (meuGrafico) {
            meuGrafico.destroy();
        }

        meuGrafico = new Chart(
            document.getElementById('meuGrafico'),
            config
        );

        // Atualizar as somas das cidades
        atualizarSomasCidades();

        return meuGrafico;

    } catch (error) {
        console.error('Erro ao criar gráfico:', error);
        console.error('Stack trace:', error.stack);
        
        // Mostrar erro para o usuário
        const graficoElement = document.getElementById('meuGrafico');
        if (graficoElement) {
            graficoElement.innerHTML = '<p style="color: red; text-align: center;">Erro ao carregar os dados do gráfico. Verifique o console para mais detalhes.</p>';
        }
    }
}

// Função para atualizar as somas das cidades
function atualizarSomasCidades() {
    if (dadosGlobais.length === 0) return;

    const anoSelecionado = document.getElementById('selectAno').value;
    const cidadeSelecionada1 = document.getElementById('selectCidade1').value;
    const cidadeSelecionada2 = document.getElementById('selectCidade2').value;
    const cidadeSelecionada3 = document.getElementById('selectCidade3').value;
    const cidadeSelecionada4 = document.getElementById('selectCidade4').value;

    // Atualizar as somas nas spans (se existirem)
    const somaCidade1Element = document.getElementById('somaCidade1');
    const somaCidade2Element = document.getElementById('somaCidade2');
    const somaCidade3Element = document.getElementById('somaCidade3');
    const somaCidade4Element = document.getElementById('somaCidade4');

    if (somaCidade1Element) {
        const soma1 = calcularSoma(dadosGlobais, cidadeSelecionada1, anoSelecionado);
        somaCidade1Element.textContent = `${cidadeSelecionada1}: +${soma1.toFixed(2)}%`;
    }
    
    if (somaCidade2Element) {
        const soma2 = calcularSoma(dadosGlobais, cidadeSelecionada2, anoSelecionado);
        somaCidade2Element.textContent = `${cidadeSelecionada2}: +${soma2.toFixed(2)}%`;
    }
    
    if (somaCidade3Element) {
        const soma3 = calcularSoma(dadosGlobais, cidadeSelecionada3, anoSelecionado);
        somaCidade3Element.textContent = `${cidadeSelecionada3}: +${soma3.toFixed(2)}%`;
    }
    
    if (somaCidade4Element) {
        const soma4 = calcularSoma(dadosGlobais, cidadeSelecionada4, anoSelecionado);
        somaCidade4Element.textContent = `${cidadeSelecionada4}: +${soma4.toFixed(2)}%`;
    }
}

// Função para atualizar o gráfico quando qualquer opção mudar
async function buscarDados() {
    if (!meuGrafico) {
        // Se o gráfico não existe, cria um novo
        await criarGraficoInicial();
        return;
    }

    const anoSelecionado = document.getElementById('selectAno').value;
    const cidadeSelecionada1 = document.getElementById('selectCidade1').value;
    const cidadeSelecionada2 = document.getElementById('selectCidade2').value;
    const cidadeSelecionada3 = document.getElementById('selectCidade3').value;
    const cidadeSelecionada4 = document.getElementById('selectCidade4').value;

    try {
        // Buscar novos dados da API
        const response = await fetch(`/variacao/${anoSelecionado}/${cidadeSelecionada1}/${cidadeSelecionada2}/${cidadeSelecionada3}/${cidadeSelecionada4}`);
        const dadosPorCidade = await response.json();
        
        // Atualizar dados globais
        dadosGlobais = dadosPorCidade;

        // Debug para verificar se os dados foram atualizados
        console.log('Dados atualizados para o ano:', anoSelecionado);
        console.log('Registros recebidos:', dadosPorCidade.length);

        // Atualizar os dados do gráfico
        meuGrafico.data.datasets[0].data = obterDadosCidade(dadosPorCidade, cidadeSelecionada1, anoSelecionado);
        meuGrafico.data.datasets[1].data = obterDadosCidade(dadosPorCidade, cidadeSelecionada2, anoSelecionado);
        meuGrafico.data.datasets[2].data = obterDadosCidade(dadosPorCidade, cidadeSelecionada3, anoSelecionado);
        meuGrafico.data.datasets[3].data = obterDadosCidade(dadosPorCidade, cidadeSelecionada4, anoSelecionado);

        // Atualizar as labels do gráfico
        meuGrafico.data.datasets[0].label = cidadeSelecionada1;
        meuGrafico.data.datasets[1].label = cidadeSelecionada2;
        meuGrafico.data.datasets[2].label = cidadeSelecionada3;
        meuGrafico.data.datasets[3].label = cidadeSelecionada4;

        // Atualizar o título do gráfico com o ano
        meuGrafico.options.plugins.title.text = `Índice de Valorização de Apartamentos - ${anoSelecionado}`;

        // Atualizar o gráfico
        meuGrafico.update();

        // Atualizar as somas das cidades
        atualizarSomasCidades();

    } catch (error) {
        console.error('Erro ao atualizar gráfico:', error);
    }
}

// ============== GRÁFICO DE DOMICÍLIO PRÓPRIO ==============

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
        chart2.destroy();
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
    
    const mediaMoradoresElement = document.getElementById("mediaMoradores");
    const umDormitorioElement = document.getElementById("umDormitorio");
    const doisDormitorioElement = document.getElementById("doisDormitorio");
    const tresDormitorioElement = document.getElementById("tresDormitorio");
    const quatroDormitorioElement = document.getElementById("quatroDormitorio");
    
    if (mediaMoradoresElement) mediaMoradoresElement.innerText = mediaFormatada.toFixed(2);
    if (umDormitorioElement) umDormitorioElement.innerText = "R$ " + preco1quarto.toFixed(2);
    if (doisDormitorioElement) doisDormitorioElement.innerText = "R$ " + preco2quarto.toFixed(2);
    if (tresDormitorioElement) tresDormitorioElement.innerText = "R$ " + preco3quarto.toFixed(2);
    if (quatroDormitorioElement) quatroDormitorioElement.innerText = "R$ " + preco4quarto.toFixed(2);
    
    // Atualiza o gráfico de Domicílio Próprio
    atualizarGraficoDomicilio(Number(dados.totalMoradoresProprio));
}

// ============== INICIALIZAÇÃO ==============

// Inicializar gráfico quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que os elementos estejam prontos
    setTimeout(() => {
        criarGraficoInicial();
    }, 100);
});