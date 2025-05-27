package school.sptech;

import org.springframework.jdbc.core.JdbcTemplate;
import school.sptech.banco.Conexao;
import school.sptech.RegiaoUtils;
import school.sptech.data.DadosIndice;
import school.sptech.data.DadosPrecoMedio;
import school.sptech.data.DadosVariacao;

import java.util.List;

public class PersistenciaService {

    private final JdbcTemplate template;

    public PersistenciaService(JdbcTemplate template) {
        this.template = template;
    }

    public void insertIndice(List<DadosIndice> indicesExtraidas){
        for (int i = 0; i < indicesExtraidas.size(); i++) {

            Integer fkRegiao = RegiaoUtils.obterFkRegiao(indicesExtraidas.get(i).getRegiao());

            template.update(
                    "INSERT INTO Indice (periodo, total, umDormitorio, doisDormitorios, tresDormitorios, quatroDormitorios, fkRegiao) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    indicesExtraidas.get(i).getData(), indicesExtraidas.get(i).getTotal(), indicesExtraidas.get(i).getD1(),
                    indicesExtraidas.get(i).getD2(), indicesExtraidas.get(i).getD3(), indicesExtraidas.get(i).getD4(),
                    fkRegiao
            );
        }
    }
    public void insertVariacao(List<DadosVariacao> variacoesExtraidas){
        for (int i = 0; i < variacoesExtraidas.size(); i++) {

            Integer fkRegiao = RegiaoUtils.obterFkRegiao(variacoesExtraidas.get(i).getRegiao());

            template.update(
                    "INSERT INTO VarMensal (periodo, total, umDormitorio, doisDormitorios, tresDormitorios, quatroDormitorios, fkRegiao) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    variacoesExtraidas.get(i).getData(), variacoesExtraidas.get(i).getTotal(), variacoesExtraidas.get(i).getD1(),
                    variacoesExtraidas.get(i).getD2(), variacoesExtraidas.get(i).getD3(), variacoesExtraidas.get(i).getD4(),
                    fkRegiao
            );
        }
    }
    public void insertPrecoMedio(List<DadosPrecoMedio> precoMediosExtraidos){
        for (int i = 0; i < precoMediosExtraidos.size(); i++) {

            Integer fkRegiao = RegiaoUtils.obterFkRegiao(precoMediosExtraidos.get(i).getRegiao());

            template.update(
                    "INSERT INTO PrecoMedio (periodo, total, umDormitorio, doisDormitorios, tresDormitorios, quatroDormitorios, fkRegiao) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    precoMediosExtraidos.get(i).getData(), precoMediosExtraidos.get(i).getTotal(), precoMediosExtraidos.get(i).getD1(),
                    precoMediosExtraidos.get(i).getD2(), precoMediosExtraidos.get(i).getD3(), precoMediosExtraidos.get(i).getD4(),
                    fkRegiao
            );
        }
    }
    public void insertSidraProprio(List<SidraProprio> sidraPropriosExtraidos){
        for (int i = 0; i < sidraPropriosExtraidos.size(); i++) {

            Integer fkRegiao = RegiaoUtils.obterFkRegiao(sidraPropriosExtraidos.get(i).getRegiao());

            template.update(
                    "INSERT INTO SidraProprio (total, umMorador, doisMoradores, tresMoradores, quatroMoradoresOuMais, fkRegiao) VALUES (?, ?, ?, ?, ?, ?)",
                    sidraPropriosExtraidos.get(i).getTotal(), sidraPropriosExtraidos.get(i).getUmMorador(),
                    sidraPropriosExtraidos.get(i).getDoisMoradores(), sidraPropriosExtraidos.get(i).getTresMoradores(), sidraPropriosExtraidos.get(i).getQuatroMoradoresOuMais(),
                    fkRegiao
            );
        }
    }
    public void insertSidraAlugado(List<SidraAlugado> sidraAlugadosExtraidos){
        for (int i = 0; i < sidraAlugadosExtraidos.size(); i++) {

            Integer fkRegiao = RegiaoUtils.obterFkRegiao(sidraAlugadosExtraidos.get(i).getRegiao());

            template.update(
                    "INSERT INTO SidraAlugado (total, umMorador, doisMoradores, tresMoradores, quatroMoradoresOuMais, fkRegiao) VALUES (?, ?, ?, ?, ?, ?)",
                    sidraAlugadosExtraidos.get(i).getTotal(), sidraAlugadosExtraidos.get(i).getUmMorador(),
                    sidraAlugadosExtraidos.get(i).getDoisMoradores(), sidraAlugadosExtraidos.get(i).getTresMoradores(), sidraAlugadosExtraidos.get(i).getQuatroMoradoresOuMais(),
                    fkRegiao
            );
        }
    }
}
