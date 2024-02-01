const centrocustoSrv = require('../service/centrocustoService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO centroscustos */

exports.centrocusto_Inclusao = async function(centrocusto) { 
	try { 
		const obj = await centrocustoSrv.getCentrocusto(centrocusto.id_empresa,centrocusto.id_filial,centrocusto.codigo);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CENTROCUSTO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.centrocusto_Alteracao = async function(centrocusto) { 
	try { 
		const obj = await centrocustoSrv.getCentrocusto(centrocusto.id_empresa,centrocusto.id_filial,centrocusto.codigo);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CENTROCUSTO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.centrocusto_Exclusao = async function(id_empresa,id_filial,codigo) { 
	try { 
		const obj = await centrocustoSrv.getCentrocusto(id_empresa,id_filial,codigo);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CENTROCUSTO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

