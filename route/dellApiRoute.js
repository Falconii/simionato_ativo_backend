/* ROUTE credenciais */
const db = require("../infra/database");
const express = require("express");
const dellApiSrv = require("../service/dellApiService");
const router = express.Router();

/* Teste */
router.post("/teste", async function (req, res) {
  try {
    response = await dellApiSrv.getWarrantyInfo("GZFS814");
    console.log(JSON.stringify(response, null, 2));
    res.status(200).json({ message: "Rota Dell API Funcionando!" });
  } catch (err) {
    console.log(err);
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Dell API", message: err.message });
    }
  }
});
module.exports = router;
