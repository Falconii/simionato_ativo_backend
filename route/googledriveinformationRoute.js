const express = require("express");
const router = express.Router();
const erroDB = require("../util/userfunctiondb");
const { google } = require("googleapis");
const GOOGLE_API_FOLDER_ID = "1Oc4S6bEQy_TPPPSsxzl1gYkOs8wvwuWq";
const GOOGLE_API_FOLDER_ID_SIMIONATO = "1eQuwNcfTmpYUWUIvlGBouodico8WrjoD";
const PORT = process.env.PORT || 3000;

// Verifica o espaço de armazenamento disponível no Google Drive
async function checkStorageQuota(driveService) {
    try {
        const about = await driveService.about.get({
            fields: "storageQuota",
        });
        const totalStorage = (about.data.storageQuota.limit / 1024 ** 3).toFixed(2); //gb
        const usedStorage = (about.data.storageQuota.usage / 1024 ** 3).toFixed(2); //gb
        const remainingStorage = (totalStorage - usedStorage).toFixed(2); //gb
        return {
            Armazenamento_total: totalStorage,
            Armazenamento_usado: usedStorage,
            Armazenamento_restante: remainingStorage,
        };
        /* console.log(`Armazenamento total: ${totalStorage} GB`);
                            console.log(`Armazenamento usado: ${usedStorage} GB`);
                            console.log(`Armazenamento restante: ${remainingStorage} GB`); */
    } catch (error) {
        throw new erroDB.UserException("Google Drive", [
            { tabela: "discofreev1", message: `Falha Na Consulta No Google` },
        ]);
    }
}

router.post("/api/discofreev1", async function(req, res) {
    console.log("Entrei Na Rota discofreev1!");

    /* const id_empresa = req.body.id_empresa;
    const id_local = req.body.id_local;
    const id_inventario = req.body.id_inventario;
    const key = req.body.key; */

    const {id_empresa }   = req.body;
    const {id_local}      = req.body;
    const {id_inventario} = req.body;
    const {key}           = req.body;
    let arquivo = "";

    if (key == "") {
        if (PORT == 3000) {
            arquivo =
                "C:/Repositorios Git/Simionato/controle de ativo/keys/googlekey.json";
        } else {
            arquivo = "./keys/googlekey.json";
        }
    } else {
        if (key == "falconi") {
            if (PORT == 3000) {
                arquivo =
                    "C:/Repositorios Git/Simionato/controle de ativo/googlekey.json";
            } else {
                arquivo = "./keys/googlekey.json";
            }
        }
        if (key == "copperstill") {
            if (PORT == 3000) {
                arquivo =
                    "C:/Repositorios/Simionato/ativo web/simionato_ativo_backend/keys/google-simionato-000001-000014-000010-key.json";
                   
            } else {
                arquivo = "keys/google-simionato-000001-000014-000010-key.json";
            }
        }
        if (key == "intelli") {
            if (PORT == 3000) {
                arquivo =
                    "C:/Repositorios Git/Simionato/controle de ativo/keys/intelli-simionato.json";
            } else {
                arquivo = "./keys/intelli-simionato.json";
            }
        }
    }

    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: arquivo,
            scopes: ["https://www.googleapis.com/auth/drive"],
        });

        const driveService = google.drive({
            version: "v3",
            auth,
        });

        const space = await checkStorageQuota(driveService);

        res.status(200).json({ code: "200", space: space });
    } catch (err) {
        if (err.name == "MyExceptionDB") {
            res.status(409).json(err);
        } else {
            res.status(500).json({
                erro: "BAK-END",
                tabela: "Espaco No Google Drive",
                message: err.message,
            });
        }
    }
});

module.exports = router;