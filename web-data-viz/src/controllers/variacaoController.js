const variacaoModel = require("../models/variacaoModel");

function listarVariacao(req, res) {
    try {
        const {ano, cidade1, cidade2, cidade3, cidade4} = req.params;

        // Validação dos parâmetros
        if (!ano || isNaN(ano)) {
            return res.status(400).json({ mensagem: "Ano inválido ou ausente." });
        }

        // Chamada ao model com as cidades (passando como argumentos individuais)
        variacaoModel.buscarVariacao(ano, cidade1, cidade2, cidade3, cidade4)
            .then(function (resultado) {
                if(resultado.length > 0){
                res.status(200).json(resultado);
                }
                
            })
            .catch(function (erro) {
                console.error("Erro na consulta:", erro);
                res.status(500).json({ mensagem: "Erro ao consultar variação.", erro: erro.sqlMessage || erro.message });
            });

    } catch (erro) {
        console.error("Erro inesperado:", erro);
        res.status(500).json({ mensagem: "Erro interno ao processar as cidades." });
    }
}


module.exports = {
    listarVariacao
}