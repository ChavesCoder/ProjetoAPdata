package school.sptech.data;

import java.time.LocalDate;

public class Dados {
    private String regiao;
    private LocalDate data;
    private Double total;
    private Double d1;
    private Double d2;
    private Double d3;
    private Double d4;


    public Dados() {
    }

    public Dados(String regiao, LocalDate data, Double total, Double d1, Double d2, Double d3, Double d4) {
        this.regiao = regiao;
        this.data = data;
        this.total = total;
        this.d1 = d1;
        this.d2 = d2;
        this.d3 = d3;
        this.d4 = d4;
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
        return "Dados{" +
                "regiao='" + regiao + '\'' +
                ", data=" + data +
                ", total=" + total +
                ", d1=" + d1 +
                ", d2=" + d2 +
                ", d3=" + d3 +
                ", d4=" + d4 +
                '}';
    }
}
