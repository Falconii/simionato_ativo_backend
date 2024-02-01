/* ROUTE usuariosinventarios */
const db = require('../infra/database');
const express = require('express');
const router = express.Router();
const usuarioinventarioSrv = require('../service/usuarioinventarioService');

/* ROTA GETONE usuarioinventario */
router.get("/api/usuarioinventario/:id_empresa/:id_filial/:id_inventario/:id_usuario", async function(req, res) {
        try {
            const lsLista = await usuarioinventarioSrv.getUsuarioinventario(req.params.id_empresa, req.params.id_filial, req.params.id_inventario, req.params.id_usuario);
            if (lsLista == null) {
                res.status(409).json({ message: 'Usuario X Inventário Não Encontrada.' });
            } else {
                res.status(200).json(lsLista);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'usuarioinventario', message: err.message });
            }
        }
    })
    /* ROTA GETALL usuarioinventario */
router.get("/api/usuariosinventarios", async function(req, res) {
        try {
            const lsLista = await usuarioinventarioSrv.getUsuariosinventarios();
            if (lsLista.length == 0) {
                res.status(409).json({ message: 'Nehuma Informação Para Esta Consulta.' });
            } else {
                res.status(200).json(lsLista);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'usuarioinventario', message: err.message });
            }
        }
    })
    /* ROTA INSERT usuarioinventario */
router.post("/api/usuarioinventario", async function(req, res) {
        try {
            const usuarioinventario = req.body;
            const registro = await usuarioinventarioSrv.insertUsuarioinventario(usuarioinventario);
            if (registro == null) {
                res.status(409).json({ message: 'Usuario x Inventario Cadastrado!' });
            } else {
                res.status(200).json(registro);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Usuarioinventario', message: err.message });
            }
        }
    })
    /* ROTA UPDATE usuarioinventario */
router.put("/api/usuarioinventario", async function(req, res) {
    try {
        const usuarioinventario = req.body;
        const registro = await usuarioinventarioSrv.updateUsuarioinventario(usuarioinventario);
        if (registro == null) {
            res.status(409).json({ message: 'Usuario X Inventario Alterado Com Sucesso!' });
        } else {
            res.status(200).json(registro);
        }
    } catch (err) {
        if (err.name == 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BAK-END', tabela: 'Usuarioinventario', message: err.message });
        }
    }
})

/* ROTA DELETE usuarioinventario */
router.delete("/api/usuarioinventario/:id_empresa/:id_filial/:id_inventario/:id_usuario", async function(req, res) {
    try {
        await usuarioinventarioSrv.deleteUsuarioinventario(req.params.id_empresa, req.params.id_filial, req.params.id_inventario, req.params.id_usuario);
        res.status(200).json({ message: 'Usuario X inventario Excluído Com Sucesso!' });
    } catch (err) {
        if (err.name == 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BAK-END', tabela: 'Usuarioinventario', message: err.message });
        }
    }
})

/* ROTA CONSULTA POST usuariosinventarios */
router.post("/api/usuariosinventarios", async function(req, res) {
    /*
    	{
    		"id_empresa":0, 
    		"id_inventario":0, 
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
        const lsRegistros = await usuarioinventarioSrv.getUsuariosinventarios(params);
        if (lsRegistros.length == 0) {
            res.status(409).json({ message: 'Usuarioinventario Nenhum Registro Encontrado!' });
        } else {
            res.status(200).json(lsRegistros);
        }
    } catch (err) {
        if (err.name == 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BAK-END', tabela: 'Usuarioinventario', message: err.message });
        }
    }
})


/* ROTA Multi-Inserts */
router.post("/api/multlanca", async function(req, res) {
    try {

        /*
		 public id_acao:CadastroAcoes = CadastroAcoes.None;
        public id_empresa:number =   0   ; 
		public id_filial:number =   0   ; 
		public id_inventario:number =   0   ; 
		public id_usuario:number =   0   ; 
		public user_insert:number =   0   ; 
		public user_update:number =   0   ; 

		*/
        console.log('multlanca', req.body);

        const params = req.body;

        console.log(params)
        for await (let param of params) {
            //Inclusao
            if (param.acao == 1) {
                registroModel = {
                    "id_empresa": param.id_empresa,
                    "id_filial": param.id_filial,
                    "id_inventario": param.id_inventario,
                    "id_usuario": param.id_usuario,
                    "user_insert": param.user_insert,
                    "user_update": param.user_update,
                }
                console.log('registroModel', registroModel);
                const reg = await usuarioinventarioSrv.insertUsuarioinventario(registroModel);
            }
            //Exclusao
            if (param.acao == 4) {
                const reg = await usuarioinventarioSrv.deleteUsuarioinventario(param.id_empresa, param.id_filial, param.id_inventario, param.id_usuario);
            }
        }
        res.status(200).json({ message: 'Alteração Executada Com Sucesso' });

    } catch (err) {

        if (err.name == 'MyExceptionDB') {

            res.status(409).json(err);

        } else {

            res.status(500).json({ erro: 'BAK-END', tabela: 'USUARIOS INVENTÁRIOS', message: err.message });

        }
    }

});

module.exports = router;