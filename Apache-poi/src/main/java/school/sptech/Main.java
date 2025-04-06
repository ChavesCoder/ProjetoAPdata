package school.sptech;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class Main {
    public static void main(String[] args) throws IOException {

        String nomeArquivo = "fipezap-serieshistoricas.xlsx";

        Path caminho = Path.of(nomeArquivo);
        InputStream arquivo = Files.newInputStream(caminho);
        System.out.println("Arquivo carregado com sucesso!");

        LeitorExcel leitorExcel = new LeitorExcel();
        List<Indice> indicesExtraidas = leitorExcel.extrairIndice(nomeArquivo, arquivo);

        arquivo.close();

        for (Indice indice : indicesExtraidas){
            System.out.println(indice);
        }

        System.out.println("Indices extraidos");

    }
}