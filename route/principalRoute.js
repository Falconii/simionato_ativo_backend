/* ROUTE principais */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const principalSrv = require('../service/principalService');

/* ROTA GETONE principal */
router.get("/api/principal/:id_empresa/:id_filial/:codigo",async function(req, res) {
	{
		const lsLista = await principalSrv.getPrincipal(req.params.id_empresa,req.params.id_filial,req.params.codigo);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Principal Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'principal', message: err.message });
		}
	}
})
/* ROTA GETALL principal */
router.get("/api/principais",async function(req, res) {
	{
		const lsLista = await principalSrv.getPrincipais();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'principal', message: err.message });
		}
	}
})
/* ROTA INSERT principal */
router.post("/api/principal",async function(req, res) {
	{
		const principal = req.body;
		const registro = await principalSrv.insertPrincipal(principal);
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Principal', message: err.message });
		}
	}
})
/* ROTA UPDATE principal */
router.put("/api/principal",async function(req, res) {
	{
		const principal = req.body;
		const registro = await principalSrv.updatePrincipal(principal);
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Principal', message: err.message });
		}
	}
})
/* ROTA DELETE principal */
router.delete("/api/principal/:id_empresa/:id_filial/:codigo",async function(req, res) {
	{
		await principalSrv.deletePrincipal(req.params.id_empresa,req.params.id_filial,req.params.codigo);
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Principal', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST principais */
router.post("/api/principais",async function(req, res) {
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
		const lsRegistros = await principalSrv.getPrincipais(params);
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Principal', message: err.message });
		}
	}
})

module.exports = router;