var database = require("../database/config");


function variacaoMedia(municipio) {
    console.log(
        "ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ",

    );
    var instrucao = `
  SELECT 
    r.municipio AS 'Cidade',
    CONCAT(
        CASE WHEN vm.total > 0 THEN '+' ELSE '' END, 
        FORMAT(vm.total, 2), '%'
    ) AS 'Variação Mensal'
FROM VarMensal vm
JOIN Regiao r ON vm.fkRegiao = r.idRegiao
WHERE r.municipio IN ('${municipio}', '${municipio}', '${municipio}', '${municipio}')
AND vm.periodo = (SELECT MAX(periodo) FROM VarMensal)
ORDER BY vm.total DESC;
`;
    //WHERE idUsuario = ${idUsuario}
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}



module.exports = {
    variacaoMedia
};

