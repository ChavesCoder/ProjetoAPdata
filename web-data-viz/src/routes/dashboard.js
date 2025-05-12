var express = require("express");
var router = express.Router();

var dashboardControllers = require("../controllers/dashboardController")

router.get("/dadosCidade/:cidade", function (req, res) {
    dashboardControllers.buscarDadosKPIS(req, res);
  });

module.exports = router;