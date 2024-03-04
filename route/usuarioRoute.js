/* ROUTE usuarios */
const db = require('../infra/database');
const express = require('express');
const router = express.Router();
const usuarioSrv = require('../service/usuarioService');
const padraoSrv = require('../service/padraoService');
const empresaSrv = require('../service/empresaService');
const localSrv = require('../service/localService');
const inventarioSrv = require('../service/inventarioService');

/* ROTA GETONE usuario */
router.get("/api/usuario/:id_empresa/:id", async function(req, res) {
        console.log("/api/usuario");
        try {
            const lsLista = await usuarioSrv.getUsuario(req.params.id_empresa, req.params.id);
            if (lsLista == null) {
                res.status(409).json({ message: 'Usuario Não Encontrada.' });
            } else {
                res.status(200).json(lsLista);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'usuario', message: err.message });
            }
        }
    })
    //Get Ambiente
router.get("/api/ambiente/:id_empresa/:id_usuario", async function(req, res) {
    let PADRAO = null;
    let EMPRESA = null;
    let USUARIO = null;
    let LOCAL = null;
    let INVENTARIO = null;

    //Buscao Padrao
    try {
        const padrao = await padraoSrv.getPadrao(req.params.id_empresa, req.params.id_usuario);
        PADRAO = padrao;
    } catch (err) {
        if (err.name == 'MyExceptionDB') {
            res.status(500).json({ erro: 'BAK-END', tabela: 'padrao', message: err.message });
        }
    }


    //Busca Empresa
    if (PADRAO !== null) {
        try {
            const empresa = await empresaSrv.getEmpresa(PADRAO.id_empresa_padrao);
            EMPRESA = empresa;
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(500).json({ erro: 'BAK-END', tabela: 'empresa', message: err.message });
            }
        }
    }
    //Usuario
    if (PADRAO !== null) {
        try {
            const usuario = await usuarioSrv.getUsuario(PADRAO.id_empresa_padrao, PADRAO.id_usuario);
            USUARIO = usuario
        } catch (err) {
            res.status(500).json({ erro: 'BAK-END', tabela: 'usuario', message: err.message });
        }
    }


    //Local
    if (PADRAO !== null) {
        try {
            const local = await localSrv.getLocal(PADRAO.id_empresa_padrao, PADRAO.id_local_padrao);
            LOCAL = local;
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(500).json({ erro: 'BAK-END', tabela: 'local', message: err.message });
            }
        }
    }


    //inventario
    if (PADRAO !== null) {
        try {
            const inventario = await inventarioSrv.getInventario(PADRAO.id_empresa_padrao, PADRAO.id_local_padrao, PADRAO.id_inv_padrao);
            INVENTARIO = inventario
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(500).json({ erro: 'BAK-END', tabela: 'local', message: err.message });
            }
        }
    }

    let id_retorno = 200;
    let mensa_retorno = "Ambiente OK";

    if (PADRAO == null ||
        EMPRESA == null ||
        USUARIO == null ||
        LOCAL == null ||
        INVENTARIO == null
    ) {
        id_retorno = 409;
        mensa_retorno = "Ambiente Não Existe. Ou Está Incompleto"
    }

    const retorno = {
        id_retorno: id_retorno,
        mensa_retorno: mensa_retorno,
        padrao: PADRAO,
        empresa: EMPRESA,
        local: LOCAL,
        inventario: INVENTARIO
    }

    res.status(200).json(retorno);


})

/* ROTA GETALL usuario */
router.get("/api/usuarios", async function(req, res) {
        try {
            const lsLista = await usuarioSrv.getUsuarios();
            if (lsLista.length == 0) {
                res.status(409).json({ message: 'Nehuma Informação Para Esta Consulta.' });
            } else {
                res.status(200).json(lsLista);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'usuario', message: err.message });
            }
        }
    })
    /* ROTA INSERT usuario */
router.post("/api/usuario", async function(req, res) {
        try {
            const usuario = req.body;
            const registro = await usuarioSrv.insertUsuario(usuario);
            if (registro == null) {
                res.status(409).json({ message: 'Usuario Cadastrado!' });
            } else {
                res.status(200).json(registro);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Usuario', message: err.message });
            }
        }
    })
    /* ROTA UPDATE usuario */
router.put("/api/usuario", async function(req, res) {
        try {
            const usuario = req.body;
            const registro = await usuarioSrv.updateUsuario(usuario);
            if (registro == null) {
                res.status(409).json({ message: 'Usuario Alterado Com Sucesso!' });
            } else {
                res.status(200).json(registro);
            }
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Usuario', message: err.message });
            }
        }
    })
    /* ROTA DELETE usuario */
router.delete("/api/usuario/:id_empresa/:id", async function(req, res) {
        try {
            await usuarioSrv.deleteUsuario(req.params.id_empresa, req.params.id);
            res.status(200).json({ message: 'Usuario Excluído Com Sucesso!' });
        } catch (err) {
            if (err.name == 'MyExceptionDB') {
                res.status(409).json(err);
            } else {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Usuario', message: err.message });
            }
        }
    })
    /* ROTA CONSULTA POST usuarios */
router.post("/api/usuarios", async function(req, res) {
    console.log("/api/usuarios");
    /*
    	{
    		"id_empresa":0, 
    		"id":0, 
    		"razao":"", 
    		"cnpj_cpf":"", 
    		"grupo":0, 
    		"pagina":0, 
    		"tamPagina":50, 
    		"contador":"N", 
    		"orderby":"", 
    		"sharp":false 
    	}
    */
    try {
        const params = req.body;
        const lsRegistros = await usuarioSrv.getUsuarios(params);
        if (lsRegistros.length == 0) {
            res.status(409).json({ message: 'Usuario Nenhum Registro Encontrado!' });
        } else {
            res.status(200).json(lsRegistros);
        }
    } catch (err) {
        if (err.name == 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BAK-END', tabela: 'Usuario', message: err.message });
        }
    }
})


/* ROTA CONSULTA POST usuarios */
router.post("/api/usuariosinventario", async function(req, res) {
    /*
    	{
    		"id_empresa":0, 
    		"id_local":0, 
    		"id_inventario":0,
    	}
    */
    try {
        const params = req.body;
        const lsRegistros = await usuarioSrv.getUsuariosInventario(params.id_empresa, params.id_local, params.id_inventario);
        if (lsRegistros.length == 0) {
            res.status(409).json({ message: 'Usuario Nenhum Registro Encontrado!' });
        } else {
            res.status(200).json(lsRegistros);
        }
    } catch (err) {
        if (err.name == 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BAK-END', tabela: 'Usuario', message: err.message });
        }
    }
})


module.exports = router;