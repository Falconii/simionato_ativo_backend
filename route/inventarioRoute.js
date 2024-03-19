/* ROUTE inventarios */
const db = require('../infra/database');
const express = require('express');
const router = express.Router();
const inventarioSrv = require('../service/inventarioService');

/* ROTA GETONE inventario */
router.get("/api/inventario/:id_empresa/:id_filial/:codigo", async function(req, res) {
    try {
        const lsLista = await inventarioSrv.getInventario(req.params.id_empresa, req.params.id_filial, req.params.codigo);
        if (lsLista == null) {
            res.status(409).json({ message: 'Inventario Não Encontrada.' });
        } else {
            res.status(200).json(lsLista);
        }
    } catch (err) {
        if (err.name == 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BAK-END', tabela: 'inventario', message: err.message });
        }
    }
})

router.get("/api/resumo/:id_empresa/:id_filial/:codigo", async function(req, res) {
    try {
        const lsLista = await inventarioSrv.getResumo(req.params.id_empresa, req.params.id_filial, req.params.codigo);
        if (lsLista == null) {
            res.status(409).json({ message: 'Resumo Não Encontrado.' });
        } else {
            res.status(200).json(lsLista);
        }
    } catch (err) {
        if (err.name == 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BAK-END', tabela: 'inventario', message: err.message });
        }
    }
})

/* ROTA GETALL inventario */
router.get("/api/inventarios", async function(req, res) {
        try {
            const lsLista = await inventarioSrv.getInventarios();
            if (lsLista.length == 0) {
                res.status(409).json({ message: 'Nehuma Informação Para Esta Consulta.' });
            } else {
                res.status(200).json(lsLista);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'inventario', message: err.message });
            }
        }
    })
    /* ROTA INSERT inventario */
router.post("/api/inventario", async function(req, res) {
        try {
            const inventario = req.body;
            const registro = await inventarioSrv.insertInventario(inventario);
            if (registro == null) {
                res.status(409).json({ message: 'Inventario Cadastrado!' });
            } else {
                res.status(200).json(registro);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Inventario', message: err.message });
            }
        }
    })
    /* ROTA UPDATE inventario */
router.put("/api/inventario", async function(req, res) {
        try {
            const inventario = req.body;
            const registro = await inventarioSrv.updateInventario(inventario);
            if (registro == null) {
                res.status(409).json({ message: 'Inventario Alterado Com Sucesso!' });
            } else {
                res.status(200).json(registro);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Inventario', message: err.message });
            }
        }
    })
    /* ROTA DELETE inventario */
router.delete("/api/inventario/:id_empresa/:id_filial/:codigo", async function(req, res) {
        try {
            await inventarioSrv.deleteInventario(req.params.id_empresa, req.params.id_filial, req.params.codigo);
            res.status(200).json({ message: 'Inventario Excluído Com Sucesso!' });
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Inventario', message: err.message });
            }
        }
    })
    /* ROTA CONSULTA POST inventarios */
router.post("/api/inventarios", async function(req, res) {
    /*
    	{
    		"id_empresa":0, 
    		"id_filial":0, 
    		"codigo":0, 
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
        const lsRegistros = await inventarioSrv.getInventarios(params);
        if (lsRegistros.length == 0) {
            res.status(409).json({ message: 'Inventario Nenhum Registro Encontrado!' });
        } else {
            res.status(200).json(lsRegistros);
        }
    } catch (err) {
        if (err.name == 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BAK-END', tabela: 'Inventario', message: err.message });
        }
    }
})

module.exports = router;