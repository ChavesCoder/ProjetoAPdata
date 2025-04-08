package school.sptech;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
//import org.apache.poi.ss.usermodel.*;


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
            System.out.printf("\nIniciando leitura do arquivo %s\n%n", nomeArquivo);


            // SELECIONA A PAGINA QUE A LEITURA SE INICIA
            int paginaInicial = 3;

            // FAZ COM QUE O CABEÇALHO SEJA IGNORADO E COMECE A LEITURA DOS DADOS A PARTIR DE ONDE IMPORTA
            int linhaInicial = 4;

            // VARIÁVEL APENAS PARA FACILITAR A INSERÇÃO NO BANCO POSTERIORMENTE
            int incrementoID = 1000;

            List<Indice> indicesExtraidas = new ArrayList<>();


            for (int i = paginaInicial; i < 19; i++) {
                Sheet sheet = workbook.getSheetAt(i);
                System.out.println(">>> Lendo aba: " + sheet.getSheetName());

                String regiao = sheet.getSheetName();

                if (i != 3) {
                    incrementoID += 1000;
                }

                for (int j = linhaInicial; j <= sheet.getLastRowNum(); j++) {

                    Row row = sheet.getRow(j);

                    if (row == null) {
                        continue;
                    }


                    Indice indice = new Indice();

                    try {

                        indice.setId((j - 3) + incrementoID);
                        indice.setRegiao(regiao);

                        indice.setData(converterDate(row.getCell(1).getDateCellValue()));
                        if (!row.getCell(2).getCellType().equals(STRING)) {
                            indice.setTotal(row.getCell(2).getNumericCellValue());
                        } else {
                            indice.setTotal(null);
                        }

                        if (!row.getCell(3).getCellType().equals(STRING)) {
                            indice.setD1(row.getCell(3).getNumericCellValue());
                        } else {
                            indice.setD1(null);
                        }

                        if (!row.getCell(4).getCellType().equals(STRING)){
                            indice.setD2(row.getCell(4).getNumericCellValue());
                        } else {
                            indice.setD2(null);
                        }

                        if (!row.getCell(5).getCellType().equals(STRING)){
                            indice.setD3(row.getCell(5).getNumericCellValue());
                        } else {
                            indice.setD3(null);
                        }

                        if (!row.getCell(6).getCellType().equals(STRING)){
                            indice.setD4(row.getCell(6).getNumericCellValue());
                        } else {
                            indice.setD4(null);
                        }

                        contadorLinhas++;
                        indicesExtraidas.add(indice);
                    } catch (Exception e) {
                        System.out.println("Erro na linha " + j + ": " + e.getMessage());
                    }
                }
            }

            workbook.close();

            System.out.println("\nLeitura do arquivo finalizado\n");

            return indicesExtraidas;

        } catch (IOException e) {

            throw new RuntimeException(e);

        }

    }

    public List<Variacao> extrairVariacao(String nomeArquivo, Workbook workbook){
        try {
            System.out.printf("\nIniciando leitura do arquivo %s\n%n", nomeArquivo);


            // SELECIONA A PAGINA QUE A LEITURA SE INICIA
            int paginaInicial = 3;

            // FAZ COM QUE O CABEÇALHO SEJA IGNORADO E COMECE A LEITURA DOS DADOS A PARTIR DE ONDE IMPORTA
            int linhaInicial = 4;

            // VARIÁVEL APENAS PARA FACILITAR A INSERÇÃO NO BANCO POSTERIORMENTE
            int incrementoID = 1000;

            List<Variacao> variacoesExtraidas = new ArrayList<>();


            for (int i = paginaInicial; i < 19; i++) {
                Sheet sheet = workbook.getSheetAt(i);
                System.out.println(">>> Lendo aba: " + sheet.getSheetName());

                String regiao = sheet.getSheetName();

                if (i != 3) {
                    incrementoID += 1000;
                }

                for (int j = linhaInicial; j <= sheet.getLastRowNum(); j++) {

                    Row row = sheet.getRow(j);

                    if (row == null) {
                        continue;
                    }


                    Variacao variacao = new Variacao();

                    try {

                        variacao.setId((j - 3) + incrementoID);
                        variacao.setRegiao(regiao);

                        variacao.setData(converterDate(row.getCell(1).getDateCellValue()));
                        if (!row.getCell(7).getCellType().equals(STRING)) {
                            variacao.setTotal(row.getCell(7).getNumericCellValue());
                        } else {
                            variacao.setTotal(null);
                        }

                        if (!row.getCell(8).getCellType().equals(STRING)) {
                            variacao.setD1(row.getCell(8).getNumericCellValue());
                        } else {
                            variacao.setD1(null);
                        }

                        if (!row.getCell(9).getCellType().equals(STRING)){
                            variacao.setD2(row.getCell(9).getNumericCellValue());
                        } else {
                            variacao.setD2(null);
                        }

                        if (!row.getCell(10).getCellType().equals(STRING)){
                            variacao.setD3(row.getCell(10).getNumericCellValue());
                        } else {
                            variacao.setD3(null);
                        }

                        if (!row.getCell(11).getCellType().equals(STRING)){
                            variacao.setD4(row.getCell(11).getNumericCellValue());
                        } else {
                            variacao.setD4(null);
                        }
                        contadorLinhas++;

                        variacoesExtraidas.add(variacao);
                    } catch (Exception e) {
                        System.out.println("Erro na linha " + j + ": " + e.getMessage());
                    }
                }
            }

            workbook.close();

            System.out.println("\nLeitura do arquivo finalizado\n");

            return variacoesExtraidas;

        } catch (IOException e) {

            throw new RuntimeException(e);

        }

    }
    public List<PrecoMedio> extrairPrecoMedio(String nomeArquivo, Workbook workbook){
        try {
            System.out.printf("\nIniciando leitura do arquivo %s\n%n", nomeArquivo);


            // SELECIONA A PAGINA QUE A LEITURA SE INICIA
            int paginaInicial = 3;

            // FAZ COM QUE O CABEÇALHO SEJA IGNORADO E COMECE A LEITURA DOS DADOS A PARTIR DE ONDE IMPORTA
            int linhaInicial = 4;

            // VARIÁVEL APENAS PARA FACILITAR A INSERÇÃO NO BANCO POSTERIORMENTE
            int incrementoID = 1000;

            List<PrecoMedio> precoMediosExtraidos = new ArrayList<>();


            for (int i = paginaInicial; i < 19; i++) {
                Sheet sheet = workbook.getSheetAt(i);
                System.out.println(">>> Lendo aba: " + sheet.getSheetName());

                String regiao = sheet.getSheetName();

                if (i != 3) {
                    incrementoID += 1000;
                }

                for (int j = linhaInicial; j <= sheet.getLastRowNum(); j++) {

                    Row row = sheet.getRow(j);

                    if (row == null) {
                        continue;
                    }


                    PrecoMedio precoMedio = new PrecoMedio();

                    try {

                        precoMedio.setId((j - 3) + incrementoID);
                        precoMedio.setRegiao(regiao);

                        precoMedio.setData(converterDate(row.getCell(1).getDateCellValue()));
                        if (!row.getCell(12).getCellType().equals(STRING)) {
                            precoMedio.setTotal(row.getCell(12).getNumericCellValue());
                        } else {
                            precoMedio.setTotal(null);
                        }

                        if (!row.getCell(13).getCellType().equals(STRING)) {
                            precoMedio.setD1(row.getCell(13).getNumericCellValue());
                        } else {
                            precoMedio.setD1(null);
                        }

                        if (!row.getCell(14).getCellType().equals(STRING)){
                            precoMedio.setD2(row.getCell(14).getNumericCellValue());
                        } else {
                            precoMedio.setD2(null);
                        }

                        if (!row.getCell(15).getCellType().equals(STRING)){
                            precoMedio.setD3(row.getCell(15).getNumericCellValue());
                        } else {
                            precoMedio.setD3(null);
                        }

                        if (!row.getCell(16).getCellType().equals(STRING)){
                            precoMedio.setD4(row.getCell(16).getNumericCellValue());
                        } else {
                            precoMedio.setD4(null);
                        }
                        contadorLinhas++;

                        precoMediosExtraidos.add(precoMedio);
                    } catch (Exception e) {
                        System.out.println("Erro na linha " + j + ": " + e.getMessage());
                    }
                }
            }

            workbook.close();

            System.out.println("\nLeitura do arquivo finalizado\n");

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
