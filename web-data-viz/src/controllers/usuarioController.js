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
    var fkEmpresaVar = req.body.fkEmpresaServer;

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
    else if (fkEmpresaVar == undefined) {
      res.status(400).send("Sua fkEmpresa está undefined!");
     }
    else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(nomeVar, emailVar, senhaVar, telefoneVar, tipoVar, fkEmpresaVar )
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


function verificarPermissaoCadastroEmpresa(req, res) {
    const fkEmpresa = req.session.fkEmpresa;
  
    if (!fkEmpresa) {
      return res.redirect("/entrar.html");
    }
  
    if (fkEmpresa == 100) {
      // Usuário interno: pode acessar o cadastro de empresa
      res.sendFile(path.join(__dirname, "../public/cadastrarEmpresa.html"));
    } else {
      // Usuário comum: bloqueado
      res.status(403).send("Acesso negado: você não tem permissão para cadastrar empresas.");
    }
}

// Atualizar perfil
function atualizarPerfil(req, res) {
    const { idUsuario, nome, email, telefone, senha } = req.body;

    if (!idUsuario || !nome || !email || !telefone || !senha) {
        return res.status(400).send("Campos obrigatórios faltando.");
    }

    usuarioModel.atualizar(idUsuario, nome, email, telefone, senha)
        .then(() => res.status(200).send("Perfil atualizado com sucesso!"))
        .catch(erro => {
            console.error("Erro no controller ao atualizar:", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

// Deletar perfil
function deletarPerfil(req, res) {
  const idUsuario = req.params.id;

  if (!idUsuario) {
    return res.status(400).json({ erro: "ID do usuário não fornecido." });
  }

  usuarioModel.deletar(idUsuario)
    .then(() => res.status(200).json({ mensagem: "Perfil deletado com sucesso." }))
    .catch(erro => {
      console.error("Erro no controller ao deletar:", erro.sqlMessage || erro);
      res.status(500).json({ erro: erro.sqlMessage || "Erro interno" });
    });
}


function listarFuncionarios(req, res) {
    const fkEmpresa = req.query.fkEmpresa;

    usuarioModel.listarFuncionarios(fkEmpresa)
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.error("Erro ao listar funcionários:", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    autenticar,
    cadastrar,
    verificarPermissaoCadastroEmpresa,
    atualizarPerfil,
    deletarPerfil,
    listarFuncionarios
}