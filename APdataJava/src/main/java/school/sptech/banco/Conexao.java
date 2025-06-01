package school.sptech.banco;

import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

public class Conexao {
    private DataSource conexao;

    public Conexao() {

        DriverManagerDataSource driver  = new DriverManagerDataSource();

        driver.setUrl("jdbc:mysql://mysql_container:3306/APDATABD");
        driver.setUsername("root");
        driver.setPassword("urubu100");
        driver.setDriverClassName("com.mysql.cj.jdbc.Driver");

        this.conexao = driver;
    }

    public DataSource getConexao(){

        return this.conexao;

    }
}
