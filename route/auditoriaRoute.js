/* ROUTE auditorias */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const auditoriaSrv = require('../service/auditoriaService');
/* ROTA GETONE auditoria */
router.get("/:id",async function(req, res) {
try 
	{
		const lsLista = await auditoriaSrv.getAuditoria(req.params.id);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Auditoria Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'auditoria', message: err.message });
		}
	}
})
/* ROTA GETALL auditoria */
router.get("/",async function(req, res) {
try 
	{
		const lsLista = await auditoriaSrv.getAuditorias();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'auditoria', message: err.message });
		}
	}
})
/* ROTA INSERT auditoria */
router.post("/",async function(req, res) {
try 
	{
		const auditoria = req.body;
		const registro = await auditoriaSrv.insertAuditoria(auditoria);
		if (registro == null)
		{
			res.status(409).json({ message: 'Auditoria Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Auditoria', message: err.message });
		}
	}
})
/* ROTA UPDATE auditoria */
router.put("/",async function(req, res) {
try 
	{
		const auditoria = req.body;
		const registro = await auditoriaSrv.updateAuditoria(auditoria);
		if (registro == null)
		{
			res.status(409).json({ message: 'Auditoria Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Auditoria', message: err.message });
		}
	}
})
/* ROTA DELETE auditoria */
router.delete("/:id",async function(req, res) {
try 
	{
		await auditoriaSrv.deleteAuditoria(req.params.id);
		res.status(200).json({ message: 'Auditoria Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Auditoria', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST auditorias */
router.post("/auditorias",async function(req, res) {
/*
	{
		"id_empresa":0, 
		"id_filial":0, 
		"id_inventario":0, 
		"escopo":"", 
		"acao":"", 
		"id_imobilizado":0, 
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
		const lsRegistros = await auditoriaSrv.getAuditorias(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Auditoria Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Auditoria', message: err.message });
		}
	}
})

module.exports = router;
