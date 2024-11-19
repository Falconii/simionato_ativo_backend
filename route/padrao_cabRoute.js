/* ROUTE padroes_cab */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const padrao_cabSrv = require('../service/padrao_cabService');

/* ROTA GETONE padrao_cab */
router.get("/api/padrao_cab/:id",async function(req, res) {
try 
	{
		const lsLista = await padrao_cabSrv.getPadrao_Cab(req.params.id);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Padrao_Cab Não Encontrada.' });
		}
	else
		{
			res.status(200).json(lsLista);
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'padrao_cab', message: err.message });
		}
	}
})
/* ROTA GETALL padrao_cab */
router.get("/api/padroes_cab",async function(req, res) {
try 
	{
		const lsLista = await padrao_cabSrv.getPadroes_Cab();
		if (lsLista.length == 0) 
		{
			res.status(409).json({ message: 'Nehuma Informação Para Esta Consulta.'} );
		}
	else
		{
			res.status(200).json(lsLista);
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'padrao_cab', message: err.message });
		}
	}
})
/* ROTA INSERT padrao_cab */
router.post("/api/padrao_cab",async function(req, res) {
try 
	{
		const padrao_cab = req.body;
		const registro = await padrao_cabSrv.insertPadrao_Cab(padrao_cab);
		if (registro == null)
		{
			res.status(409).json({ message: 'Padrao_Cab Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Padrao_Cab', message: err.message });
		}
	}
})
/* ROTA UPDATE padrao_cab */
router.put("/api/padrao_cab",async function(req, res) {
try 
	{
		const padrao_cab = req.body;
		const registro = await padrao_cabSrv.updatePadrao_Cab(padrao_cab);
		if (registro == null)
		{
			res.status(409).json({ message: 'Padrao_Cab Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Padrao_Cab', message: err.message });
		}
	}
})
/* ROTA DELETE padrao_cab */
router.delete("/api/padrao_cab/:id",async function(req, res) {
try 
	{
		await padrao_cabSrv.deletePadrao_Cab(req.params.id);
		res.status(200).json({ message: 'Padrao_Cab Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Padrao_Cab', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST padroes_cab */
router.post("/api/padroes_cab",async function(req, res) {
/*
	{
		"id":0, 
		"apelido":"", 
		"descricao":"", 
		"id_usuario":0, 
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

		console.log("padroes_cab",params);

		const lsRegistros = await padrao_cabSrv.getPadroes_Cab(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Padrao_Cab Nenhum Registro Encontrado!' });
		}
		else
		{
			res.status(200).json(lsRegistros);
		}
}
catch (err)
	{
		console.log(err);
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Padrao_Cab', message: err.message });
		}
	}
})

module.exports = router;
