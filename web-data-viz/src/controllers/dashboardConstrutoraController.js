var dashboardConstrutoraModel = require("../models/dashboardConstrutoraModel");

function buscarDadosKPIS(req, res) {
  var cidade = req.params.cidade;

  dashboardConstrutoraModel.buscarDadosKPIS(cidade)
    .then(function (resultado) {
      res.json(resultado[0]); // ou só resultado, depende do que você quer
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).json(erro.sqlMessage);
    });
}


function totalPrecoMedio(req, res) {
  var cidade = req.params.cidade;

  dashboardConstrutoraModel.totalPrecoMedio(cidade)
    .then(function (resultado) {
      res.json(resultado[0]); // ou só resultado, depende do que você quer
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).json(erro.sqlMessage);
    });
}

function sidraProprioChart(req, res) {
  var cidade = req.params.cidade;
  console.log("Controller - Cidade recebida:", cidade);

  dashboardConstrutoraModel.sidraProprioChart(cidade)
    .then(function (resultado) {
      console.log("Resultado da query:", resultado);
      console.log("Resultado[0]:", resultado[0]);
      res.json(resultado[0]);
    })
    .catch(function (erro) {
      console.log("Erro na controller:", erro);
      res.status(500).json({error: erro.sqlMessage || erro.message});
    });
} 
  
module.exports = {
buscarDadosKPIS,
totalPrecoMedio,
sidraProprioChart
};