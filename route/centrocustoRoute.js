/* ROUTE centroscustos */
const db = require('../infra/database');
const express = require('express');
const router = express.Router();
const centrocustoSrv = require('../service/centrocustoService');

/* ROTA GETONE centrocusto */
router.get("/api/centrocusto/:id_empresa/:id_filial/:codigo", async function(req, res) {
        try {
            const lsLista = await centrocustoSrv.getCentrocusto(req.params.id_empresa, req.params.id_filial, req.params.codigo.replace('_', "/"));
            if (lsLista == null) {
                res.status(409).json({ message: 'Centrocusto Não Encontrada.' });
            } else {
                res.status(200).json(lsLista);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'centrocusto', message: err.message });
            }
        }
    })
    /* ROTA GETALL centrocusto */
router.get("/api/centroscustos", async function(req, res) {
        try {
            const lsLista = await centrocustoSrv.getCentroscustos();
            if (lsLista.length == 0) {
                res.status(409).json({ message: 'Nehuma Informação Para Esta Consulta.' });
            } else {
                res.status(200).json(lsLista);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'centrocusto', message: err.message });
            }
        }
    })
    /* ROTA INSERT centrocusto */
router.post("/api/centrocusto", async function(req, res) {
        try {
            const centrocusto = req.body;
            const registro = await centrocustoSrv.insertCentrocusto(centrocusto);
            if (registro == null) {
                res.status(409).json({ message: 'Centrocusto Cadastrado!' });
            } else {
                res.status(200).json(registro);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Centrocusto', message: err.message });
            }
        }
    })
    /* ROTA UPDATE centrocusto */
router.put("/api/centrocusto", async function(req, res) {
        try {
            const centrocusto = req.body;
            const registro = await centrocustoSrv.updateCentrocusto(centrocusto);
            if (registro == null) {
                res.status(409).json({ message: 'Centrocusto Alterado Com Sucesso!' });
            } else {
                res.status(200).json(registro);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Centrocusto', message: err.message });
            }
        }
    })
    /* ROTA DELETE centrocusto */
router.delete("/api/centrocusto/:id_empresa/:id_filial/:codigo", async function(req, res) {
        try {
            await centrocustoSrv.deleteCentrocusto(req.params.id_empresa, req.params.id_filial, req.params.codigo);
            res.status(200).json({ message: 'Centrocusto Excluído Com Sucesso!' });
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Centrocusto', message: err.message });
            }
        }
    })
    /* ROTA CONSULTA POST centroscustos */
router.post("/api/centroscustos", async function(req, res) {
    /*
    	{
    		"id_empresa":0, 
    		"id_filial":0, 
    		"codigo":"", 
    		"descricao":"", 
    		"pagina":0, 
    		"tamPagina":50, 
    		"contador":"N", 
    		"orderby":"", 
    		"sharp":false 
    	}
    */
    try {
        const params = req.body;
        const lsRegistros = await centrocustoSrv.getCentroscustos(params);
        if (lsRegistros.length == 0) {
            res.status(409).json({ message: 'Centrocusto Nenhum Registro Encontrado!' });
        } else {
            res.status(200).json(lsRegistros);
        }
    } catch (err) {
        if (err.name == 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BAK-END', tabela: 'Centrocusto', message: err.message });
        }
    }
})

module.exports = router;