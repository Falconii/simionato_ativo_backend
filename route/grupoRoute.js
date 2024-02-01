/* ROUTE grupos */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const grupoSrv = require('../service/grupoService');

/* ROTA GETONE grupo */
router.get("/api/grupo/:id_empresa/:id_filial/:codigo",async function(req, res) {try 
	{
		const lsLista = await grupoSrv.getGrupo(req.params.id_empresa,req.params.id_filial,req.params.codigo);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Grupo Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'grupo', message: err.message });
		}
	}
})
/* ROTA GETALL grupo */
router.get("/api/grupos",async function(req, res) {try 
	{
		const lsLista = await grupoSrv.getGrupos();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'grupo', message: err.message });
		}
	}
})
/* ROTA INSERT grupo */
router.post("/api/grupo",async function(req, res) {try 
	{
		const grupo = req.body;
		const registro = await grupoSrv.insertGrupo(grupo);		if (registro == null)
		{			res.status(409).json({ message: 'Grupo Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Grupo', message: err.message });
		}
	}
})
/* ROTA UPDATE grupo */
router.put("/api/grupo",async function(req, res) {try 
	{
		const grupo = req.body;
		const registro = await grupoSrv.updateGrupo(grupo);		if (registro == null)
		{			res.status(409).json({ message: 'Grupo Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Grupo', message: err.message });
		}
	}
})
/* ROTA DELETE grupo */
router.delete("/api/grupo/:id_empresa/:id_filial/:codigo",async function(req, res) {try 
	{
		await grupoSrv.deleteGrupo(req.params.id_empresa,req.params.id_filial,req.params.codigo);		res.status(200).json({ message: 'Grupo Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Grupo', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST grupos */
router.post("/api/grupos",async function(req, res) {/*
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
try 
	{
		const params = req.body;
		const lsRegistros = await grupoSrv.getGrupos(params);		if (lsRegistros.length == 0)
		{			res.status(409).json({ message: 'Grupo Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Grupo', message: err.message });
		}
	}
})

module.exports = router;
