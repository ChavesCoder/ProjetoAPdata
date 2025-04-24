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
    telefone CHAR(11),
    tipoUsuario ENUM('Administrador', 'Comum') DEFAULT 'Comum',
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


-- Inserts para empresa
INSERT INTO empresa (nomeEmpresa, nomeFicticio, cnpj, endereco, email, senha, telefone)
VALUES 
('Construtora Brasil LTDA', 'Construbras', '12345678000199', 'Rua das Palmeiras, 100', 'contato@construbras.com', 'senha123', '(11) 99999-9999'),
('Imobiliária Alpha', 'Alpha Imóveis', '98765432000155', 'Av. Central, 200', 'suporte@alphaimoveis.com', 'alpha456', '(21) 98888-8888');

-- Inserts para usuario
INSERT INTO usuario (nome, email, senha, telefone,tipoUsuario, fkEmpresa)
VALUES 
('João Silva', 'joao@construbras.com', '1234', '12345678910', 'Administrador', 1),
('Maria Oliveira', 'maria@alphaimoveis.com', '5678', '11111111111', 'Comum', 2);

-- Inserts para regiao
INSERT INTO regiao (estado, municipio, zona, condicaoDomicilio, ano, qtdRegistros)
VALUES 
('SP', 'São Paulo', 'Zona Sul', 'ProprioMorador', '2023-01-01', 150),
('SP', 'Barueri', 'Zona Norte', 'Alugado', '2023-01-01', 120);

-- Inserts para precoDormitorio
INSERT INTO precoDormitorio (dormitorios, precoMedio)
VALUES 
(2, 53.8),
(3, 48.9);

-- Inserts para indicadoresMercado
INSERT INTO indicadoresMercado (numIndice, variacaoMensal, rentabilidadeMensal, qtdMoradores, fkRegiao, fkprecoDormitorio)
VALUES 
(268.5, 0.41, 0.52, 3, 1, 1),
(269.6, 0.40, 0.51, 4, 2, 2);

-- Inserts para log
INSERT INTO log (tipo, especificacao, descricao)
VALUES 
('INSERT', 'usuario', 'Usuário João Silva cadastrado no sistema'),
('INSERT', 'indicadoresMercado', 'Indicador de mercado adicionado para São Paulo e 2 dormitórios');

SELECT idUsuario AS id, nome, email, fkEmpresa AS empresaId 
        FROM usuario WHERE email = 'joao@construbras.com' AND senha = '1234';
        
       select * from usuario;
       
               INSERT INTO usuario (nome, email, senha, telefone, tipoUsuario, fkEmpresa) VALUES ('TEste', 'teste@gmail.com', '12345','1111111111','Comum', 1);

