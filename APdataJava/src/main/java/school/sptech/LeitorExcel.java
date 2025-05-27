package school.sptech;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import school.sptech.data.DadosIndice;
import school.sptech.data.DadosPrecoMedio;
import school.sptech.data.DadosVariacao;
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


    public List<DadosIndice> extrairIndice(String nomeArquivo, Workbook workbook) {

        try {
            System.out.printf("\nIniciando leitura do arquivo %s\n%n", nomeArquivo);


            // SELECIONA A PAGINA QUE A LEITURA SE INICIA
            int paginaInicial = 3;

            // FAZ COM QUE O CABEÇALHO SEJA IGNORADO E COMECE A LEITURA DOS DADOS A PARTIR DE ONDE IMPORTA
            int linhaInicial = 4;

            // VARIÁVEL APENAS PARA FACILITAR A INSERÇÃO NO BANCO POSTERIORMENTE
            int incrementoID = 1000;

            List<DadosIndice> indicesExtraidas = new ArrayList<>();


            for (int i = paginaInicial; i < 19; i++) {
                Sheet sheet = workbook.getSheetAt(i);
                System.out.println(">>> Lendo aba: " + sheet.getSheetName());

                String regiao = sheet.getSheetName();

                if (i != 3) {
                    incrementoID += 1000;
                }

                for (int j = linhaInicial; j <= sheet.getLastRowNum() - 5; j++) {

                    Row row = sheet.getRow(j);

                    if (row == null) {
                        continue;
                    }


                    DadosIndice indice = new DadosIndice();

                    try {

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

    public List<DadosVariacao> extrairVariacao(String nomeArquivo, Workbook workbook){
        try {
            System.out.printf("\nIniciando leitura do arquivo %s\n%n", nomeArquivo);


            // SELECIONA A PAGINA QUE A LEITURA SE INICIA
            int paginaInicial = 3;

            // FAZ COM QUE O CABEÇALHO SEJA IGNORADO E COMECE A LEITURA DOS DADOS A PARTIR DE ONDE IMPORTA
            int linhaInicial = 4;

            // VARIÁVEL APENAS PARA FACILITAR A INSERÇÃO NO BANCO POSTERIORMENTE
            int incrementoID = 1000;

            List<DadosVariacao> variacoesExtraidas = new ArrayList<>();


            for (int i = paginaInicial; i < 19; i++) {
                Sheet sheet = workbook.getSheetAt(i);
                System.out.println(">>> Lendo aba: " + sheet.getSheetName());

                String regiao = sheet.getSheetName();

                if (i != 3) {
                    incrementoID += 1000;
                }

                for (int j = linhaInicial; j <= sheet.getLastRowNum() - 5; j++) {

                    Row row = sheet.getRow(j);

                    if (row == null) {
                        continue;
                    }


                    DadosVariacao variacao = new DadosVariacao();

                    try {

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
    public List<DadosPrecoMedio> extrairPrecoMedio(String nomeArquivo, Workbook workbook){
        try {
            System.out.printf("\nIniciando leitura do arquivo %s\n%n", nomeArquivo);


            // SELECIONA A PAGINA QUE A LEITURA SE INICIA
            int paginaInicial = 3;

            // FAZ COM QUE O CABEÇALHO SEJA IGNORADO E COMECE A LEITURA DOS DADOS A PARTIR DE ONDE IMPORTA
            int linhaInicial = 4;

            // VARIÁVEL APENAS PARA FACILITAR A INSERÇÃO NO BANCO POSTERIORMENTE
            int incrementoID = 1000;

            List<DadosPrecoMedio> precoMediosExtraidos = new ArrayList<>();


            for (int i = paginaInicial; i < 19; i++) {
                Sheet sheet = workbook.getSheetAt(i);
                System.out.println(">>> Lendo aba: " + sheet.getSheetName());

                String regiao = sheet.getSheetName();

                if (i != 3) {
                    incrementoID += 1000;
                }

                for (int j = linhaInicial; j <= sheet.getLastRowNum() - 5; j++) {

                    Row row = sheet.getRow(j);

                    if (row == null) {
                        continue;
                    }


                    DadosPrecoMedio precoMedio = new DadosPrecoMedio();

                    try {

                        precoMedio.setRegiao(regiao);

                        precoMedio.setData(converterDate(row.getCell(1).getDateCellValue()));
                        if (!row.getCell(17).getCellType().equals(STRING)) {
                            precoMedio.setTotal(row.getCell(17).getNumericCellValue());
                        } else {
                            precoMedio.setTotal(null);
                        }

                        if (!row.getCell(18).getCellType().equals(STRING)) {
                            precoMedio.setD1(row.getCell(18).getNumericCellValue());
                        } else {
                            precoMedio.setD1(null);
                        }

                        if (!row.getCell(19).getCellType().equals(STRING)){
                            precoMedio.setD2(row.getCell(19).getNumericCellValue());
                        } else {
                            precoMedio.setD2(null);
                        }

                        if (!row.getCell(20).getCellType().equals(STRING)){
                            precoMedio.setD3(row.getCell(20).getNumericCellValue());
                        } else {
                            precoMedio.setD3(null);
                        }

                        if (!row.getCell(21).getCellType().equals(STRING)){
                            precoMedio.setD4(row.getCell(21).getNumericCellValue());
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
    public List<SidraProprio> extrairSidraProprio(String nomeArquivo2, Workbook workbookSidra){
        try {
            System.out.printf("\nIniciando leitura do arquivo %s\n%n", nomeArquivo2);


            // SELECIONA A PAGINA QUE A LEITURA SE INICIA
            int paginaInicial = 0;

            // FAZ COM QUE O CABEÇALHO SEJA IGNORADO E COMECE A LEITURA DOS DADOS A PARTIR DE ONDE IMPORTA
            int linhaInicial = 7;

            // VARIÁVEL APENAS PARA FACILITAR A INSERÇÃO NO BANCO POSTERIORMENTE
            int incrementoID = 1000;

            List<SidraProprio> sidraPropriosExtraidos = new ArrayList<>();

                Sheet sheet = workbookSidra.getSheetAt(0);

                for (int i = linhaInicial; i <= sheet.getLastRowNum() - 1; i++) {

                    Row row = sheet.getRow(i);

                    if (row == null) {
                        continue;
                    }


                    SidraProprio domiciliosProprios = new SidraProprio();

                    try {

                        domiciliosProprios.setId((i - 6) + incrementoID);

                        domiciliosProprios.setRegiao(row.getCell(0).getStringCellValue());

                        if (!row.getCell(2).getCellType().equals(STRING)) {
                            domiciliosProprios.setTotal(row.getCell(2).getNumericCellValue());
                        } else {
                            domiciliosProprios.setTotal(null);
                        }

                        if (!row.getCell(3).getCellType().equals(STRING)) {
                            domiciliosProprios.setUmMorador(row.getCell(3).getNumericCellValue());
                        } else {
                            domiciliosProprios.setUmMorador(null);
                        }

                        if (!row.getCell(4).getCellType().equals(STRING)){
                            domiciliosProprios.setDoisMoradores(row.getCell(4).getNumericCellValue());
                        } else {
                            domiciliosProprios.setDoisMoradores(null);
                        }

                        if (!row.getCell(5).getCellType().equals(STRING)){
                            domiciliosProprios.setTresMoradores(row.getCell(5).getNumericCellValue());
                        } else {
                            domiciliosProprios.setTresMoradores(null);
                        }

                        if (!row.getCell(6).getCellType().equals(STRING)){
                            domiciliosProprios.setQuatroMoradoresOuMais(row.getCell(6).getNumericCellValue());
                        } else {
                            domiciliosProprios.setQuatroMoradoresOuMais(null);
                        }
                        contadorLinhas++;

                        sidraPropriosExtraidos.add(domiciliosProprios);
                    } catch (Exception e) {
                        System.out.println("Erro na linha " + i + ": " + e.getMessage());
                    }
                }

            workbookSidra.close();

            System.out.println("\nLeitura do arquivo finalizado\n");

            return sidraPropriosExtraidos;

        } catch (IOException e) {

            throw new RuntimeException(e);

        }

    }
    public List<SidraAlugado> extrairSidraAlugado(String nomeArquivo2, Workbook workbookSidra){
        try {
            System.out.printf("\nIniciando leitura do arquivo %s\n%n", nomeArquivo2);


            // SELECIONA A PAGINA QUE A LEITURA SE INICIA
            int paginaInicial = 0;

            // FAZ COM QUE O CABEÇALHO SEJA IGNORADO E COMECE A LEITURA DOS DADOS A PARTIR DE ONDE IMPORTA
            int linhaInicial = 7;

            // VARIÁVEL APENAS PARA FACILITAR A INSERÇÃO NO BANCO POSTERIORMENTE
            int incrementoID = 1000;

            List<SidraAlugado> sidraAlugadosExtraidos = new ArrayList<>();

                Sheet sheet = workbookSidra.getSheetAt(0);

                for (int i = linhaInicial; i <= sheet.getLastRowNum() - 1; i++) {

                    Row row = sheet.getRow(i);

                    if (row == null) {
                        continue;
                    }


                    SidraAlugado domiciliosAlugados = new SidraAlugado();

                    try {

                        domiciliosAlugados.setId((i - 6) + incrementoID);

                        domiciliosAlugados.setRegiao(row.getCell(0).getStringCellValue());

                        if (!row.getCell(7).getCellType().equals(STRING)) {
                            domiciliosAlugados.setTotal(row.getCell(7).getNumericCellValue());
                        } else {
                            domiciliosAlugados.setTotal(null);
                        }

                        if (!row.getCell(8).getCellType().equals(STRING)) {
                            domiciliosAlugados.setUmMorador(row.getCell(8).getNumericCellValue());
                        } else {
                            domiciliosAlugados.setUmMorador(null);
                        }

                        if (!row.getCell(9).getCellType().equals(STRING)){
                            domiciliosAlugados.setDoisMoradores(row.getCell(9).getNumericCellValue());
                        } else {
                            domiciliosAlugados.setDoisMoradores(null);
                        }

                        if (!row.getCell(10).getCellType().equals(STRING)){
                            domiciliosAlugados.setTresMoradores(row.getCell(10).getNumericCellValue());
                        } else {
                            domiciliosAlugados.setTresMoradores(null);
                        }

                        if (!row.getCell(11).getCellType().equals(STRING)){
                            domiciliosAlugados.setQuatroMoradoresOuMais(row.getCell(11).getNumericCellValue());
                        } else {
                            domiciliosAlugados.setQuatroMoradoresOuMais(null);
                        }
                        contadorLinhas++;

                        sidraAlugadosExtraidos.add(domiciliosAlugados);
                    } catch (Exception e) {
                        System.out.println("Erro na linha " + i + ": " + e.getMessage());
                    }
                }

            workbookSidra.close();

            System.out.println("\nLeitura do arquivo finalizado\n");

            return sidraAlugadosExtraidos;

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
