var database = require("../database/config");


function buscarUltimosDadosPrecoMedio(municipio) {
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
LIMIT 1;`;
    //WHERE idUsuario = ${idUsuario}
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    buscarUltimosDadosPrecoMedio
};

