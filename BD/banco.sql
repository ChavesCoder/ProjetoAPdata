	-- DROP database apdatabd;

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
		CREATE TABLE Regiao (
			idRegiao INT AUTO_INCREMENT PRIMARY KEY,
			municipio VARCHAR(45),
			qtdRegistros INT
		);




		-- Tabela separada para variação mensal
		CREATE TABLE VarMensal (
			idVarMensal INT AUTO_INCREMENT PRIMARY KEY,
            periodo DATE,
			total DECIMAL(23,20),
			umDormitorio DECIMAL(23,20),
			doisDormitorios DECIMAL(23,20),
			tresDormitorios DECIMAL(23,20),
			quatroDormitorios DECIMAL(23,20),
            fkRegiao INT,
            FOREIGN KEY (fkRegiao) REFERENCES Regiao(idRegiao)
		);


		CREATE TABLE PrecoMedio (
			idPrecoMedio INT AUTO_INCREMENT PRIMARY KEY,
            periodo DATE,
			total DOUBLE,
			umDormitorio DOUBLE,
			doisDormitorios DOUBLE,
			tresDormitorios DOUBLE,
			quatroDormitorios DOUBLE,
            fkRegiao INT,
            FOREIGN KEY (fkRegiao) REFERENCES Regiao(idRegiao)
		);


        CREATE TABLE Indice (
			idIndice INT AUTO_INCREMENT PRIMARY KEY,
            periodo DATE,
			total DECIMAL(23,20),
			umDormitorio DECIMAL(23,20),
			doisDormitorios DECIMAL(23,20),
			tresDormitorios DECIMAL(23,20),
			quatroDormitorios DECIMAL(23,20),
            fkRegiao INT,
            FOREIGN KEY (fkRegiao) REFERENCES Regiao(idRegiao)
		);


		CREATE TABLE SidraProprio (
			idSidraProprio INT AUTO_INCREMENT PRIMARY KEY,
			total DECIMAL(5,2),
			umMorador DECIMAL(5,2),
			doisMoradores DECIMAL(5,2),
			tresMoradores DECIMAL(5,2),
			quatroMoradoresOuMais DECIMAL(5,2),
            fkRegiao INT,
            FOREIGN KEY (fkRegiao) REFERENCES Regiao(idRegiao)
		);

		CREATE TABLE SidraAlugado (
			idSidraProprio INT AUTO_INCREMENT PRIMARY KEY,
			total DECIMAL(5,2),
			umMorador DECIMAL(5,2),
			doisMoradores DECIMAL(5,2),
			tresMoradores DECIMAL(5,2),
			quatroMoradoresOuMais DECIMAL(5,2),
            fkRegiao INT,
            FOREIGN KEY (fkRegiao) REFERENCES Regiao(idRegiao)
		);

		-- Tabela de logs (ligada ao usuário que realizou a ação)
		CREATE TABLE log (
			id_log INT AUTO_INCREMENT PRIMARY KEY,
			dataHora DATETIME DEFAULT CURRENT_TIMESTAMP,
			tipo VARCHAR(45),
			descricao TEXT
		);

        -- Inserts na tabela regiao (cidades da sua imagem)
INSERT INTO Regiao (municipio, qtdRegistros) VALUES
('São Paulo', 100),
('Barueri', 80),
('Campinas', 90),
('Diadema', 70),
('Guarujá', 60),
('Guarulhos', 85),
('Osasco', 75),
('Praia Grande', 65),
('Ribeirão Preto', 95),
('Santo André', 88),
('Santos', 77),
('São Bernardo do Campo', 83),
('São Caetano do Sul', 79),
('São José do Rio Preto', 68),
('São José dos Campos', 74),
('São Vicente', 63);

        SELECT * FROM log LIMIT 0, 10000000;