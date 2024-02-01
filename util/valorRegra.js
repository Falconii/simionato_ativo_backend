const valorSrv = require('../service/valorService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO valores */

exports.valor_Inclusao = async function(valor) { 
	try { 
		const obj = await valorSrv.getValor(valor.id_empresa,valor.id_filial,valor.id_imobilizado);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'VALOR', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.valor_Alteracao = async function(valor) { 
	try { 
		const obj = await valorSrv.getValor(valor.id_empresa,valor.id_filial,valor.id_imobilizado);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'VALOR', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.valor_Exclusao = async function(id_empresa,id_filial,id_imobilizado) { 
	try { 
		const obj = await valorSrv.getValor(id_empresa,id_filial,id_imobilizado);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'VALOR', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

