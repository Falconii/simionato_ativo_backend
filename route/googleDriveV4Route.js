const db = require("../infra/database");
const express = require("express");
const fs = require("fs");
const router = express.Router();
const fotoSrv = require("../service/fotoService");
const { google } = require("googleapis");
const uploadFotos = require("../config/uploadFotosV4.js");
const GOOGLE_API_FOLDER_ID = "1Oc4S6bEQy_TPPPSsxzl1gYkOs8wvwuWq";
const GOOGLE_API_FOLDER_ID_SIMIONATO = "1RFHyFMSFAGtgtvnY1HjKLLA7HWbEAQLW";
const PORT = process.env.PORT || 3000;
const URL_GOOGLE_DRIVE = "https://drive.google.com/uc?export=view&id=";

/* ROTINAS DE ACESSO AO GOOGLE V4 *;
/* ROTA UPLOADFOTOS imobilizadoinventario */
router.post(
  "/api/uploadfotov4",
  uploadFotos.single("file"),
  async function (req, res) {
    console.log("Entrei Na Rota uploadfotov4 !");

    const id_empresa = req.body.id_empresa;
    const id_local = req.body.id_local;
    const id_inventario = req.body.id_inventario;
    const id_imobilizado = req.body.id_imobilizado;
    const id_pasta = req.body.id_pasta;
    const id_file = req.body.id_file;
    const id_usuario = req.body.id_usuario;
    const data = req.body.data;
    const destaque = req.body.destaque;
    const obs = req.body.obs;
    const file_name = `${req.file.originalname}`;
    let existeDrive = false;
    let arquivo = "";
    let acao = "";

    console.log(
      "id_empresa",
      id_empresa,
      "\nid_local",
      id_local,
      "\nid_inventario",
      id_inventario,
      "\nid_imobilizado",
      id_imobilizado,
      "\ndata",
      data,
      "destaque",
      destaque,
      "\nobs",
      obs,
      "\nid_pasta",
      id_pasta,
      "\nid_file",
      id_file,
      "\nid_usuario",
      id_usuario,
      "\nfile_name",
      file_name
    );

    let foto = await fotoSrv.getFoto(
      id_empresa,
      id_local,
      id_inventario,
      id_imobilizado,
      id_pasta,
      id_file,
      file_name
    );

    console.log(
      "foto",
      foto,
      "GOOGLE_API_FOLDER_ID_SIMIONATO",
      GOOGLE_API_FOLDER_ID_SIMIONATO
    );

    if (foto == null) {
      acao = "inclusao";
      foto = {
        id_empresa: id_empresa,
        id_local: id_local,
        id_inventario: id_inventario,
        id_imobilizado: id_imobilizado,
        id_pasta: GOOGLE_API_FOLDER_ID_SIMIONATO,
        id_file: "",
        file_name: file_name,
        file_name_original: req.file.originalname,
        id_usuario: id_usuario,
        data: data,
        destaque: destaque,
        obs: obs,
        user_insert: id_usuario,
        user_update: 0,
      };
    } else {
      acao = "alteracao";
      foto.id_usuario = id_usuario;
      foto.user_update = id_usuario;
    }

    if (PORT == 3000) {
      arquivo =
        "C:/Repositorios Git/Simionato/controle de ativo/keys/intelli-simionato.json";
    } else {
      arquivo = "./keys/intelli-simionato.json";
    }

    console.log(
      "id_empresa",
      id_empresa,
      "id_local",
      id_local,
      "id_inventario",
      id_inventario,
      "id_usuario",
      id_usuario,
      "file_name",
      file_name
    );

    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: arquivo,
        scopes: ["https://www.googleapis.com/auth/drive"],
      });

      const driveService = google.drive({
        version: "v3",
        auth,
      });

      const fileMetaData = {
        name: file_name,
        parents: [GOOGLE_API_FOLDER_ID_SIMIONATO],
      };

      const media = {
        mimeType: "image/jpg",
        body: fs.createReadStream(`./fotos/${file_name}`),
      };

      let existeDrive = false;

      try {
        // Verifincando se existe ok
        const responseGet = await driveService.files.get({
          fileId: foto.id_file,
        });
        existeDrive = true;
      } catch (error) {
        existeDrive = false;
      }

      if (!existeDrive) {
        // Gravando
        const response = await driveService.files.create({
          resource: fileMetaData,
          media: media,
        });
        console.log("Gravei Arquivo", response.data);
        foto.id_file = response.data.id;
        try {
          // Verifincando se existe ok
          const responseGet = await driveService.files.get({
            fileId: foto.id_file,
          });
          existe = true;
          console.log("GET", responseGet.data);
        } catch (error) {
          existe = false;
        }
        const ft = await fotoSrv.insertFoto(foto);
        if (ft == null) {
          res
            .status(200)
            .json({ code: "409", message: "Falha Ao Incluir Foto No BD" });
        } else {
          console.log(`${URL_GOOGLE_DRIVE}${foto.id_file}`);
          res.status(200).json({ code: "200", message: "Foto Registrada" });
        }
      } else {
        //Excluindo
        const responseDelete = await driveService.files.delete({
          fileId: foto.id_file,
        });
        console.log("Arquivo Excluido Com Sucesso!!!");
        // Regravando
        const response = await driveService.files.create({
          resource: fileMetaData,
          media: media,
        });
        foto.id_file = response.data.id;
        const ft = await fotoSrv.updateFoto(foto);
        if (ft == null) {
          res
            .status(200)
            .json({ code: "409", message: "Falha Ao Alterar Foto No BD" });
        } else {
          try {
            // Verifincando se existe ok
            const responseGet = await driveService.files.get({
              fileId: foto.id_file,
            });
          } catch (error) {}
          console.log(URL_GOOGLE_DRIVE.join(foto.id_file));
          res.status(200).json({ code: "200", message: "Foto Alterada" });
        }
      }
    } catch (err) {
      if (err.name == "MyExceptionDB") {
        res.status(409).json(err);
      } else {
        res
          .status(500)
          .json({ erro: "BAK-END", tabela: "fotos", message: err.message });
      }
    }
  }
);

router.post("/api/deleteuploadfotov4", async function (req, res) {
  let arquivo = "";
  try {
    const foto = req.body;
    //deleta primeir do google
    try {
      if (PORT == 3000) {
        arquivo =
          "C:/Repositorios Git/Simionato/controle de ativo/keys/intelli-simionato.json";
      } else {
        arquivo = "./keys/intelli-simionato.json";
      }

      const auth = new google.auth.GoogleAuth({
        keyFile: arquivo,
        scopes: ["https://www.googleapis.com/auth/drive"],
      });

      const driveService = google.drive({
        version: "v3",
        auth,
      });

      let existe = false;

      try {
        // Verifincando se existe ok
        const responseGet = await driveService.files.get({
          fileId: foto.id_file,
        });
        console.log("Arquivo Existe No GooGle Drive");
        existe = true;
      } catch (error) {
        console.log("Arquivo Não Existe No GooGle Drive");
        existe = false;
        console.log(error);
      }

      if (existe) {
        //Excluindo
        const responseDelete = await driveService.files.delete({
          fileId: foto.id_file,
        });

        console.log("Arquivo Excluido Com Sucesso!!!");
      }
    } catch (erro) {
      console.log(erro);
    }
    //deleta do banco
    const registro = await fotoSrv.deleteFoto(
      foto.id_empresa,
      foto.id_local,
      foto.id_inventario,
      foto.id_imobilizado,
      foto.id_pasta,
      foto.id_file,
      foto.file_name
    );
    if (registro == null) {
      res.status(200).json({
        message: "Foto Excluída Com Sucesso!",
      });
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Foto", message: err.message });
    }
  }
});

module.exports = router;
