/* ROUTE padroes */
const db = require('../infra/database');
const express = require('express');
const router = express.Router();
const padraoSrv = require('../service/padraoService');

/* ROTA GETONE padrao */
router.get("/api/padrao/:id_empresa/:id_usuario", async function(req, res) {
        try {
            const lsLista = await padraoSrv.getPadrao(req.params.id_empresa, req.params.id_usuario);
            if (lsLista == null) {
                res.status(409).json({ message: 'Padrao Não Encontrada.' });
            } else {
                res.status(200).json(lsLista);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'padrao', message: err.message });
            }
        }
    })
    /* ROTA GETALL padrao */
router.get("/api/padroes", async function(req, res) {
        try {
            const lsLista = await padraoSrv.getPadroes();
            if (lsLista.length == 0) {
                res.status(409).json({ message: 'Nehuma Informação Para Esta Consulta.' });
            } else {
                res.status(200).json(lsLista);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'padrao', message: err.message });
            }
        }
    })
    /* ROTA INSERT padrao */
router.post("/api/padrao", async function(req, res) {
        try {
            const padrao = req.body;
            const registro = await padraoSrv.insertPadrao(padrao);
            if (registro == null) {
                res.status(409).json({ message: 'Padrao Cadastrado!' });
            } else {
                res.status(200).json(registro);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Padrao', message: err.message });
            }
        }
    })
    /* ROTA INSERT OR UPDATE padrao */
router.post("/api/padraoinsertupdate", async function(req, res) {
        try {
            const padrao = req.body;

            //Verifica se existe
            const lsLista = await padraoSrv.getPadrao(padrao.id_empresa, padrao.id_usuario);
            //padrao não existe
            if (lsLista == null) {
                const registro = await padraoSrv.insertPadrao(padrao);

                if (registro == null) {
                    res.status(409).json({ message: 'Padrao Não Cadastrado!' });
                } else {
                    res.status(200).json(registro);
                }
            } else {
                const registro = await padraoSrv.updatePadrao(padrao);
                if (registro == null) {
                    res.status(409).json({ message: 'Padrao Alterado Com Sucesso!' });
                } else {
                    res.status(200).json(registro);
                }
            }

        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Padrao', message: err.message });
            }
        }
    })
    /* ROTA UPDATE padrao */
router.put("/api/padrao", async function(req, res) {
        try {
            const padrao = req.body;
            const registro = await padraoSrv.updatePadrao(padrao);
            if (registro == null) {
                res.status(409).json({ message: 'Padrao Alterado Com Sucesso!' });
            } else {
                res.status(200).json(registro);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Padrao', message: err.message });
            }
        }
    })
    /* ROTA DELETE padrao */
router.delete("/api/padrao/:id_empresa/:id_usuario", async function(req, res) {
        try {
            await padraoSrv.deletePadrao(req.params.id_empresa, req.params.id_usuario);
            res.status(200).json({ message: 'Padrao Excluído Com Sucesso!' });
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Padrao', message: err.message });
            }
        }
    })
    /* ROTA CONSULTA POST padroes */
router.post("/api/padroes", async function(req, res) {
    /*
    	{
    		"id_empresa":0, 
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
        const lsRegistros = await padraoSrv.getPadroes(params);
        if (lsRegistros.length == 0) {
            res.status(409).json({ message: 'Padrao Nenhum Registro Encontrado!' });
        } else {
            res.status(200).json(lsRegistros);
        }
    } catch (err) {
        if (err.name == 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BAK-END', tabela: 'Padrao', message: err.message });
        }
    }
})

module.exports = router;