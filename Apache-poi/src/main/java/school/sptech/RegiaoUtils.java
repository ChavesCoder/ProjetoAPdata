package school.sptech;


public class RegiaoUtils {
    public static Integer obterFkRegiao(String regiao) {
        return switch (regiao) {
            case "São Paulo" -> 1;
            case "Barueri" -> 2;
            case "Campinas" -> 3;
            case "Diadema" -> 4;
            case "Guarujá" -> 5;
            case "Guarulhos" -> 6;
            case "Osasco" -> 7;
            case "Praia Grande" -> 8;
            case "Ribeirão Preto" -> 9;
            case "Santo André" -> 10;
            case "Santos" -> 11;
            case "São Bernardo do Campo" -> 12;
            case "São Caetano do Sul" -> 13;
            case "São José do Rio Preto" -> 14;
            case "São José dos Campos" -> 15;
            case "São Vicente" -> 16;
            default -> 1;
        };
    }
}
