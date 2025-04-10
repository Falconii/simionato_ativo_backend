/* SERVICE realoc_transf */
const realocadoData = require('../data/realocadoData');
const validacao = require('../util/validacao');
const parametros = require('../util/realocadoParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/realocadoRegra');
const TABELA = 'REALOC_TRANSF';
/* CRUD GET SERVICE */
exports.getRealocado = async function(id_empresa,id_local,id_inventario,id_realocado,id_transferido){
	return realocadoData.getRealocado(id_empresa,id_local,id_inventario,id_realocado,id_transferido);
};
/* CRUD GET ALL SERVICE */
exports.getRealocados = async function(params){
	return realocadoData.getRealocados(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertRealocado = async function(realocado){
try 
{
	await regras.realocado_Inclusao(realocado);
	validacao.Validacao(TABELA,realocado, parametros.realoc_transf());
	return realocadoData.insertRealocado(realocado);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateRealocado = async function(realocado){
try 
{
	await regras.realocado_Alteracao(realocado);
	validacao.Validacao(TABELA,realocado, parametros.realoc_transf());
	return realocadoData.updateRealocado(realocado);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteRealocado = async function(id_empresa,id_local,id_inventario,id_realocado,id_transferido){
try 
{
	await  regras.realocado_Exclusao(id_empresa,id_local,id_inventario,id_realocado,id_transferido);
	return realocadoData.deleteRealocado(id_empresa,id_local,id_inventario,id_realocado,id_transferido);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };


 /* Processar Realocar */
 exports.processarRealocar = async function(id_empresa, id_local, id_inventario,status){
	return realocadoData.processarRealocar(id_empresa, id_local, id_inventario,status);
 };


 /* Processar updateRealocado_status */
 exports.updateRealocado_status = async function(realocado){
	await regras.realocado_Alteracao(realocado);
	validacao.Validacao(TABELA,realocado, parametros.realoc_transf());
	return realocadoData.updateRealocado_status(realocado);
 };

