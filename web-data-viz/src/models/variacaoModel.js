var database = require("../database/config");

function buscarVariacao(ano, cidades) {
    var instrucaoSql = `
        SELECT 
            r.municipio,
            DATE_FORMAT(v.periodo, '%d-%m-%Y') AS data,
            ROUND(v.total * 100, 2) AS totalMultiplicadoPor100
        FROM 
            VarMensal v
        JOIN 
            Regiao r ON v.fkRegiao = r.idRegiao
        WHERE 
            YEAR(v.periodo) = ?
            AND r.municipio IN (?)
        ORDER BY 
            r.municipio, v.periodo;
    `;

    console.log("Executando SQL: \n" + instrucaoSql);
    return database.query(instrucaoSql, [ano, cidades]);
}

module.exports = {
    buscarVariacao
};
