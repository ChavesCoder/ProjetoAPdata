const empresaModel = require("../models/empresaModel");
const usuarioModel = require("../models/usuarioModel");

function cadastrarComAdmin(req, res) {
  const {
    razaoSocial,
    nomeFantasia,
    cnpj,
    telefone,
    email,
    endereco,
    senha
  } = req.body;

  empresaModel.cadastrarEmpresa(razaoSocial, nomeFantasia, cnpj, telefone, email, endereco)
    .then(resultadoEmpresa => {
      const idEmpresa = resultadoEmpresa.insertId;

      return usuarioModel.cadastrarUsuario(
        nomeFantasia, // nome do admin
        email,
        senha,
        telefone,
        idEmpresa
      ).then(resultadoUsuario => {
        // Retorna os dois valores em um objeto
        return { resultadoUsuario, idEmpresa };
      });
    })
    .then(({resultadoUsuario, idEmpresa}) => {
      res.status(201).json({
        mensagem: "Empresa e administrador cadastrados com sucesso!",
        resultadoUsuario,
        idEmpresa
      });
    })
    .catch(erro => {
      console.error("Erro ao cadastrar:", erro);
      res.status(500).json({ erro: "Erro no cadastro da empresa ou do administrador." });
    });
}

function listarEmpresas(req, res) {
    empresaModel.listarTodas()
      .then(empresas => {
        res.status(200).json(empresas);
      })
      .catch(erro => {
        console.error("Erro ao listar empresas:", erro);
        res.status(500).json({ erro: "Erro ao buscar empresas." });
      });
  }

  function excluirEmpresa(req, res) {
    const idEmpresa = req.params.id;
  
    empresaModel.excluirEmpresaComUsuarios(idEmpresa)
      .then(() => {
        res.status(200).send("Empresa e seus usuários foram excluídos com sucesso.");
      })
      .catch(erro => {
        console.error("Erro ao excluir empresa e usuários:", erro);
        res.status(500).json({ erro: "Erro ao excluir empresa e usuários." });
      });
  }
  
  
module.exports = {
  cadastrarComAdmin, listarEmpresas, excluirEmpresa
};