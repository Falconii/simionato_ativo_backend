const ExcelJs = require("exceljs");

function getSituacao(idx) {
  let retorno = "";
  switch (idx) {
    case 0:
      retorno = "Não Inventariado";
      break;
    case 1:
      retorno = "Inventariado";
      break;
    case 2:
      retorno = "Inv. Troca Código";
      break;
    case 3:
      retorno = "Inv. Troca CC";
      break;
    case 4:
      retorno = "Inv. Ambos Alterados";
      break;
    case 5:
      retorno = "Inv. Não Encontrado";
      break;
    case 6:
      retorno = "Inv. Baixado";
      break;
    default:
      retorno = "Não Definida!";
  }

  return `${idx}-${retorno}`;
}

function getCondicao(idx) {
  let retorno = "";
  switch (idx) {
    case 1:
      retorno = "Boa";
      break;
    case 2:
      retorno = "Regular";
      break;
    case 3:
      retorno = "Ruim";
      break;
    default:
      retorno = "Não Classificada";
  }

  return `${idx}-${retorno}`;
}

function getOrigem(sigla){
  return sigla == "P" ? "Planilha" : "Manual";
}
exports.generateExcel = async function(lsRegistros, inventario, complemento) {
  const workbook = new ExcelJs.Workbook();
  const sheet = workbook.addWorksheet("Imobilizado", {
    views: [{ showGridLines: false }], // oculta as linhas de grade
  });

  try {
    console.log("inventario==>", inventario);
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

    console.log("Função generateExcel foi chamada.");

    const uniqueIds = {}; // objeto para armazenar IDs únicos e seus dados

    for await (const registro of lsRegistros) {

      //Loop assíncrono sobre os registros fornecidos
      if (!uniqueIds[registro.id_imobilizado]) {
        // veriifica se o ID já foi add
        uniqueIds[registro.id_imobilizado] = {
          // se não existir cria uma entrada para ele
          registro,
          fotos: [],
          observacoes: [],
          destaques: [],
        }; // inicializando arrays vazios para armazenar
      }

      const { fotos, observacoes, destaques } =
        uniqueIds[registro.id_imobilizado]; // Desestruturação do objeto dentro do uniqueIds para acessar os arrays

      // add URLs do registro atual aos arrays
      fotos.push(
        registro.fot_url ||
          registro.fot_url ||
          registro.fot_url ||
          registro.fot_url ||
          registro.fot_url
      );
      observacoes.push(
        registro.fot_obs ||
          registro.fot_obs ||
          registro.fot_obs ||
          registro.fot_obs ||
          registro.fot_obs
      );
      destaques.push(
        registro.fot_destaque ||
          registro.fot_destaque ||
          registro.fot_destaque ||
          registro.fot_destaque ||
          registro.fot_destaque
      );

      // converte valores de aquisição e total depreciado para números se existirem e atribui ao registro.
      const vlraquisicao = registro.val_vlraquisicao
        ? registro.val_vlraquisicao / 1
        : "";
      const totaldepreciado = registro.val_totaldepreciado
        ? registro.val_totaldepreciado / 1
        : "";
      registro.vlraquisicao = vlraquisicao;
      registro.totaldepreciado = totaldepreciado;
    }

    // add títulos
    const titles = [
      "Empresa",
      "Filial",
      "Inventário",
      "Situacao",
      "Plaqueta",
      "Origem",
      "Nova Plaqueta",
      "Descrição do Imobilizado",
      "Observação Lançamento",
      "Código CC",
      "Descrição CC",
      "Código Novo CC",
      "Descrição Novo CC",
      "Código Grupo",
      "Descrição Grupo",
      "Número NFE",
      "Série NFE",
      "Item NFE",
      "Condição",
      "Book",
      "Data Lançamento",
      "Nome do Usuário",
      //  "Valor Aquisição",
      //  "Total Depreciado",
      //  "Foto 1",
      //  "Foto 2",
      //  "Foto 3",
      //  "Foto 4",
      //  "Foto 5",
      //  "Observação 1",
      //  "Observação 2",
      //  "Observação 3",
      //  "Observação 4",
      //  "Observação 5",
      //  "Destaque 1",
      //  "Destaque 2",
      //  "Destaque 3",
      //  "Destaque 4",
      //  "Destaque 5",
    ];
    sheet.addRow(titles);

    // itera sobre os valores do objeto uniqueIds, que contém registros únicos com base no ID do imobilizado.
    Object.values(uniqueIds).forEach(
      ({ registro, fotos, observacoes, destaques }) => {
        // cada valor executa uma função...um objeto contendo os registros
        // inicia arrays vazios para armazenar as células
        const fotoCells = [];
        const obsCells = [];
        const highlightCells = [];

        // Constrói a URL da foto a partir do array fotos, se a URL existir
        for (let i = 0; i < 5; i++) {
          // cinco vezes para cada uma das cinco fotos possíveis
          const fotoUrl = fotos[i]
            ? `https://drive.google.com/uc?export=view&id=${fotos[i]}`
            : "";
          fotoCells.push(
            fotoUrl ? { formula: `=HYPERLINK("${fotoUrl}", "Abrir foto")` } : ""
          ); // cria uma fórmula Excel para criar um link para a foto
        }

        // Preenche o array obsCells com as observações do registro
        for (let i = 0; i < 5; i++) {
          // cinco vezes para cada uma das cinco observações possíveis
          const obs = observacoes[i] ? observacoes[i] : "";
          obsCells.push(obs);
        }

        // Preenche o array highlightCells com os destaques do registro
        for (let i = 0; i < 5; i++) {
          // cinco vezes para cada um dos cinco destaques possíveis
          const destaque = destaques[i] ? destaques[i] : "";
          highlightCells.push(destaque);
        }

        // se existem fotos adicionais no registro atual e as add ao array fotos do registro único, evitando duplicatas
        if (registro.fotos) {
          registro.fotos.forEach((foto) => {
            if (!fotos.includes(foto)) {
              fotos.push(foto);
            }
          });
        }

        // se existem observações adicionais no registro atual e as add ao array observacoes do registro único, evitando duplicatas
        if (registro.observacoes) {
          registro.observacoes.forEach((observacoes) => {
            if (!observacoes.includes(observacoes)) {
              observacoes.push(observacoes);
            }
          });
        }

        // se existem destaques adicionais no registro atual e os add ao array destaques do registro único, evitando duplicatas
        if (registro.destaques) {
          registro.destaques.forEach((destaques) => {
            if (!destaques.includes(destaques)) {
              destaques.push(destaques);
            }
          });
        }

        // add uma nova linha à planilha com os valores dos registros e os arrays e se algum valor estiver ausente, será substituído por uma string vazia.
        sheet.addRow([
          complemento.emp_razao || "",
          complemento.loc_razao || "",
          inventario.descricao || "",
          getSituacao(registro.status),
          registro.id_imobilizado || "",
          getOrigem(registro.imo_origem) || "" ,
          registro.new_codigo || "",
          registro.imo_descricao || "",
          registro.lanc_obs || "",
          registro.imo_cod_cc,
          registro.cc_descricao || "",
          registro.new_cc || "",
          registro.new_cc_descricao || "",
          registro.imo_cod_grupo || "",
          registro.grupo_descricao || "",
          parseInt(registro.imo_nfe) || "",
          parseInt(registro.imo_serie) || "",
          parseInt(registro.imo_item) || "",
          getCondicao(registro.condicao),
          registro.book == "S" ? "SIM" : "NÃO",
          registro.lanc_dt_lanca || "",
          registro.usu_razao || "",
          //registro.vlraquisicao,
          //registro.totaldepreciado,
          //...fotoCells,
          //...obsCells,
          //...highlightCells,
        ]);
      }
    );

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

    await workbook.xlsx.writeFile("rel_excel/imobilizadosinventarios.xlsx");
    console.log("Arquivo gerado com sucesso!");
  } catch (error) {
    console.error("Erro ao gerar o arquivo Excel:", error);
  }
}



exports.generateExcelv2 = async function(lsRegistros, inventario, complemento,fileName) {
  const workbook = new ExcelJs.Workbook();
  const sheet = workbook.addWorksheet("Imobilizado", {
    views: [{ showGridLines: false }], // oculta as linhas de grade
  });

  try {
    console.log("inventario==>", inventario);
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

    console.log("Função generateExcel foi chamada.");

    const uniqueIds = {}; // objeto para armazenar IDs únicos e seus dados

    for await (const registro of lsRegistros) {

      //Loop assíncrono sobre os registros fornecidos
      if (!uniqueIds[registro.id_imobilizado]) {
        // veriifica se o ID já foi add
        uniqueIds[registro.id_imobilizado] = {
          // se não existir cria uma entrada para ele
          registro,
          fotos: [],
          observacoes: [],
          destaques: [],
        }; // inicializando arrays vazios para armazenar
      }

      const { fotos, observacoes, destaques } =
        uniqueIds[registro.id_imobilizado]; // Desestruturação do objeto dentro do uniqueIds para acessar os arrays

      // add URLs do registro atual aos arrays
      fotos.push(
        registro.fot_url ||
          registro.fot_url ||
          registro.fot_url ||
          registro.fot_url ||
          registro.fot_url
      );
      observacoes.push(
        registro.fot_obs ||
          registro.fot_obs ||
          registro.fot_obs ||
          registro.fot_obs ||
          registro.fot_obs
      );
      destaques.push(
        registro.fot_destaque ||
          registro.fot_destaque ||
          registro.fot_destaque ||
          registro.fot_destaque ||
          registro.fot_destaque
      );

      // converte valores de aquisição e total depreciado para números se existirem e atribui ao registro.
      const vlraquisicao = registro.val_vlraquisicao
        ? registro.val_vlraquisicao / 1
        : "";
      const totaldepreciado = registro.val_totaldepreciado
        ? registro.val_totaldepreciado / 1
        : "";
      registro.vlraquisicao = vlraquisicao;
      registro.totaldepreciado = totaldepreciado;
    }

    // add títulos
    const titles = [
      "Empresa",
      "Filial",
      "Inventário",
      "Situacao",
      "Plaqueta",
      "Origem",
      "Nova Plaqueta",
      "Descrição do Imobilizado",
      "Observação Lançamento",
      "Código CC",
      "Descrição CC",
      "Código Novo CC",
      "Descrição Novo CC",
      "Código Grupo",
      "Descrição Grupo",
      "Número NFE",
      "Série NFE",
      "Item NFE",
      "Condição",
      "Book",
      "Data Lançamento",
      "Nome do Usuário",
      //  "Valor Aquisição",
      //  "Total Depreciado",
      //  "Foto 1",
      //  "Foto 2",
      //  "Foto 3",
      //  "Foto 4",
      //  "Foto 5",
      //  "Observação 1",
      //  "Observação 2",
      //  "Observação 3",
      //  "Observação 4",
      //  "Observação 5",
      //  "Destaque 1",
      //  "Destaque 2",
      //  "Destaque 3",
      //  "Destaque 4",
      //  "Destaque 5",
    ];
    sheet.addRow(titles);

    // itera sobre os valores do objeto uniqueIds, que contém registros únicos com base no ID do imobilizado.
    Object.values(uniqueIds).forEach(
      ({ registro, fotos, observacoes, destaques }) => {
        // cada valor executa uma função...um objeto contendo os registros
        // inicia arrays vazios para armazenar as células
        const fotoCells = [];
        const obsCells = [];
        const highlightCells = [];

        // Constrói a URL da foto a partir do array fotos, se a URL existir
        for (let i = 0; i < 5; i++) {
          // cinco vezes para cada uma das cinco fotos possíveis
          const fotoUrl = fotos[i]
            ? `https://drive.google.com/uc?export=view&id=${fotos[i]}`
            : "";
          fotoCells.push(
            fotoUrl ? { formula: `=HYPERLINK("${fotoUrl}", "Abrir foto")` } : ""
          ); // cria uma fórmula Excel para criar um link para a foto
        }

        // Preenche o array obsCells com as observações do registro
        for (let i = 0; i < 5; i++) {
          // cinco vezes para cada uma das cinco observações possíveis
          const obs = observacoes[i] ? observacoes[i] : "";
          obsCells.push(obs);
        }

        // Preenche o array highlightCells com os destaques do registro
        for (let i = 0; i < 5; i++) {
          // cinco vezes para cada um dos cinco destaques possíveis
          const destaque = destaques[i] ? destaques[i] : "";
          highlightCells.push(destaque);
        }

        // se existem fotos adicionais no registro atual e as add ao array fotos do registro único, evitando duplicatas
        if (registro.fotos) {
          registro.fotos.forEach((foto) => {
            if (!fotos.includes(foto)) {
              fotos.push(foto);
            }
          });
        }

        // se existem observações adicionais no registro atual e as add ao array observacoes do registro único, evitando duplicatas
        if (registro.observacoes) {
          registro.observacoes.forEach((observacoes) => {
            if (!observacoes.includes(observacoes)) {
              observacoes.push(observacoes);
            }
          });
        }

        // se existem destaques adicionais no registro atual e os add ao array destaques do registro único, evitando duplicatas
        if (registro.destaques) {
          registro.destaques.forEach((destaques) => {
            if (!destaques.includes(destaques)) {
              destaques.push(destaques);
            }
          });
        }

        // add uma nova linha à planilha com os valores dos registros e os arrays e se algum valor estiver ausente, será substituído por uma string vazia.
        sheet.addRow([
          complemento.emp_razao || "",
          complemento.loc_razao || "",
          inventario.descricao || "",
          getSituacao(registro.status),
          registro.id_imobilizado || "",
          getOrigem(registro.imo_origem) || "" ,
          registro.new_codigo || "",
          registro.imo_descricao || "",
          registro.lanc_obs || "",
          registro.imo_cod_cc.replace("#","-") || "",
          registro.cc_descricao || "",
          registro.new_cc.replace("#","-") || "",
          registro.new_cc_descricao || "",
          registro.imo_cod_grupo || "",
          registro.grupo_descricao || "",
          parseInt(registro.imo_nfe) || "",
          parseInt(registro.imo_serie) || "",
          parseInt(registro.imo_item) || "",
          getCondicao(registro.condicao),
          registro.book == "S" ? "SIM" : "NÃO",
          registro.lanc_dt_lanca || "",
          registro.usu_razao || "",
          //registro.vlraquisicao,
          //registro.totaldepreciado,
          //...fotoCells,
          //...obsCells,
          //...highlightCells,
        ]);
      }
    );

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

    await workbook.xlsx.writeFile("rel_excel/".concat(fileName));
    console.log("Arquivo gerado com sucesso!");
  } catch (error) {
    console.error("Erro ao gerar o arquivo Excel:", error);
  }
}


