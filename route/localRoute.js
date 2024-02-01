/* ROUTE locais */
const db = require('../infra/database');
const express = require('express');
const router = express.Router();
const localSrv = require('../service/localService');

/* ROTA GETONE local */
router.get("/api/local/:id_empresa/:id", async function(req, res) {
        try {
            const lsLista = await localSrv.getLocal(req.params.id_empresa, req.params.id);
            if (lsLista == null) {
                res.status(409).json({ message: 'Local Não Encontrada.' });
            } else {
                res.status(200).json(lsLista);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'local', message: err.message });
            }
        }
    })
    /* ROTA GETALL local */
router.get("/api/locais", async function(req, res) {
        try {
            const lsLista = await localSrv.getLocais();
            if (lsLista.length == 0) {
                res.status(409).json({ message: 'Nehuma Informação Para Esta Consulta.' });
            } else {
                res.status(200).json(lsLista);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'local', message: err.message });
            }
        }
    })
    /* ROTA INSERT local */
router.post("/api/local", async function(req, res) {
        try {
            const local = req.body;
            const registro = await localSrv.insertLocal(local);
            if (registro == null) {
                res.status(409).json({ message: 'Local Cadastrado!' });
            } else {
                res.status(200).json(registro);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Local', message: err.message });
            }
        }
    })
    /* ROTA UPDATE local */
router.put("/api/local", async function(req, res) {
        try {
            const local = req.body;
            const registro = await localSrv.updateLocal(local);
            if (registro == null) {
                res.status(409).json({ message: 'Local Alterado Com Sucesso!' });
            } else {
                res.status(200).json(registro);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Local', message: err.message });
            }
        }
    })
    /* ROTA DELETE local */
router.delete("/api/local/:id_empresa/:id", async function(req, res) {
        try {
            await localSrv.deleteLocal(req.params.id_empresa, req.params.id);
            res.status(200).json({ message: 'Local Excluído Com Sucesso!' });
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Local', message: err.message });
            }
        }
    })
    /* ROTA CONSULTA POST locais */
router.post("/api/locais", async function(req, res) {
    /*
    	{
    		"id_empresa":0, 
    		"id":0, 
    		"razao":"", 
    		"cnpj_cpf":"", 
    		"pagina":0, 
    		"tamPagina":50, 
    		"contador":"N", 
    		"orderby":"", 
    		"sharp":false 
    	}
    */
    try {
        const params = req.body;
        const lsRegistros = await localSrv.getLocais(params);
        if (lsRegistros.length == 0) {
            res.status(409).json({ message: 'Local Nenhum Registro Encontrado!' });
        } else {
            res.status(200).json(lsRegistros);
        }
    } catch (err) {
        if (err.name == 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BAK-END', tabela: 'Local', message: err.message });
        }
    }
})


/* ROTA Multi-Inserts */
router.post("/api/local", async function(req, res) {
    router.post('/api/alterpontes', async function(req, res) {

        try {

            console.log('alterpontes', req.body);

            const params = req.body;

            for await (let param of params) {
                //Inclusao
                if (param.acao == 1) {
                    const reg = await feriadoSrv.insertFeriado(param.feriado);
                }
                //Exclusao
                if (param.acao == 4) {
                    const reg = await feriadoSrv.deleteFeriado(param.feriado.id_empresa, param.feriado.id_usuario, param.feriado.id_tipo, param.feriado.data);
                }
            }

            res.status(200).json({ message: 'Alteração Executada Com Sucesso' });

        } catch (err) {

            if (err.name == 'MyExceptionDB') {

                res.status(409).json(err);

            } else {

                res.status(500).json({ erro: 'BAK-END', tabela: 'PONTES', message: err.message });

            }
        }

    });

})


module.exports = router;