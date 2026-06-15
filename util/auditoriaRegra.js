const auditoriaSrv = require('../service/auditoriaService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO auditorias */

exports.auditoria_Inclusao = async function(auditoria) { 
	try { 
		const obj = await auditoriaSrv.getAuditoria(auditoria.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'AUDITORIA', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.auditoria_Alteracao = async function(auditoria) { 
	try { 
		const obj = await auditoriaSrv.getAuditoria(auditoria.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'AUDITORIA', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.auditoria_Exclusao = async function(id) { 
	try { 
		const obj = await auditoriaSrv.getAuditoria(id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'AUDITORIA', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

