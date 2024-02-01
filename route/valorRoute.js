/* ROUTE valores */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const valorSrv = require('../service/valorService');

/* ROTA GETONE valor */
router.get("/api/valor/:id_empresa/:id_filial/:id_imobilizado",async function(req, res) {try 
	{
		const lsLista = await valorSrv.getValor(req.params.id_empresa,req.params.id_filial,req.params.id_imobilizado);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Valor Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'valor', message: err.message });
		}
	}
})
/* ROTA GETALL valor */
router.get("/api/valores",async function(req, res) {try 
	{
		const lsLista = await valorSrv.getValores();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'valor', message: err.message });
		}
	}
})
/* ROTA INSERT valor */
router.post("/api/valor",async function(req, res) {try 
	{
		const valor = req.body;
		const registro = await valorSrv.insertValor(valor);		if (registro == null)
		{			res.status(409).json({ message: 'Valor Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Valor', message: err.message });
		}
	}
})
/* ROTA UPDATE valor */
router.put("/api/valor",async function(req, res) {try 
	{
		const valor = req.body;
		const registro = await valorSrv.updateValor(valor);		if (registro == null)
		{			res.status(409).json({ message: 'Valor Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Valor', message: err.message });
		}
	}
})
/* ROTA DELETE valor */
router.delete("/api/valor/:id_empresa/:id_filial/:id_imobilizado",async function(req, res) {try 
	{
		await valorSrv.deleteValor(req.params.id_empresa,req.params.id_filial,req.params.id_imobilizado);		res.status(200).json({ message: 'Valor Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Valor', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST valores */
router.post("/api/valores",async function(req, res) {/*
	{
		"id_empresa":0, 
		"id_filial":0, 
		"id_imobilizado":0, 
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
		const lsRegistros = await valorSrv.getValores(params);		if (lsRegistros.length == 0)
		{			res.status(409).json({ message: 'Valor Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Valor', message: err.message });
		}
	}
})

module.exports = router;
