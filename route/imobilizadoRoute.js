/* ROUTE imobilizados */
const db = require("../infra/database");
const express = require("express");
const router = express.Router();
const imobilizadoSrv = require("../service/imobilizadoService");
const imobilizadoinventarioSrv = require("../service/imobilizadoinventarioService");

/* ROTA GETONE imobilizado */
router.get(
  "/api/imobilizado/:id_empresa/:id_filial/:codigo",
  async function (req, res) {
    try {
      const lsLista = await imobilizadoSrv.getImobilizado(
        req.params.id_empresa,
        req.params.id_filial,
        req.params.codigo
      );
      if (lsLista == null) {
        res.status(409).json({ message: "Imobilizado Não Encontrada." });
      } else {
        res.status(200).json(lsLista);
      }
    } catch (err) {
      if (err.name == "MyExceptionDB") {
        res.status(409).json(err);
      } else {
        res.status(500).json({
          erro: "BAK-END",
          tabela: "imobilizado",
          message: err.message,
        });
      }
    }
  }
);
/* ROTA GETALL imobilizado */
router.get("/api/imobilizados", async function (req, res) {
  try {
    const lsLista = await imobilizadoSrv.getImobilizados();
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
        .json({ erro: "BAK-END", tabela: "imobilizado", message: err.message });
    }
  }
});
/* ROTA INSERT imobilizado */
router.post("/api/imobilizado", async function (req, res) {
  try {
    const imobilizado = req.body;
    const registro = await imobilizadoSrv.insertImobilizado(imobilizado);
    if (registro == null) {
      res.status(409).json({ message: "Imobilizado Cadastrado!" });
    } else {
      res.status(200).json(registro);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Imobilizado", message: err.message });
    }
  }
});

router.post("/api/imobilizado_inv", async function (req, res) {
  try {
    const inventario = req.query.inventario;
    const imobilizado = req.body;
    console.log(req);
    console.log(inventario);
    console.log("------------------------------------------------");
    const registro = await imobilizadoSrv.insertImobilizado(imobilizado);
    if (registro == null) {
      res.status(409).json({ message: "Imobilizado Não Cadastrado!" });
    }
    console.log("registro", registro);
    const imo_inv = {
      id_empresa: registro.id_empresa,
      id_filial: registro.id_filial,
      id_inventario: inventario,
      id_imobilizado: registro.codigo,
      id_lanca: 0,
      status: 0,
      new_codigo: 0,
      new_cc: "",
      condicao: registro.condicao,
      book: "N",
      user_insert: registro.user_insert,
      user_update: 0,
      imo_descricao: "",
      imo_cod_cc: "",
      imo_cod_grupo: 0,
      cc_descricao: "",
      grupo_descricao: "",
      lanc_id_usuario: 0,
      lanc_dt_lanca: "",
      lanc_obs: "",
      lanc_estado: 0,
      usu_razao: "",
      new_cc_descricao: "",
    };
    const imo = await imobilizadoinventarioSrv.insertImobilizadoinventario(
      imo_inv
    );
    if (registro == null) {
      res
        .status(409)
        .json({ message: "Imobilizado Não Incluído No Inventário!" });
    } else {
      res.status(200).json(registro);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res.status(500).json({
        erro: "BAK-END",
        tabela: "Imobilizado-inv",
        message: err.message,
      });
    }
  }
});
/* ROTA UPDATE imobilizado */
router.put("/api/imobilizado", async function (req, res) {
  try {
    const imobilizado = req.body;
    const registro = await imobilizadoSrv.updateImobilizado(imobilizado);
    if (registro == null) {
      res.status(409).json({ message: "Imobilizado Alterado Com Sucesso!" });
    } else {
      res.status(200).json(registro);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Imobilizado", message: err.message });
    }
  }
});
/* ROTA DELETE imobilizado */
router.delete(
  "/api/imobilizado/:id_empresa/:id_filial/:codigo",
  async function (req, res) {
    try {
      await imobilizadoSrv.deleteImobilizado(
        req.params.id_empresa,
        req.params.id_filial,
        req.params.codigo
      );
      res.status(200).json({ message: "Imobilizado Excluído Com Sucesso!" });
    } catch (err) {
      if (err.name == "MyExceptionDB") {
        res.status(409).json(err);
      } else {
        res.status(500).json({
          erro: "BAK-END",
          tabela: "Imobilizado",
          message: err.message,
        });
      }
    }
  }
);
/* ROTA CONSULTA POST imobilizados */
router.post("/api/imobilizados", async function (req, res) {
  /*
        	{
        		"id_empresa":0, 
        		"id_filial":0, 
        		"codigo":0, 
        		"descricao":"", 
        		"grupo_cod":0, 
        		"cc_cod":"", 
        		"pagina":0, 
        		"tamPagina":50, 
        		"contador":"N", 
        		"orderby":"", 
        		"sharp":false 
        	}
        */
  try {
    const params = req.body;
    const lsRegistros = await imobilizadoSrv.getImobilizados(params);
    if (lsRegistros.length == 0) {
      res
        .status(409)
        .json({ message: "Imobilizado Nenhum Registro Encontrado!" });
    } else {
      res.status(200).json(lsRegistros);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Imobilizado", message: err.message });
    }
  }
});

/*
isto foi alterado
ok
*/

module.exports = router;
