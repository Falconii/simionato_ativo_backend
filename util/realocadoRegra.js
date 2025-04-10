const realocadoSrv = require('../service/realocadoService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO realoc_transf */

exports.realocado_Inclusao = async function(realocado) { 
	try { 
		const obj = await realocadoSrv.getRealocado(realocado.id_empresa,realocado.id_local,realocado.id_inventario,realocado.id_realocado,realocado.id_transferido);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'REALOCADO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.realocado_Alteracao = async function(realocado) { 
	try { 
		const obj = await realocadoSrv.getRealocado(realocado.id_empresa,realocado.id_local,realocado.id_inventario,realocado.id_realocado,realocado.id_transferido);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'REALOCADO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.realocado_Exclusao = async function(id_empresa,id_local,id_inventario,id_realocado,id_transferido) { 
	try { 
		const obj = await realocadoSrv.getRealocado(id_empresa,id_local,id_inventario,id_realocado,id_transferido);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'REALOCADO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

