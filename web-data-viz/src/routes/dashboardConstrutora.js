var express = require("express");
var router = express.Router();

var dashboardConstrutoraControllers = require("../controllers/dashboardConstrutoraController")

router.get("/dadosCidade/:cidade", function (req, res) {
    dashboardConstrutoraControllers.buscarDadosKPIS(req, res);
  });

  router.get("/dadosCidade/:cidade", function (req, res) {
    dashboardConstrutoraControllers.totalPrecoMedio(req, res);
  });
  
  router.get("/dadosSidraProprio/:cidade", function (req, res) {
    dashboardConstrutoraControllers.sidraProprioChart(req, res);
  });

module.exports = router;