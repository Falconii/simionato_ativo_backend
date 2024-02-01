const principalSrv = require('../service/principalService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO principais */

exports.principal_Inclusao = async function(principal) { 
	try { 
		const obj = await principalSrv.getPrincipal(principal.id_empresa,principal.id_filial,principal.codigo);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PRINCIPAL', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.principal_Alteracao = async function(principal) { 
	try { 
		const obj = await principalSrv.getPrincipal(principal.id_empresa,principal.id_filial,principal.codigo);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PRINCIPAL', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.principal_Exclusao = async function(id_empresa,id_filial,codigo) { 
	try { 
		const obj = await principalSrv.getPrincipal(id_empresa,id_filial,codigo);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PRINCIPAL', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

