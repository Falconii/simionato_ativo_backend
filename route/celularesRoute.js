const express = require('express');
const router = express.Router();
const celularesService = require('../service/celularesService');

/* ROTA GETONE celular */
router.get("/api/celular/:id", async function(req, res) {
    try {
        const celular = await celularesService.getCelular(req.params.id);
        if (celular == null) {
            res.status(409).json({ message: 'Celular não encontrado.' });
        } else {
            res.status(200).json(celular);
        }
    } catch (err) {
        if (err.name === 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BACK-END', tabela: 'celular', message: err.message });
        }
    }
});
/* ROTA GETALL celulares */
router.get("/api/celulares", async function(req, res) {
    try {
        const celulares = await celularesService.getCelulares();
        if (celulares.length === 0) {
            res.status(409).json({ message: 'Nenhum celular encontrado.' });
        } else {
            res.status(200).json(celulares);
        }
    } catch (err) {
        if (err.name === 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BACK-END', tabela: 'celulares', message: err.message });
        }
    }
});
/* ROTA INSERT celular */
router.post("/api/celular", async function(req, res) {
    try {
        const celular = req.body;
        const registro = await celularesService.insertCelular(celular);
        if (registro == null) {
            res.status(409).json({ message: 'Celular não cadastrado.' });
        } else {
            res.status(200).json(registro);
        }
    } catch (err) {
        if (err.name === 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BACK-END', tabela: 'celular', message: err.message });
        }
    }
});
/* ROTA INSERT OR UPDATE celular */
router.post("/api/celularinsertupdate", async function(req, res) {
    try {
        const celular = req.body;

        // Verifica se existe
        const existente = await celularesService.getCelular(celular.androidid);

        // Celular não existe
        if (existente == null) {
            const registro = await celularesService.insertCelular(celular);
            if (registro == null) {
                res.status(409).json({ message: 'Celular não cadastrado!' });
            } else {
                res.status(200).json(registro);
            }
        } else {
            // Celular existe, faz update
            const registro = await celularesService.updateCelular(celular);
            if (registro == null) {
                res.status(409).json({ message: 'Erro ao atualizar o celular.' });
            } else {
                res.status(200).json(registro);
            }
        }
    } catch (err) {
        if (err.name === 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BACK-END', tabela: 'celular', message: err.message });
        }
    }
});
/* ROTA UPDATE celular */
router.put("/api/celular", async function(req, res) {
    try {
        const celular = req.body;
        const registro = await celularesService.updateCelular(celular);
        if (registro == null) {
            res.status(409).json({ message: 'Erro ao atualizar o celular.' });
        } else {
            res.status(200).json(registro);
        }
    } catch (err) {
        if (err.name === 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BACK-END', tabela: 'celular', message: err.message });
        }
    }
});
/* ROTA DELETE celular */
router.delete("/api/celular/:id", async function(req, res) {
    try {
        await celularesService.deleteCelular(req.params.androidid);
        res.status(200).json({ message: 'Celular excluído com sucesso!' });
    } catch (err) {
        if (err.name === 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BACK-END', tabela: 'celular', message: err.message });
        }
    }
});
/* ROTA CONSULTA POST celulares (filtro customizado) */
router.post("/api/celulares", async function(req, res) {
    try {
        const params = req.body; 
        const lsRegistros = await celularesService.getCelulares(params);
        if (lsRegistros.length === 0) {
            res.status(409).json({ message: 'Nenhum registro encontrado!' });
        } else {
            res.status(200).json(lsRegistros);
        }
    } catch (err) {
        if (err.name === 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BACK-END', tabela: 'celulares', message: err.message });
        }
    }
});

module.exports = router;
