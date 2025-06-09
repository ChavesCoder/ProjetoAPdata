var database = require("../database/config");

function buscarDadosKPIS(cidade) {
    var instrucaoSql = `
   SELECT 
    (
        IFNULL(sp.umMorador, 0) * 1 +
        IFNULL(sp.doisMoradores, 0) * 2 +
        IFNULL(sp.tresMoradores, 0) * 3 +
        IFNULL(sp.quatroMoradoresOuMais, 0) * 4
    ) / NULLIF(IFNULL(sp.total, 0), 0) AS mediaDomicilio,
    
    IFNULL(pm.umDormitorio, 0) AS precoMedioUmDormitorio,
    IFNULL(pm.doisDormitorios, 0) AS precoMedioDoisDormitorios,
    IFNULL(pm.tresDormitorios, 0) AS precoMedioTresDormitorios,
    IFNULL(pm.quatroDormitorios, 0) AS precoMedioQuatroDormitorios,
    
    IFNULL(sp.total, 0) AS totalMoradoresProprio

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

module.exports = {
    buscarDadosKPIS
};

