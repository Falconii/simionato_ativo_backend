/* ROUTE nfes */
const db = require('../infra/database');
const express = require('express');
const router = express.Router();
const nfeSrv = require('../service/nfeService');

/* ROTA GETONEONE nfe */
router.post("/api/nfegetone", async function(req, res) {
    /*
    	{
    		"id_empresa": 0,
            "id_filial":0,
            "cnpj_fornecedor":""
            "razao_fornecedor":""
            "id_imobilizado":0
            "nfe":""
            "serie":""
            "item":""
    	}
    */
    try {
        const params = req.body;
        const lsLista = await nfeSrv.getNfe(params);
        if (lsLista == null) {
            res.status(409).json({ message: 'Nfe Não Encontrada.' });
        } else {
            res.status(200).json(lsLista);
        }
    } catch (err) {
        if (err.name == 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BAK-END', tabela: 'nfe', message: err.message });
        }
    }
})
router.get("/api/nfebyimobilizado/:id_empresa/:id_filial/:id_imobilizado/:nfe", async function(req, res) {

        try {
            const lsLista = await nfeSrv.getNfeByImobilizado(req.params.id_empresa, req.params.id_filial, req.params.id_imobilizado, req.params.nfe);
            if (lsLista == null) {
                res.status(409).json({ message: 'Nfe Não Encontrada.' });
            } else {
                res.status(200).json(lsLista);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'nfe', message: err.message });
            }
        }
    })
    /* ROTA GETALL nfe */
router.get("/api/nfes", async function(req, res) {
        try {
            const lsLista = await nfeSrv.getNfes();
            if (lsLista.length == 0) {
                res.status(409).json({ message: 'Nehuma Informação Para Esta Consulta.' });
            } else {
                res.status(200).json(lsLista);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'nfe', message: err.message });
            }
        }
    })
    /* ROTA INSERT nfe */
router.post("/api/nfe", async function(req, res) {
        try {
            const nfe = req.body;
            const registro = await nfeSrv.insertNfe(nfe);
            if (registro == null) {
                res.status(409).json({ message: 'Nfe Cadastrado!' });
            } else {
                res.status(200).json(registro);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Nfe', message: err.message });
            }
        }
    })
    /* ROTA UPDATE nfe */
router.put("/api/nfe", async function(req, res) {
        try {
            const nfe = req.body;
            const registro = await nfeSrv.updateNfe(nfe);
            if (registro == null) {
                res.status(409).json({ message: 'Nfe Alterado Com Sucesso!' });
            } else {
                res.status(200).json(registro);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Nfe', message: err.message });
            }
        }
    })
    /* ROTA DELETE nfe */
router.delete("/api/nfe/:id_empresa/:id_filial/:cnpj_fornecedor/:razao_fornecedor/:id_imobilizado/:nfe/:serie/:item", async function(req, res) {
        try {
            await nfeSrv.deleteNfe(req.params.id_empresa, req.params.id_filial, req.params.cnpj_fornecedor, req.params.razao_fornecedor, req.params.id_imobilizado, req.params.nfe, req.params.serie, req.params.item);
            res.status(200).json({ message: 'Nfe Excluído Com Sucesso!' });
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Nfe', message: err.message });
            }
        }
    })
    /* ROTA CONSULTA POST nfes */
router.post("/api/nfes", async function(req, res) {
    /*
    	{
    		"id_empresa":0, 
    		"id_filial":0, 
    		"cnpj_fornecedor":, 
    		"razao_fornecedor":, 
    		"id_imobilizado":0, 
    		"nfe":"", 
    		"serie":"", 
    		"chavee":"", 
    		"pagina":0, 
    		"tamPagina":50, 
    		"contador":"N", 
    		"orderby":"", 
    		"sharp":false 
    	}
    */
    try {
        const params = req.body;
        const lsRegistros = await nfeSrv.getNfes(params);
        if (lsRegistros.length == 0) {
            res.status(409).json({ message: 'Nfe Nenhum Registro Encontrado!' });
        } else {
            res.status(200).json(lsRegistros);
        }
    } catch (err) {
        if (err.name == 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BAK-END', tabela: 'Nfe', message: err.message });
        }
    }
})

module.exports = router;