package school.sptech;

import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;

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
        Workbook workbook = WorkbookFactory.create(arquivo);

        System.out.println("Arquivo carregado com sucesso!");

        LeitorExcel leitorExcel = new LeitorExcel();
        List<Indice> indicesExtraidas = leitorExcel.extrairIndice(nomeArquivo, workbook);
        List<Variacao> variacoesExtraidas = leitorExcel.extrairVariacao(nomeArquivo, workbook);
        List<PrecoMedio> precoMediosExtraidos = leitorExcel.extrairPrecoMedio(nomeArquivo, workbook);


        for (Indice indice : indicesExtraidas){
            System.out.println(indice);
        }

        System.out.println("Indices extraidos");

        for (Variacao variacao : variacoesExtraidas){
            System.out.println(variacao);
        }

        System.out.println("Variações extraidas");

        for (PrecoMedio precoMedio : precoMediosExtraidos){
            System.out.println(precoMedio);
        }

        System.out.println("Preço medio extraido");

        System.out.println("Total de linhas extraidas: " + leitorExcel.getContadorLinhas());
        arquivo.close();
    }
}