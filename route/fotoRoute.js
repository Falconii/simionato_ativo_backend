/* ROUTE fotos */
const db = require("../infra/database");
const express = require("express");
const fs = require("fs");
const router = express.Router();
const fotoSrv = require("../service/fotoService");
const { google } = require("googleapis");
const uploadFotos = require("../config/uploadFotos");
const uploadFotosV2 = require("../config/uploadFotosV2");
const GOOGLE_API_FOLDER_ID = "1Oc4S6bEQy_TPPPSsxzl1gYkOs8wvwuWq";
const GOOGLE_API_FOLDER_ID_SIMIONATO = "1eQuwNcfTmpYUWUIvlGBouodico8WrjoD";
const PORT = process.env.PORT || 3000;
const URL_GOOGLE_DRIVE = "https://drive.google.com/uc?export=view&id=";

const path = require("path");

/*
When you upload any file in Google Drive and share it, the shared link looks like this:
 
https://drive.google.com/open?id=DRIVE_FILE_ID
 
The FILE_ID is unique for every file in Google Drive. If you copy this FILE_ID and use it in the URL below, you’ll get a direct link to download the file from Google Drive (example).
 
https://drive.google.com/uc?export=download&id=DRIVE_FILE_ID
*/

/* ROTA GETONE foto */

// Verifica o espaço de armazenamento disponível no Google Drive
async function checkStorageQuota(driveService) {
    try {
        const about = await driveService.about.get({
            fields: "storageQuota",
        });
        const totalStorage = (about.data.storageQuota.limit / 1024 ** 3).toFixed(2); //gb
        const usedStorage = (about.data.storageQuota.usage / 1024 ** 3).toFixed(2); //gb
        const remainingStorage = (totalStorage - usedStorage).toFixed(2); //gb

        console.log(`Armazenamento total: ${totalStorage} GB`);
        console.log(`Armazenamento usado: ${usedStorage} GB`);
        console.log(`Armazenamento restante: ${remainingStorage} GB`);
    } catch (error) {
        console.error("Erro ao verificar a cota de armazenamento:", error.message);
    }
}
router.get(
    "/api/foto/:id_empresa/:id_local/:id_inventario/:id_imobilizado/:id_pasta/:id_file/:file_name",
    async function(req, res) {
        try {
            const lsLista = await fotoSrv.getFoto(
                req.params.id_empresa,
                req.params.id_local,
                req.params.id_inventario,
                req.params.id_imobilizado,
                req.params.id_pasta,
                req.params.id_file,
                req.params.file_name
            );
            if (lsLista == null) {
                res.status(409).json({ message: "Foto Não Encontrada." });
            } else {
                res.status(200).json(lsLista);
            }
        } catch (err) {
            if (err.name == "MyExceptionDB") {
                res.status(409).json(err);
            } else {
                res
                    .status(500)
                    .json({ erro: "BAK-END", tabela: "foto", message: err.message });
            }
        }
    }
);
/* ROTA GETALL foto */
router.get("/api/fotos", async function(req, res) {
    try {
        const lsLista = await fotoSrv.getFotos();
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
                .json({ erro: "BAK-END", tabela: "foto", message: err.message });
        }
    }
});
/* ROTA INSERT foto */
router.post("/api/foto", async function(req, res) {
    try {
        const foto = req.body;
        const registro = await fotoSrv.insertFoto(foto);
        if (registro == null) {
            res.status(409).json({ message: "Foto Cadastrado!" });
        } else {
            res.status(200).json(registro);
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
/* ROTA UPDATE foto */
router.put("/api/foto", async function(req, res) {
    try {
        const foto = req.body;
        const registro = await fotoSrv.updateFoto(foto);
        if (registro == null) {
            res.status(409).json({ message: "Foto Alterado Com Sucesso!" });
        } else {
            res.status(200).json(registro);
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
/* ROTA DELETE foto */
router.delete(
    "/api/foto/:id_empresa/:id_local/:id_inventario/:id_imobilizado/:id_pasta/:id_file/:file_name",
    async function(req, res) {
        try {
            await fotoSrv.deleteFoto(
                req.params.id_empresa,
                req.params.id_local,
                req.params.id_inventario,
                req.params.id_imobilizado,
                req.params.id_pasta,
                req.params.id_file,
                req.params.file_name
            );
            res.status(200).json({ message: "Foto Excluída Com Sucesso!" });
        } catch (err) {
            if (err.name == "MyExceptionDB") {
                res.status(409).json(err);
            } else {
                res
                    .status(500)
                    .json({ erro: "BAK-END", tabela: "Foto", message: err.message });
            }
        }
    }
);
/* ROTA CONSULTA POST fotos */
router.post("/api/fotos", async function(req, res) {
    /*
                                          	{
                                          		"id_empresa":0, 
                                          		"id_local":0, 
                                          		"id_inventario":0, 
                                          		"id_imobilizado":0, 
                                          		"id_pasta":"", 
                                          		"id_file":"", 
                                          		"file_name":"", 
                                          		"destaque":"N", 
                                          		"pagina":0, 
                                          		"tamPagina":50, 
                                          		"contador":"N", 
                                          		"orderby":"", 
                                          		"sharp":false 
                                          	}
                                          */
    try {
        const params = req.body;
        const lsRegistros = await fotoSrv.getFotos(params);
        if (lsRegistros.length == 0) {
            res.status(409).json({ message: "Foto Nenhum Registro Encontrado!" });
        } else {
            res.status(200).json(lsRegistros);
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

/* ROTA UPLOADFOTOS imobilizadoinventario */
router.post(
    "/api/uploadfoto",
    uploadFotos.single("file"),
    async function(req, res) {
        console.log("Entrei Na Rota uoloadfoto!");

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
        const file_name = `${req.body.id_empresa.padStart(
      2,
      "0"
    )}_${req.body.id_local.padStart(6, "0")}_${req.body.id_inventario.padStart(
      6,
      "0"
    )}_${req.body.id_imobilizado.padStart(6, "0")}_${req.file.originalname}`;
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

        console.log("foto", foto);

        if (foto == null) {
            acao = "inclusao";
            foto = {
                id_empresa: id_empresa,
                id_local: id_local,
                id_inventario: id_inventario,
                id_imobilizado: id_imobilizado,
                id_pasta: GOOGLE_API_FOLDER_ID,
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
                "C:/Repositorios Git/Simionato/controle de ativo/keys/googlekey.json";
        } else {
            arquivo = "./keys/googlekey.json";
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
                parents: [GOOGLE_API_FOLDER_ID],
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
                        existe = true;
                    } catch (error) {
                        existe = false;
                    }
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

        /*
       try {
           const auth = new google.auth.GoogleAuth({
      
			keyFile: './keys/googlekey.json',
               scopes: ['https://www.googleapis.com/auth/drive']
           })

           const driveService = google.drive({
               version: 'v3',
               auth,
           })

           const fileMetaData = {
               name: 'olha eu aqui.jpg',
               parents: [GOOGLE_API_FOLDER_ID]
           }

           const media = {
               mimeType: 'image/jpg',
               body: fs.createReadStream('./tempo/arvore.jpg')
           }

           let existe = false

           try {
               // Verifincando se existe ok
               const responseGet = await driveService.files.get({
                   fileId: '1w81MkQ1BdJ-TKIdMkf7I6fNC5WoGE4DG'
               })
               existe = true;
           } catch (error) {
               existe = false;
           }

           if (!existe) {
               // Gravando
               const response = await driveService.files.create({
                   resource: fileMetaData,
                   media: media,
               })

               console.log("Gravei Arquivo", response.data);
           } else {
               //Excluindo
               const responseDelete = await driveService.files.delete({
                   fileId: '1w81MkQ1BdJ-TKIdMkf7I6fNC5WoGE4DG'
               })

               console.log("Arquivo Excluido Com Sucesso!!!");

           }

           res.status(200).json({ "message": 'Processamento Executado!!' });
       } catch (err) {
           if (err.name == 'MyExceptionDB') {
               res.status(409).json(err);
           } else {
               res.status(500).json({ erro: 'BAK-END', tabela: 'imobilizadoinventario', message: err.message });
           }
       }
       */
    }
);

router.post("/api/deleteuploadfoto", async function(req, res) {
    let arquivo = "";
    try {
        const foto = req.body;
        //deleta primeir do google
        try {
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

/* ROTINAS DE ACESSO AO GOOGLE V2 *;
/* ROTA UPLOADFOTOS imobilizadoinventario */
router.post(
    "/api/uploadfotov2",
    uploadFotosV2.single("file"),
    async function(req, res) {
        console.log("Entrei Na Rota uPoloadfoto!");

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
        const old_name = `${req.body.old_name}`;
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
            old_name
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
                "C:/Repositorios/Simionato/ativo web/keys/google-simionato-000001-000014-000010-key.json";
        } else {
            arquivo = "./keys/google-simionato-000001-000014-000010-key.json";
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

            await checkStorageQuota(driveService);

            console.log("Buscando Arquivo No GoogleDrive", foto.id_file);

            let existeDrive = foto.id_file == "" ? false : true;

            /*  try {
                                                   // Verifincando se existe ok
                                                   const responseGet = await driveService.files.get({
                                                     fileId: foto.id_file,
                                                   });
                                                   existeDrive = true;
                                                   console.log("Arquivo Existe No GoogleDrive", existeDrive);
                                                   console.log("GET", responseGet.data.length());
                                                 } catch (error) {
                                                   existeDrive = false;
                                                 } */

            if (!existeDrive) {
                console.log("Gravando...");
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
                console.log("FOTO", foto);
                const ft = await fotoSrv.insertFoto(foto);
                if (ft == null) {
                    res
                        .status(200)
                        .json({ code: "409", message: "Falha Ao Incluir Foto No BD" });
                } else {
                    console.log(`${URL_GOOGLE_DRIVE}${foto.id_file}`);
                    res.status(200).json({ code: "200", message: "Foto Registrada" });
                    try {
                        fs.unlinkSync(`./fotos/${file_name}`);
                    } catch (err) {
                        console.error(err);
                    }
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
                await fotoSrv.deleteFoto(
                    id_empresa,
                    id_local,
                    id_inventario,
                    id_imobilizado,
                    id_pasta,
                    id_file,
                    old_name
                );
                const ft = await fotoSrv.insertFoto(foto);
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
                        existe = true;
                    } catch (error) {
                        existe = false;
                    }
                    console.log(URL_GOOGLE_DRIVE.join(foto.id_file));
                    res.status(200).json({ code: "200", message: "Foto Alterada" });
                    try {
                        fs.unlinkSync(`./fotos/${file_name}`);
                    } catch (err) {
                        console.error(err);
                    }
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

        /*
       try {
           const auth = new google.auth.GoogleAuth({
      
			keyFile: './keys/googlekey.json',
               scopes: ['https://www.googleapis.com/auth/drive']
           })

           const driveService = google.drive({
               version: 'v3',
               auth,
           })

           const fileMetaData = {
               name: 'olha eu aqui.jpg',
               parents: [GOOGLE_API_FOLDER_ID]
           }

           const media = {
               mimeType: 'image/jpg',
               body: fs.createReadStream('./tempo/arvore.jpg')
           }

           let existe = false

           try {
               // Verifincando se existe ok
               const responseGet = await driveService.files.get({
                   fileId: '1w81MkQ1BdJ-TKIdMkf7I6fNC5WoGE4DG'
               })
               existe = true;
           } catch (error) {
               existe = false;
           }

           if (!existe) {
               // Gravando
               const response = await driveService.files.create({
                   resource: fileMetaData,
                   media: media,
               })

               console.log("Gravei Arquivo", response.data);
           } else {
               //Excluindo
               const responseDelete = await driveService.files.delete({
                   fileId: '1w81MkQ1BdJ-TKIdMkf7I6fNC5WoGE4DG'
               })

               console.log("Arquivo Excluido Com Sucesso!!!");

           }

           res.status(200).json({ "message": 'Processamento Executado!!' });
       } catch (err) {
           if (err.name == 'MyExceptionDB') {
               res.status(409).json(err);
           } else {
               res.status(500).json({ erro: 'BAK-END', tabela: 'imobilizadoinventario', message: err.message });
           }
       }
       */
    }
);

router.post("/api/deleteuploadfotov2", async function(req, res) {
    let arquivo = "";
    try {
        const foto = req.body;
        //deleta primeir do google
        try {
            if (PORT == 3000) {
                arquivo =
                    "C:/Repositorios/Simionato/ativo web/keys/google-simionato-000001-000014-000010-key.json";
            } else {
                arquivo = "./keys/google-simionato-000001-000014-000010-key.json";
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

router.post("/api/changefilenameuploadfotov2", async function(req, res) {
    let arquivo = "";
    try {

        try {
            if (PORT == 3000) {
                arquivo =
                    "C:/Repositorios/Simionato/ativo web/keys/google-simionato-000001-000014-000010-key.json";
            } else {
                arquivo = "keys/google-simionato-000001-000014-000010-key.json";
            }

            const auth = new google.auth.GoogleAuth({
                keyFile: arquivo,
                scopes: ["https://www.googleapis.com/auth/drive"],
            });

            const driveService = google.drive({
                version: "v3",
                auth,
            });
          
            const body = {
                'name': 'foto do copo de agua'
            }
            
            const response = await driveService.files.update({
                fileId: '1My1uquyCu9aZ9C9ZIDn7iqlTUpsG4j9h',
                resource: body,
              });
            console.log("Retorno Do Google: ", response);

            res.status(200).json({"message" : "Nome Alterado Com Sucesso!"});

        } catch(err){
            if (err.name == "MyExceptionDB") {
                res.status(409).json(err);
            } else {
                res
                    .status(500)
                    .json({ erro: "BAK-END", tabela: "Foto", message: err.message });
            }
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