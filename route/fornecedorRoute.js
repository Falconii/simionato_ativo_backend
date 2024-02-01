/* ROUTE fornecedores */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const fornecedorSrv = require('../service/fornecedorService');

/* ROTA GETONE fornecedor */
router.get("/api/fornecedor/:id_empresa/:id_filial/:id",async function(req, res) {try 
	{
		const lsLista = await fornecedorSrv.getFornecedor(req.params.id_empresa,req.params.id_filial,req.params.id);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Fornecedor Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'fornecedor', message: err.message });
		}
	}
})
/* ROTA GETALL fornecedor */
router.get("/api/fornecedores",async function(req, res) {try 
	{
		const lsLista = await fornecedorSrv.getFornecedores();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'fornecedor', message: err.message });
		}
	}
})
/* ROTA INSERT fornecedor */
router.post("/api/fornecedor",async function(req, res) {try 
	{
		const fornecedor = req.body;
		const registro = await fornecedorSrv.insertFornecedor(fornecedor);		if (registro == null)
		{			res.status(409).json({ message: 'Fornecedor Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Fornecedor', message: err.message });
		}
	}
})
/* ROTA UPDATE fornecedor */
router.put("/api/fornecedor",async function(req, res) {try 
	{
		const fornecedor = req.body;
		const registro = await fornecedorSrv.updateFornecedor(fornecedor);		if (registro == null)
		{			res.status(409).json({ message: 'Fornecedor Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Fornecedor', message: err.message });
		}
	}
})
/* ROTA DELETE fornecedor */
router.delete("/api/fornecedor/:id_empresa/:id_filial/:id",async function(req, res) {try 
	{
		await fornecedorSrv.deleteFornecedor(req.params.id_empresa,req.params.id_filial,req.params.id);		res.status(200).json({ message: 'Fornecedor Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Fornecedor', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST fornecedores */
router.post("/api/fornecedores",async function(req, res) {/*
	{
		"id_empresa":0, 
		"id":0, 
		"razao":"", 
		"cnpj_cpf":"", 
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
		const lsRegistros = await fornecedorSrv.getFornecedores(params);		if (lsRegistros.length == 0)
		{			res.status(409).json({ message: 'Fornecedor Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Fornecedor', message: err.message });
		}
	}
})

module.exports = router;
