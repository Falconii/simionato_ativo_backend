const padroes_sugestaoSrv = require('../service/padroes_sugestaoService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO padroes_sugestoes */

exports.padroes_sugestao_Inclusao = async function(padroes_sugestao) { 
	try { 
		const obj = await padroes_sugestaoSrv.getPadroes_Sugestao(padroes_sugestao.id_empresa,padroes_sugestao.id_cab,padroes_sugestao.id_caract,padroes_sugestao.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PADROES_SUGESTAO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.padroes_sugestao_Alteracao = async function(padroes_sugestao) { 
	try { 
		const obj = await padroes_sugestaoSrv.getPadroes_Sugestao(padroes_sugestao.id_empresa,padroes_sugestao.id_cab,padroes_sugestao.id_caract,padroes_sugestao.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PADROES_SUGESTAO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.padroes_sugestao_Exclusao = async function(id_empresa,id_cab,id_caract,id) { 
	try { 
		const obj = await padroes_sugestaoSrv.getPadroes_Sugestao(id_empresa,id_cab,id_caract,id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PADROES_SUGESTAO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

