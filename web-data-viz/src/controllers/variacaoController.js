var variacaoModel = require("../models/variacaoModel");

function variacaoMedia(req, res) {
    console.log(`Atualizando grafico com dados recentes...`);
    var idUsuario = req.params.idUsuario;
    
    variacaoModel.variacaoMedia(idUsuario)                                     
      .then(function (resultado) {                              
        if (resultado.length > 0) {                             
          console.log(resultado);                               
          res.status(200).json(resultado);                      
        } else {                                                
          res.status(204).send("Nenhum resultado encontrado!"); 
        }
      })
      .catch(function (erro) {                                             
        console.log(erro);                                                 
        console.log("Houve um erro ao buscar os dados.", erro.sqlMessage); 
        res.status(500).json(erro.sqlMessage);                             
      });
  }
  

module.exports = {
variacaoMedia
};