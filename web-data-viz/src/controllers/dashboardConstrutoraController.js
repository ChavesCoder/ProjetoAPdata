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
  
module.exports = {
buscarDadosKPIS
};