const filialSrv = require('../service/filialService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO filiais */

exports.filial_Inclusao = async function(filial) { 
	try { 
		const obj = await filialSrv.getFilial(filial.id_empresa,filial.id_filial,filial.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'FILIAL', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.filial_Alteracao = async function(filial) { 
	try { 
		const obj = await filialSrv.getFilial(filial.id_empresa,filial.id_filial,filial.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'FILIAL', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.filial_Exclusao = async function(id_empresa,id_filial,id) { 
	try { 
		const obj = await filialSrv.getFilial(id_empresa,id_filial,id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'FILIAL', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

