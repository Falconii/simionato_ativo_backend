const credencialSrv = require('../service/credencialService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO credenciais */

exports.credencial_Inclusao = async function(credencial) { 
	try { 
		const obj = await credencialSrv.getCredencial(credencial.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CREDENCIAL', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.credencial_Alteracao = async function(credencial) { 
	try { 
		const obj = await credencialSrv.getCredencial(credencial.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CREDENCIAL', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.credencial_Exclusao = async function(id) { 
	try { 
		const obj = await credencialSrv.getCredencial(id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CREDENCIAL', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

