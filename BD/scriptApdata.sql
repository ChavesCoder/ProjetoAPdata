-- Criação do banco de dados

CREATE DATABASE APDATABD;
-- Utilizando o banco APDATABD
USE APDATABD;

-- Tabela de empresas
CREATE TABLE empresa (
    idEmpresa INT AUTO_INCREMENT PRIMARY KEY,
    razaoSocial VARCHAR(45),
    nomeFicticio VARCHAR(45),
    cnpj CHAR(14) UNIQUE,
    CEP VARCHAR(45),
    email VARCHAR(45),
    senha VARCHAR(45),
    telefone VARCHAR(20)
);

-- Tabela de usuários/funcionários
CREATE TABLE usuario(
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(45),
    email VARCHAR(45),
    senha VARCHAR(45),
    telefone CHAR(11),
    tipoUsuario ENUM('Administrador', 'Comum') DEFAULT 'Comum',
    fkEmpresa INT,
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa)
);

-- Tabela de regiões
CREATE TABLE regiao (
    idRegiao INT AUTO_INCREMENT PRIMARY KEY,
    municipio VARCHAR(45),
    porcentagem VARCHAR(45),
    ano DATE,
    qtdRegistros INT
);

-- Tabela separada para preços por dormitório (flexível para mais tipos no futuro)
CREATE TABLE precoDormitorio (
    idPreco INT AUTO_INCREMENT PRIMARY KEY,
    dormitorios TINYINT, -- 1, 2, 3, 4...
    precoMedio DECIMAL(12,2)
);


-- Tabela de indicadores de mercado
CREATE TABLE indicadoresMercado (
    idIndicador INT AUTO_INCREMENT PRIMARY KEY,
    numIndice INT,
    variacaoMensal DECIMAL(5,2),
    rentabilidadeMensal DECIMAL(5,2),
    qtdMoradores INT,
    fkRegiao INT,
    fkprecoDormitorio INT, 
    FOREIGN KEY (fkRegiao) REFERENCES regiao(idRegiao),
    FOREIGN KEY (fkprecoDormitorio) REFERENCES precoDormitorio(idPreco)
);

-- Tabela de logs (ligada ao usuário que realizou a ação)
CREATE TABLE log (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    dataHora DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo VARCHAR(45),
    especificacao VARCHAR(45), 
    descricao TEXT
);






