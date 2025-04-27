package school.sptech;

import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import school.sptech.banco.Conexao;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class Main {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
    private static LogService logService;

    public static void main(String[] args) throws IOException {

        Conexao conexao = new Conexao();
        try (Connection conn = conexao.getConexao().getConnection()) {
            if (conn != null && !conn.isClosed()) {
                System.out.println("Conexão bem-sucedida!");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        // Uso do JdbcTemplate
        JdbcTemplate template = new JdbcTemplate(conexao.getConexao());

        logService = new LogService(template);

        // Persistencia de dados em banco
        PersistenciaService persistenciaService = new PersistenciaService(template);




        logInfo("Início - Iniciando o carregamento dos arquivos Excel.");


        String nomeArquivo = "Apache-poi/fipezap-serieshistoricas.xlsx";
        String nomeArquivo2 = "Apache-poi/Sidra.xlsx";

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


        arquivo.close();
        arquivo2.close();

//
//        S3Main s3Main = new S3Main();
//        s3Main.listarBucket();
//        s3Main.listarObj();
//        s3Main.downloadArquivos();
//
        System.out.println("Iniciando a inserção de dados");

//        persistenciaService.insertIndice(indicesExtraidas);
//        System.out.print("Indices Inseridos\n");
//        persistenciaService.insertVariacao(variacoesExtraidas);
//        System.out.print("Variações Inseridas\n");
//        persistenciaService.insertPrecoMedio(precoMediosExtraidos);
//        System.out.print("Preços médios Inseridos\n");
//        persistenciaService.insertSidraProprio(sidraPropriosExtraidos);
//        System.out.print("Sidra Proprio Inserido\n");
//        persistenciaService.insertSidraAlugado(sidraAlugadosExtraidos);
//        System.out.print("Sidra Alugado Inserido\n");


    }
    private static void logInfo(String mensagem) {
        String timestamp = LocalDateTime.now().format(FORMATTER);
        System.out.println(timestamp + " | (INFO) | " + mensagem);

        if (logService != null) {
            logService.salvarLog(mensagem);
        }

    }
}
