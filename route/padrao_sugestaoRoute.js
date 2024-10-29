/* ROUTE padroes_sugestoes */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const padrao_sugestaoSrv = require('../service/padrao_sugestaoService');

/* ROTA GETONE padrao_sugestao */
router.get("/api/padrao_sugestao/:id_cab/:id_caract/:id",async function(req, res) {try 
	{
		const lsLista = await padrao_sugestaoSrv.getPadrao_Sugestao(req.params.id_cab,req.params.id_caract,req.params.id);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Padrao_Sugestao Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'padrao_sugestao', message: err.message });
		}
	}
})
/* ROTA GETALL padrao_sugestao */
router.get("/api/padroes_sugestoes",async function(req, res) {try 
	{
		const lsLista = await padrao_sugestaoSrv.getPadroes_Sugestoes();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'padrao_sugestao', message: err.message });
		}
	}
})
/* ROTA INSERT padrao_sugestao */
router.post("/api/padrao_sugestao",async function(req, res) {try 
	{
		const padrao_sugestao = req.body;
		const registro = await padrao_sugestaoSrv.insertPadrao_Sugestao(padrao_sugestao);		if (registro == null)
		{			res.status(409).json({ message: 'Padrao_Sugestao Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Padrao_Sugestao', message: err.message });
		}
	}
})
/* ROTA UPDATE padrao_sugestao */
router.put("/api/padrao_sugestao",async function(req, res) {try 
	{
		const padrao_sugestao = req.body;
		const registro = await padrao_sugestaoSrv.updatePadrao_Sugestao(padrao_sugestao);		if (registro == null)
		{			res.status(409).json({ message: 'Padrao_Sugestao Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Padrao_Sugestao', message: err.message });
		}
	}
})
/* ROTA DELETE padrao_sugestao */
router.delete("/api/padrao_sugestao/:id_cab/:id_caract/:id",async function(req, res) {try 
	{
		await padrao_sugestaoSrv.deletePadrao_Sugestao(req.params.id_cab,req.params.id_caract,req.params.id);		res.status(200).json({ message: 'Padrao_Sugestao Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Padrao_Sugestao', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST padroes_sugestoes */
router.post("/api/padroes_sugestoes",async function(req, res) {/*
	{
		"id_cab":0, 
		"id_caract":0, 
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
		const lsRegistros = await padrao_sugestaoSrv.getPadroes_Sugestoes(params);		if (lsRegistros.length == 0)
		{			res.status(409).json({ message: 'Padrao_Sugestao Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Padrao_Sugestao', message: err.message });
		}
	}
})

module.exports = router;
