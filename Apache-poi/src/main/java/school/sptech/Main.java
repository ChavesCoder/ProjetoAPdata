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
        String nomeArquivo2 = "Sidra.xlsx";

        Path caminho = Path.of(nomeArquivo);
        InputStream arquivo = Files.newInputStream(caminho);
        Workbook workbook = WorkbookFactory.create(arquivo);

        Path caminho2 = Path.of(nomeArquivo2);
        InputStream arquivo2 = Files.newInputStream(caminho2);
        Workbook workbookSidra = WorkbookFactory.create(arquivo2);

        System.out.println("Arquivos carregados com sucesso!");

        LeitorExcel leitorExcel = new LeitorExcel();
        List<Indice> indicesExtraidas = leitorExcel.extrairIndice(nomeArquivo, workbook);
        List<Variacao> variacoesExtraidas = leitorExcel.extrairVariacao(nomeArquivo, workbook);
        List<PrecoMedio> precoMediosExtraidos = leitorExcel.extrairPrecoMedio(nomeArquivo, workbook);
        List<SidraProprio> sidraPropriosExtraidos = leitorExcel.extrairSidraProprio(nomeArquivo2, workbookSidra);
        List<SidraAlugado> sidraAlugadosExtraidos = leitorExcel.extrairSidraAlugado(nomeArquivo2, workbookSidra);


        for (Indice indice : indicesExtraidas){
            System.out.println(indice);
        }

        System.out.println("Indices extraidos");

        for (Variacao variacao : variacoesExtraidas){
            System.out.println(variacao);
        }

        System.out.println("Variações extraidas");

        for (PrecoMedio precoMedio : precoMediosExtraidos) {
            System.out.println(precoMedio);
        }
        System.out.println("Preço medio extraido");

        for (SidraProprio sidraProprio : sidraPropriosExtraidos){
            System.out.println(sidraProprio);
        }

        for (SidraAlugado sidraAlugado : sidraAlugadosExtraidos){
            System.out.println(sidraAlugado);
        }


        System.out.println("Total de linhas extraidas: " + leitorExcel.getContadorLinhas());
        arquivo.close();
        arquivo2.close();

        S3Main s3 = new S3Main();
        s3.listarBucket();
        s3.listarObj();
        s3.downloadArquivos();
    }
}