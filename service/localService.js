/* SERVICE locais */
const localData = require('../data/localData');
const validacao = require('../util/validacao');
const parametros = require('../util/localParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/localRegra');
const TABELA = 'LOCAIS';
/* CRUD GET SERVICE */
exports.getLocal = async function(id_empresa,id){
	return localData.getLocal(id_empresa,id);
};
/* CRUD GET ALL SERVICE */
exports.getLocais = async function(params){
	return localData.getLocais(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertLocal = async function(local){
try 
{
	await regras.local_Inclusao(local);
	validacao.Validacao(TABELA,local, parametros.locais());
	return localData.insertLocal(local);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateLocal = async function(local){try 
{
	await regras.local_Alteracao(local);
	validacao.Validacao(TABELA,local, parametros.locais());
	return localData.updateLocal(local);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteLocal = async function(id_empresa,id){try 
{
	await  regras.local_Exclusao(id_empresa,id);
	return localData.deleteLocal(id_empresa,id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
