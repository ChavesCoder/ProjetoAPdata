/**
 * Calculadora de Score Composto por Região
 * Combina crescimento de preços imobiliários com indicadores socioeconômicos
 */

function calculateRegionalScore(fipeData, sidraData) {
  // 1. Calcular crescimento percentual dos preços por região
  const priceGrowthByRegion = calculatePriceGrowth(fipeData);
  
  // 2. Normalizar os dados para escala 0-1
  const normalizedPriceGrowth = normalizeData(priceGrowthByRegion);
  const normalizedSocioeconomic = normalizeData(sidraData, 'morandoAlugado');
  
  // 3. Combinar os scores com pesos
  const combinedScores = combineScores(normalizedPriceGrowth, normalizedSocioeconomic);
  
  return combinedScores;
}

function calculatePriceGrowth(fipeData) {
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
      const oldestPrice = regionData[0].price;
      const newestPrice = regionData[regionData.length - 1].price;
      const growthRate = ((newestPrice - oldestPrice) / oldestPrice) * 100;
      
      regionGrowth[regiao] = {
        regiao: regiao,
        priceGrowth: growthRate
      };
    }
  });
  
  return Object.values(regionGrowth);
}

function normalizeData(data, valueKey = null) {
  if (data.length === 0) return [];
  
  // Determinar qual campo usar para normalização
  const getValue = valueKey ? (item) => item[valueKey] : (item) => item.priceGrowth;
  
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
    normalizedValue: (getValue(item) - min) / range
  }));
}

function combineScores(priceGrowthData, socioeconomicData, weights = { price: 0.6, socio: 0.4 }) {
  const scores = [];
  
  // Criar um mapa dos dados socioeconômicos para acesso rápido
  const socioMap = socioeconomicData.reduce((acc, item) => {
    acc[item.regiao] = item.normalizedValue;
    return acc;
  }, {});
  
  // Combinar scores para cada região que tem dados de preço
  priceGrowthData.forEach(priceItem => {
    const regiao = priceItem.regiao;
    const socioValue = socioMap[regiao];
    
    if (socioValue !== undefined) {
      // Calcular score composto
      const compositeScore = (
        priceItem.normalizedValue * weights.price +
        socioValue * weights.socio
      );
      
      scores.push({
        regiao: regiao,
        score: Math.round(compositeScore * 1000) / 1000 // Arredondar para 3 casas decimais
      });
    }
  });
  
  // Ordenar por score decrescente
  return scores.sort((a, b) => b.score - a.score);
}

// Função utilitária para análise detalhada
function getDetailedAnalysis(fipeData, sidraData) {
  const priceGrowth = calculatePriceGrowth(fipeData);
  const normalizedPrice = normalizeData(priceGrowth);
  const normalizedSocio = normalizeData(sidraData, 'morandoAlugado');
  
  console.log('=== ANÁLISE DETALHADA ===');
  console.log('\n1. Crescimento de Preços por Região:');
  priceGrowth.forEach(item => {
    console.log(`${item.regiao}: ${item.priceGrowth.toFixed(2)}%`);
  });
  
  console.log('\n2. Dados Socioeconômicos:');
  sidraData.forEach(item => {
    console.log(`${item.regiao}: ${item.morandoAlugado}% morando alugado`);
  });
  
  console.log('\n3. Scores Finais:');
  const finalScores = calculateRegionalScore(fipeData, sidraData);
  finalScores.forEach(item => {
    console.log(`${item.regiao}: ${item.score}`);
  });
  
  return finalScores;
}

// Exemplo de uso com dados de teste
const exemploFipeData = [
  { regiao: "São Paulo", date: "2023-01", price_m2: 11381 },
  { regiao: "São Paulo", date: "2024-01", price_m2: 12000 },
  { regiao: "Osasco", date: "2023-01", price_m2: 8500 },
  { regiao: "Osasco", date: "2024-01", price_m2: 8800 },
  { regiao: "Guarulhos", date: "2023-01", price_m2: 7200 },
  { regiao: "Guarulhos", date: "2024-01", price_m2: 7650 }
];

const exemploSidraData = [
  { regiao: "São Paulo", morandoAlugado: 25.74 },
  { regiao: "Osasco", morandoAlugado: 28.37 },
  { regiao: "Guarulhos", morandoAlugado: 22.15 }
];

// Executar exemplo
console.log('=== CALCULADORA DE SCORE REGIONAL ===');
const resultadoFinal = getDetailedAnalysis(exemploFipeData, exemploSidraData);

// Função principal para usar em produção
console.log('\n=== RESULTADO FINAL ===');
console.log(JSON.stringify(resultadoFinal, null, 2));