package school.sptech;

import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.json.JSONObject;
import org.springframework.jdbc.core.JdbcTemplate;
import school.sptech.banco.Conexao;
import school.sptech.client.S3Provider;
import school.sptech.notify.Slack;

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

//        Conexao conexao = new Conexao();
//        try (Connection conn = conexao.getConexao().getConnection()) {
//            if (conn != null && !conn.isClosed()) {
//                System.out.println("Conexão bem-sucedida!");
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//        // Uso do JdbcTemplate
//        JdbcTemplate template = new JdbcTemplate(conexao.getConexao());
//        logService = new LogService(template);
//
//        // Persistência de dados em banco
//        PersistenciaService persistenciaService = new PersistenciaService(template);

        logInfo("Início - Iniciando o carregamento dos arquivos Excel.");

//        S3Main s3 = new S3Main();
//        s3.listarBucket();
//        s3.listarObj();
//        s3.downloadArquivos();



        // Arquivos a serem lidos
        String nomeArquivo1 = "./fipezap-serieshistoricas.xlsx";
        String nomeArquivo2 = "./Sidra.xlsx";

        System.out.println(nomeArquivo1);
        System.out.println(nomeArquivo2);
        // Carregamento dos arquivos Excel
        try (Workbook workbook = carregarWorkbook(nomeArquivo1);
             Workbook workbookSidra = carregarWorkbook(nomeArquivo2)) {

            logInfo("Arquivos carregados com sucesso - 'fipezap-serieshistoricas.xlsx' e 'Sidra.xlsx'.");

            LeitorExcel leitorExcel = new LeitorExcel();

            logInfo("Extração - Iniciando extração dos dados de FIPEZAP.");
            List<Indice> indicesExtraidas = leitorExcel.extrairIndice(nomeArquivo1, workbook);
            List<Variacao> variacoesExtraidas = leitorExcel.extrairVariacao(nomeArquivo1, workbook);
            List<PrecoMedio> precoMediosExtraidos = leitorExcel.extrairPrecoMedio(nomeArquivo1, workbook);
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

            sidraAlugadosExtraidos.stream()
                    .map(SidraAlugado::getRegiao)
                    .distinct()
                    .forEach(regiao -> logInfo("Extração - Região '" + regiao + "' extraída com sucesso (SIDRA - Alugado)."));

            logInfo("Extração - Impressão dos dados concluída.");
            logInfo("Resumo - Total de linhas extraídas: " + leitorExcel.getContadorLinhas());

            // Persistência dos dados extraídos
//            logInfo("Iniciando a inserção de dados");
//            persistenciaService.insertIndice(indicesExtraidas);
//            persistenciaService.insertVariacao(variacoesExtraidas);
//            persistenciaService.insertPrecoMedio(precoMediosExtraidos);
//            persistenciaService.insertSidraProprio(sidraPropriosExtraidos);
//            persistenciaService.insertSidraAlugado(sidraAlugadosExtraidos);

            System.out.println("Dados inseridos com sucesso!");

            JSONObject json = new JSONObject();

            json.put("text", "Novos dados estão disponíveis para vizualização na AP Data");
            Slack.enviarMensagem(json);

        } catch (Exception e) {
            logInfo("Erro ao carregar ou processar os arquivos: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static Workbook carregarWorkbook(String caminhoArquivo) throws IOException {
        Path path = Path.of(caminhoArquivo);
        try (InputStream is = Files.newInputStream(path)) {
            return WorkbookFactory.create(is);
        }
    }

    private static void logInfo(String mensagem) {
        String timestamp = LocalDateTime.now().format(FORMATTER);
        System.out.println(timestamp + " | (INFO) | " + mensagem);

        if (logService != null) {
            logService.salvarLog(mensagem);
        }
    }
}