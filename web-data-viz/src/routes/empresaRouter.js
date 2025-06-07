const express = require("express");
const router = express.Router();
const empresaCadastroController = require("../controllers/empresaCadastroController");

router.post("/cadastrar-com-admin", empresaCadastroController.cadastrarComAdmin);
router.get("/listar", empresaCadastroController.listarEmpresas);
router.delete("/excluir/:id", empresaCadastroController.excluirEmpresa);


module.exports = router;