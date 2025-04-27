var express = require("express");
var router = express.Router();

var variacaoControllers = require("../controllers/variacaoController")


// router.post("/variacaoMedia", variacaoController.variacaoMedia);
router.get("/variacaoMedia/:idUsuario", function (req, res) {
    variacaoControllers.variacaoMedia(req, res);
    //  res.render("variacao");
});

module.exports = router;