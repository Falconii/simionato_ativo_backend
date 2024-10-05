/* ROUTE lancamentos */
const db = require("../infra/database");
const express = require("express");
const router = express.Router();
const lancamentoSrv = require("../service/lancamentoService");

/* ROTA GETONE lancamento */
router.get(
  "/api/lancamento/:id_empresa/:id_filial/:id_inventario/:id_imobilizado",
  async function (req, res) {
    try {
      const lsLista = await lancamentoSrv.getLancamento(
        req.params.id_empresa,
        req.params.id_filial,
        req.params.id_inventario,
        req.params.id_imobilizado
      );
      if (lsLista == null) {
        res.status(409).json({ message: "Lançamento Não Encontrada." });
      } else {
        res.status(200).json(lsLista);
      }
    } catch (err) {
      if (err.name == "MyExceptionDB") {
        res.status(409).json(err);
      } else {
        res.status(500).json({
          erro: "BAK-END",
          tabela: "lancamento",
          message: err.message,
        });
      }
    }
  }
);
/* ROTA GETALL lancamento */
router.get("/api/lancamentos", async function (req, res) {
  try {
    const lsLista = await lancamentoSrv.getLancamentos();
    if (lsLista.length == 0) {
      res
        .status(409)
        .json({ message: "Nehuma Informação Para Esta Consulta." });
    } else {
      res.status(200).json(lsLista);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "lancamento", message: err.message });
    }
  }
});
/* ROTA INSERT lancamento */
router.post("/api/lancamento", async function (req, res) {
  try {
    const lancamento = req.body;
    //Recalcula situacao
    lancamento.estado = 4;
    if (lancamento.estado !== 5) {
      // sit 1
      if (
        lancamento.new_codigo == 0 ||
        (lancamento.id_imobilizado == lancamento.new_codigo &&
          lancamento.new_cc.trim() == "") ||
        lancamento.imo_cod_cc == lancamento.new_cc
      ) {
        lancamento.estado = 1;
      }
      // 2
      if (
        (lancamento.new_codigo > 0 &&
          lancamento.id_imobilizado !== lancamento.new_codigo &&
          lancamento.new_cc.trim() == "") ||
        lancamento.imo_cod_cc == lancamento.new_cc
      ) {
        lancamento.estado = 2;
      }
      //3
      if (
        lancamento.new_codigo == 0 ||
        (lancamento.id_imobilizado == lancamento.new_codigo &&
          lancamento.new_cc.trim() !== "" &&
          lancamento.imo_cod_cc !== lancamento.new_cc)
      ) {
        lancamento.estado = 3;
      }
      //4
      if (
        lancamento.new_codigo > 0 &&
        lancamento.id_imobilizado !== lancamento.new_codigo &&
        lancamento.new_cc.trim() !== "" &&
        lancamento.imo_cod_cc !== lancamento.new_cc
      ) {
        lancamento.estado = 4;
      }
    } else {
      lancamento.estado = 5;
    }
    const registro = await lancamentoSrv.insertLancamento(lancamento);
    if (registro == null) {
      res.status(409).json({ message: "Lancamento Cadastrado!" });
    } else {
      res.status(200).json(registro);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Lancamento", message: err.message });
    }
  }
});
/* ROTA UPDATE lancamento */
router.put("/api/lancamento", async function (req, res) {
  try {
    const lancamento = req.body;

    lancamento.estado = 4;
    if (lancamento.estado !== 5) {
      // sit 1
      if (
        lancamento.new_codigo == 0 ||
        (lancamento.id_imobilizado == lancamento.new_codigo &&
          lancamento.new_cc.trim() == "") ||
        lancamento.imo_cod_cc == lancamento.new_cc
      ) {
        lancamento.estado = 1;
      }
      // 2
      if (
        (lancamento.new_codigo > 0 &&
          lancamento.id_imobilizado !== lancamento.new_codigo &&
          lancamento.new_cc.trim() == "") ||
        lancamento.imo_cod_cc == lancamento.new_cc
      ) {
        lancamento.estado = 2;
      }
      //3
      if (
        lancamento.new_codigo == 0 ||
        (lancamento.id_imobilizado == lancamento.new_codigo &&
          lancamento.new_cc.trim() !== "" &&
          lancamento.imo_cod_cc !== lancamento.new_cc)
      ) {
        lancamento.estado = 3;
      }
      //4
      if (
        lancamento.new_codigo > 0 &&
        lancamento.id_imobilizado !== lancamento.new_codigo &&
        lancamento.new_cc.trim() !== "" &&
        lancamento.imo_cod_cc !== lancamento.new_cc
      ) {
        lancamento.estado = 4;
      }
    } else {
      lancamento.estado = 5;
    }

    const registro = await lancamentoSrv.updateLancamento(lancamento);
    if (registro == null) {
      res.status(409).json({ message: "Lancamento Alterado Com Sucesso!" });
    } else {
      res.status(200).json(registro);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Lancamento", message: err.message });
    }
  }
});
/* ROTA DELETE lancamento */
router.delete(
  "/api/lancamento/:id_empresa/:id_filial/:id_inventario/:id_imobilizado",
  async function (req, res) {
    try {
      await lancamentoSrv.deleteLancamento(
        req.params.id_empresa,
        req.params.id_filial,
        req.params.id_inventario,
        req.params.id_imobilizado
      );
      res.status(200).json({ message: "Lancamento Excluído Com Sucesso!" });
    } catch (err) {
      if (err.name == "MyExceptionDB") {
        res.status(409).json(err);
      } else {
        res.status(500).json({
          erro: "BAK-END",
          tabela: "Lancamento",
          message: err.message,
        });
      }
    }
  }
);
/* ROTA CONSULTA POST lancamentos */
router.post("/api/lancamentos", async function (req, res) {
  /*
                  	{
                  		"id_empresa":0, 
                  		"id_filial":0, 
                  		"id_lanca":0, 
                  		"id_inventario":0, 
                  		"id_imobilizado":0, 
                  		"pagina":0, 
                  		"tamPagina":50, 
                  		"contador":"N", 
                  		"orderby":"", 
                  		"sharp":false 
                  	}
                  */
  try {
    const params = req.body;
    const lsRegistros = await lancamentoSrv.getLancamentos(params);
    if (lsRegistros.length == 0) {
      res
        .status(409)
        .json({ message: "Lancamento Nenhum Registro Encontrado!" });
    } else {
      res.status(200).json(lsRegistros);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Lancamento", message: err.message });
    }
  }
});

/* ROTA CONSULTA POST Resumo Lancamentos */
router.post("/api/resumolancamentos", async function (req, res) {
  /*
                  	{
                  		public id_empresa: number = 0;
                          public id_filial: number = 0;
                          public id_inventario: number = 0;
                  	}
                  */
  console.log(`Chegue na Rota resumolancamentos`);
  try {
    const params = req.body;
    const lsRegistros = await lancamentoSrv.getResumoLancamentos(params);
    if (lsRegistros.length == 0) {
      res
        .status(409)
        .json({ message: "Lancamento Nenhum Registro Encontrado!" });
    } else {
      res.status(200).json(lsRegistros);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Lancamento", message: err.message });
    }
  }
});

/* ROTA CONSULTA POST Evolucoes */
router.post("/api/evolucoes", async function (req, res) {
  /*
    	{
              	  "id_empresa" :  1 , 
                  "id_filial" :  14 , 
                  "id_inventario" :  10 , 
                  "id_usuario" :  0,
		              "pagina" :  0 , 
		              "tamPagina" :  50 , 
		              "contador":"N",
		              "orderby": "",
		              "sharp": "true"
	}  
 */
  console.log(`Chegue na Rota evolucaolancamentos`);
  try {
    const params = req.body;
    const lsRegistros = await lancamentoSrv.getEvolucaoLancamentos(params);
    if (lsRegistros.length == 0) {
      res.status(409).json({ message: "Nenhum Registro Encontrado!" });
    } else {
      res.status(200).json(lsRegistros);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Lancamento", message: err.message });
    }
  }
});

module.exports = router;
