/* ROUTE de_para */
const db = require("../infra/database");
const express = require("express");
const router = express.Router();

const deparaSrv = require("../service/deparaService");

/* ROTA GETONE depara */
router.get(
  "/api/depara/:id_empresa/:id_local/:id_inventario/:de/:para",
  async function (req, res) {
    try {
      const lsLista = await deparaSrv.getDepara(
        req.params.id_empresa,
        req.params.id_local,
        req.params.id_inventario,
        req.params.de,
        req.params.para,
      );
      if (lsLista == null) {
        res.status(409).json({ message: "Depara Não Encontrada." });
      } else {
        res.status(200).json(lsLista);
      }
    } catch (err) {
      if (err.name == "MyExceptionDB") {
        res.status(409).json(err);
      } else {
        res
          .status(500)
          .json({ erro: "BAK-END", tabela: "depara", message: err.message });
      }
    }
  },
);
/* ROTA GETALL depara */
router.get("/api/depara/", async function (req, res) {
  try {
    const lsLista = await deparaSrv.getDeparas();
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
        .json({ erro: "BAK-END", tabela: "depara", message: err.message });
    }
  }
});
/* ROTA INSERT depara */
router.post("/api/depara/", async function (req, res) {
  try {
    const depara = req.body;
    const registro = await deparaSrv.insertDepara(depara);
    if (registro == null) {
      res.status(409).json({ message: "Depara Cadastrado!" });
    } else {
      res.status(200).json(registro);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Depara", message: err.message });
    }
  }
});
/* ROTA UPDATE depara */
router.put("/api/depara/", async function (req, res) {
  try {
    const depara = req.body;
    const registro = await deparaSrv.updateDepara(depara);
    if (registro == null) {
      res.status(409).json({ message: "Depara Alterado Com Sucesso!" });
    } else {
      res.status(200).json(registro);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Depara", message: err.message });
    }
  }
});
/* ROTA DELETE depara */
router.delete(
  "/api/depara/:id_empresa/:id_local/:id_inventario/:de/:para",
  async function (req, res) {
    try {
      await deparaSrv.deleteDepara(
        req.params.id_empresa,
        req.params.id_local,
        req.params.id_inventario,
        req.params.de,
        req.params.para,
      );
      res.status(200).json({ message: "Depara Excluído Com Sucesso!" });
    } catch (err) {
      if (err.name == "MyExceptionDB") {
        res.status(409).json(err);
      } else {
        res
          .status(500)
          .json({ erro: "BAK-END", tabela: "Depara", message: err.message });
      }
    }
  },
);
/* ROTA CONSULTA POST de_para */
router.post("/api/deparas", async function (req, res) {
  /*
            	{
            		"id_empresa":0, 
            		"id_local":0, 
            		"id_inventario":0, 
            		"de":0, 
            		"para":0, 
            		"status":0, 
            		"id_usuario":0, 
            		"pagina":0, 
            		"tamPagina":50, 
            		"contador":"N", 
            		"orderby":"", 
            		"sharp":false 
            	}
            */
  try {
    const params = req.body;
    console.log(params);
    const lsRegistros = await deparaSrv.getDeparas(params);
    if (lsRegistros.length == 0) {
      res.status(409).json({ message: "Depara Nenhum Registro Encontrado!" });
    } else {
      res.status(200).json(lsRegistros);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Depara", message: err.message });
    }
  }
});

module.exports = router;
