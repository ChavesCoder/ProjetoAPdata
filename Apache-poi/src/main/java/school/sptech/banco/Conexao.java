package school.sptech.banco;

import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

public class Conexao {
    private DataSource conexao;

    public Conexao() {

        DriverManagerDataSource driver  = new DriverManagerDataSource();

        driver.setUrl("jdbc:mysql://localhost:3306/APDATABD");
        driver.setUsername("root");
        driver.setPassword("010905");
        driver.setDriverClassName("com.mysql.cj.jdbc.Driver");

        // Abaixo tem uma conexao H2, um banco armazenado na memoria
        //driver.setUsername("sa");
        //driver.setPassword("");
        //driver.setUrl("jdbc:h2:file:./banco-de-dados");
        //driver.setDriverClassName("org.h2.Driver");
        this.conexao = driver;
    }

    public DataSource getConexao(){

        return this.conexao;

    }
}
