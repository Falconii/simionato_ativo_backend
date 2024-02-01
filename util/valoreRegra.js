const valoreSrv = require('../service/valoreService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO valores */

exports.valore_Inclusao = async function(valore) { 
	try { 
		const obj = await valoreSrv.getValore(valore.id_empresa,valore.id_filial,valore.id_imobilizado);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'VALORE', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.valore_Alteracao = async function(valore) { 
	try { 
		const obj = await valoreSrv.getValore(valore.id_empresa,valore.id_filial,valore.id_imobilizado);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'VALORE', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.valore_Exclusao = async function(id_empresa,id_filial,id_imobilizado) { 
	try { 
		const obj = await valoreSrv.getValore(id_empresa,id_filial,id_imobilizado);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'VALORE', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

