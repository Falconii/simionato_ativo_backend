const padraoSrv = require('../service/padraoService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO padroes */

exports.padrao_Inclusao = async function(padrao) { 
	try { 
		const obj = await padraoSrv.getPadrao(padrao.id_empresa,padrao.id_usuario);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PADRAO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.padrao_Alteracao = async function(padrao) { 
	try { 
		const obj = await padraoSrv.getPadrao(padrao.id_empresa,padrao.id_usuario);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PADRAO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.padrao_Exclusao = async function(id_empresa,id_usuario) { 
	try { 
		const obj = await padraoSrv.getPadrao(id_empresa,id_usuario);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PADRAO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

