/* ROUTE correcao  */
const dirService = require("../service/diretorioService");
const compactar = require("../util/foto_compactacao");
const path = require("path");
const db = require("../infra/database");
const express = require("express");
const fs = require("fs");
const router = express.Router();
const fotoSrv = require("../service/fotoService");
const { google } = require("googleapis");
const uploadFotos = require("../config/uploadFotos");
//const GOOGLE_API_FOLDER_ID_SIMIONATO = "1eQuwNcfTmpYUWUIvlGBouodico8WrjoD";
const GOOGLE_API_FOLDER_ID_SIMIONATO = "1i5exZMWijaDqRkF3diGH5MtgyiLePnS5";
const PORT = process.env.PORT || 3000;
const URL_GOOGLE_DRIVE = "https://drive.google.com/uc?export=view&id=";

router.get("/api/transferenciadia/:dia", async function (req, res) {
  const dia = req.params.dia;

  const dirBase = global.appRoot;

  let fotos = dirService.getDirFotos(dia);

  const pathDia = path.resolve(`C:\\fotos\\${dia}`);

  let arquivo = "";

  let existeDrive = false;

  let acao = "";

  let contador = 0;

  /*  if (PORT == 3000) {
           arquivo =
             "C:/Repositorios Git/Simionato/controle de ativo/keys/google-simionato-000001-000014-000010-key.json";
         } else {
           arquivo = "./keys/google-simionato-000001-000014-000010-key.json";
         } */

  if (PORT == 3000) {
    arquivo =
      "C:/Repositorios Git/Simionato/controle de ativo/keys/googlekey.json";
  } else {
    arquivo = "./keys/googlekey.json";
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: arquivo,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  const driveService = google.drive({
    version: "v3",
    auth,
  });

  try {
    //Transferencia de arquivo

    for (const fotoAtual of fotos) {
      let param = {
        id_empresa: "1",
        id_local: "14",
        id_inventario: "10",
        id_imobilizado: fotoAtual.substring(17, 23),
        id_pasta: GOOGLE_API_FOLDER_ID_SIMIONATO,
        id_file: "",
        id_usuario: 16,
        data: "27/07/2024",
        destaque: "N",
        obs: "",
        file_name: fotoAtual,
      };

      const fileMetaData = {
        name: param.file_name,
        parents: [GOOGLE_API_FOLDER_ID_SIMIONATO],
      };

      let foto = await fotoSrv.getFoto(
        param.id_empresa,
        param.id_local,
        param.id_inventario,
        param.id_imobilizado,
        param.id_pasta,
        param.id_file,
        param.file_name
      );

      if (foto == null) {
        acao = "inclusao";
        foto = {
          id_empresa: param.id_empresa,
          id_local: param.id_local,
          id_inventario: param.id_inventario,
          id_imobilizado: param.id_imobilizado,
          id_pasta: GOOGLE_API_FOLDER_ID_SIMIONATO,
          id_file: "",
          file_name: param.file_name,
          file_name_original: param.file_name,
          id_usuario: param.id_usuario,
          data: param.data,
          destaque: param.destaque,
          obs: param.obs,
          user_insert: param.id_usuario,
          user_update: 0,
        };
      } else {
        acao = "alteracao";
        foto.user_update = param.id_usuario;
      }

      /*   console.log("param", param);

                                                                                                        console.log("foto", foto);

                                                                                                        console.log("path: ", `${pathDia}\\${param.file_name}`); */

      const media = {
        mimeType: "image/jpg",
        body: fs.createReadStream(`${pathDia}\\${param.file_name}`),
      };

      try {
        // Verifincando se existe ok
        const responseGet = await driveService.files.get({
          fileId: foto.id_file,
        });
        existe = true;
      } catch (error) {
        existe = false;
      }

      if (!existeDrive) {
        // Gravando
        const response = await driveService.files.create({
          resource: fileMetaData,
          media: media,
        });
        //console.log("Gravei Arquivo", response.data);
        foto.id_file = response.data.id;
        /*
                        try {
                                                                                                                    // Verifincando se existe ok
                                                                                                                    const responseGet = await driveService.sfiles.get({
                                                                                                                      fileId: foto.id_file,
                                                                                                                    });
                                                                                                                    existe = true;
                                                                                                                    console.log("GET", responseGet.data);
                                                                                                                  } catch (error) {
                                                                                                                    existe = false;
                                                                                                                  } 
                        */
        const ft = await fotoSrv.insertFoto(foto);
        if (ft == null) {
          console.log("ERRO", "Falha Ao Incluir Foto No BD");
        } else {
          contador++;
          console.log(`Foto Registrada ${contador}`);
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
          console.log("Falha Na Atualizacao");
        } else {
          /* try {
                                                                                                                                                                                      // Verifincando se existe ok
                                                                                                                                                                                      const responseGet = await driveService.files.get({
                                                                                                                                                                                        fileId: foto.id_file,
                                                                                                                                                                                      });
                                                                                                                                                                                      existe = true;
                                                                                                                                                                                    } catch (error) {
                                                                                                                                                                                      existe = false;
                                                                                                                                                                                    } */
          //console.log(URL_GOOGLE_DRIVE.join(foto.id_file));
          //res.status(200).json({ code: "200", message: "Foto Alterada" });
          console.log("Foto Alterada!");
        }
      }
    }
    res.status(200).json({ code: "200", message: "Fim do Processamento!" });
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "fotos", message: err.message });
    }
  }
});

router.get("/api/compactar/:dia", async function (req, res) {
  try {
    const dia = req.params.dia;

    const dirBase = global.appRoot;

    let fotos = dirService.getDirFotos(dia);

    const pathDia = path.resolve(`C:\\fotos\\${dia}`);

    const fotoAtual = fotos[0];

    const original = pathDia + `\\${fotoAtual}`;
    2;
    const compactada = pathDia + `\\teste.png`;

    const reponse = await compactar.compactarImagem(original, compactada);

    res.status(200).json({
      code: "200",
      message: `Fim do Processamento! ${original} ${compactada}`,
    });
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "fotos", message: err.message });
    }
  }
});

module.exports = router;
