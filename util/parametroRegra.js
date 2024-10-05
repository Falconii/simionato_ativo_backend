const parametroSrv = require('../service/parametroService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO credenciais */

exports.parametro_Inclusao = async function(parametro) { 
	try { 
		const obj = await parametroSrv.getParametro(parametro.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARAMETRO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.parametro_Alteracao = async function(parametro) { 
	try { 
		const obj = await parametroSrv.getParametro(parametro.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARAMETRO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.parametro_Exclusao = async function(id) { 
	try { 
		const obj = await parametroSrv.getParametro(id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARAMETRO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

