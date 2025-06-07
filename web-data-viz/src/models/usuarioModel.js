var database = require("../database/config")

function autenticar(emailVar, senhaVar) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", emailVar, senhaVar)
    var instrucaoSql = `
    SELECT idUsuario , nome, email, fkEmpresa 
        FROM usuario WHERE email = '${emailVar}' AND senha = '${senhaVar}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrar(nomeVar,emailVar,  senhaVar,  telefoneVar,  tipoVar, fkEmpresaVar) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nomeVar, emailVar, senhaVar, telefoneVar, tipoVar/*, fkEmpresaVar*/);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
            INSERT INTO usuario (nome, email, senha, telefone, tipoUsuario, fkEmpresa) VALUES ('${nomeVar}', '${emailVar}', '${senhaVar}','${telefoneVar}','${tipoVar}','${fkEmpresaVar}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarUsuario(nome, email, senha, telefone, fkEmpresa) {
    var instrucaoSql = `
      INSERT INTO usuario (nome, email, senha, telefone, tipoUsuario, fkEmpresa)
      VALUES ('${nome}', '${email}', '${senha}', '${telefone}','Administrador', ${fkEmpresa})
    `;
    return database.executar(instrucaoSql);
  }

  
module.exports = {
    autenticar,
    cadastrar,
    cadastrarUsuario
};