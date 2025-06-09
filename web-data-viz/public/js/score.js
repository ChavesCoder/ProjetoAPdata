/**
 * Calculadora de Score Composto por Região - VERSÃO COMPLETA
 * Combina crescimento de preços imobiliários com indicadores socioeconômicos
 */

console.log('=== CALCULADORA DE SCORE REGIONAL ===');

// ============== FUNÇÕES PRINCIPAIS ==============

function calculaScoreRegional(fipeData, sidraData) {
  console.log('\n=== INICIANDO CÁLCULO DO SCORE ===');
  
  // Verificar se sidraData não está vazio
  console.log('1. Verificando dados socioeconômicos:');
  console.log(`   - Quantidade de registros: ${sidraData.length}`);
  
  if (sidraData.length === 0) {
    console.log('   ❌ ERRO: sidraData está vazio!');
    return [];
  }
  
  // 1. Calcular crescimento percentual dos preços por região
  const aumentoPrecoRegiao = calculaAumentoPreco(fipeData);
  
  // 2. Normalizar os dados para escala 0-1
  const normalizaAumentoPreco = normalizaDados(aumentoPrecoRegiao);
  const normalizaSocioEconomico = normalizaDados(sidraData, 'morandoAlugado');
  
  // 3. Combinar os scores com pesos
  const scoreCombinado = combinaScores(normalizaAumentoPreco, normalizaSocioEconomico);
  
  return scoreCombinado;
}

function calculaAumentoPreco(fipeData) {
  const regionGrowth = {};
  
  // Agrupar dados por região
  const dataByRegion = fipeData.reduce((acc, item) => {
    if (!acc[item.regiao]) {
      acc[item.regiao] = [];
    }
    acc[item.regiao].push({
      date: new Date(item.date + '-01'),
      price: item.price_m2
    });
    return acc;
  }, {});
  
  // Calcular crescimento para cada região
  Object.keys(dataByRegion).forEach(regiao => {
    const regionData = dataByRegion[regiao].sort((a, b) => a.date - b.date);
    
    if (regionData.length >= 2) {
      // Crescimento simples (primeiro vs último)
      const oldestPrice = regionData[0].price;
      const newestPrice = regionData[regionData.length - 1].price;
      const simpleGrowthRate = ((newestPrice - oldestPrice) / oldestPrice) * 100;
      
      // Taxa de crescimento média mensal
      const totalMonths = regionData.length - 1;
      const monthlyGrowthRate = Math.pow(newestPrice / oldestPrice, 1 / totalMonths) - 1;
      const annualizedGrowthRate = (Math.pow(1 + monthlyGrowthRate, 12) - 1) * 100;
      
      // Volatilidade dos preços
      const prices = regionData.map(d => d.price);
      const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
      const variance = prices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / prices.length;
      const volatility = Math.sqrt(variance) / avgPrice * 100;
      
      // Tendência linear
      const trend = calculateLinearTrend(regionData);
      
      regionGrowth[regiao] = {
        regiao: regiao,
        priceGrowth: simpleGrowthRate,
        monthlyGrowth: monthlyGrowthRate * 100,
        annualizedGrowth: annualizedGrowthRate,
        volatility: volatility,
        trend: trend,
        dataPoints: regionData.length
      };
    }
  });
  
  return Object.values(regionGrowth);
}

function calculateLinearTrend(regionData) {
  const n = regionData.length;
  if (n < 2) return 0;
  
  const dataPoints = regionData.map((item, index) => ({
    x: index,
    y: item.price
  }));
  
  const sumX = dataPoints.reduce((sum, point) => sum + point.x, 0);
  const sumY = dataPoints.reduce((sum, point) => sum + point.y, 0);
  const sumXY = dataPoints.reduce((sum, point) => sum + (point.x * point.y), 0);
  const sumXX = dataPoints.reduce((sum, point) => sum + (point.x * point.x), 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const avgPrice = sumY / n;
  return (slope / avgPrice) * 100;
}

function normalizaDados(data, valueKey = null) {
  if (data.length === 0) return [];
  
  // Determinar qual campo usar para normalização
  let getValue;
  if (valueKey) {
    getValue = (item) => item[valueKey];
  } else {
    getValue = (item) => item.annualizedGrowth !== undefined ? item.annualizedGrowth : item.priceGrowth;
  }
  
  const values = data.map(getValue);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  
  // Evitar divisão por zero
  if (range === 0) {
    return data.map(item => ({
      regiao: item.regiao,
      normalizedValue: 0.5
    }));
  }
  
  return data.map(item => ({
    regiao: item.regiao,
    normalizedValue: (getValue(item) - min) / range,
    originalValue: getValue(item)
  }));
}

function combinaScores(priceGrowthData, socioeconomicData, weights = { price: 0.6, socio: 0.4 }) {
  const scores = [];
  
  console.log('\n2. Combinando scores...');
  console.log(`   - Regiões com dados de preço: ${priceGrowthData.length}`);
  console.log(`   - Regiões com dados socioeconômicos: ${socioeconomicData.length}`);
  
  // Criar um mapa dos dados socioeconômicos para acesso rápido
  const socioMap = socioeconomicData.reduce((acc, item) => {
    acc[item.regiao] = item.normalizedValue;
    return acc;
  }, {});
  
  console.log('   - Regiões socioeconômicas disponíveis:', Object.keys(socioMap));
  
  // Combinar scores para cada região que tem dados de preço
  let matchCount = 0;
  priceGrowthData.forEach(priceItem => {
    const regiao = priceItem.regiao;
    const socioValue = socioMap[regiao];
    
    if (socioValue !== undefined) {
      matchCount++;
      // Calcular score composto
      const compositeScore = (
        priceItem.normalizedValue * weights.price +
        socioValue * weights.socio
      );
      
      scores.push({
        regiao: regiao,
        score: Math.round(compositeScore * 1000) / 1000
      });
    } else {
      console.log(`   ❌ Região "${regiao}" não encontrada nos dados socioeconômicos`);
    }
  });
  
  console.log(`   ✅ ${matchCount} regiões combinadas com sucesso`);
  
  // Ordenar por score decrescente
  return scores.sort((a, b) => b.score - a.score);
}

// Função utilitária para análise detalhada
function getDetailedAnalysis(fipeData, sidraData) {
  console.log('\n=== ANÁLISE DETALHADA ===');
  
  const priceGrowth = calculaAumentoPreco(fipeData);
  const normalizedPrice = normalizaDados(priceGrowth);
  const normalizedSocio = normalizaDados(sidraData, 'morandoAlugado');
  
  console.log('\n1. Crescimento de Preços por Região:');
  priceGrowth.forEach(item => {
    console.log(`${item.regiao}: ${item.priceGrowth.toFixed(2)}% (${item.dataPoints} pontos)`);
  });
  
  console.log('\n2. Dados Socioeconômicos:');
  if (sidraData.length > 0) {
    sidraData.forEach(item => {
      console.log(`${item.regiao}: ${item.morandoAlugado}% morando alugado`);
    });
  } else {
    console.log('   ⚠️  Nenhum dado socioeconômico disponível');
  }
  
  console.log('\n3. Scores Finais:');
  const finalScores = calculaScoreRegional(fipeData, sidraData);
  if (finalScores.length > 0) {
    finalScores.forEach(item => {
      console.log(`${item.regiao}: ${item.score}`);
    });
  } else {
    console.log('   ❌ Nenhum score foi calculado');
  }
  
  return {
    detailedMetrics: priceGrowth,
    finalScores: finalScores
  };
}

// ============== DADOS DE EXEMPLO PARA TESTE ==============

// Dados de exemplo do FIPE (baseados no seu resultado anterior)



const exemploFipeData = [
  {regiao: "São Paulo",
    date: "2023-01",
    price_m2: 10231
  },
  {regiao: "São Paulo",
    date: "2023-02",
    price_m2: 10265
  },
  {regiao: "São Paulo",
    date: "2023-03",
    price_m2: 10309
  },
  {regiao: "São Paulo",
    date: "2023-04",
    price_m2: 10354
  },
  {regiao: "São Paulo",
    date: "2023-05",
    price_m2: 10402
  },
  {regiao: "São Paulo",
    date: "2023-06",
    price_m2: 10451
  },
  {regiao: "São Paulo",
    date: "2023-07",
    price_m2: 10488
  },
  {regiao: "São Paulo",
    date: "2023-08",
    price_m2: 10533
  },
  {regiao: "São Paulo",
    date: "2023-09",
    price_m2: 10580
  },
  {regiao: "São Paulo",
    date: "2023-10",
    price_m2: 10630
  },
  {regiao: "São Paulo",
    date: "2023-11",
    price_m2: 10664
  },
  {regiao: "São Paulo",
    date: "2023-12",
    price_m2: 10681
  },
  {regiao: "São Paulo",
    date: "2024-01",
    price_m2: 10710
  },
  {regiao: "São Paulo",
    date: "2024-02",
    price_m2: 10746
  },
  {regiao: "São Paulo",
    date: "2024-03",
    price_m2: 10801
  },
  {regiao: "São Paulo",
    date: "2024-04",
    price_m2: 10865
  },
  {regiao: "São Paulo",
    date: "2024-05",
    price_m2: 10943
  },
  {regiao: "São Paulo",
    date: "2024-06",
    price_m2: 11018
  },
  {regiao: "São Paulo",
    date: "2024-07",
    price_m2: 11084
  },
  {regiao: "São Paulo",
    date: "2024-08",
    price_m2: 11153
  },
  {regiao: "São Paulo",
    date: "2024-09",
    price_m2: 11212
  },
  {regiao: "São Paulo",
    date: "2024-10",
    price_m2: 11273
  },
  {regiao: "São Paulo",
    date: "2024-11",
    price_m2: 11324
  },
  {regiao: "São Paulo",
    date: "2024-12",
    price_m2: 11381
  },
  {regiao: "São Paulo",
    date: "2025-01",
    price_m2: 11428
  },
  {regiao: "Barueri",
    date: "2023-01",
    price_m2: 9097
  },
  {regiao: "Barueri",
    date: "2023-02",
    price_m2: 9173
  },
  {regiao: "Barueri",
    date: "2023-03",
    price_m2: 9233
  },
  {regiao: "Barueri",
    date: "2023-04",
    price_m2: 9281
  },
  {regiao: "Barueri",
    date: "2023-05",
    price_m2: 9337
  },
  {regiao: "Barueri",
    date: "2023-06",
    price_m2: 9419
  },
  {regiao: "Barueri",
    date: "2023-07",
    price_m2: 9501
  },
  {regiao: "Barueri",
    date: "2023-08",
    price_m2: 9571
  },
  {regiao: "Barueri",
    date: "2023-09",
    price_m2: 9644
  },
  {regiao: "Barueri",
    date: "2023-10",
    price_m2: 9736
  },
  {regiao: "Barueri",
    date: "2023-11",
    price_m2: 9807
  },
  {regiao: "Barueri",
    date: "2023-12",
    price_m2: 9874
  },
  {regiao: "Barueri",
    date: "2024-01",
    price_m2: 9959
  },
  {regiao: "Barueri",
    date: "2024-02",
    price_m2: 10049
  },
  {regiao: "Barueri",
    date: "2024-03",
    price_m2: 10116
  },
  {regiao: "Barueri",
    date: "2024-04",
    price_m2: 10198
  },
  {regiao: "Barueri",
    date: "2024-05",
    price_m2: 10296
  },
  {regiao: "Barueri",
    date: "2024-06",
    price_m2: 10414
  },
  {regiao: "Barueri",
    date: "2024-07",
    price_m2: 10512
  },
  {regiao: "Barueri",
    date: "2024-08",
    price_m2: 10610
  },
  {regiao: "Barueri",
    date: "2024-09",
    price_m2: 10678
  },
  {regiao: "Barueri",
    date: "2024-10",
    price_m2: 10763
  },
  {regiao: "Barueri",
    date: "2024-11",
    price_m2: 10820
  },
  {regiao: "Barueri",
    date: "2024-12",
    price_m2: 10895
  },
  {regiao: "Barueri",
    date: "2025-01",
    price_m2: 10944
  },
  {regiao: "Campinas",
    date: "2023-01",
    price_m2: 5762
  },
  {regiao: "Campinas",
    date: "2023-02",
    price_m2: 5775
  },
  {regiao: "Campinas",
    date: "2023-03",
    price_m2: 5801
  },
  {regiao: "Campinas",
    date: "2023-04",
    price_m2: 5833
  },
  {regiao: "Campinas",
    date: "2023-05",
    price_m2: 5886
  },
  {regiao: "Campinas",
    date: "2023-06",
    price_m2: 5961
  },
  {regiao: "Campinas",
    date: "2023-07",
    price_m2: 6041
  },
  {regiao: "Campinas",
    date: "2023-08",
    price_m2: 6105
  },
  {regiao: "Campinas",
    date: "2023-09",
    price_m2: 6141
  },
  {regiao: "Campinas",
    date: "2023-10",
    price_m2: 6171
  },
  {regiao: "Campinas",
    date: "2023-11",
    price_m2: 6200
  },
  {regiao: "Campinas",
    date: "2023-12",
    price_m2: 6230
  },
  {regiao: "Campinas",
    date: "2024-01",
    price_m2: 6276
  },
  {regiao: "Campinas",
    date: "2024-02",
    price_m2: 6311
  },
  {regiao: "Campinas",
    date: "2024-03",
    price_m2: 6352
  },
  {regiao: "Campinas",
    date: "2024-04",
    price_m2: 6403
  },
  {regiao: "Campinas",
    date: "2024-05",
    price_m2: 6487
  },
  {regiao: "Campinas",
    date: "2024-06",
    price_m2: 6565
  },
  {regiao: "Campinas",
    date: "2024-07",
    price_m2: 6618
  },
  {regiao: "Campinas",
    date: "2024-08",
    price_m2: 6647
  },
  {regiao: "Campinas",
    date: "2024-09",
    price_m2: 6684
  },
  {regiao: "Campinas",
    date: "2024-10",
    price_m2: 6743
  },
  {regiao: "Campinas",
    date: "2024-11",
    price_m2: 6827
  },
  {regiao: "Campinas",
    date: "2024-12",
    price_m2: 6916
  },
  {regiao: "Campinas",
    date: "2025-01",
    price_m2: 6983
  },
  {regiao: "Diadema",
    date: "2023-01",
    price_m2: 5904
  },
  {regiao: "Diadema",
    date: "2023-02",
    price_m2: 5914
  },
  {regiao: "Diadema",
    date: "2023-03",
    price_m2: 5914
  },
  {regiao: "Diadema",
    date: "2023-04",
    price_m2: 5919
  },
  {regiao: "Diadema",
    date: "2023-05",
    price_m2: 5944
  },
  {regiao: "Diadema",
    date: "2023-06",
    price_m2: 5964
  },
  {regiao: "Diadema",
    date: "2023-07",
    price_m2: 5988
  },
  {regiao: "Diadema",
    date: "2023-08",
    price_m2: 6016
  },
  {regiao: "Diadema",
    date: "2023-09",
    price_m2: 6061
  },
  {regiao: "Diadema",
    date: "2023-10",
    price_m2: 6114
  },
  {regiao: "Diadema",
    date: "2023-11",
    price_m2: 6151
  },
  {regiao: "Diadema",
    date: "2023-12",
    price_m2: 6164
  },
  {regiao: "Diadema",
    date: "2024-01",
    price_m2: 6181
  },
  {regiao: "Diadema",
    date: "2024-02",
    price_m2: 6216
  },
  {regiao: "Diadema",
    date: "2024-03",
    price_m2: 6259
  },
  {regiao: "Diadema",
    date: "2024-04",
    price_m2: 6293
  },
  {regiao: "Diadema",
    date: "2024-05",
    price_m2: 6348
  },
  {regiao: "Diadema",
    date: "2024-06",
    price_m2: 6390
  },
  {regiao: "Diadema",
    date: "2024-07",
    price_m2: 6405
  },
  {regiao: "Diadema",
    date: "2024-08",
    price_m2: 6381
  },
  {regiao: "Diadema",
    date: "2024-09",
    price_m2: 6340
  },
  {regiao: "Diadema",
    date: "2024-10",
    price_m2: 6359
  },
  {regiao: "Diadema",
    date: "2024-11",
    price_m2: 6382
  },
  {regiao: "Diadema",
    date: "2024-12",
    price_m2: 6446
  },
  {regiao: "Diadema",
    date: "2025-01",
    price_m2: 6486
  },
  {regiao: "Guarujá",
    date: "2023-01",
    price_m2: 5318
  },
  {regiao: "Guarujá",
    date: "2023-02",
    price_m2: 5329
  },
  {regiao: "Guarujá",
    date: "2023-03",
    price_m2: 5388
  },
  {regiao: "Guarujá",
    date: "2023-04",
    price_m2: 5472
  },
  {regiao: "Guarujá",
    date: "2023-05",
    price_m2: 5525
  },
  {regiao: "Guarujá",
    date: "2023-06",
    price_m2: 5532
  },
  {regiao: "Guarujá",
    date: "2023-07",
    price_m2: 5562
  },
  {regiao: "Guarujá",
    date: "2023-08",
    price_m2: 5571
  },
  {regiao: "Guarujá",
    date: "2023-09",
    price_m2: 5620
  },
  {regiao: "Guarujá",
    date: "2023-10",
    price_m2: 5662
  },
  {regiao: "Guarujá",
    date: "2023-11",
    price_m2: 5729
  },
  {regiao: "Guarujá",
    date: "2023-12",
    price_m2: 5796
  },
  {regiao: "Guarujá",
    date: "2024-01",
    price_m2: 5859
  },
  {regiao: "Guarujá",
    date: "2024-02",
    price_m2: 5903
  },
  {regiao: "Guarujá",
    date: "2024-03",
    price_m2: 5899
  },
  {regiao: "Guarujá",
    date: "2024-04",
    price_m2: 5899
  },
  {regiao: "Guarujá",
    date: "2024-05",
    price_m2: 5906
  },
  {regiao: "Guarujá",
    date: "2024-06",
    price_m2: 5949
  },
  {regiao: "Guarujá",
    date: "2024-07",
    price_m2: 5996
  },
  {regiao: "Guarujá",
    date: "2024-08",
    price_m2: 6048
  },
  {regiao: "Guarujá",
    date: "2024-09",
    price_m2: 6080
  },
  {regiao: "Guarujá",
    date: "2024-10",
    price_m2: 6112
  },
  {regiao: "Guarujá",
    date: "2024-11",
    price_m2: 6150
  },
  {regiao: "Guarujá",
    date: "2024-12",
    price_m2: 6198
  },
  {regiao: "Guarujá",
    date: "2025-01",
    price_m2: 6244
  },
  {regiao: "Guarulhos",
    date: "2023-01",
    price_m2: 5770
  },
  {regiao: "Guarulhos",
    date: "2023-02",
    price_m2: 5802
  },
  {regiao: "Guarulhos",
    date: "2023-03",
    price_m2: 5831
  },
  {regiao: "Guarulhos",
    date: "2023-04",
    price_m2: 5854
  },
  {regiao: "Guarulhos",
    date: "2023-05",
    price_m2: 5862
  },
  {regiao: "Guarulhos",
    date: "2023-06",
    price_m2: 5884
  },
  {regiao: "Guarulhos",
    date: "2023-07",
    price_m2: 5924
  },
  {regiao: "Guarulhos",
    date: "2023-08",
    price_m2: 5990
  },
  {regiao: "Guarulhos",
    date: "2023-09",
    price_m2: 6053
  },
  {regiao: "Guarulhos",
    date: "2023-10",
    price_m2: 6112
  },
  {regiao: "Guarulhos",
    date: "2023-11",
    price_m2: 6142
  },
  {regiao: "Guarulhos",
    date: "2023-12",
    price_m2: 6169
  },
  {regiao: "Guarulhos",
    date: "2024-01",
    price_m2: 6185
  },
  {regiao: "Guarulhos",
    date: "2024-02",
    price_m2: 6206
  },
  {regiao: "Guarulhos",
    date: "2024-03",
    price_m2: 6231
  },
  {regiao: "Guarulhos",
    date: "2024-04",
    price_m2: 6259
  },
  {regiao: "Guarulhos",
    date: "2024-05",
    price_m2: 6341
  },
  {regiao: "Guarulhos",
    date: "2024-06",
    price_m2: 6428
  },
  {regiao: "Guarulhos",
    date: "2024-07",
    price_m2: 6520
  },
  {regiao: "Guarulhos",
    date: "2024-08",
    price_m2: 6580
  },
  {regiao: "Guarulhos",
    date: "2024-09",
    price_m2: 6641
  },
  {regiao: "Guarulhos",
    date: "2024-10",
    price_m2: 6711
  },
  {regiao: "Guarulhos",
    date: "2024-11",
    price_m2: 6793
  },
  {regiao: "Guarulhos",
    date: "2024-12",
    price_m2: 6839
  },
  {regiao: "Guarulhos",
    date: "2025-01",
    price_m2: 6877
  },
  {regiao: "Osasco",
    date: "2023-01",
    price_m2: 6681
  },
  {regiao: "Osasco",
    date: "2023-02",
    price_m2: 6723
  },
  {regiao: "Osasco",
    date: "2023-03",
    price_m2: 6774
  },
  {regiao: "Osasco",
    date: "2023-04",
    price_m2: 6855
  },
  {regiao: "Osasco",
    date: "2023-05",
    price_m2: 6906
  },
  {regiao: "Osasco",
    date: "2023-06",
    price_m2: 6961
  },
  {regiao: "Osasco",
    date: "2023-07",
    price_m2: 6994
  },
  {regiao: "Osasco",
    date: "2023-08",
    price_m2: 7038
  },
  {regiao: "Osasco",
    date: "2023-09",
    price_m2: 7077
  },
  {regiao: "Osasco",
    date: "2023-10",
    price_m2: 7121
  },
  {regiao: "Osasco",
    date: "2023-11",
    price_m2: 7170
  },
  {regiao: "Osasco",
    date: "2023-12",
    price_m2: 7215
  },
  {regiao: "Osasco",
    date: "2024-01",
    price_m2: 7252
  },
  {regiao: "Osasco",
    date: "2024-02",
    price_m2: 7284
  },
  {regiao: "Osasco",
    date: "2024-03",
    price_m2: 7313
  },
  {regiao: "Osasco",
    date: "2024-04",
    price_m2: 7350
  },
  {regiao: "Osasco",
    date: "2024-05",
    price_m2: 7406
  },
  {regiao: "Osasco",
    date: "2024-06",
    price_m2: 7467
  },
  {regiao: "Osasco",
    date: "2024-07",
    price_m2: 7512
  },
  {regiao: "Osasco",
    date: "2024-08",
    price_m2: 7569
  },
  {regiao: "Osasco",
    date: "2024-09",
    price_m2: 7618
  },
  {regiao: "Osasco",
    date: "2024-10",
    price_m2: 7695
  },
  {regiao: "Osasco",
    date: "2024-11",
    price_m2: 7740
  },
  {regiao: "Osasco",
    date: "2024-12",
    price_m2: 7778
  },
  {regiao: "Osasco",
    date: "2025-01",
    price_m2: 7806
  },
  {regiao: "Praia Grande",
    date: "2023-01",
    price_m2: 5118
  },
  {regiao: "Praia Grande",
    date: "2023-02",
    price_m2: 5171
  },
  {regiao: "Praia Grande",
    date: "2023-03",
    price_m2: 5234
  },
  {regiao: "Praia Grande",
    date: "2023-04",
    price_m2: 5290
  },
  {regiao: "Praia Grande",
    date: "2023-05",
    price_m2: 5342
  },
  {regiao: "Praia Grande",
    date: "2023-06",
    price_m2: 5395
  },
  {regiao: "Praia Grande",
    date: "2023-07",
    price_m2: 5454
  },
  {regiao: "Praia Grande",
    date: "2023-08",
    price_m2: 5487
  },
  {regiao: "Praia Grande",
    date: "2023-09",
    price_m2: 5511
  },
  {regiao: "Praia Grande",
    date: "2023-10",
    price_m2: 5551
  },
  {regiao: "Praia Grande",
    date: "2023-11",
    price_m2: 5607
  },
  {regiao: "Praia Grande",
    date: "2023-12",
    price_m2: 5652
  },
  {regiao: "Praia Grande",
    date: "2024-01",
    price_m2: 5696
  },
  {regiao: "Praia Grande",
    date: "2024-02",
    price_m2: 5751
  },
  {regiao: "Praia Grande",
    date: "2024-03",
    price_m2: 5831
  },
  {regiao: "Praia Grande",
    date: "2024-04",
    price_m2: 5903
  },
  {regiao: "Praia Grande",
    date: "2024-05",
    price_m2: 5955
  },
  {regiao: "Praia Grande",
    date: "2024-06",
    price_m2: 5980
  },
  {regiao: "Praia Grande",
    date: "2024-07",
    price_m2: 5985
  },
  {regiao: "Praia Grande",
    date: "2024-08",
    price_m2: 5989
  },
  {regiao: "Praia Grande",
    date: "2024-09",
    price_m2: 6035
  },
  {regiao: "Praia Grande",
    date: "2024-10",
    price_m2: 6108
  },
  {regiao: "Praia Grande",
    date: "2024-11",
    price_m2: 6192
  },
  {regiao: "Praia Grande",
    date: "2024-12",
    price_m2: 6250
  },
  {regiao: "Praia Grande",
    date: "2025-01",
    price_m2: 6260
  },
  {regiao: "Ribeirão Preto",
    date: "2023-01",
    price_m2: 4388
  },
  {regiao: "Ribeirão Preto",
    date: "2023-02",
    price_m2: 4402
  },
  {regiao: "Ribeirão Preto",
    date: "2023-03",
    price_m2: 4426
  },
  {regiao: "Ribeirão Preto",
    date: "2023-04",
    price_m2: 4442
  },
  {regiao: "Ribeirão Preto",
    date: "2023-05",
    price_m2: 4459
  },
  {regiao: "Ribeirão Preto",
    date: "2023-06",
    price_m2: 4468
  },
  {regiao: "Ribeirão Preto",
    date: "2023-07",
    price_m2: 4486
  },
  {regiao: "Ribeirão Preto",
    date: "2023-08",
    price_m2: 4496
  },
  {regiao: "Ribeirão Preto",
    date: "2023-09",
    price_m2: 4508
  },
  {regiao: "Ribeirão Preto",
    date: "2023-10",
    price_m2: 4524
  },
  {regiao: "Ribeirão Preto",
    date: "2023-11",
    price_m2: 4535
  },
  {regiao: "Ribeirão Preto",
    date: "2023-12",
    price_m2: 4551
  },
  {regiao: "Ribeirão Preto",
    date: "2024-01",
    price_m2: 4554
  },
  {regiao: "Ribeirão Preto",
    date: "2024-02",
    price_m2: 4570
  },
  {regiao: "Ribeirão Preto",
    date: "2024-03",
    price_m2: 4599
  },
  {regiao: "Ribeirão Preto",
    date: "2024-04",
    price_m2: 4643
  },
  {regiao: "Ribeirão Preto",
    date: "2024-05",
    price_m2: 4690
  },
  {regiao: "Ribeirão Preto",
    date: "2024-06",
    price_m2: 4726
  },
  {regiao: "Ribeirão Preto",
    date: "2024-07",
    price_m2: 4762
  },
  {regiao: "Ribeirão Preto",
    date: "2024-08",
    price_m2: 4804
  },
  {regiao: "Ribeirão Preto",
    date: "2024-09",
    price_m2: 4844
  },
  {regiao: "Ribeirão Preto",
    date: "2024-10",
    price_m2: 4874
  },
  {regiao: "Ribeirão Preto",
    date: "2024-11",
    price_m2: 4901
  },
  {regiao: "Ribeirão Preto",
    date: "2024-12",
    price_m2: 4924
  },
  {regiao: "Ribeirão Preto",
    date: "2025-01",
    price_m2: 4950
  },
  {regiao: "Santo André",
    date: "2023-01",
    price_m2: 6436
  },
  {regiao: "Santo André",
    date: "2023-02",
    price_m2: 6471
  },
  {regiao: "Santo André",
    date: "2023-03",
    price_m2: 6502
  },
  {regiao: "Santo André",
    date: "2023-04",
    price_m2: 6547
  },
  {regiao: "Santo André",
    date: "2023-05",
    price_m2: 6592
  },
  {regiao: "Santo André",
    date: "2023-06",
    price_m2: 6630
  },
  {regiao: "Santo André",
    date: "2023-07",
    price_m2: 6661
  },
  {regiao: "Santo André",
    date: "2023-08",
    price_m2: 6681
  },
  {regiao: "Santo André",
    date: "2023-09",
    price_m2: 6712
  },
  {regiao: "Santo André",
    date: "2023-10",
    price_m2: 6747
  },
  {regiao: "Santo André",
    date: "2023-11",
    price_m2: 6780
  },
  {regiao: "Santo André",
    date: "2023-12",
    price_m2: 6807
  },
  {regiao: "Santo André",
    date: "2024-01",
    price_m2: 6825
  },
  {regiao: "Santo André",
    date: "2024-02",
    price_m2: 6847
  },
  {regiao: "Santo André",
    date: "2024-03",
    price_m2: 6865
  },
  {regiao: "Santo André",
    date: "2024-04",
    price_m2: 6895
  },
  {regiao: "Santo André",
    date: "2024-05",
    price_m2: 6936
  },
  {regiao: "Santo André",
    date: "2024-06",
    price_m2: 6982
  },
  {regiao: "Santo André",
    date: "2024-07",
    price_m2: 7021
  },
  {regiao: "Santo André",
    date: "2024-08",
    price_m2: 7063
  },
  {regiao: "Santo André",
    date: "2024-09",
    price_m2: 7097
  },
  {regiao: "Santo André",
    date: "2024-10",
    price_m2: 7129
  },
  {regiao: "Santo André",
    date: "2024-11",
    price_m2: 7162
  },
  {regiao: "Santo André",
    date: "2024-12",
    price_m2: 7198
  },
  {regiao: "Santo André",
    date: "2025-01",
    price_m2: 7232
  },
  {regiao: "Santos",
    date: "2023-01",
    price_m2: 5939
  },
  {regiao: "Santos",
    date: "2023-02",
    price_m2: 5983
  },
  {regiao: "Santos",
    date: "2023-03",
    price_m2: 6018
  },
  {regiao: "Santos",
    date: "2023-04",
    price_m2: 6059
  },
  {regiao: "Santos",
    date: "2023-05",
    price_m2: 6094
  },
  {regiao: "Santos",
    date: "2023-06",
    price_m2: 6139
  },
  {regiao: "Santos",
    date: "2023-07",
    price_m2: 6190
  },
  {regiao: "Santos",
    date: "2023-08",
    price_m2: 6249
  },
  {regiao: "Santos",
    date: "2023-09",
    price_m2: 6318
  },
  {regiao: "Santos",
    date: "2023-10",
    price_m2: 6379
  },
  {regiao: "Santos",
    date: "2023-11",
    price_m2: 6444
  },
  {regiao: "Santos",
    date: "2023-12",
    price_m2: 6482
  },
  {regiao: "Santos",
    date: "2024-01",
    price_m2: 6538
  },
  {regiao: "Santos",
    date: "2024-02",
    price_m2: 6606
  },
  {regiao: "Santos",
    date: "2024-03",
    price_m2: 6691
  },
  {regiao: "Santos",
    date: "2024-04",
    price_m2: 6759
  },
  {regiao: "Santos",
    date: "2024-05",
    price_m2: 6808
  },
  {regiao: "Santos",
    date: "2024-06",
    price_m2: 6861
  },
  {regiao: "Santos",
    date: "2024-07",
    price_m2: 6946
  },
  {regiao: "Santos",
    date: "2024-08",
    price_m2: 7040
  },
  {regiao: "Santos",
    date: "2024-09",
    price_m2: 7137
  },
  {regiao: "Santos",
    date: "2024-10",
    price_m2: 7219
  },
  {regiao: "Santos",
    date: "2024-11",
    price_m2: 7299
  },
  {regiao: "Santos",
    date: "2024-12",
    price_m2: 7357
  },
  {regiao: "Santos",
    date: "2025-01",
    price_m2: 7399
  },
  {regiao: "São Bernardo do Campo",
    date: "2023-01",
    price_m2: 5642
  },
  {regiao: "São Bernardo do Campo",
    date: "2023-02",
    price_m2: 5660
  },
  {regiao: "São Bernardo do Campo",
    date: "2023-03",
    price_m2: 5699
  },
  {regiao: "São Bernardo do Campo",
    date: "2023-04",
    price_m2: 5738
  },
  {regiao: "São Bernardo do Campo",
    date: "2023-05",
    price_m2: 5773
  },
  {regiao: "São Bernardo do Campo",
    date: "2023-06",
    price_m2: 5801
  },
  {regiao: "São Bernardo do Campo",
    date: "2023-07",
    price_m2: 5832
  },
  {regiao: "São Bernardo do Campo",
    date: "2023-08",
    price_m2: 5862
  },
  {regiao: "São Bernardo do Campo",
    date: "2023-09",
    price_m2: 5898
  },
  {regiao: "São Bernardo do Campo",
    date: "2023-10",
    price_m2: 5928
  },
  {regiao: "São Bernardo do Campo",
    date: "2023-11",
    price_m2: 5968
  },
  {regiao: "São Bernardo do Campo",
    date: "2023-12",
    price_m2: 5987
  },
  {regiao: "São Bernardo do Campo",
    date: "2024-01",
    price_m2: 6011
  },
  {regiao: "São Bernardo do Campo",
    date: "2024-02",
    price_m2: 6024
  },
  {regiao: "São Bernardo do Campo",
    date: "2024-03",
    price_m2: 6048
  },
  {regiao: "São Bernardo do Campo",
    date: "2024-04",
    price_m2: 6099
  },
  {regiao: "São Bernardo do Campo",
    date: "2024-05",
    price_m2: 6171
  },
  {regiao: "São Bernardo do Campo",
    date: "2024-06",
    price_m2: 6246
  },
  {regiao: "São Bernardo do Campo",
    date: "2024-07",
    price_m2: 6313
  },
  {regiao: "São Bernardo do Campo",
    date: "2024-08",
    price_m2: 6374
  },
  {regiao: "São Bernardo do Campo",
    date: "2024-09",
    price_m2: 6428
  },
  {regiao: "São Bernardo do Campo",
    date: "2024-10",
    price_m2: 6465
  },
  {regiao: "São Bernardo do Campo",
    date: "2024-11",
    price_m2: 6494
  },
  {regiao: "São Bernardo do Campo",
    date: "2024-12",
    price_m2: 6533
  },
  {regiao: "São Bernardo do Campo",
    date: "2025-01",
    price_m2: 6588
  },
  {regiao: "São Caetano do Sul",
    date: "2023-01",
    price_m2: 7476
  },
  {regiao: "São Caetano do Sul",
    date: "2023-02",
    price_m2: 7502
  },
  {regiao: "São Caetano do Sul",
    date: "2023-03",
    price_m2: 7548
  },
  {regiao: "São Caetano do Sul",
    date: "2023-04",
    price_m2: 7593
  },
  {regiao: "São Caetano do Sul",
    date: "2023-05",
    price_m2: 7642
  },
  {regiao: "São Caetano do Sul",
    date: "2023-06",
    price_m2: 7648
  },
  {regiao: "São Caetano do Sul",
    date: "2023-07",
    price_m2: 7662
  },
  {regiao: "São Caetano do Sul",
    date: "2023-08",
    price_m2: 7713
  },
  {regiao: "São Caetano do Sul",
    date: "2023-09",
    price_m2: 7765
  },
  {regiao: "São Caetano do Sul",
    date: "2023-10",
    price_m2: 7798
  },
  {regiao: "São Caetano do Sul",
    date: "2023-11",
    price_m2: 7833
  },
  {regiao: "São Caetano do Sul",
    date: "2023-12",
    price_m2: 7902
  },
  {regiao: "São Caetano do Sul",
    date: "2024-01",
    price_m2: 7974
  },
  {regiao: "São Caetano do Sul",
    date: "2024-02",
    price_m2: 8025
  },
  {regiao: "São Caetano do Sul",
    date: "2024-03",
    price_m2: 8054
  },
  {regiao: "São Caetano do Sul",
    date: "2024-04",
    price_m2: 8112
  },
  {regiao: "São Caetano do Sul",
    date: "2024-05",
    price_m2: 8166
  },
  {regiao: "São Caetano do Sul",
    date: "2024-06",
    price_m2: 8255
  },
  {regiao: "São Caetano do Sul",
    date: "2024-07",
    price_m2: 8309
  },
  {regiao: "São Caetano do Sul",
    date: "2024-08",
    price_m2: 8403
  },
  {regiao: "São Caetano do Sul",
    date: "2024-09",
    price_m2: 8479
  },
  {regiao: "São Caetano do Sul",
    date: "2024-10",
    price_m2: 8527
  },
  {regiao: "São Caetano do Sul",
    date: "2024-11",
    price_m2: 8564
  },
  {regiao: "São Caetano do Sul",
    date: "2024-12",
    price_m2: 8587
  },
  {regiao: "São Caetano do Sul",
    date: "2025-01",
    price_m2: 8629
  },
  {regiao: "São José do Rio Preto",
    date: "2023-01",
    price_m2: 4826
  },
  {regiao: "São José do Rio Preto",
    date: "2023-02",
    price_m2: 4825
  },
  {regiao: "São José do Rio Preto",
    date: "2023-03",
    price_m2: 4810
  },
  {regiao: "São José do Rio Preto",
    date: "2023-04",
    price_m2: 4783
  },
  {regiao: "São José do Rio Preto",
    date: "2023-05",
    price_m2: 4782
  },
  {regiao: "São José do Rio Preto",
    date: "2023-06",
    price_m2: 4789
  },
  {regiao: "São José do Rio Preto",
    date: "2023-07",
    price_m2: 4815
  },
  {regiao: "São José do Rio Preto",
    date: "2023-08",
    price_m2: 4815
  },
  {regiao: "São José do Rio Preto",
    date: "2023-09",
    price_m2: 4864
  },
  {regiao: "São José do Rio Preto",
    date: "2023-10",
    price_m2: 4889
  },
  {regiao: "São José do Rio Preto",
    date: "2023-11",
    price_m2: 4954
  },
  {regiao: "São José do Rio Preto",
    date: "2023-12",
    price_m2: 4930
  },
  {regiao: "São José do Rio Preto",
    date: "2024-01",
    price_m2: 4930
  },
  {regiao: "São José do Rio Preto",
    date: "2024-02",
    price_m2: 4958
  },
  {regiao: "São José do Rio Preto",
    date: "2024-03",
    price_m2: 5048
  },
  {regiao: "São José do Rio Preto",
    date: "2024-04",
    price_m2: 5149
  },
  {regiao: "São José do Rio Preto",
    date: "2024-05",
    price_m2: 5241
  },
  {regiao: "São José do Rio Preto",
    date: "2024-06",
    price_m2: 5243
  },
  {regiao: "São José do Rio Preto",
    date: "2024-07",
    price_m2: 5212
  },
  {regiao: "São José do Rio Preto",
    date: "2024-08",
    price_m2: 5169
  },
  {regiao: "São José do Rio Preto",
    date: "2024-09",
    price_m2: 5204
  },
  {regiao: "São José do Rio Preto",
    date: "2024-10",
    price_m2: 5307
  },
  {regiao: "São José do Rio Preto",
    date: "2024-11",
    price_m2: 5388
  },
  {regiao: "São José do Rio Preto",
    date: "2024-12",
    price_m2: 5373
  },
  {regiao: "São José do Rio Preto",
    date: "2025-01",
    price_m2: 5301
  },
  {regiao: "São José dos Campos",
    date: "2023-01",
    price_m2: 6778
  },
  {regiao: "São José dos Campos",
    date: "2023-02",
    price_m2: 6862
  },
  {regiao: "São José dos Campos",
    date: "2023-03",
    price_m2: 6982
  },
  {regiao: "São José dos Campos",
    date: "2023-04",
    price_m2: 7091
  },
  {regiao: "São José dos Campos",
    date: "2023-05",
    price_m2: 7198
  },
  {regiao: "São José dos Campos",
    date: "2023-06",
    price_m2: 7280
  },
  {regiao: "São José dos Campos",
    date: "2023-07",
    price_m2: 7304
  },
  {regiao: "São José dos Campos",
    date: "2023-08",
    price_m2: 7318
  },
  {regiao: "São José dos Campos",
    date: "2023-09",
    price_m2: 7304
  },
  {regiao: "São José dos Campos",
    date: "2023-10",
    price_m2: 7344
  },
  {regiao: "São José dos Campos",
    date: "2023-11",
    price_m2: 7345
  },
  {regiao: "São José dos Campos",
    date: "2023-12",
    price_m2: 7346
  },
  {regiao: "São José dos Campos",
    date: "2024-01",
    price_m2: 7438
  },
  {regiao: "São José dos Campos",
    date: "2024-02",
    price_m2: 7618
  },
  {regiao: "São José dos Campos",
    date: "2024-03",
    price_m2: 7815
  },
  {regiao: "São José dos Campos",
    date: "2024-04",
    price_m2: 7941
  },
  {regiao: "São José dos Campos",
    date: "2024-05",
    price_m2: 8004
  },
  {regiao: "São José dos Campos",
    date: "2024-06",
    price_m2: 8063
  },
  {regiao: "São José dos Campos",
    date: "2024-07",
    price_m2: 8117
  },
  {regiao: "São José dos Campos",
    date: "2024-08",
    price_m2: 8185
  },
  {regiao: "São José dos Campos",
    date: "2024-09",
    price_m2: 8252
  },
  {regiao: "São José dos Campos",
    date: "2024-10",
    price_m2: 8257
  },
  {regiao: "São José dos Campos",
    date: "2024-11",
    price_m2: 8248
  },
  {regiao: "São José dos Campos",
    date: "2024-12",
    price_m2: 8247
  },
  {regiao: "São José dos Campos",
    date: "2025-01",
    price_m2: 8306
  },
  {regiao: "São Vicente",
    date: "2023-01",
    price_m2: 4169
  },
  {regiao: "São Vicente",
    date: "2023-02",
    price_m2: 4162
  },
  {regiao: "São Vicente",
    date: "2023-03",
    price_m2: 4152
  },
  {regiao: "São Vicente",
    date: "2023-04",
    price_m2: 4149
  },
  {regiao: "São Vicente",
    date: "2023-05",
    price_m2: 4163
  },
  {regiao: "São Vicente",
    date: "2023-06",
    price_m2: 4172
  },
  {regiao: "São Vicente",
    date: "2023-07",
    price_m2: 4189
  },
  {regiao: "São Vicente",
    date: "2023-08",
    price_m2: 4207
  },
  {regiao: "São Vicente",
    date: "2023-09",
    price_m2: 4229
  },
  {regiao: "São Vicente",
    date: "2023-10",
    price_m2: 4246
  },
  {regiao: "São Vicente",
    date: "2023-11",
    price_m2: 4238
  },
  {regiao: "São Vicente",
    date: "2023-12",
    price_m2: 4216
  },
  {regiao: "São Vicente",
    date: "2024-01",
    price_m2: 4205
  },
  {regiao: "São Vicente",
    date: "2024-02",
    price_m2: 4222
  },
  {regiao: "São Vicente",
    date: "2024-03",
    price_m2: 4254
  },
  {regiao: "São Vicente",
    date: "2024-04",
    price_m2: 4285
  },
  {regiao: "São Vicente",
    date: "2024-05",
    price_m2: 4312
  },
  {regiao: "São Vicente",
    date: "2024-06",
    price_m2: 4344
  },
  {regiao: "São Vicente",
    date: "2024-07",
    price_m2: 4377
  },
  {regiao: "São Vicente",
    date: "2024-08",
    price_m2: 4409
  },
  {regiao: "São Vicente",
    date: "2024-09",
    price_m2: 4438
  },
  {regiao: "São Vicente",
    date: "2024-10",
    price_m2: 4441
  },
  {regiao: "São Vicente",
    date: "2024-11",
    price_m2: 4446
  },
  {regiao: "São Vicente",
    date: "2024-12",
    price_m2: 4461
  },
  {regiao: "São Vicente",
    date: "2025-01",
    price_m2: 4500
  }
];

const exemploSidraData = [
    { regiao: "São Paulo", morandoAlugado: 25.74 },
    { regiao: "Osasco", morandoAlugado: 28.37 },
    { regiao: "Guarulhos", morandoAlugado: 22.15 },
    { regiao: "Barueri", morandoAlugado: 26.80 },
    { regiao: "Campinas", morandoAlugado: 24.50 },
    { regiao: "Diadema", morandoAlugado: 29.10 },
    { regiao: "Guarujá", morandoAlugado: 27.45 },
    { regiao: "Santos", morandoAlugado: 30.20 },
    { regiao: "Santo André", morandoAlugado: 25.90 },
    { regiao: "São Bernardo do Campo", morandoAlugado: 24.30 },
    { regiao: "São Caetano do Sul", morandoAlugado: 23.80 },
    { regiao: "São José dos Campos", morandoAlugado: 26.15 },
    { regiao: "São Vicente", morandoAlugado: 31.40 },
    { regiao: "Praia Grande", morandoAlugado: 28.90 },
    { regiao: "Ribeirão Preto", morandoAlugado: 27.70 },
    { regiao: "São José do Rio Preto", morandoAlugado: 25.60 }
  
];

// ============== DIAGNÓSTICO E TESTE ==============

function diagnosticarProblema(fipeData, sidraData) {
  console.log('\n=== DIAGNÓSTICO COMPLETO ===');
  
  // Extrair regiões únicas de cada dataset
  const regioesFipe = [...new Set(fipeData.map(item => item.regiao))];
  const regioesSidra = [...new Set(sidraData.map(item => item.regiao))];
  
  console.log('\nRegiões no FIPE:', regioesFipe);
  console.log('Regiões no SIDRA:', regioesSidra);
  
  // Verificar correspondências
  const correspondencias = regioesFipe.filter(regiao => regioesSidra.includes(regiao));
  const semCorrespondencia = regioesFipe.filter(regiao => !regioesSidra.includes(regiao));
  
  console.log('\n✅ Regiões com correspondência:', correspondencias);
  console.log('❌ Regiões sem correspondência:', semCorrespondencia);
  
  return { regioesFipe, regioesSidra, correspondencias, semCorrespondencia };
}

// ============== EXECUÇÃO PRINCIPAL ==============

function executarTeste() {
  console.log('\n🧪 EXECUTANDO TESTE COM DADOS DE EXEMPLO...\n');
  
  // Diagnóstico
  const diagnostico = diagnosticarProblema(exemploFipeData, exemploSidraData);
  
  // Análise completa
  const resultado = getDetailedAnalysis(exemploFipeData, exemploSidraData);
  
  console.log('\n=== RESULTADO FINAL ===');
  console.log(JSON.stringify(resultado, null, 2));
  
  return resultado;
}

// Executar teste automaticamente
if (require.main === module) {
  executarTeste();
}

// ============== EXPORTAR FUNÇÕES ==============

module.exports = {
  calculaScoreRegional,
  calculaAumentoPreco,
  normalizaDados,
  combinaScores,
  getDetailedAnalysis,
  diagnosticarProblema,
  executarTeste
};
// Exemplo de uso com dados de teste