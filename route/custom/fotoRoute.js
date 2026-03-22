/* ROUTE fotos */
const db = require("../../infra/database");
const express = require("express");
const fs = require("fs");
const router = express.Router();
const fotoSrv = require("../../service/custom/fotoService");
const shared = require("../../util/shared.js");
const funcoes = require("../../util/deparaFuncoes");

/* ROTA CONSULTA POST fotos */
router.post("/api/corrigenomedefoto", async function(req, res) {
    try {
        const params = req.body;
        const lsFotos = await fotoSrv.FotosParaCorrigir(params);

        if (!lsFotos || lsFotos.length === 0) {
            return res
                .status(409)
                .json({ message: "Foto Nenhum Registro Encontrado!" });
        }

        // 🔥 RESPONDE IMEDIATAMENTE
        res.status(200).json(lsFotos);

        // 🔥 PROCESSA EM BACKGROUND (sem await)
        process.nextTick(async() => {
            for (const foto of lsFotos) {
                try {
                    await funcoes.CorrigeFileNamePadrao(foto);
                } catch (err) {
                    console.error("Erro ao processar foto:", err);
                }
            }

            console.log("Fim Do Processamento!");
        });
    } catch (err) {
        if (err.name === "MyExceptionDB") {
            res.status(409).json(err);
        } else {
            res.status(500).json({
                erro: "BAK-END",
                tabela: "Foto",
                message: err.message,
            });
        }
    }
});

module.exports = router;