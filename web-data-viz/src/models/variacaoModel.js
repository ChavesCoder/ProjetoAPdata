var database = require("../database/config");

function buscarVariacao(ano, cidade1, cidade2, cidade3, cidade4) {
    var instrucaoSql = `
        SELECT 
    r.municipio,
    DATE_FORMAT(v.periodo, '%d-%m-%Y') AS data,
    ROUND(IFNULL(v.total, 0) * 100, 2) AS totalMultiplicadoPor100
FROM 
    VarMensal v
JOIN 
    Regiao r ON v.fkRegiao = r.idRegiao
WHERE 
    YEAR(v.periodo) = ${ano}
    AND r.municipio IN ('${cidade1}', '${cidade2}', '${cidade3}', '${cidade4}')
ORDER BY 
    r.municipio, v.periodo;
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    buscarVariacao
};
