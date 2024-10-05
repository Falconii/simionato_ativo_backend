/* SERVICE credenciais */
const credencialData = require('../data/credencialData');
const validacao = require('../util/validacao');
const parametros = require('../util/credencialParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/credencialRegra');
const TABELA = 'CREDENCIAIS';
/* CRUD GET SERVICE */
exports.getCredencial = async function(id){
	return credencialData.getCredencial(id);
};
/* CRUD GET ALL SERVICE */
exports.getCredenciais = async function(params){
	return credencialData.getCredenciais(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertCredencial = async function(credencial){
try 
{
	await regras.credencial_Inclusao(credencial);
	validacao.Validacao(TABELA,credencial, parametros.credenciais());
	return credencialData.insertCredencial(credencial);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateCredencial = async function(credencial){try 
{
	await regras.credencial_Alteracao(credencial);
	validacao.Validacao(TABELA,credencial, parametros.credenciais());
	return credencialData.updateCredencial(credencial);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteCredencial = async function(id){try 
{
	await  regras.credencial_Exclusao(id);
	return credencialData.deleteCredencial(id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
