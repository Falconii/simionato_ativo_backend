/* SERVICE de_para */
const deparaData = require('../data/deparaData');
const validacao = require('../util/validacao');
const parametros = require('../util/deparaParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/deparaRegra');
const TABELA = 'DE_PARA';
/* CRUD GET SERVICE */
exports.getDepara = async function(id_empresa,id_local,id_inventario,de,para){
	return deparaData.getDepara(id_empresa,id_local,id_inventario,de,para);
};
/* CRUD GET ALL SERVICE */
exports.getDeparas = async function(params){
	return deparaData.getDeparas(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertDepara = async function(depara){
try 
{
	await regras.depara_Inclusao(depara);
	validacao.Validacao(TABELA,depara, parametros.de_para());
	return deparaData.insertDepara(depara);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateDepara = async function(depara){try 
{
	await regras.depara_Alteracao(depara);
	validacao.Validacao(TABELA,depara, parametros.de_para());
	return deparaData.updateDepara(depara);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteDepara = async function(id_empresa,id_local,id_inventario,de,para){try 
{
	await  regras.depara_Exclusao(id_empresa,id_local,id_inventario,de,para);
	return deparaData.deleteDepara(id_empresa,id_local,id_inventario,de,para);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
