var express = require("express");
var router = express.Router();

var dashboardControllers = require("../controllers/dashboardControllers")


// router.post("/buscarUltimosDadosPrecoMedio", dashboardController.buscarUltimosDadosPrecoMedio);
router.get("/buscarUltimosDadosPrecoMedio/:idUsuario", function (req, res) {
    dashboardControllers.buscarUltimosDadosPrecoMedio(req, res);
    //  res.render("dashboard");
});

module.exports = router;