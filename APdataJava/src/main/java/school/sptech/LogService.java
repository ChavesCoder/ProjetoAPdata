package school.sptech;

import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDateTime;


public class LogService {

    private final JdbcTemplate template;

    public LogService(JdbcTemplate template) {
        this.template = template;
    }

    public void salvarLog(String mensagem) {
        template.update(
                "INSERT INTO log (dataHora, tipo, descricao) VALUES (?, ?, ?)",
                LocalDateTime.now(),"(INFO)", mensagem
        );
    }
}
