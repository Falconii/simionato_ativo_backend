/* ROUTE credenciais */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const credencialSrv = require('../service/credencialService');

/* ROTA GETONE credencial */
router.get("/api/credencial/:id",async function(req, res) {
	{
		const lsLista = await credencialSrv.getCredencial(req.params.id);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Credencial Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'credencial', message: err.message });
		}
	}
})
/* ROTA GETALL credencial */
router.get("/api/credenciais",async function(req, res) {
	{
		const lsLista = await credencialSrv.getCredenciais();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'credencial', message: err.message });
		}
	}
})
/* ROTA INSERT credencial */
router.post("/api/credencial",async function(req, res) {
	{
		const credencial = req.body;
		const registro = await credencialSrv.insertCredencial(credencial);
		{
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Credencial', message: err.message });
		}
	}
})
/* ROTA UPDATE credencial */
router.put("/api/credencial",async function(req, res) {
	{
		const credencial = req.body;
		const registro = await credencialSrv.updateCredencial(credencial);
		{
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Credencial', message: err.message });
		}
	}
})
/* ROTA DELETE credencial */
router.delete("/api/credencial/:id",async function(req, res) {
	{
		await credencialSrv.deleteCredencial(req.params.id);
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Credencial', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST credenciais */
router.post("/api/credenciais",async function(req, res) {
	{
		"id":0, 
		"client_id":"", 
		"client_secret":"" 
	}
*/
try 
	{
		const params = req.body;
		const lsRegistros = await credencialSrv.getCredenciais(params);
		{
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Credencial', message: err.message });
		}
	}
})

module.exports = router;