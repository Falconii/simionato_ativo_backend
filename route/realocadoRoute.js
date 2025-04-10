/* ROUTE realoc_transf */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const realocadoSrv = require('../service/realocadoService');
const funcoes = require("../util/deparaFuncoes")

/* ROTA GETONE realocado */
router.get("/api/realocado/:id_empresa/:id_local/:id_inventario/:id_realocado/:id_transferido",async function(req, res) {
try 
	{
		const lsLista = await realocadoSrv.getRealocado(req.params.id_empresa,req.params.id_local,req.params.id_inventario,req.params.id_realocado,req.params.id_transferido);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Realocado Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'realocado', message: err.message });
		}
	}
})
/* ROTA GETALL realocado */
router.get("/api/realocados",async function(req, res) {
try 
	{
		const lsLista = await realocadoSrv.getRealocados();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'realocado', message: err.message });
		}
	}
})
/* ROTA INSERT realocado */
router.post("/api/realocado",async function(req, res) {
try 
	{
		const realocado = req.body;
		const registro = await realocadoSrv.insertRealocado(realocado);
		if (registro == null)
		{
			res.status(409).json({ message: 'Realocado Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Realocado', message: err.message });
		}
	}
})
/* ROTA UPDATE realocado */
router.put("/api/realocado",async function(req, res) {
try 
	{
		const realocado = req.body;
		const registro = await realocadoSrv.updateRealocado(realocado);
		if (registro == null)
		{
			res.status(409).json({ message: 'Realocado Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Realocado', message: err.message });
		}
	}
})
/* ROTA DELETE realocado */
router.delete("/api/realocado/:id_empresa/:id_local/:id_inventario/:id_realocado/:id_transferido",async function(req, res) {
try 
	{
		await realocadoSrv.deleteRealocado(req.params.id_empresa,req.params.id_local,req.params.id_inventario,req.params.id_realocado,req.params.id_transferido);
		res.status(200).json({ message: 'Realocado Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Realocado', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST realoc_transf */
router.post("/api/realocados",async function(req, res) {
/*
	{
		"id_empresa":0, 
		"id_local":0, 
		"id_inventario":0, 
		"id_realocado":0, 
		"id_transferido":0 
	}
*/
try 
	{
		const params = req.body;
		const lsRegistros = await realocadoSrv.getRealocados(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Realocado Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Realocado', message: err.message });
		}
	}
})




router.get("/api/trocarativo/:id_empresa/:id_local/:id_inventario",async function(req, res) {
	try 
		{

			const registro = await funcoes.RealocarAtivo(req.params.id_empresa,req.params.id_local,req.params.id_inventario);

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



module.exports = router;
