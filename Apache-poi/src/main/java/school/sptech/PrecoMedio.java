package school.sptech;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class PrecoMedio {
    private Integer id;
    private String regiao;
    private LocalDate data;
    private Double total;
    private Double d1;
    private Double d2;
    private Double d3;
    private Double d4;

    public PrecoMedio() {
    }

    public PrecoMedio(Integer id, String regiao, LocalDate data, Double total, Double d1, Double d2, Double d3, Double d4) {
        this.id = id;
        this.regiao = regiao;
        this.data = data;
        this.total = total;
        this.d1 = d1;
        this.d2 = d2;
        this.d3 = d3;
        this.d4 = d4;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getRegiao() {
        return regiao;
    }

    public void setRegiao(String regiao) {
        this.regiao = regiao;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public Double getD1() {
        return d1;
    }

    public void setD1(Double d1) {
        this.d1 = d1;
    }

    public Double getD2() {
        return d2;
    }

    public void setD2(Double d2) {
        this.d2 = d2;
    }

    public Double getD3() {
        return d3;
    }

    public void setD3(Double d3) {
        this.d3 = d3;
    }

    public Double getD4() {
        return d4;
    }

    public void setD4(Double d4) {
        this.d4 = d4;
    }

    @Override
    public String toString() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return String.format(
                "%s | (informação) | \"registroPrecoMedio\" - Preço médio registrado para a região '%s'. Valores:\n" +
                        "   • Total: %.2f | Econômico: %.2f | Acessibilidade: %.2f | Segurança: %.2f | Qualidade de vida: %.2f",
                data.format(formatter), regiao, total, d1, d2, d3, d4
        );
    }
}
