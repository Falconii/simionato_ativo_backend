/* SERVICE imobilizados */
const imobilizadoData = require('../data/imobilizadoData');
const validacao = require('../util/validacao');
const parametros = require('../util/imobilizadoParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/imobilizadoRegra');
const TABELA = 'IMOBILIZADOS';
/* CRUD GET SERVICE */
exports.getImobilizado = async function(id_empresa,id_filial,codigo){
	return imobilizadoData.getImobilizado(id_empresa,id_filial,codigo);
};
/* CRUD GET ALL SERVICE */
exports.getImobilizados = async function(params){
	return imobilizadoData.getImobilizados(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertImobilizado = async function(imobilizado){
try 
{
	console.log(imobilizado);
	await regras.imobilizado_Inclusao(imobilizado);
	validacao.Validacao(TABELA,imobilizado, parametros.imobilizados());
	return imobilizadoData.insertImobilizado(imobilizado);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateImobilizado = async function(imobilizado){
try 
{
	await regras.imobilizado_Alteracao(imobilizado);
	validacao.Validacao(TABELA,imobilizado, parametros.imobilizados());
	return imobilizadoData.updateImobilizado(imobilizado);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteImobilizado = async function(id_empresa,id_filial,codigo){
try 
{
	await  regras.imobilizado_Exclusao(id_empresa,id_filial,codigo);
	return imobilizadoData.deleteImobilizado(id_empresa,id_filial,codigo);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
