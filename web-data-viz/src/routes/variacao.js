var express = require("express");
var router = express.Router();

var variacaoController = require("../controllers/variacaoController");

// Rota para buscar a variação por ano e cidades
router.get("/:ano/:cidade1/:cidade2/:cidade3/:cidade4", variacaoController.listarVariacao);

module.exports = router;


