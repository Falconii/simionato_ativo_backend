const uploaddata = require("../data/uploadData");
const centrocustoSrv = require("../service/centrocustoService");
const grupoSrv = require("../service/grupoService");
const produtoSrv = require("../service/produtoService");
const principalSrv = require("../service/principalService");
const imobilizadoSrv = require("../service/imobilizadoService");
const nfeSrv = require("../service/nfeService");
const valorSrv = require("../service/valorService");
const shared = require("../util/shared.js");
const parse = require("../shared/ParseCSV");
const fs = require("fs");
const readline = require("readline");
let id_empresa = 0;
let id_local = 0;
let id_usuario = 0;
let centro_custos = [];
let grupos = [];
let produtos = [];
let principal = [];
let imobilizados = [];
let nfes = [];
let valores = [];

exports.create = async (req, res, _id_empresa, _id_local, _id_usuario) => {
  id_empresa = _id_empresa;
  id_local = _id_local;
  id_usuario = _id_usuario;
  let ct = 0;
  let nro_linha = 0;
  let result = { message: "Processamento OK" };
  const { name } = req.body;
  const file = req.file;
  var dadosPlanilha = readline.createInterface({
    input: fs.createReadStream(file.path),
  });
  for await (let linha of dadosPlanilha) {  
    nro_linha++;
    if (nro_linha > 1) {
      const campos = parse.ParseCVS("", linha, ";");
     
      if (campos.length != 36) {
        result = {
          message: `Quantidade De Colunas Deferente Do Padrão (36)! ${campos.length}}`,
        };
        console.log(
          `Quantidade De Colunas Deferente Do Padrão (36)! ${campos.length}}`
        );
        continue;
      }

      campos[10] = campos[10].replace(/[a-zA-Z]{3}\//, (match) => {
        const months = {
          jan: '01-',
          fev: '02-',
          mar: '03-',
          abr: '04-',
          mai: '05-',
          jun: '06-',
          jul: '07-',
          ago: '08-',
          set: '09-',
          out: '10-',
          nov: '11-',
          dez: '12-',
          Jan: '01-',
          Feb: '02-',
          Mar: '03-',
          Apr: '04-',
          May: '05-',
          Jun: '06-',
          Jul: '07-',
          Aug: '08-',
          Sep: '09-',
          Oct: '10-',
          Nov: '11-',
          Dec: '12-'
        };
        return months[match.slice(0, 3)];
    });
    

  
      const retornoModel = _centroCusto(campos);
      if (retornoModel != null) {
          try {
           // const registro = await centrocustoSrv.insertCentrocusto(retornoModel);
          } catch (err) {
            console.log(err);
        }
      }
      const grupoModel = _grupo(campos);
      
      if (grupoModel != null) {
    
        try {
        //const registro = await grupoSrv.insertGrupo(grupoModel);
        }  catch (err) {
          console.log(err);
      }
      } 

      const produtosModel = _produto(campos);

      if (produtosModel != null) {
        
        try {
          const registro = await produtoSrv.insertProduto(produtosModel);
          }  catch (err) {
            console.log(err);
        }
      }

      const principalModel = _principal(campos);

      if (principalModel != null) {
        try {
          const registro = await principalSrv.insertPrincipal(principalModel);
          }  catch (err) {
            console.log(err);
        }
      }

      const ImobilizadoModel = _imobilizado(campos);

      if (ImobilizadoModel != null) {
        try {
            const registro = await imobilizadoSrv.insertImobilizado(
            ImobilizadoModel
         );
          }  catch (err) {
            console.log(err);
        }
      
      }
      const NfesModel = _nfe(campos);

      if (NfesModel != null) {
        try {
             const registro = await nfeSrv.insertNfe(NfesModel);
          }  catch (err) {
            console.log(err);
        }
        
      }

      const ValorModel = _valores(campos);

      if (ValorModel != null) {
            console.log(ValorModel);
          try {
            const registro = await valorSrv.insertValor(ValorModel);
            }  catch (err) {
              console.log(err);
          }
      }
      
    }
      
  }
  return result;
};

exports.update = async (req, res, _id_empresa, _id_local, _id_usuario) => {
  id_empresa = _id_empresa;
  id_local = _id_local;
  id_usuario = _id_usuario;
  let ct = 0;
  let nro_linha = 0;
  let result = { message: "Processamento OK" };
  const { name } = req.body;
  const file = req.file;
  var dadosPlanilha = readline.createInterface({
    input: fs.createReadStream(file.path),
  });
  for await (let linha of dadosPlanilha) {
    nro_linha++;
    if (nro_linha > 1) {
      const campos = parse.ParseCVS("", linha, ";");  
      if (campos.length != 36) {
        result = {
          message: `Quantidade De Colunas Deferente Do Padrão (35)! ${campos.length}}`,
        };
        console.log(
          `Quantidade De Colunas Deferente Do Padrão (35)! ${campos.length}}`
        );
        break;
      }
      
      const principalModel = _principalSemFiltro(campos);

        if (principalModel != null) {

          const princImobilizadoModel = await imobilizadoSrv.getImobilizado(id_empresa,id_local,principalModel.codigo);

          if (princImobilizadoModel != null)  {

            princImobilizadoModel.principal = principalModel.codigo;

            const alterado = await imobilizadoSrv.updateImobilizado(princImobilizadoModel);

            }
     

         const ImobilizadoModel = _imobilizado(campos);

          if (ImobilizadoModel != null) {

            const imobilizado = await imobilizadoSrv.getImobilizado(id_empresa,id_local,ImobilizadoModel.codigo);
        
            if (imobilizado != null){
                  console.log(`Principal ${principalModel.codigo} Imobilizado ${imobilizado.codigo}`);

                  imobilizado.principal =  principalModel.codigo;

                  const alterado = await imobilizadoSrv.updateImobilizado(imobilizado);
            } else {
                  console.log("Não Encontrado No Imobilizado: ",ImobilizadoModel.codigo);
            }
          } 
      }
        
    }
  }
  return result;
};

function _centroCusto(campos) {
  //console.log(campos);
  let centrocustoModel = null;
  ct = 0;
  const idx_cc = centro_custos.findIndex((cc) => {
    return cc.cod_cc.trim().replace("#","-") == campos[10].trim().replace("#","-");
  });
  if (campos[10].trim() !== "" && idx_cc == -1) {
    ct++;
    centro_custos.push({
      idx: ct,
      cod_cc: campos[10].replace("#","-"),
      desc_cc: campos[11],
    });
    centrocustoModel = {
      id_empresa: id_empresa,
      id_filial: id_local,
      codigo: campos[10].replace("#","-"),
      descricao: campos[11],
      user_insert: id_usuario,
      user_update: 0,
    };
  }
  return centrocustoModel;
}

function _grupo(campos) {
  ct = 0;
  let grupoModel = null;
  const idx_gr = grupos.findIndex((gr) => {
    return gr.cod_grupo.trim() == campos[8].trim();
  });
  if (campos[8].trim() !== "" && idx_gr == -1) {
    ct++;
    grupos.push({ idx: ct, cod_grupo: campos[8], desc_grupo: campos[9] });
    grupoModel = {
      id_empresa: id_empresa,
      id_filial: id_local,
      codigo: campos[8],
      descricao: campos[9].toUpperCase(),
      user_insert: id_usuario,
      user_update: 0,
    };
  }

  return grupoModel;
}

function _produto(campos) {
  let ct = 0;
  let produtosModel = null;
  const idx_pro = produtos.findIndex((pr) => {
    return pr.cod_produto.trim() == campos[1].trim();
  });
  if (campos[1].trim() !== "" && idx_pro == -1) {
    ct++;
    let cod_produto = parseInt(campos[4].trim(), 10);
    if (isNaN(cod_produto)) {
      cod_produto = 0;
    }
    let estado = 0;
    if (campos[0].trim() != "") {
      if (campos[0].trim() == "NOVO") {
        estado = 1;
      } else {
        estado = 3;
      }
    }
    produtos.push({
      idx: ct,
      cod_produto: campos[1],
      desc_produto: campos[2],
    });
    produtosModel = {
      id_empresa: id_empresa,
      id_filial: id_local,
      codigo: campos[1],
      estado: estado,
      descricao: shared.excluirCaracteres(campos[2]).toUpperCase(),
      ncm: campos[3],
      id_principal: cod_produto,
      user_insert: id_usuario,
      user_update: 0,
    };
  }
  return produtosModel;
}

function _principal(campos) {
  let principalModel = null;
  let ct = 0;
  const idx_main = principal.findIndex((pr) => {
    return pr.cod_produto.trim() == campos[4].trim();
  });
  if (campos[4].trim() !== "" && idx_main == -1) {
    ct++;
    principal.push({
      idx: ct,
      cod_produto: campos[4],
      desc_produto: campos[4],
    });
    principalModel = {
      id_empresa: id_empresa,
      id_filial: id_local,
      codigo: campos[4],
      descricao: shared.excluirCaracteres(campos[5]).toUpperCase(),
      user_insert: id_usuario,
      user_update: 0,
    };
  }
  return principalModel;
}

function _principalSemFiltro(campos) {
    let principalModel = null;
   
    if (campos[4].trim() !== "") {
      principalModel = {
        id_empresa: id_empresa,
        id_filial: id_local,
        codigo: campos[4],
        descricao: shared.excluirCaracteres(campos[5]).toUpperCase(),
        user_insert: id_usuario,
        user_update: 0,
      };
    }
    return principalModel;
  }

function _imobilizado(campos) {
  let ImobilizadoModel = null;
  let ct = 0;
  const idx_mob = imobilizados.findIndex((imo) => {
    return imo.cod_imobilizado.trim() == campos[6].trim();
  });
  if (campos[6].trim() !== "" && idx_mob == -1) {
    ct++;
    imobilizados.push({
      idx: ct,
      cod_imobilizado: campos[6],
      desc_imobilizado: campos[7],
    });

    ImobilizadoModel = {
      id_empresa: id_empresa,
      id_filial: id_local,
      codigo: campos[6],
      descricao: shared.excluirCaracteres(campos[7]).toUpperCase(),
      cod_grupo: campos[8],
      cod_cc: "3#109", //campos[10].replace("#","-"),
      nfe: campos[16],
      serie: campos[17],
      item: campos[18],
      condicao: campos[12],
      apelido: campos[13],
      origem: "P",
      principal: 0,
      user_insert: id_usuario,
      user_update: 0,
    };
  }
  return ImobilizadoModel;
}

function _nfe(campos) {
  let NfesModel = null;
  let ct = 0;
  const idx_nfe = nfes.findIndex((nf) => {
    return (
      nf.imobilizado == campos[6] &&
      nf.nfe == campos[16] &&
      nf.serie == campos[17] &&
      nf.item == campos[18]
    );
  });
  if (campos[16].trim() !== "" && idx_nfe == -1) {
    nfes.push({
      idx: ct,
      id_empresa: id_empresa,
      id_filial: id_local,
      cnpj_fornecedor: campos[14],
      razao_fornecedor: shared.excluirCaracteres(campos[15]).toUpperCase(),
      id_imobilizado: campos[6],
      nfe: campos[16],
      serie: campos[17],
      item: campos[18],
    });
    NfesModel = {
      id_empresa: id_empresa,
      id_filial: id_local,
      cnpj_fornecedor: campos[14],
      razao_fornecedor: shared.excluirCaracteres(campos[15]).toUpperCase(),
      id_imobilizado: campos[6],
      nfe: campos[16],
      serie: campos[17],
      item: campos[18],
      chavee: campos[19],
      dtemissao: campos[27],
      dtlancamento: campos[28],
      qtd: shared.excluirVirgulasePontos(campos[20]),
      punit: shared.excluirVirgulasePontos(campos[21]),
      totalitem: shared.excluirVirgulasePontos(campos[22]),
      vlrcontabil: shared.excluirVirgulasePontos(campos[23]),
      baseicms: shared.excluirVirgulasePontos(campos[24]),
      percicms: shared.excluirVirgulasePontos(campos[25]),
      vlrcicms: shared.excluirVirgulasePontos(campos[26]),
      user_insert: id_usuario,
      user_update: 0,
    };
  }
  return NfesModel;
}

function _valores(campos) {
  let ValorModel = null;
  ct = 0;
  const idx_valor = valores.findIndex((val) => {
    return (
      val.id_empresa == id_empresa &&
      val.id_filial == id_local &&
      val.id_imobilizado == campos[6]
    );
  });
  if (idx_valor == -1) {
    ct++;
    valores.push({
      idx: ct,
      cod_imobilizado: campos[12],
      dtaquisicao: campos[29],
    });

    ValorModel = {
      id_empresa: id_empresa,
      id_filial: id_local,
      id_imobilizado: campos[6],
      dtaquisicao: campos[29],
      vlraquisicao: shared.excluirVirgulasePontos(campos[30]),
      totaldepreciado: shared.excluirVirgulasePontos(campos[31]),
      vlrresidual: shared.excluirVirgulasePontos(campos[32]),
      reavalicao: shared.excluirVirgulasePontos(campos[33]),
      deemed: shared.excluirVirgulasePontos(campos[34]),
      vlrconsolidado: shared.excluirVirgulasePontos(campos[35]),
      user_insert: id_usuario,
      user_update: 0,
    };
  }
  return ValorModel;
}

exports.createV2 = async (req, res) => {
  const { name } = req.body;
  const file = req.file;
  return { message: "Deu Certo !!" };
};

exports.delete = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;
    fs.unlinkSync(file.path);
    res.status(200).json({ message: "Arquivo Excluído!", path: file.path });
  } catch (erro) {
    res.status(500).json({ message: erro.message });
  }
};
