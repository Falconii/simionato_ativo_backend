const grupoSrv = require('../service/grupoService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO grupos */

exports.grupo_Inclusao = async function(grupo) { 
	try { 
		const obj = await grupoSrv.getGrupo(grupo.id_empresa,grupo.id_filial,grupo.codigo);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'GRUPO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.grupo_Alteracao = async function(grupo) { 
	try { 
		const obj = await grupoSrv.getGrupo(grupo.id_empresa,grupo.id_filial,grupo.codigo);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'GRUPO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.grupo_Exclusao = async function(id_empresa,id_filial,codigo) { 
	try { 
		const obj = await grupoSrv.getGrupo(id_empresa,id_filial,codigo);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'GRUPO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

