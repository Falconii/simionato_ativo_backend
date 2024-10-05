const ExcelJs = require("exceljs");

async function rel_modelo_01(lsEvolucoes) {
  const workbook = new ExcelJs.Workbook();
  const sheet = workbook.addWorksheet("Evolução", {
    views: [{ showGridLines: false }], // oculta as linhas de grade
  });

  try {
    console.log("rel_modelo_01==>", inventario);
    const logoPath = "logo/images.png";
    const logoImage = workbook.addImage({
      filename: logoPath,
      extension: "png",
    });

    sheet.addImage(logoImage, {
      tl: { col: 0, row: 0 },
      br: { col: 1, row: 3 },
      ext: { width: 25, height: 25 },
    });

    sheet.mergeCells("F3"); // mescla células
    const titleCell = sheet.getCell("F3");
    titleCell.value = `${inventario.descricao}`; // célula 'F3' com o título do inventário
    titleCell.font = { bold: true, size: 18 }; // fonte em negrito e tamanho
    titleCell.alignment = { horizontal: "center", vertical: "bottom" }; // alinhamento horizontal e vertical
    titleCell.height = 30; // altura

    for await (const evolucao of lsEvolucoes) {
      // add títulos
      const titles = ["DATA", "QTD ATIVOS"];
      sheet.addRow(titles);

      // add uma nova linha à planilha com os valores dos registros e os arrays e se algum valor estiver ausente, será substituído por uma string vazia.
      sheet.addRow([evolucao.dtlanca || "", evolucao.total || ""]);
    }

    // formatação de alinhamento vertical e horizontal das células da planilha
    sheet.eachRow({ includeEmpty: false }, function (row) {
      row.alignment = { vertical: "middle", horizontal: "center" };
    });

    // altura das células individualmente para 15
    sheet.eachRow({ includeEmpty: false }, function (row) {
      for (let i = 1; i <= 20; i++) {
        row.getCell(i).height = 15;
      }
    });

    // formatação de borda, fonte e preenchimento para as células na linha 5 (títulos das colunas)
    sheet.getRow(5).eachCell((cell) => {
      // borda e o preenchimento são aplicados apenas se houver um valor na célula
      if (cell.value) {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.font = {
          bold: true,
          color: { argb: "FFCCCCCC" },
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF000000" },
        };
      }
    });

    // formatação de borda para todas as células nas linhas após a quarta linha
    sheet.eachRow((row, rowNumber) => {
      // garante que as bordas sejam aplicadas apenas às células de dados, não aos títulos das colunas
      if (rowNumber > 4) {
        // ignorar as primeiras linhas
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      }
    });

    // largura das colunas automaticamente com base no conteúdo das células
    sheet.columns.forEach((column, columnIndex) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const length = cell.value ? String(cell.value).length : 0;
        if (length > maxLength) {
          maxLength = length;
        }
      });
      // largura mínima é definida como 10 unidades
      sheet.getColumn(columnIndex + 1).width =
        maxLength < 10 ? 10 : maxLength + 2; // add uma folga de 2 caracteres
    });
    await workbook.xlsx.writeFile("rel_excel/evolucao.xlsx");
    console.log("Arquivo gerado com sucesso!");
  } catch (error) {
    console.error("Erro ao gerar o arquivo Excel:", error);
  }
}
