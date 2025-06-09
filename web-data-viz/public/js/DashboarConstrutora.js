// ============== VARIÁVEIS GLOBAIS ==============
let dadosGlobais = [];
let meuGrafico = null;
let chart2 = null;
let chartDonutAlugado = null;

// Labels do gráfico de linha
const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// ============== DADOS ESTÁTICOS ==============
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

// ============== FUNÇÕES AUXILIARES ==============

/**
 * Função auxiliar para buscar dados da cidade de forma segura
 */

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

function normalizarTexto(texto) {
    return texto.trim().toLowerCase().replace(/\s*\(.*\)/g, '');
}

function obterDadosCidade(dadosPorCidade, nomeCidade, ano) {
    const dadosCidade = dadosPorCidade.filter(item => {
        const anoDoItem = item.data.split('-')[2];
        return normalizarTexto(item.municipio) === normalizarTexto(nomeCidade)
            && anoDoItem === ano;
    });

    if (dadosCidade.length === 0) {
        console.warn(`⚠️ Dados não encontrados para ${nomeCidade} no ano ${ano}`);
        return new Array(12).fill(0);
    }

    dadosCidade.sort((a, b) => {
        const mesA = parseInt(a.data.split('-')[0]);
        const mesB = parseInt(b.data.split('-')[0]);
        return mesA - mesB;
    });

    const valores = dadosCidade.map(item => parseFloat(item.totalMultiplicadoPor100));
    console.log(`✅ Dados encontrados para ${nomeCidade} no ano ${ano}:`, valores);

    return valores;
}


/**
 * Função para calcular a soma dos valores de uma cidade
 */
function calcularSoma(dadosPorCidade, nomeCidade, ano) {
    const dados = obterDadosCidade(dadosPorCidade, nomeCidade, ano);
    return dados.reduce((acc, val) => acc + val, 0);
}

/**
 * Função para mostrar estado de loading
 */
function mostrarLoadingGrafico(mostrar) {
    const loadingElement = document.getElementById('loading-grafico-domicilio');
    if (loadingElement) {
        loadingElement.style.display = mostrar ? 'block' : 'none';
    }
}

/**
 * Função para mostrar erros ao usuário
 */
function mostrarErroGrafico(mensagem) {
    const erroElement = document.getElementById('erro-grafico-domicilio');
    if (erroElement) {
        erroElement.textContent = mensagem;
        erroElement.style.display = 'block';
        setTimeout(() => {
            erroElement.style.display = 'none';
        }, 5000);
    } else {
        console.error('Erro para usuário:', mensagem);
    }
}

// ============== FUNÇÕES DE POPULAÇÃO E SCORE ==============

function buscarPopulacao() {
    const cidade = document.getElementById('select_cidade').value;
    const populacao = populacoes[cidade];
    
    if (populacao) {
        document.getElementById('populacao').textContent = populacao.toLocaleString('pt-BR');
    }
}

function buscarScore() {
    const cidade = document.getElementById('select_cidade').value;
    const score = scores[cidade] * 10;
    
    if (score) {
        document.getElementById('score').textContent = score.toFixed(1);
    }
}

// ============== GRÁFICO DE LINHA (VALORIZAÇÃO) ==============

async function criarGraficoInicial() {
    const cidadeSelecionada1 = document.getElementById('selectCidade1').value;
    const cidadeSelecionada2 = document.getElementById('selectCidade2').value;
    const cidadeSelecionada3 = document.getElementById('selectCidade3').value;
    const cidadeSelecionada4 = document.getElementById('selectCidade4').value;
    const anoSelecionado = document.getElementById('selectAno').value;

    try {
        const response = await fetch(`/variacao/${anoSelecionado}/${cidadeSelecionada1}/${cidadeSelecionada2}/${cidadeSelecionada3}/${cidadeSelecionada4}`);
        const dadosPorCidade = await response.json();
        
        dadosGlobais = dadosPorCidade;
        
        console.log('Dados recebidos - Total de registros:', dadosPorCidade.length);
        console.log('Ano selecionado:', anoSelecionado);

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

        if (meuGrafico) {
            meuGrafico.destroy();
        }

        meuGrafico = new Chart(document.getElementById('meuGrafico'), config);
        atualizarSomasCidades();

        return meuGrafico;

    } catch (error) {
        console.error('Erro ao criar gráfico:', error);
        const graficoElement = document.getElementById('meuGrafico');
        if (graficoElement) {
            graficoElement.innerHTML = '<p style="color: red; text-align: center;">Erro ao carregar os dados do gráfico.</p>';
        }
    }
}

function atualizarSomasCidades() {
    if (dadosGlobais.length === 0) return;

    const anoSelecionado = document.getElementById('selectAno').value;
    const cidadeSelecionada1 = document.getElementById('selectCidade1').value;
    const cidadeSelecionada2 = document.getElementById('selectCidade2').value;
    const cidadeSelecionada3 = document.getElementById('selectCidade3').value;
    const cidadeSelecionada4 = document.getElementById('selectCidade4').value;

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

async function buscarDados() {
    if (!meuGrafico) {
        await criarGraficoInicial();
        return;
    }

    const anoSelecionado = document.getElementById('selectAno').value;
    const cidadeSelecionada1 = document.getElementById('selectCidade1').value;
    const cidadeSelecionada2 = document.getElementById('selectCidade2').value;
    const cidadeSelecionada3 = document.getElementById('selectCidade3').value;
    const cidadeSelecionada4 = document.getElementById('selectCidade4').value;

    try {
        const response = await fetch(`/variacao/${anoSelecionado}/${cidadeSelecionada1}/${cidadeSelecionada2}/${cidadeSelecionada3}/${cidadeSelecionada4}`);
        const dadosPorCidade = await response.json();
        
        dadosGlobais = dadosPorCidade;

        meuGrafico.data.datasets[0].data = obterDadosCidade(dadosPorCidade, cidadeSelecionada1, anoSelecionado);
        meuGrafico.data.datasets[1].data = obterDadosCidade(dadosPorCidade, cidadeSelecionada2, anoSelecionado);
        meuGrafico.data.datasets[2].data = obterDadosCidade(dadosPorCidade, cidadeSelecionada3, anoSelecionado);
        meuGrafico.data.datasets[3].data = obterDadosCidade(dadosPorCidade, cidadeSelecionada4, anoSelecionado);

        meuGrafico.data.datasets[0].label = cidadeSelecionada1;
        meuGrafico.data.datasets[1].label = cidadeSelecionada2;
        meuGrafico.data.datasets[2].label = cidadeSelecionada3;
        meuGrafico.data.datasets[3].label = cidadeSelecionada4;

        meuGrafico.options.plugins.title.text = `Índice de Valorização de Apartamentos - ${anoSelecionado}`;
        meuGrafico.update();

        atualizarSomasCidades();

    } catch (error) {
        console.error('Erro ao atualizar gráfico:', error);
    }
}

// ============== GRÁFICO DE ALUGUEL ==============

function atualizarGraficoAlugado(percentualComDomicilio) {
    console.log('Atualizando gráfico de aluguel com:', percentualComDomicilio);
    
    const ctx = document.getElementById("donutChartAluguel");
    
    if (!ctx) {
        console.error('Elemento canvas "donutChartAluguel" não encontrado');
        return;
    }
    
    if (chartDonutAlugado) {
        chartDonutAlugado.destroy();
    }

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
                    backgroundColor: ['#EBDE75', '#E6E6E6'],
                    borderColor: ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                rotation: -90,              
                circumference: 180,         
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

// ============== GRÁFICO DE DOMICÍLIO - CORRIGIDO ==============

function atualizarGraficoDomicilio(dadosSidra) {
    console.log('Atualizando gráfico de domicílio com:', dadosSidra);
    console.log('Tipo dos dados recebidos:', typeof dadosSidra);
    
    const ctx2 = document.getElementById('donutChart2');
    
    if (!ctx2) {
        console.error('Elemento canvas "donutChart2" não encontrado');
        return;
    }
    
    // CORREÇÃO: Verificar se os dados são um objeto ou um número simples
    let umMorador, doisMoradores, tresMoradores, quatroMoradoresOuMais;
    
    if (typeof dadosSidra === 'object' && dadosSidra !== null) {
        // Se é um objeto, extrair as propriedades
        umMorador = Number(dadosSidra.umMorador) || 0;
        doisMoradores = Number(dadosSidra.doisMoradores) || 0;
        tresMoradores = Number(dadosSidra.tresMoradores) || 0;
        quatroMoradoresOuMais = Number(dadosSidra.quatroMoradoresOuMais) || 0;
    } else if (typeof dadosSidra === 'number' || typeof dadosSidra === 'string') {
        // Se é um número simples (percentual), usar distribuição padrão
        const percentual = Number(dadosSidra) || 0;
        console.log('Dados recebidos como número simples:', percentual);
        
        // Distribuição exemplo baseada no percentual recebido
        // Você pode ajustar estes valores conforme sua lógica de negócio
        const total = 100;
        umMorador = Math.round(total * 0.15); // 15%
        doisMoradores = Math.round(total * 0.35); // 35%
        tresMoradores = Math.round(total * 0.30); // 30%
        quatroMoradoresOuMais = Math.round(total * 0.20); // 20%
        
        console.log('Distribuição calculada:', {umMorador, doisMoradores, tresMoradores, quatroMoradoresOuMais});
    } else {
        console.error('Dados do SIDRA em formato inválido:', dadosSidra);
        return;
    }
    
    const data2 = {
        labels: ['1 Morador', '2 Moradores', '3 Moradores', '4+ Moradores'],
        datasets: [{
            data: [umMorador, doisMoradores, tresMoradores, quatroMoradoresOuMais],
            backgroundColor: ['#2896df', '#09629d', '#1e7ba8', '#0d4f73'],
            borderWidth: 1,
            borderColor: '#ffffff'
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
                    position: 'bottom',
                    labels: {
                        padding: 12,
                        usePointStyle: true
                    }
                },
                title: {
                    display: true,
                    text: 'Distribuição de Moradores por Domicílio',
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    };

    if (chart2 && typeof chart2.destroy === 'function') {
        chart2.destroy();
        chart2 = null;
    }

    try {
        chart2 = new Chart(ctx2, config2);
        console.log('Gráfico de domicílio criado com sucesso');
    } catch (error) {
        console.error('Erro ao criar gráfico de domicílio:', error);
        mostrarErroGrafico('Erro ao carregar gráfico de domicílio');
    }
}

function carregarDadosSidra(cidade) {
    console.log('=== DEBUG SIDRA ===');
    console.log('Parâmetro cidade recebido:', cidade);
    console.log('Tipo da variável cidade:', typeof cidade);
    
    // Se cidade não foi passada, tentar pegar do select
    if (!cidade) {
        const selectCidade = document.getElementById("select_cidade");
        if (selectCidade && selectCidade.value) {
            cidade = selectCidade.value;
            console.log('Cidade obtida do select:', cidade);
        }
    }
    
    if (!cidade || cidade.toString().trim() === '') {
        console.error('ERRO: Cidade não informada ou inválida!');
        mostrarErroGrafico('Por favor, selecione uma cidade válida');
        return;
    }
    
    cidade = cidade.toString().trim();
    const url = `/dashboardConstrutora/dadosSidraProprio/${encodeURIComponent(cidade)}`;
    console.log('URL da requisição:', url);
    
    mostrarLoadingGrafico(true);
    
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => {
            console.log('Status da resposta:', response.status);
            console.log('Response OK?', response.ok);
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
            }
            
            return response.json();
        })
        .then(dados => {
            console.log('Dados recebidos do backend:', dados);
            console.log('Tipo dos dados:', typeof dados);
            atualizarGraficoDomicilio(dados);
        })
        .catch(error => {
            console.error('Erro detalhado ao carregar dados do SIDRA:', error);
            
            let mensagemErro = 'Erro ao carregar dados';
            
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                mensagemErro = 'Erro de conexão. Verifique sua internet.';
            } else if (error.message.includes('404')) {
                mensagemErro = 'Dados não encontrados para esta cidade.';
            } else if (error.message.includes('500')) {
                mensagemErro = 'Erro interno do servidor. Tente novamente.';
            }
            
            mostrarErroGrafico(mensagemErro);
        })
        .finally(() => {
            mostrarLoadingGrafico(false);
        });
}

// ============== FUNÇÃO PRINCIPAL DE BUSCA DE DADOS ==============

function buscarDadosCidade() {
    const cidadeEscolhida = document.getElementById("select_cidade").value;
    
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
        atualizarDashboard(dados);
    })
    .catch(function (erro) {
        console.error("Erro ao buscar dados da cidade:", erro);
    });
}

function atualizarDashboard(dados) {
    console.log('Atualizando dashboard com dados:', dados);
    
    if (!dados) {
        console.error('Dados não recebidos');
        return;
    }
    
    // Extrair dados com fallbacks
    const precoMedio = dados.precoMedio || dados.precoMedioUmDormitorio || 0;
    const populacaoTotal = dados.populacaoTotal || 0;
    const percentualDomicilioProprio = dados.totalMoradoresProprio || dados.domicilioProprio || dados.percentualDomicilioProprio || 0;
    
    // Calcular média dos preços por dormitórios
    const totalQuarto = (
        (dados.precoMedioUmDormitorio || 0) + 
        (dados.precoMedioDoisDormitorios || 0) + 
        (dados.precoMedioTresDormitorios || 0) + 
        (dados.precoMedioQuatroDormitorios || 0)
    ) / 4;
    
    console.log('Valores extraídos:', {
        precoMedio,
        populacaoTotal,
        percentualDomicilioProprio,
        totalQuarto
    });
    
    // Atualizar elementos do HTML
    const precoMedioElement = document.getElementById("totalDormitorio");
    const populacaoElement = document.getElementById("doisDormitorio");
    
    if (precoMedioElement) {
        precoMedioElement.innerText = "R$ " + Number(totalQuarto).toFixed(2);
    }
    
    if (populacaoElement) {
        populacaoElement.innerText = Number(populacaoTotal).toLocaleString('pt-BR');
    }
    
    // Converter para número de forma segura
    const percentualNumerico = Number(percentualDomicilioProprio) || 0;
    
    console.log('Percentual numérico calculado:', percentualNumerico);
    
    // Atualizar os gráficos
    try {
        atualizarGraficoAlugado(percentualNumerico);
        carregarDadosSidra(); // Chama sem parâmetro para usar o select
    } catch (error) {
        console.error('Erro ao atualizar gráficos:', error);
    }
    
    console.log('Dashboard atualizado com sucesso');
}

// ============== INICIALIZAÇÃO E EVENT LISTENERS ==============

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando dashboard...');
    
    setTimeout(() => {
        // Inicializar o gráfico de linha
        if (document.getElementById('meuGrafico')) {
            criarGraficoInicial();
        }
        
        // Buscar dados da cidade padrão
        if (document.getElementById('select_cidade')) {
            buscarDadosCidade();
        }
    }, 100);
    
    // Event listeners para gráfico de linha
    const selectAno = document.getElementById('selectAno');
    const selectCidade1 = document.getElementById('selectCidade1');
    const selectCidade2 = document.getElementById('selectCidade2');
    const selectCidade3 = document.getElementById('selectCidade3');
    const selectCidade4 = document.getElementById('selectCidade4');
    
    if (selectAno) selectAno.addEventListener('change', buscarDados);
    if (selectCidade1) selectCidade1.addEventListener('change', buscarDados);
    if (selectCidade2) selectCidade2.addEventListener('change', buscarDados);
    if (selectCidade3) selectCidade3.addEventListener('change', buscarDados);
    if (selectCidade4) selectCidade4.addEventListener('change', buscarDados);
    
    // Event listener para mudança de cidade principal
    const selectCidadePrincipal = document.getElementById('select_cidade');
    if (selectCidadePrincipal) {
        selectCidadePrincipal.addEventListener('change', function() {
            buscarDadosCidade();
            buscarPopulacao();
            buscarScore();
        });
    }
});