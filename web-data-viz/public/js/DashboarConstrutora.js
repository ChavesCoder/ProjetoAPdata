// População total mockoda



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

// ============== GRÁFICO DE ALUGUEL - VERSÃO CORRIGIDA ==============

let chartDonutAlugado;

function atualizarGraficoAlugado(percentualComDomicilio) {
    console.log('Atualizando gráfico de aluguel com:', percentualComDomicilio);
    
    const ctx = document.getElementById("donutChartAluguel");
    
    // Verifica se o elemento canvas existe
    if (!ctx) {
        console.error('Elemento canvas "donutChartAluguel" não encontrado');
        return;
    }
    
    // Destrói o gráfico anterior se existir
    if (chartDonutAlugado) {
        chartDonutAlugado.destroy();
    }

    // Converte para número e calcula as porcentagens
    const comDomicilio = Number(percentualComDomicilio) || 0;
    const semDomicilio = 100 - comDomicilio;
    
    const dados = [comDomicilio, semDomicilio];

    try {
        chartDonutAlugado = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Com Domicílio Próprio', 'Sem Domicílio Próprio'],
                datasets: [{
                    data: dados,
                    backgroundColor: [
                        '#EBDE75',    
                        '#E6E6E6',      
                    ],
                    borderColor: [
                        'rgba(255, 255, 255, 1)',
                        'rgba(255, 255, 255, 1)',
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                rotation: -100,              
                circumference: 200,         
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                cutout: 60
            }
        });
        
        console.log('Gráfico de aluguel criado com sucesso');
        
    } catch (error) {
        console.error('Erro ao criar gráfico de aluguel:', error);
    }
}

// ============== GRÁFICO DE DOMICÍLIO PRÓPRIO ==============

let chart2; 

function atualizarGraficoDomicilio(dadosSidra) {
    console.log('Atualizando gráfico de domicílio com:', dadosSidra);
    
    const ctx2 = document.getElementById('donutChart2');
    
    if (!ctx2) {
        console.error('Elemento canvas "donutChart2" não encontrado');
        return;
    }
    
    // Extraindo os valores dos dados retornados pela query
    const umMorador = Number(dadosSidra.umMorador) || 0;
    const doisMoradores = Number(dadosSidra.doisMoradores) || 0;
    const tresMoradores = Number(dadosSidra.tresMoradores) || 0;
    const quatroMoradoresOuMais = Number(dadosSidra.quatroMoradoresOuMais) || 0;
    
    const data2 = {
        labels: ['1 Morador', '2 Moradores', '3 Moradores', '4+ Moradores'],
        datasets: [{
            data: [umMorador, doisMoradores, tresMoradores, quatroMoradoresOuMais],
            backgroundColor: ['#2896df', '#09629d', '#1e7ba8', '#0d4f73'],
            borderWidth: 1
        }]
    };

    const config2 = {
        type: 'doughnut',
        data: data2,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Distribuição de Moradores por Domicílio',
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed;
                        }
                    }
                },
            }
        }
    };

    // Se o gráfico já existir, destrói o antigo antes de criar um novo
    if (chart2) {
        chart2.destroy();
    }

    try {
        // Cria o gráfico com os novos dados
        chart2 = new Chart(ctx2, config2);
        console.log('Gráfico de domicílio criado com sucesso');
    } catch (error) {
        console.error('Erro ao criar gráfico de domicílio:', error);
    }
}

// Função para fazer a requisição e atualizar o gráfico
function carregarDadosSidra(cidade) {
    var cidadeEscolhida = document.getElementById("select_cidade").value;
    console.log('=== DEBUG SIDRA ===');
    console.log('Tipo da variável cidade:', typeof cidade);
    console.log('Valor da variável cidade:', cidade);
    console.log('Cidade está undefined?', cidade === undefined);
    console.log('Cidade está null?', cidade === null);
    console.log('Cidade está vazia?', cidade === '');
    
    if (!cidade) {
        console.log('ERRO: Cidade não informada!');
        return;
    }
    
    const url = `/dashboardConstrutora/dadosSidraProprio/${cidade}`;
    console.log('URL da requisição:', url);
    
    fetch(url)
        .then(response => {
            console.log('Status da resposta:', response.status);
            console.log('Response OK?', response.ok);
            console.log('Headers da resposta:', response.headers);
            
            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.status);
            }
            
            // Verificar se a resposta tem conteúdo antes de tentar fazer JSON
            return response.text().then(text => {
                console.log('Resposta como texto:', text);
                if (!text) {
                    throw new Error('Resposta vazia do servidor');
                }
                try {
                    return JSON.parse(text);
                } catch (error) {
                    console.error('Erro ao fazer parse do JSON:', error);
                    console.error('Texto recebido:', text);
                    throw new Error('Resposta não é um JSON válido');
                }
            });
        })
        .then(dados => {
            console.log('Dados recebidos do backend:', dados);
            console.log('Tipo dos dados:', typeof dados);
            atualizarGraficoDomicilio(dados);
        })
        .catch(error => {
            console.error('Erro detalhado ao carregar dados do SIDRA:', error);
            console.error('Stack trace:', error.stack);
        });
}
// ============== FUNÇÃO PARA BUSCAR DADOS DA CIDADE - CORRIGIDA ==============

function buscarDadosCidade() {
    var cidadeEscolhida = document.getElementById("select_cidade").value;
    
    console.log('Buscando dados para a cidade:', cidadeEscolhida);
  
    fetch(`/dashboard/dadosCidade/${cidadeEscolhida}`, {
        method: "GET"
    })
    .then(function (resposta) {
        if (resposta.ok) {
            return resposta.json();
        } else {
            throw new Error(`Erro na resposta: ${resposta.status} - ${resposta.statusText}`);
        }
    })
    .then(function (dados) {
        console.log('Dados recebidos da API:', dados);
        // Atualiza o dashboard e os gráficos com os dados
        atualizarDashboard(dados);
    })
    .catch(function (erro) {
        console.error("Erro ao buscar dados da cidade:", erro);
    });
}


// ============== FUNÇÃO PARA ATUALIZAR DASHBOARD - CORRIGIDA ==============

function atualizarDashboard(dados) {

    let mediaFormatada = Number(dados.mediaDomicilio);
    let preco1quarto = dados.precoMedioUmDormitorio;
    let preco2quarto = dados.precoMedioDoisDormitorios;
    let preco3quarto = dados.precoMedioTresDormitorios;
    let preco4quarto = dados.precoMedioQuatroDormitorios

    const totalQuarto = (dados.precoMedioUmDormitorio + dados.precoMedioDoisDormitorios + dados.precoMedioTresDormitorios + dados.precoMedioQuatroDormitorios) / 4;
    console.log('Atualizando dashboard com dados:', dados);
    
    // Verificar se os dados existem
    if (!dados) {
        console.error('Dados não recebidos');
        return;
    }
    
    // Extrair e formatar os dados de forma segura
    const precoMedio = dados.precoMedio || dados.precoMedioUmDormitorio || 0;
    const populacaoTotal = dados.populacaoTotal || 0;
    const percentualDomicilioProprio = dados.totalMoradoresProprio || dados.domicilioProprio || dados.percentualDomicilioProprio || 0;
    //const scoreValue = dados.score || 0;
    
    console.log('Valores extraídos:', {
        precoMedio,
        populacaoTotal,
        percentualDomicilioProprio,
   //     scoreValue
    });
    
    // Atualizar elementos do HTML
    const precoMedioElement = document.getElementById("totalDormitorio");
    const populacaoElement = document.getElementById("doisDormitorio");
  //  const scoreElement = document.getElementById("score");
    
    if (precoMedioElement) {
        precoMedioElement.innerText = "R$ " + Number(totalQuarto).toFixed(2);
    }
    
    if (populacaoElement) {
        populacaoElement.innerText = Number(populacaoTotal).toLocaleString('pt-BR');
    }
    
  //  if (scoreElement) {
  //      scoreElement.innerText = Number(scoreValue).toFixed(1);
  //  }
    
    // Converter para número de forma segura
    const percentualNumerico = Number(percentualDomicilioProprio) || 0;
    
    console.log('Percentual numérico calculado:', percentualNumerico);
    
    // Atualizar os gráficos com os dados corretos
    try {
        atualizarGraficoDomicilio(percentualNumerico);
        atualizarGraficoAlugado(percentualNumerico);
    } catch (error) {
        console.error('Erro ao atualizar gráficos:', error);
    }
    
    console.log('Dashboard atualizado com sucesso');
}

// ============== INICIALIZAÇÃO ==============

// Inicializar gráfico quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando dashboard...');
    
    // Aguardar um pouco para garantir que os elementos estejam prontos
    setTimeout(() => {
        // Inicializar o gráfico de linha
        criarGraficoInicial();
        
        // Buscar dados da cidade padrão
        buscarDadosCidade();
    }, 100);
});

// Adicionar listeners para mudanças nos selects
document.addEventListener('DOMContentLoaded', function() {
    const selectAno = document.getElementById('selectAno');
    const selectCidade1 = document.getElementById('selectCidade1');
    const selectCidade2 = document.getElementById('selectCidade2');
    const selectCidade3 = document.getElementById('selectCidade3');
    const selectCidade4 = document.getElementById('selectCidade4');
    
    // Adicionar listeners para os selects do gráfico de linha
    if (selectAno) selectAno.addEventListener('change', buscarDados);
    if (selectCidade1) selectCidade1.addEventListener('change', buscarDados);
    if (selectCidade2) selectCidade2.addEventListener('change', buscarDados);
    if (selectCidade3) selectCidade3.addEventListener('change', buscarDados);
    if (selectCidade4) selectCidade4.addEventListener('change', buscarDados);
});



function buscarPopulacao() {
            const cidade = document.getElementById('select_cidade').value;

            const populacoes = {
                "São Paulo": 11696491,
                "Barueri": 276982,
                "Campinas": 1213792,
                "Diadema": 426757,
                "Guarujá": 322750,
                "Guarulhos": 1392121,
                "Osasco": 743212,
                "Praia Grande": 330845,
                "Ribeirão Preto": 720116,
                "Santo André": 721368,
                "Santos": 433311,
                "São Bernardo do Campo": 844483,
                "São Caetano do Sul": 165558,
                "São José do Rio Preto": 484752,
                "São José dos Campos": 737310,
                "São Vicente": 368355
            };

            const populacao = populacoes[cidade];

            document.getElementById('populacao').textContent = populacao.toLocaleString('pt-BR') + " habitantes";
        }



function buscarScore() {
            const cidade = document.getElementById('select_cidade').value;

            const scores = {
                "Santos": 0.948,
                "Praia Grande": 0.813,
                "São José dos Campos": 0.702,
                "Barueri": 0.651,
                "Osasco": 0.595,
                "Campinas": 0.583,
                "Guarujá": 0.576,
                "Ribeirão Preto": 0.42,
                "São Bernardo do Campo": 0.417,
                "Guarulhos": 0.41,
                "São Vicente": 0.4,
                "Diadema": 0.372,
                "São Caetano do Sul": 0.346,
                "Santo André": 0.326,
                "São Paulo": 0.595,
                "São José do Rio Preto": 0.22
            };
            const score = scores[cidade] * 10;

            document.getElementById('score').textContent = score.toLocaleString('pt-BR') + "";
        }

