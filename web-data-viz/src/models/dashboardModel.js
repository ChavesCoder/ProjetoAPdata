var database = require("../database/config");


function mediaPrecoM(municipio){
    console.log(
        "ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ",
    );
    var instrucao = `
     SELECT 
    CONCAT('R$ ', FORMAT(pm.umDormitorio, 2, 'de_DE')) AS '1 Dormitório',
    CONCAT('R$ ', FORMAT(pm.doisDormitorios, 2, 'de_DE')) AS '2 Dormitórios',
    CONCAT('R$ ', FORMAT(pm.tresDormitorios, 2, 'de_DE')) AS '3 Dormitórios',
    CONCAT('R$ ', FORMAT(pm.quatroDormitorios, 2, 'de_DE')) AS '4+ Dormitórios'
FROM PrecoMedio pm
JOIN Regiao r ON pm.fkRegiao = r.idRegiao
WHERE r.municipio = '${municipio}'
ORDER BY pm.periodo DESC
LIMIT 1;
  `;
      
      console.log("Executando a instrução SQL: \n" + instrucao);
      return database.executar(instrucao);  
}



function mediaMoradoresDomicilio() {
    console.log(
        "ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ",

    );
    var instrucao = `
SELECT 
    ROUND(
        (1 * sp.umMorador + 2 * sp.doisMoradores + 3 * sp.tresMoradores + 4 * sp.quatroMoradoresOuMais) /
        (sp.umMorador + sp.doisMoradores + sp.tresMoradores + sp.quatroMoradoresOuMais),
        1
    ) AS 'Média Moradores/Domicílio',
    CONCAT(FORMAT(sp.total, 1), '%') AS '% Domicílio Próprio',
    CONCAT(FORMAT(100 - sp.total, 1), '%') AS 'Outros'
FROM SidraProprio sp
JOIN Regiao r ON sp.fkRegiao = r.idRegiao
WHERE r.municipio = 'Barueri'
ORDER BY (SELECT MAX(periodo) FROM PrecoMedio WHERE fkRegiao = r.idRegiao)
LIMIT 1;
`;
    
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}


function variacaoMedia(periodo, ano ) {
    console.log(
        "ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ",

    );
    var instrucao = `
SELECT 
    DATE_FORMAT(vm.periodo, '%M %Y') AS mes,
    ROUND((vm.total * 100),2) AS variacao_percentual
FROM VarMensal vm
WHERE vm.periodo >= DATE_SUB(CURDATE(), INTERVAL 15 MONTH)
ORDER BY vm.periodo DESC;
`;
    
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}


function graficoLinhas(municipio) {
    console.log(
        "ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ",

    );
    var instrucao = `
SELECT 
    DATE_FORMAT(vm.periodo, '%M') AS 'Mês',
    vm.total AS 'Barueri',
    (SELECT v2.total FROM VarMensal v2 
     JOIN Regiao r2 ON v2.fkRegiao = r2.idRegiao 
     WHERE r2.municipio = 'São Paulo' AND v2.periodo = vm.periodo) AS 'São Paulo',
    (SELECT v2.total FROM VarMensal v2 
     JOIN Regiao r2 ON v2.fkRegiao = r2.idRegiao 
     WHERE r2.municipio = 'Osasco' AND v2.periodo = vm.periodo) AS 'Osasco',
    (SELECT v2.total FROM VarMensal v2 
     JOIN Regiao r2 ON v2.fkRegiao = r2.idRegiao 
     WHERE r2.municipio = 'Santos' AND v2.periodo = vm.periodo) AS 'Santos'
FROM VarMensal vm
JOIN Regiao r ON vm.fkRegiao = r.idRegiao
WHERE r.municipio = 'Barueri'
AND vm.periodo >= DATE_SUB((SELECT MAX(periodo) FROM VarMensal), INTERVAL 6 MONTH)
ORDER BY vm.periodo;
`;
    
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function anualSemestral(municipio) {
    console.log(
        "ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ",

    );
    var instrucao = `
SELECT 
    CONCAT(YEAR(pm.periodo), '.', QUARTER(pm.periodo)) AS 'Ano.Trimestre',
    r.municipio AS 'Cidade',
    pm.total AS 'Preço Médio',
    vm.total AS 'Variação',
    i.total AS 'Índice'
FROM PrecoMedio pm
JOIN VarMensal vm ON pm.fkRegiao = vm.fkRegiao AND pm.periodo = vm.periodo
JOIN Indice i ON pm.fkRegiao = i.fkRegiao AND pm.periodo = i.periodo
JOIN Regiao r ON pm.fkRegiao = r.idRegiao
WHERE r.municipio IN ('Barueri', 'São Paulo', 'Osasco', 'Santos')
AND YEAR(pm.periodo) = YEAR(CURDATE())
ORDER BY pm.periodo, r.municipio;
`;
    
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}




module.exports = {
    mediaPrecoM,
    mediaMoradoresDomicilio,
    variacaoMedia,
    graficoLinhas,
    anualSemestral

};

