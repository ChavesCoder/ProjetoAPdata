package school.sptech;

import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class Main {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");

    public static void main(String[] args) throws IOException {
        logInfo("Início - Iniciando o carregamento dos arquivos Excel.");


        String nomeArquivo = "fipezap-serieshistoricas.xlsx";
        String nomeArquivo2 = "Sidra.xlsx";

        Path caminho = Path.of(nomeArquivo);
        InputStream arquivo = Files.newInputStream(caminho);
        Workbook workbook = WorkbookFactory.create(arquivo);

        Path caminho2 = Path.of(nomeArquivo2);
        InputStream arquivo2 = Files.newInputStream(caminho2);
        Workbook workbookSidra = WorkbookFactory.create(arquivo2);

        logInfo("Arquivos carregados com sucesso - 'fipezap-serieshistoricas.xlsx' e 'Sidra.xlsx'.");

        LeitorExcel leitorExcel = new LeitorExcel();

        logInfo("Extração - Iniciando extração dos dados de FIPEZAP.");
        List<Indice> indicesExtraidas = leitorExcel.extrairIndice(nomeArquivo, workbook);
        List<Variacao> variacoesExtraidas = leitorExcel.extrairVariacao(nomeArquivo, workbook);
        List<PrecoMedio> precoMediosExtraidos = leitorExcel.extrairPrecoMedio(nomeArquivo, workbook);
        logInfo("Extração - Dados de FIPEZAP extraídos com sucesso.");

        precoMediosExtraidos.stream()
                .map(PrecoMedio::getRegiao)
                .distinct()
                .forEach(regiao -> logInfo("Extração - Região '" + regiao + "' extraída com sucesso (FIPEZAP)."));

        logInfo("Resumo - FIPEZAP: " +
                indicesExtraidas.size() + " índices, " +
                variacoesExtraidas.size() + " variações, " +
                precoMediosExtraidos.size() + " preços médios extraídos.");

        logInfo("Extração - Iniciando extração dos dados de SIDRA.");
        List<SidraProprio> sidraPropriosExtraidos = leitorExcel.extrairSidraProprio(nomeArquivo2, workbookSidra);
        List<SidraAlugado> sidraAlugadosExtraidos = leitorExcel.extrairSidraAlugado(nomeArquivo2, workbookSidra);
        logInfo("Extração - Dados de SIDRA extraídos com sucesso.");

//
//        for (Indice indice : indicesExtraidas){
//            System.out.println(indice);
//        }
//
//        System.out.println("Indices extraidos");
//
//        for (Variacao variacao : variacoesExtraidas){
//            System.out.println(variacao);
//        }
//
//        System.out.println("Variações extraidas");
//
//        for (PrecoMedio precoMedio : precoMediosExtraidos){
//            System.out.println(precoMedio);
//
//        System.out.println("Preço medio extraido");

        sidraAlugadosExtraidos.stream()
                .map(SidraAlugado::getRegiao)
                .distinct()
                .forEach(regiao -> logInfo("Extração - Região '" + regiao + "' extraída com sucesso (SIDRA - Alugado)."));

        logInfo("Extração - Impressão dos dados concluída.");
        logInfo("Resumo - Total de linhas extraídas: " + leitorExcel.getContadorLinhas());


        System.out.println("Total de linhas extraidas: " + leitorExcel.getContadorLinhas());
        arquivo.close();
        arquivo2.close();


        S3Main s3Main = new S3Main();
        s3Main.listarBucket();
        s3Main.listarObj();
        s3Main.downloadArquivos();
    }

    private static void logInfo(String mensagem) {
        String timestamp = LocalDateTime.now().format(FORMATTER);
        System.out.println(timestamp + " | (INFO) | " + mensagem);
    }




}
