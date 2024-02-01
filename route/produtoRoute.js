/* ROUTE produtos */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const produtoSrv = require('../service/produtoService');

/* ROTA GETONE produto */
router.get("/api/produto/:id_empresa/:id_filial/:codigo",async function(req, res) {try 
	{
		const lsLista = await produtoSrv.getProduto(req.params.id_empresa,req.params.id_filial,req.params.codigo);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Produto Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'produto', message: err.message });
		}
	}
})
/* ROTA GETALL produto */
router.get("/api/produtos",async function(req, res) {try 
	{
		const lsLista = await produtoSrv.getProdutos();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'produto', message: err.message });
		}
	}
})
/* ROTA INSERT produto */
router.post("/api/produto",async function(req, res) {try 
	{
		const produto = req.body;
		const registro = await produtoSrv.insertProduto(produto);		if (registro == null)
		{			res.status(409).json({ message: 'Produto Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Produto', message: err.message });
		}
	}
})
/* ROTA UPDATE produto */
router.put("/api/produto",async function(req, res) {try 
	{
		const produto = req.body;
		const registro = await produtoSrv.updateProduto(produto);		if (registro == null)
		{			res.status(409).json({ message: 'Produto Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Produto', message: err.message });
		}
	}
})
/* ROTA DELETE produto */
router.delete("/api/produto/:id_empresa/:id_filial/:codigo",async function(req, res) {try 
	{
		await produtoSrv.deleteProduto(req.params.id_empresa,req.params.id_filial,req.params.codigo);		res.status(200).json({ message: 'Produto Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Produto', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST produtos */
router.post("/api/produtos",async function(req, res) {/*
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
		const lsRegistros = await produtoSrv.getProdutos(params);		if (lsRegistros.length == 0)
		{			res.status(409).json({ message: 'Produto Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Produto', message: err.message });
		}
	}
})

module.exports = router;
