/* ROUTE imobilizadosinventarios */
const db = require('../infra/database');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const imobilizadoinventarioSrv = require('../service/imobilizadoinventarioService');
const parametroSrv = require('../service/parametroService');
const { google } = require('googleapis');
const uploadFotos = require('../config/uploadFotos');
const GOOGLE_API_FOLDER_ID = '1tpa2S6kqIvETTbkoyzQ2bhW6bvpKvktK'
const PORT = process.env.PORT || 3000;



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



router.post("/api/fotokey", async function(req, res) {

    console.log("Entrei Na Rota fotokey!");

    let arquivo = "";

    //Buscando key google
    const param = await parametroSrv.getParametro(1, "key", "googledrive", 999);
    if (param == null) {
        res.status(409).json({ message: 'Não Foi Encontrada Chave GOOGLE DRIVE' });
    }
    if (PORT == 3000) {
        arquivo = "C:/Repositorios Git/Simionato/controle de ativo/keys/googlekey.json"
    } else {
        arquivo = "./keys/googlekey.json"
    }

    try {
        var writeStream = fs.createWriteStream(arquivo);
        writeStream.write(param.parametro)
        writeStream.end();
        res.status(200).json({ message: 'Chave Atualizada Com Sucesso!' });
    } catch (error) {
        res.status(409).json({ message: 'Erro Na Gravação googlekey, No Servidor' });
    }
})

module.exports = router;