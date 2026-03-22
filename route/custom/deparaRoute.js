/* ROUTE de_para */
const db = require("../../infra/database");
const express = require("express");
const router = express.Router();
const deparaSrv = require("../../service/custom/deparaService");
const funcoes = require("../../util/deparaFuncoes");

/* processar depara */
router.post("/api/processardepara", async function(req, res) {
    try {
        const credencial = req.body;
        const registro = await deparaSrv.processarDePara(credencial);
        if (registro == null) {
            res.status(409).json({ message: "Arquivo De Para Processado!" });
        } else {
            res.status(200).json(registro);
        }
    } catch (err) {
        if (err.name == "MyExceptionDB") {
            res.status(409).json(err);
        } else {
            res
                .status(500)
                .json({ erro: "BAK-END", tabela: "DePara", message: err.message });
        }
    }
});

router.post("/api/substituirativo", async function(req, res) {
    try {
        const { id_empresa, id_local, id_inventario } = req.body;

        const registro = await funcoes.SubstituirAtivo(
            id_empresa,
            id_local,
            id_inventario,
        );

        if (registro == null) {
            res.status(409).json({ message: "Falha No Processamento!" });
        } else {
            res.status(200).json(registro);
        }
    } catch (err) {
        if (err.name == "MyExceptionDB") {
            res.status(409).json(err);
        } else {
            res
                .status(500)
                .json({ erro: "BAK-END", tabela: "DePara", message: err.message });
        }
    }
});

router.post("/api/deparaativo", async function(req, res) {
    try {
        const { id_empresa, id_local, id_inventario, id_imobilizado, id_usuario } =
        req.body;

        const registro = await funcoes.DeParaAtivo(
            id_empresa,
            id_local,
            id_inventario,
            id_imobilizado,
            id_usuario,
        );

        if (registro == null) {
            res.status(409).json({ message: "Falha No Processamento!" });
        } else {
            res.status(200).json(registro);
        }
    } catch (err) {
        if (err.name == "MyExceptionDB") {
            res.status(409).json(err);
        } else {
            res
                .status(500)
                .json({ erro: "BAK-END", tabela: "DePara", message: err.message });
        }
    }
});

module.exports = router;