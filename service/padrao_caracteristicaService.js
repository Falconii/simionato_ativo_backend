/* SERVICE padroes_caracteristica */
const padrao_caracteristicaData = require('../data/padrao_caracteristicaData');
const validacao = require('../util/validacao');
const parametros = require('../util/padrao_caracteristicaParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/padrao_caracteristicaRegra');
const TABELA = 'PADROES_CARACTERISTICA';
/* CRUD GET SERVICE */
exports.getPadrao_Caracteristica = async function(id_cab,id){
	return padrao_caracteristicaData.getPadrao_Caracteristica(id_cab,id);
};
/* CRUD GET ALL SERVICE */
exports.getPadroes_Caracteristica = async function(params){
	return padrao_caracteristicaData.getPadroes_Caracteristica(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertPadrao_Caracteristica = async function(padrao_caracteristica){
try 
{
	await regras.padrao_caracteristica_Inclusao(padrao_caracteristica);
	validacao.Validacao(TABELA,padrao_caracteristica, parametros.padroes_caracteristica());
	return padrao_caracteristicaData.insertPadrao_Caracteristica(padrao_caracteristica);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updatePadrao_Caracteristica = async function(padrao_caracteristica){try 
{
	await regras.padrao_caracteristica_Alteracao(padrao_caracteristica);
	validacao.Validacao(TABELA,padrao_caracteristica, parametros.padroes_caracteristica());
	return padrao_caracteristicaData.updatePadrao_Caracteristica(padrao_caracteristica);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deletePadrao_Caracteristica = async function(id_cab,id){try 
{
	await  regras.padrao_caracteristica_Exclusao(id_cab,id);
	return padrao_caracteristicaData.deletePadrao_Caracteristica(id_cab,id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
