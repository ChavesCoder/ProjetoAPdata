package school.sptech;

import org.springframework.jdbc.core.JdbcTemplate;
import school.sptech.banco.Conexao;

import java.util.List;

public class PersistenciaService {

    private final JdbcTemplate template;

    public PersistenciaService(JdbcTemplate template) {
        this.template = template;
    }

    public void insertVariacao(List<Indice> indicesExtraidas){
        for (int i = 0; i < indicesExtraidas.size(); i++) {

            Integer fkRegiao = 1;
            switch (indicesExtraidas.get(i).getRegiao()) {
                case "São Paulo" -> fkRegiao = 1;
                case "Barueri" -> fkRegiao = 2;
                case "Campinas" -> fkRegiao = 3;
                case "Diadema" -> fkRegiao = 4;
                case "Guarujá" -> fkRegiao = 5;
                case "Guarulhos" -> fkRegiao = 6;
                case "Osasco" -> fkRegiao = 7;
                case "Praia Grande" -> fkRegiao = 8;
                case "Ribeirão Preto" -> fkRegiao = 9;
                case "Santo André" -> fkRegiao = 10;
                case "Santos" -> fkRegiao = 11;
                case "São Bernardo do Campo" -> fkRegiao = 12;
                case "São Caetano do Sul" -> fkRegiao = 13;
                case "São José do Rio Preto" -> fkRegiao = 14;
                case "São José dos Campos" -> fkRegiao = 15;
                case "São Vicente" -> fkRegiao = 16;
            }

            template.update(
                    "INSERT INTO indice (periodo, total, umDormitorio, doisDormitorios, tresDormitorios, quatroDormitorios, fkRegiao) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    indicesExtraidas.get(i).getData(), indicesExtraidas.get(i).getTotal(), indicesExtraidas.get(i).getD1(),
                    indicesExtraidas.get(i).getD2(), indicesExtraidas.get(i).getD3(), indicesExtraidas.get(i).getD4(),
                    fkRegiao
            );


        }


    }
}
