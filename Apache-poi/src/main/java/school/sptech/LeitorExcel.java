package school.sptech;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.apache.poi.ss.usermodel.CellType.STRING;

public class LeitorExcel {

    public Integer contadorLinhas;

    public LeitorExcel() {
        contadorLinhas = 0;
    }

    public List<Indice> extrairIndice(String nomeArquivo, Workbook workbook) {
        try {
            System.out.printf("%s | (informação) | \"abrirArquivo\" - Iniciando leitura do arquivo %s\n", java.time.LocalDateTime.now(), nomeArquivo);

            int paginaInicial = 3;
            int linhaInicial = 4;
            int incrementoID = 1000;

            List<Indice> indicesExtraidas = new ArrayList<>();

            for (int i = paginaInicial; i < 19; i++) {
                Sheet sheet = workbook.getSheetAt(i);
                System.out.printf("%s | (informação) | \"lerAba\" - Lendo aba: %s\n", java.time.LocalDateTime.now(), sheet.getSheetName());

                String regiao = sheet.getSheetName();

                if (i != 3) incrementoID += 1000;

                for (int j = linhaInicial; j <= sheet.getLastRowNum(); j++) {
                    Row row = sheet.getRow(j);
                    if (row == null) continue;

                    Indice indice = new Indice();

                    try {
                        indice.setId((j - 3) + incrementoID);
                        indice.setRegiao(regiao);
                        indice.setData(converterDate(row.getCell(1).getDateCellValue()));
                        indice.setTotal(!row.getCell(2).getCellType().equals(STRING) ? row.getCell(2).getNumericCellValue() : null);
                        indice.setD1(!row.getCell(3).getCellType().equals(STRING) ? row.getCell(3).getNumericCellValue() : null);
                        indice.setD2(!row.getCell(4).getCellType().equals(STRING) ? row.getCell(4).getNumericCellValue() : null);
                        indice.setD3(!row.getCell(5).getCellType().equals(STRING) ? row.getCell(5).getNumericCellValue() : null);
                        indice.setD4(!row.getCell(6).getCellType().equals(STRING) ? row.getCell(6).getNumericCellValue() : null);

                        contadorLinhas++;
                        indicesExtraidas.add(indice);
                        System.out.println(indice);
                    } catch (Exception e) {
                        System.out.printf("%s | (erro) | \"extrairIndice\" - Erro na linha %d: %s\n", java.time.LocalDateTime.now(), j, e.getMessage());
                    }
                }
            }

            workbook.close();
            System.out.printf("%s | (informação) | \"fecharArquivo\" - Leitura do arquivo finalizada\n", java.time.LocalDateTime.now());

            return indicesExtraidas;

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public List<Variacao> extrairVariacao(String nomeArquivo, Workbook workbook) {
        try {
            System.out.printf("%s | (informação) | \"abrirArquivo\" - Iniciando leitura do arquivo %s\n", java.time.LocalDateTime.now(), nomeArquivo);

            int paginaInicial = 3;
            int linhaInicial = 4;
            int incrementoID = 1000;

            List<Variacao> variacoesExtraidas = new ArrayList<>();

            for (int i = paginaInicial; i < 19; i++) {
                Sheet sheet = workbook.getSheetAt(i);
                System.out.printf("%s | (informação) | \"lerAba\" - Lendo aba: %s\n", java.time.LocalDateTime.now(), sheet.getSheetName());

                String regiao = sheet.getSheetName();
                if (i != 3) incrementoID += 1000;

                for (int j = linhaInicial; j <= sheet.getLastRowNum(); j++) {
                    Row row = sheet.getRow(j);
                    if (row == null) continue;

                    Variacao variacao = new Variacao();

                    try {
                        variacao.setId((j - 3) + incrementoID);
                        variacao.setRegiao(regiao);
                        variacao.setData(converterDate(row.getCell(1).getDateCellValue()));
                        variacao.setTotal(!row.getCell(7).getCellType().equals(STRING) ? row.getCell(7).getNumericCellValue() : null);
                        variacao.setD1(!row.getCell(8).getCellType().equals(STRING) ? row.getCell(8).getNumericCellValue() : null);
                        variacao.setD2(!row.getCell(9).getCellType().equals(STRING) ? row.getCell(9).getNumericCellValue() : null);
                        variacao.setD3(!row.getCell(10).getCellType().equals(STRING) ? row.getCell(10).getNumericCellValue() : null);
                        variacao.setD4(!row.getCell(11).getCellType().equals(STRING) ? row.getCell(11).getNumericCellValue() : null);

                        contadorLinhas++;
                        variacoesExtraidas.add(variacao);
                        System.out.println(variacao);
                    } catch (Exception e) {
                        System.out.printf("%s | (erro) | \"extrairVariacao\" - Erro na linha %d: %s\n", java.time.LocalDateTime.now(), j, e.getMessage());
                    }
                }
            }

            workbook.close();
            System.out.printf("%s | (informação) | \"fecharArquivo\" - Leitura do arquivo finalizada\n", java.time.LocalDateTime.now());

            return variacoesExtraidas;

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public List<PrecoMedio> extrairPrecoMedio(String nomeArquivo, Workbook workbook) {
        try {
            System.out.printf("%s | (informação) | \"abrirArquivo\" - Iniciando leitura do arquivo %s\n", java.time.LocalDateTime.now(), nomeArquivo);

            int paginaInicial = 3;
            int linhaInicial = 4;
            int incrementoID = 1000;

            List<PrecoMedio> precoMediosExtraidos = new ArrayList<>();

            for (int i = paginaInicial; i < 19; i++) {
                Sheet sheet = workbook.getSheetAt(i);
                System.out.printf("%s | (informação) | \"lerAba\" - Lendo aba: %s\n", java.time.LocalDateTime.now(), sheet.getSheetName());

                String regiao = sheet.getSheetName();
                if (i != 3) incrementoID += 1000;

                for (int j = linhaInicial; j <= sheet.getLastRowNum(); j++) {
                    Row row = sheet.getRow(j);
                    if (row == null) continue;

                    PrecoMedio precoMedio = new PrecoMedio();

                    try {
                        precoMedio.setId((j - 3) + incrementoID);
                        precoMedio.setRegiao(regiao);
                        precoMedio.setData(converterDate(row.getCell(1).getDateCellValue()));
                        precoMedio.setTotal(!row.getCell(17).getCellType().equals(STRING) ? row.getCell(17).getNumericCellValue() : null);
                        precoMedio.setD1(!row.getCell(18).getCellType().equals(STRING) ? row.getCell(18).getNumericCellValue() : null);
                        precoMedio.setD2(!row.getCell(19).getCellType().equals(STRING) ? row.getCell(19).getNumericCellValue() : null);
                        precoMedio.setD3(!row.getCell(20).getCellType().equals(STRING) ? row.getCell(20).getNumericCellValue() : null);
                        precoMedio.setD4(!row.getCell(21).getCellType().equals(STRING) ? row.getCell(21).getNumericCellValue() : null);

                        contadorLinhas++;
                        precoMediosExtraidos.add(precoMedio);
                        System.out.println(precoMedio);
                    } catch (Exception e) {
                        System.out.printf("%s | (erro) | \"extrairPrecoMedio\" - Erro na linha %d: %s\n", java.time.LocalDateTime.now(), j, e.getMessage());
                    }
                }
            }

            workbook.close();
            System.out.printf("%s | (informação) | \"fecharArquivo\" - Leitura do arquivo finalizada\n", java.time.LocalDateTime.now());

            return precoMediosExtraidos;

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private LocalDate converterDate(Date data) {
        return data.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }

    public Integer getContadorLinhas() {
        return contadorLinhas;
    }
}
