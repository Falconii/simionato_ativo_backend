/* SERVICE auditorias */
const auditoriaData = require('../data/auditoriaData');
const validacao = require('../util/validacao');
const parametros = require('../util/auditoriaParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/auditoriaRegra');
const TABELA = 'AUDITORIAS';
/* CRUD GET SERVICE */
exports.getAuditoria = async function(id){
	return auditoriaData.getAuditoria(id);
};
/* CRUD GET ALL SERVICE */
exports.getAuditorias = async function(params){
	return auditoriaData.getAuditorias(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertAuditoria = async function(auditoria){
try 
{
	await regras.auditoria_Inclusao(auditoria);
	validacao.Validacao(TABELA,auditoria, parametros.auditorias());
	return auditoriaData.insertAuditoria(auditoria);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateAuditoria = async function(auditoria){try 
{
	await regras.auditoria_Alteracao(auditoria);
	validacao.Validacao(TABELA,auditoria, parametros.auditorias());
	return auditoriaData.updateAuditoria(auditoria);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteAuditoria = async function(id){try 
{
	await  regras.auditoria_Exclusao(id);
	return auditoriaData.deleteAuditoria(id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
