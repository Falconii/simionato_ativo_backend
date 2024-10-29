/* SERVICE padroes_cab */
const padrao_cabData = require('../data/padrao_cabData');
const validacao = require('../util/validacao');
const parametros = require('../util/padrao_cabParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/padrao_cabRegra');
const TABELA = 'PADROES_CAB';
/* CRUD GET SERVICE */
exports.getPadrao_Cab = async function(id){
	return padrao_cabData.getPadrao_Cab(id);
};
/* CRUD GET ALL SERVICE */
exports.getPadroes_Cab = async function(params){
	return padrao_cabData.getPadroes_Cab(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertPadrao_Cab = async function(padrao_cab){
try 
{
	await regras.padrao_cab_Inclusao(padrao_cab);
	validacao.Validacao(TABELA,padrao_cab, parametros.padroes_cab());
	return padrao_cabData.insertPadrao_Cab(padrao_cab);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updatePadrao_Cab = async function(padrao_cab){try 
{
	await regras.padrao_cab_Alteracao(padrao_cab);
	validacao.Validacao(TABELA,padrao_cab, parametros.padroes_cab());
	return padrao_cabData.updatePadrao_Cab(padrao_cab);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deletePadrao_Cab = async function(id){try 
{
	await  regras.padrao_cab_Exclusao(id);
	return padrao_cabData.deletePadrao_Cab(id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
