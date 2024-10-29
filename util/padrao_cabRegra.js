const padrao_cabSrv = require('../service/padrao_cabService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO padroes_cab */

exports.padrao_cab_Inclusao = async function(padrao_cab) { 
	try { 
		const obj = await padrao_cabSrv.getPadrao_Cab(padrao_cab.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PADRAO_CAB', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.padrao_cab_Alteracao = async function(padrao_cab) { 
	try { 
		const obj = await padrao_cabSrv.getPadrao_Cab(padrao_cab.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PADRAO_CAB', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.padrao_cab_Exclusao = async function(id) { 
	try { 
		const obj = await padrao_cabSrv.getPadrao_Cab(id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PADRAO_CAB', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

