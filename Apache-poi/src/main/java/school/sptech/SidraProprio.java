package school.sptech;

public class SidraProprio {
    private Integer id;
    private String regiao;
    private Double total;
    private Double umMorador;
    private Double doisMoradores;
    private Double tresMoradores;
    private Double quatroMoradoresOuMais;

    public SidraProprio() {
    }

    public SidraProprio(Integer id, String regiao, Double total, Double umMorador, Double doisMoradores, Double tresMoradores, Double quatroMoradoresOuMais) {
        this.id = id;
        this.regiao = regiao;
        this.total = total;
        this.umMorador = umMorador;
        this.doisMoradores = doisMoradores;
        this.tresMoradores = tresMoradores;
        this.quatroMoradoresOuMais = quatroMoradoresOuMais;
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

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public Double getUmMorador() {
        return umMorador;
    }

    public void setUmMorador(Double umMorador) {
        this.umMorador = umMorador;
    }

    public Double getDoisMoradores() {
        return doisMoradores;
    }

    public void setDoisMoradores(Double doisMoradores) {
        this.doisMoradores = doisMoradores;
    }

    public Double getTresMoradores() {
        return tresMoradores;
    }

    public void setTresMoradores(Double tresMoradores) {
        this.tresMoradores = tresMoradores;
    }

    public Double getQuatroMoradoresOuMais() {
        return quatroMoradoresOuMais;
    }

    public void setQuatroMoradoresOuMais(Double quatroMoradoresOuMais) {
        this.quatroMoradoresOuMais = quatroMoradoresOuMais;
    }

    @Override
    public String toString() {
        return "SidraProprio{" +
                "id=" + id +
                ", regiao='" + regiao + '\'' +
                ", total=" + total +
                ", umMorador=" + umMorador +
                ", doisMoradores=" + doisMoradores +
                ", tresMoradores=" + tresMoradores +
                ", quatroMoradoresOuMais=" + quatroMoradoresOuMais +
                '}';
    }
}
