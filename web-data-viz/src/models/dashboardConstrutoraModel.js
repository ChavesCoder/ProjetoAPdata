var database = require("../database/config");

function buscarDadosKPIS(cidade) {
    var instrucaoSql = `
   SELECT 
    (sp.umMorador * 1 + sp.doisMoradores * 2 + sp.tresMoradores * 3 + sp.quatroMoradoresOuMais * 4) / sp.total AS mediaDomicilio,
    
    pm.umDormitorio AS precoMedioUmDormitorio,
    pm.doisDormitorios AS precoMedioDoisDormitorios,
    pm.tresDormitorios AS precoMedioTresDormitorios,
    pm.quatroDormitorios AS precoMedioQuatroDormitorios,
    
    sp.total AS totalMoradoresProprio

FROM 
    SidraProprio sp
JOIN 
    Regiao r ON sp.fkRegiao = r.idRegiao
JOIN 
    (
        SELECT *
        FROM PrecoMedio
        WHERE fkRegiao = (SELECT idRegiao FROM Regiao WHERE municipio = '${cidade}')
        ORDER BY periodo DESC
        LIMIT 1
    ) pm ON pm.fkRegiao = r.idRegiao
WHERE 
    r.municipio = '${cidade}';
  `;
    console.log("Executando a SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function totalPrecoMedio(cidade){
    var instrucaoSql = `
    SELECT total
        FROM PrecoMedio
        WHERE fkRegiao = (SELECT idRegiao FROM Regiao WHERE municipio = '${cidade}')
        ORDER BY periodo DESC
        LIMIT 1
    `
    console.log("Executando a SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function sidraProprioChart(cidade){
    var instrucaoSql = `
    SELECT municipio, umMorador, doisMoradores, tresMoradores, quatroMoradoresOuMais 
    FROM SidraProprio
    JOIN Regiao
    ON fkRegiao = (SELECT idRegiao FROM Regiao WHERE municipio = '${cidade}');
    `
    console.log("Executando a SQL: \n" + instrucaoSql);
    console.log("Cidade recebida:", cidade);
    return database.executar(instrucaoSql);

}

module.exports = {
    buscarDadosKPIS,
    totalPrecoMedio,
    sidraProprioChart
};

