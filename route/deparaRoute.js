/* ROUTE credenciais */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const deparaSrv = require('../service/deparaService');
const funcoes = require("../util/deparaFuncoes")


/* ROTA UPDATE empresa */
router.put("/api/de_para",async function(req, res) {
    try 
        {
            const depara = req.body;
            const registro = await deparaSrv.updateDe_Para(depara);
            if (registro == null)
            {
                res.status(409).json({ message: 'De_Para Alterado Com Sucesso!' });
            }
            else
            {
                res.status(200).json(registro);
            }
    }
    catch (err)
        {
            if(err.name == 'MyExceptionDB')
            {
                res.status(409).json(err);
            }
            else
            {
                res.status(500).json({ erro: 'BAK-END', tabela: 'Empresa', message: err.message });
            }
        }
    })

/* processar depara */
router.post("/api/processardepara",async function(req, res) {
try 
	{
		const credencial = req.body;
		const registro = await deparaSrv.processarDePara(credencial);
		if (registro == null)
		{
			res.status(409).json({ message: 'Arquivo De Para Processado!' });
		}
		else
		{
			res.status(200).json(registro);
		}
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'DePara', message: err.message });
		}
	}
})


router.post("/api/testedepara",async function(req, res) {
    try 
        {

            const registro = await funcoes.testeChangeInventario(1,14,10);

            if (registro == null)
            {
                res.status(409).json({ message: 'Falha No Processamento!' });
            }
            else
            {
                res.status(200).json(registro);
            }
    }
    catch (err)
        {
            if(err.name == 'MyExceptionDB')
            {
                res.status(409).json(err);
            }
            else
            {
                res.status(500).json({ erro: 'BAK-END', tabela: 'DePara', message: err.message });
            }
        }
    })


/* ROTA CONSULTA POST getDeparas */
router.post("/api/getDeparas",async function(req, res) {
/*
	{
         "id_empresa":0, 
        "id_local":7, 
        "id_inventario":0, 
        "de":0, 
        "para":0,
        "status":0,						
        "pagina":0, 
        "tamPagina":50, 
        "contador":"N", 
        "orderby":"", 
        "sharp":false 
    }

                  
*/
try 
	{
		const params = req.body;
		const lsRegistros = await deparaSrv.getDeparas(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'De_Para Nenhum Registro Encontrado!' });
		}
		else
		{
			res.status(200).json(lsRegistros);
		}
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'De_Para', message: err.message });
		}
	}
})

module.exports = router;