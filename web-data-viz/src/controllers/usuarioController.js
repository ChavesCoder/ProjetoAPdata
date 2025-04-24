var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var emailVar = req.body.emailServer;
    var senhaVar = req.body.senhaServer;

    if (emailVar == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senhaVar == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(emailVar, senhaVar)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);
                        res.json(resultadoAutenticar[0]);
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastroUsuario.html

    var nomeVar = req.body.nomeServer;
    var emailVar = req.body.emailServer;
    var senhaVar = req.body.senhaServer;
    var telefoneVar = req.body.telefoneServer;
    var tipoVar = req.body.tipoServer;
   // var fkEmpresaVar = req.body.fkEmpresaServer;

    // Faça as validações dos valores
    if (nomeVar == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (emailVar == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senhaVar == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (telefoneVar == undefined) {
        res.status(400).send("Seu telefone está undefined!");
    } else if (tipoVar == undefined) {
        res.status(400).send("Sua tipo usuario está undefined!");
    }
    //else if (fkEmpresaVar == undefined) {
      //  res.status(400).send("Sua fkEmpresa está undefined!");
   // }
    else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(nomeVar, emailVar, senhaVar, telefoneVar, tipoVar/*, fkEmpresaVar*/ )
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

module.exports = {
    autenticar,
    cadastrar
}