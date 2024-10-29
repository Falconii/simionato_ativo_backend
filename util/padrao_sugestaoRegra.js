const padrao_sugestaoSrv = require('../service/padrao_sugestaoService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO padroes_sugestoes */

exports.padrao_sugestao_Inclusao = async function(padrao_sugestao) { 
	try { 
		const obj = await padrao_sugestaoSrv.getPadrao_Sugestao(padrao_sugestao.id_cab,padrao_sugestao.id_caract,padrao_sugestao.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PADRAO_SUGESTAO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.padrao_sugestao_Alteracao = async function(padrao_sugestao) { 
	try { 
		const obj = await padrao_sugestaoSrv.getPadrao_Sugestao(padrao_sugestao.id_cab,padrao_sugestao.id_caract,padrao_sugestao.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PADRAO_SUGESTAO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.padrao_sugestao_Exclusao = async function(id_cab,id_caract,id) { 
	try { 
		const obj = await padrao_sugestaoSrv.getPadrao_Sugestao(id_cab,id_caract,id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PADRAO_SUGESTAO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

