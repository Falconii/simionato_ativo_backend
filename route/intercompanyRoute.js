/* ROUTE eventos  */
const db = require("../infra/database");
const express = require("express");
const router = express.Router();
const imobilizadoSrv = require("../service/imobilizadoService");
const imobilizadoinventarioSrv = require("../service/imobilizadoinventarioService");
const lancamentoSrv = require("../service/lancamentoService");
const empresaSrv = require("../service/empresaService");
const localSrv = require("../service/localService");
const centrocustoSrv = require("../service/centrocustoService");
const gruposrv = require("../service/grupoService");
const produtoSrv = require("../service/produtoService");
const principalSrv = require("../service/principalService");  
const nfeSrv = require("../service/nfeService");
const valorSrv = require("../service/valorService");
const erroDB = require('../util/userfunctiondb');
const response = require("../util/respostaPadrao");

/*
  Pegar movimentação de inventário de ativo de um local "origem" e transferir para outro local "destino"
  No local de origem, será excluido o ativo, e a movimentação de inventario
  No local de destino, será inserido a movimentação de inventario origem assim como as fotos.
  O Lancamento de inventario do destino será substituido pelo do origem.
*/


router.post("/transfere_ativo_intercompany", async function (req, res) {
  /*
   {
      "lanc_origem"  :1,
      "lanc_destino" :14
    }
    
  */
 console.log("Iniciando Processamento de Evento de Ativo");

    const lanc_origem  = req.body.lanc_origem;
    const lanc_destino = req.body.lanc_destino;


    // Validação
    const camposObrigatorios = ["lanc_origem", "lanc_destino"];
    const camposAusentes = camposObrigatorios.filter(campo => !req.body[campo]);
    if (camposAusentes.length > 0) {
      return response.validationError(res, camposAusentes);
    }

    
    console.log("Parametros Obrigatórios Presentes",lanc_origem,lanc_destino);

    const lancamento_origem = await lancamentoSrv.getLancamento(lanc_origem.id_empresa, lanc_origem.id_filial, lanc_origem.id_inventario,lanc_origem.id_imobilizado);

    if (lancamento_origem == null) {
      return response.notFound(res, `Lançamento de origem não encontrado.`);
    }


    const lancamento_destino = await lancamentoSrv.getLancamento(lanc_destino.id_empresa, lanc_destino.id_filial, lanc_destino.id_inventario,lanc_destino.id_imobilizado);

    if (lancamento_destino == null) {
      return response.notFound(res, `Lançamento de destino não encontrado.`);
    }

    //ativos devem ser iguais
    if (lancamento_origem.id_imobilizado != lancamento_destino.id_imobilizado) {
      return response.validationError(res, [`Os lançamentos devem pertencer ao mesmo ativo.`]);
    }
    
    lancamento_destino.id_centro_custo = lancamento_origem.id_centro_custo;
    lancamento_destino.data_inventario = lancamento_origem.data_inventario;;
    lancamento_destino.observacao = lancamento_origem.observacao;
    lancamento_destino.foto1 = lancamento_origem.foto1; 
    
    
  return response.success(res,"OK", { lanc_origem,lanc_destino });
 
});



module.exports = router;
