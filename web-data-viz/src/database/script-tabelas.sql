-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/


/*CREATE DATABASE aquatech;

USE aquatech;

CREATE TABLE empresa (
	id INT PRIMARY KEY AUTO_INCREMENT,
	razao_social VARCHAR(50),
	cnpj CHAR(14),
	codigo_ativacao VARCHAR(50)
);

CREATE TABLE usuario (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(50),
	email VARCHAR(50),
	senha VARCHAR(50),
	fk_empresa INT,
	FOREIGN KEY (fk_empresa) REFERENCES empresa(id)
);

CREATE TABLE aviso (
	id INT PRIMARY KEY AUTO_INCREMENT,
	titulo VARCHAR(100),
	descricao VARCHAR(150),
	fk_usuario INT,
	FOREIGN KEY (fk_usuario) REFERENCES usuario(id)
);

create table aquario (
/* em nossa regra de negócio, um aquario tem apenas um sensor */
	id INT PRIMARY KEY AUTO_INCREMENT,
	descricao VARCHAR(300),
	fk_empresa INT,
	FOREIGN KEY (fk_empresa) REFERENCES empresa(id)
);

/* esta tabela deve estar de acordo com o que está em INSERT de sua API do arduino - dat-acqu-ino */

create table medida (
	id INT PRIMARY KEY AUTO_INCREMENT,
	dht11_umidade DECIMAL,
	dht11_temperatura DECIMAL,
	luminosidade DECIMAL,
	lm35_temperatura DECIMAL,
	chave TINYINT,
	momento DATETIME,
	fk_aquario INT,
	FOREIGN KEY (fk_aquario) REFERENCES aquario(id)
);

insert into empresa (razao_social, codigo_ativacao) values ('Empresa 1', 'ED145B');
insert into empresa (razao_social, codigo_ativacao) values ('Empresa 2', 'A1B2C3');
insert into aquario (descricao, fk_empresa) values ('Aquário de Estrela-do-mar', 1);
insert into aquario (descricao, fk_empresa) values ('Aquário de Peixe-dourado', 2); */

-- Criação do banco de dados
CREATE DATABASE APDATABD;

-- Utilizando o banco APDATABD
USE APDATABD;

-- Tabela de empresas
CREATE TABLE empresa (
    idEmpresa INT AUTO_INCREMENT PRIMARY KEY,
    nomeEmpresa VARCHAR(45),
    nomeFicticio VARCHAR(45),
    cnpj CHAR(14) UNIQUE,
    endereco VARCHAR(45),
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
    cpf CHAR(11) UNIQUE,
    perfil ENUM('admin', 'analista', 'gerente', 'outro') DEFAULT 'analista',
    fkEmpresa INT,
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa)
);

-- Tabela de regiões
CREATE TABLE regiao (
    idRegiao INT AUTO_INCREMENT PRIMARY KEY,
    estado VARCHAR(45),
    municipio VARCHAR(45),
    zona VARCHAR(45),
    condicaoDomicilio VARCHAR(45),
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
    datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo VARCHAR(45),
    especificacao VARCHAR(45), 
    descricao TEXT
);