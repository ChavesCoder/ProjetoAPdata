package school.sptech;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.ss.usermodel.*;


import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class LeitorExcel {
    public List<Indice> extrairIndice(String nomeArquivo, InputStream arquivo) {
        try {
            System.out.println("\nIniciando leitura do aqruivo %s\n".formatted(nomeArquivo));

            Workbook workbook;

            if (nomeArquivo.endsWith(".xlsx")) {
                workbook = new XSSFWorkbook(arquivo);
            } else {
                workbook = new HSSFWorkbook(arquivo);
            }

            Sheet sheet = workbook.getSheetAt(3);




            // TESTES SE OS CAMPOS E TABELAS SÃO VALIDOS
//            if (sheet == null) {
//                System.out.println("A planilha é nula");
//            }
//
//            Row row = sheet.getRow(0); // linha 1 (índice começa em 0)
//            if (row == null) {
//                System.out.println("A linha está nula.");
//            }
//
//            Cell cell = row.getCell(0); // coluna A
//            if (cell == null) {
//                System.out.println("A célula está nula.");
//            } else {
//                System.out.println("Tipo da célula: " + cell.getCellType());
//            }
//
//
            // FOR QUE PRINTA A TABELA INTEIRA USAR COM CUIDADO!
//            for (Row linha : sheet) {
//                for (Cell celula : linha) {
//                    System.out.println("Linha " + linha.getRowNum() + " Coluna " + celula.getColumnIndex() +
//                            " -> Valor: " + celula.toString());
//                }
//            }


            List<Indice> indicesExtraidas = new ArrayList<>();


            String regiao = sheet.getRow(0).getCell(1).getStringCellValue();


            int linhaInicial = 4;

            for (int i = linhaInicial; i <= sheet.getLastRowNum(); i++) {

                Row row = sheet.getRow(i);

                if (row == null) {
                    continue;
                }

                Indice indice = new Indice();


                try {


                    indice.setId((i - 3));
                    indice.setRegiao(regiao);
                    indice.setData(converterDate(row.getCell(1).getDateCellValue()));
                    indice.setTotal(row.getCell(2).getNumericCellValue());
                    indice.setD1(row.getCell(3).getNumericCellValue());
                    indice.setD2(row.getCell(4).getNumericCellValue());
                    indice.setD3(row.getCell(5).getNumericCellValue());
                    indice.setD4(row.getCell(6).getNumericCellValue());

                    indicesExtraidas.add(indice);
                } catch (Exception e) {
                    System.out.println("Erro na linha " + i + ": " + e.getMessage());
                }

            }

            workbook.close();

            System.out.println("\nLeitura do arquivo finalizado\n");


            return indicesExtraidas;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }
    private LocalDate converterDate(Date data) {
        return data.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }

}
