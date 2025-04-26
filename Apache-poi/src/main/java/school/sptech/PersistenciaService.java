package school.sptech;

import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class PersistenciaService {
    public void insertVariacao(List<Indice> indicesExtraidas, List<Variacao> variacoesExtraidas, List<PrecoMedio> precoMediosExtraidos){


        JdbcTemplate jdbcTemplate = new JdbcTemplate(basicDataSource);

    }
}
