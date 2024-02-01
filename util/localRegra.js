const localSrv = require('../service/localService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO locais */

exports.local_Inclusao = async function(local) { 
	try { 
		const obj = await localSrv.getLocal(local.id_empresa,local.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'LOCAL', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.local_Alteracao = async function(local) { 
	try { 
		const obj = await localSrv.getLocal(local.id_empresa,local.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'LOCAL', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.local_Exclusao = async function(id_empresa,id) { 
	try { 
		const obj = await localSrv.getLocal(id_empresa,id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'LOCAL', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

