var database = require("../database/config");

function buscarPorId(id) {
  var instrucaoSql = `SELECT * FROM empresa WHERE id = '${id}'`;

  return database.executar(instrucaoSql);
}

function listar() {
  var instrucaoSql = `SELECT id, razao_social, cnpj, codigo_ativacao FROM empresa`;

  return database.executar(instrucaoSql);
}

function buscarPorCnpj(cnpj) {
  var instrucaoSql = `SELECT * FROM empresa WHERE cnpj = '${cnpj}'`;

  return database.executar(instrucaoSql);
}

function cadastrar(razaoSocial, cnpj) {
  var instrucaoSql = `INSERT INTO empresa (razao_social, cnpj) VALUES ('${razaoSocial}', '${cnpj}')`;

  return database.executar(instrucaoSql);
}

function cadastrarEmpresa(razao, fantasia, cnpj, telefone, email, endereco) {
  const instrucaoSql = `
    INSERT INTO empresa (razaoSocial, nomeFicticio, cnpj, telefone, email, endereco)
    VALUES ('${razao}', '${fantasia}', '${cnpj}', '${telefone}', '${email}', '${endereco}')
  `;
  return database.executar(instrucaoSql);
}

function listarTodas() {
  const instrucaoSql = `SELECT idEmpresa, razaoSocial, nomeFicticio, email FROM empresa`;
  return database.executar(instrucaoSql);
}

function excluirEmpresaComUsuarios(id) {
  const sqlExcluirUsuarios = `DELETE FROM usuario WHERE fkEmpresa = ${id}`;
  const sqlExcluirEmpresa = `DELETE FROM empresa WHERE idEmpresa = ${id}`;

  return database.executar(sqlExcluirUsuarios)
    .then(() => database.executar(sqlExcluirEmpresa));
}

module.exports = { buscarPorCnpj, buscarPorId, cadastrar, listar, cadastrarEmpresa, listarTodas, excluirEmpresaComUsuarios};
