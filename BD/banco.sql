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


		-- Tabela separada para variação mensal
		CREATE TABLE varMensal (
			idVarMensal INT AUTO_INCREMENT PRIMARY KEY,
			total DECIMAL(12,2), 
			umDormitorio DECIMAL(12,2),
			doisDormitorios DECIMAL(12,2),
			tresDormitorios DECIMAL(12,2),
			quatroDormitorios DECIMAL(12,2)
		);


		CREATE TABLE precoMedio (
			idPrecoMedio INT AUTO_INCREMENT PRIMARY KEY,
			total DECIMAL(12,2), 
			umDormitorio DECIMAL(12,2),
			doisDormitorios DECIMAL(12,2),
			tresDormitorios DECIMAL(12,2),
			quatroDormitorios DECIMAL(12,2)
		);
        
        	-- Tabela de periodo
		CREATE TABLE periodo (
			idPeriodo INT AUTO_INCREMENT PRIMARY KEY,
			periodo DATE,
			fkPrecoMedio INT,
			fkVarMensal INT,
			FOREIGN KEY (fkPrecoMedio) REFERENCES precoMedio(idPrecoMedio),
			FOREIGN KEY (fkVarMensal) REFERENCES varMensal(idVarMensal)
		);
        
		-- Tabela de regiões
		CREATE TABLE regiao (
			idRegiao INT AUTO_INCREMENT PRIMARY KEY,
			municipio VARCHAR(45),
			qtdRegistros INT,
            fkPeriodo INT,
            FOREIGN KEY (fkPeriodo) REFERENCES periodo(idPeriodo)
		);


		CREATE TABLE sidraProprio (
			idSidraProprio INT AUTO_INCREMENT PRIMARY KEY,
			total DECIMAL(12,2),
			umMorador DECIMAL(12,2),
			doisMoradores DECIMAL(12,2),
			tresMoradores DECIMAL(12,2),
			quatroMoradoresOuMais DECIMAL(12,2),
            fkRegiao INT,
            FOREIGN KEY (fkRegiao) REFERENCES regiao(idRegiao)
		);

		CREATE TABLE sidraAlugado (
			idSidraProprio INT AUTO_INCREMENT PRIMARY KEY,
			total DECIMAL(12,2),
			umMorador DECIMAL(12,2),
			doisMoradores DECIMAL(12,2),
			tresMoradores DECIMAL(12,2),
			quatroMoradoresOuMais DECIMAL(12,2),
            fkRegiao INT,
            FOREIGN KEY (fkRegiao) REFERENCES regiao(idRegiao)
		);

		-- Tabela de logs (ligada ao usuário que realizou a ação)
		CREATE TABLE log (
			id_log INT AUTO_INCREMENT PRIMARY KEY,
			dataHora DATETIME DEFAULT CURRENT_TIMESTAMP,
			tipo VARCHAR(45),
			especificacao VARCHAR(45), 
			descricao TEXT
		);