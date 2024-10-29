/* ROUTE padroes_caracteristica */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const padrao_caracteristicaSrv = require('../service/padrao_caracteristicaService');

/* ROTA GETONE padrao_caracteristica */
router.get("/api/padrao_caracteristica/:id_cab/:id",async function(req, res) {try 
	{
		const lsLista = await padrao_caracteristicaSrv.getPadrao_Caracteristica(req.params.id_cab,req.params.id);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Padrao_Caracteristica Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'padrao_caracteristica', message: err.message });
		}
	}
})
/* ROTA GETALL padrao_caracteristica */
router.get("/api/padroes_caracteristica",async function(req, res) {try 
	{
		const lsLista = await padrao_caracteristicaSrv.getPadroes_Caracteristica();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'padrao_caracteristica', message: err.message });
		}
	}
})
/* ROTA INSERT padrao_caracteristica */
router.post("/api/padrao_caracteristica",async function(req, res) {try 
	{
		const padrao_caracteristica = req.body;
		const registro = await padrao_caracteristicaSrv.insertPadrao_Caracteristica(padrao_caracteristica);		if (registro == null)
		{			res.status(409).json({ message: 'Padrao_Caracteristica Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Padrao_Caracteristica', message: err.message });
		}
	}
})
/* ROTA UPDATE padrao_caracteristica */
router.put("/api/padrao_caracteristica",async function(req, res) {try 
	{
		const padrao_caracteristica = req.body;
		const registro = await padrao_caracteristicaSrv.updatePadrao_Caracteristica(padrao_caracteristica);		if (registro == null)
		{			res.status(409).json({ message: 'Padrao_Caracteristica Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Padrao_Caracteristica', message: err.message });
		}
	}
})
/* ROTA DELETE padrao_caracteristica */
router.delete("/api/padrao_caracteristica/:id_cab/:id",async function(req, res) {try 
	{
		await padrao_caracteristicaSrv.deletePadrao_Caracteristica(req.params.id_cab,req.params.id);		res.status(200).json({ message: 'Padrao_Caracteristica Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Padrao_Caracteristica', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST padroes_caracteristica */
router.post("/api/padroes_caracteristica",async function(req, res) {/*
	{
		"id_cab":0, 
		"id":0, 
		"descricao":"", 
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
		const lsRegistros = await padrao_caracteristicaSrv.getPadroes_Caracteristica(params);		if (lsRegistros.length == 0)
		{			res.status(409).json({ message: 'Padrao_Caracteristica Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Padrao_Caracteristica', message: err.message });
		}
	}
})

module.exports = router;
