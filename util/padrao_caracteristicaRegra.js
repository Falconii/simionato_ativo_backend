const padrao_caracteristicaSrv = require('../service/padrao_caracteristicaService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO padroes_caracteristica */

exports.padrao_caracteristica_Inclusao = async function(padrao_caracteristica) { 
	try { 
		const obj = await padrao_caracteristicaSrv.getPadrao_Caracteristica(padrao_caracteristica.id_cab,padrao_caracteristica.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PADRAO_CARACTERISTICA', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.padrao_caracteristica_Alteracao = async function(padrao_caracteristica) { 
	try { 
		const obj = await padrao_caracteristicaSrv.getPadrao_Caracteristica(padrao_caracteristica.id_cab,padrao_caracteristica.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PADRAO_CARACTERISTICA', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.padrao_caracteristica_Exclusao = async function(id_cab,id) { 
	try { 
		const obj = await padrao_caracteristicaSrv.getPadrao_Caracteristica(id_cab,id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PADRAO_CARACTERISTICA', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

