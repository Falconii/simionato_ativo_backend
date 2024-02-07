/* ROUTE imobilizadosinventarios */
const db = require('../infra/database');
const express = require('express');
const router = express.Router();
const imobilizadoinventarioSrv = require('../service/imobilizadoinventarioService');

const fs = require('fs')
const { google } = require('googleapis');
const uploadFotos = require('../config/uploadFotos');
const GOOGLE_API_FOLDER_ID = '1tpa2S6kqIvETTbkoyzQ2bhW6bvpKvktK'



/* ROTA GETONE imobilizadoinventario */
router.get("/api/imobilizadoinventario/:id_empresa/:id_filial/:id_inventario/:id_imobilizado", async function(req, res) {
        try {
            const lsLista = await imobilizadoinventarioSrv.getImobilizadoinventario(req.params.id_empresa, req.params.id_filial, req.params.id_inventario, req.params.id_imobilizado);
            if (lsLista == null) {
                res.status(409).json({ message: 'Imobilizadoinventario Não Encontrada.' });
            } else {
                res.status(200).json(lsLista);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'imobilizadoinventario', message: err.message });
            }
        }
    })
    /* ROTA GETALL imobilizadoinventario */
router.get("/api/imobilizadosinventarios", async function(req, res) {
        try {
            const lsLista = await imobilizadoinventarioSrv.getImobilizadosinventarios();
            if (lsLista.length == 0) {
                res.status(409).json({ message: 'Nehuma Informação Para Esta Consulta.' });
            } else {
                res.status(200).json(lsLista);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'imobilizadoinventario', message: err.message });
            }
        }
    })
    /* ROTA INSERT imobilizadoinventario */
router.post("/api/imobilizadoinventario", async function(req, res) {
        try {
            const imobilizadoinventario = req.body;
            const registro = await imobilizadoinventarioSrv.insertImobilizadoinventario(imobilizadoinventario);
            if (registro == null) {
                res.status(409).json({ message: 'Imobilizadoinventario Cadastrado!' });
            } else {
                res.status(200).json(registro);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Imobilizadoinventario', message: err.message });
            }
        }
    })
    /* ROTA UPDATE imobilizadoinventario */
router.put("/api/imobilizadoinventario", async function(req, res) {
        try {
            const imobilizadoinventario = req.body;
            const registro = await imobilizadoinventarioSrv.updateImobilizadoinventario(imobilizadoinventario);
            if (registro == null) {
                res.status(409).json({ message: 'Imobilizadoinventario Alterado Com Sucesso!' });
            } else {
                res.status(200).json(registro);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Imobilizadoinventario', message: err.message });
            }
        }
    })
    /* ROTA DELETE imobilizadoinventario */
router.delete("/api/imobilizadoinventario/:id_empresa/:id_filial/:id_inventario/:id_imobilizado", async function(req, res) {
        try {
            await imobilizadoinventarioSrv.deleteImobilizadoinventario(req.params.id_empresa, req.params.id_filial, req.params.id_inventario, req.params.id_imobilizado);
            res.status(200).json({ message: 'Imobilizadoinventario Excluído Com Sucesso!' });
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Imobilizadoinventario', message: err.message });
            }
        }
    })
    /* ROTA CONSULTA POST imobilizadosinventarios */
router.post("/api/imobilizadosinventarios", async function(req, res) {
    /*
    	{
    		"id_empresa":0, 
    		"id_filial":0, 
    		"id_inventario":0, 
    		"id_imobilizado":0, 
    		"id_cc":"", 
    		"id_grupo":0, 
    		"status":0, 
    		"new_cc":"", 
    		"new_codigo":0, 
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
        const lsRegistros = await imobilizadoinventarioSrv.getImobilizadosinventarios(params);
        if (lsRegistros.length == 0) {
            res.status(409).json({ message: 'Imobilizadoinventario Nenhum Registro Encontrado!' });
        } else {
            res.status(200).json(lsRegistros);
        }
    } catch (err) {
        if (err.name == 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BAK-END', tabela: 'Imobilizadoinventario', message: err.message });
        }
    }
})


/* ROTA UPLOADFOTOS imobilizadoinventario */
router.post("/api/imobilizadoinventariofoto", uploadFotos.single("file"), async function(req, res) {

    console.log("Entrei Na Rota imobilizadoinventariofoto!");

    const id_empresa = req.body.id_empresa;
    const id_local = req.body.id_local;
    const id_inventario = req.body.id_inventario;
    const id_usuario = req.body.id_usuario;
    const file_name = `${req.body.id_empresa.padStart(2,'0')}_${req.body.id_local.padStart(6,'0')}_${req.body.id_inventario.padStart(6,'0')}_${req.file.originalname}`
    let existe = false;

    console.log('id_empresa', id_empresa, 'id_local', id_local, 'id_inventario', id_inventario, 'id_usuario', id_usuario, 'file_name', file_name);

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
            name: file_name,
            parents: [GOOGLE_API_FOLDER_ID]
        }

        const media = {
            mimeType: 'image/jpg',
            body: fs.createReadStream(`./fotos/${file_name}`)
        }

        if (!existe) {
            // Gravando
            const response = await driveService.files.create({
                resource: fileMetaData,
                media: media,
            })

            console.log("Gravei Arquivo", response.data);
        }

        res.status(200).json({ "message": 'Processamento Executado!!' });

    } catch (err) {
        if (err.name == 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BAK-END', tabela: 'imobilizadoinventario', message: err.message });
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
})


module.exports = router;