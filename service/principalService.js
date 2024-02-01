/* SERVICE principais */
const principalData = require('../data/principalData');
const validacao = require('../util/validacao');
const parametros = require('../util/principalParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/principalRegra');
const TABELA = 'PRINCIPAIS';
/* CRUD GET SERVICE */
exports.getPrincipal = async function(id_empresa,id_filial,codigo){
	return principalData.getPrincipal(id_empresa,id_filial,codigo);
};
/* CRUD GET ALL SERVICE */
exports.getPrincipais = async function(params){
	return principalData.getPrincipais(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertPrincipal = async function(principal){
try 
{
	await regras.principal_Inclusao(principal);
	validacao.Validacao(TABELA,principal, parametros.principais());
	return principalData.insertPrincipal(principal);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updatePrincipal = async function(principal){try 
{
	await regras.principal_Alteracao(principal);
	validacao.Validacao(TABELA,principal, parametros.principais());
	return principalData.updatePrincipal(principal);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deletePrincipal = async function(id_empresa,id_filial,codigo){try 
{
	await  regras.principal_Exclusao(id_empresa,id_filial,codigo);
	return principalData.deletePrincipal(id_empresa,id_filial,codigo);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
