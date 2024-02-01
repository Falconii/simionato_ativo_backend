/* SERVICE valores */
const valorData = require('../data/valorData');
const validacao = require('../util/validacao');
const parametros = require('../util/valorParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/valorRegra');
const TABELA = 'VALORES';
/* CRUD GET SERVICE */
exports.getValor = async function(id_empresa,id_filial,id_imobilizado){
	return valorData.getValor(id_empresa,id_filial,id_imobilizado);
};
/* CRUD GET ALL SERVICE */
exports.getValores = async function(params){
	return valorData.getValores(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertValor = async function(valor){
try 
{
	await regras.valor_Inclusao(valor);
	validacao.Validacao(TABELA,valor, parametros.valores());
	return valorData.insertValor(valor);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateValor = async function(valor){try 
{
	await regras.valor_Alteracao(valor);
	validacao.Validacao(TABELA,valor, parametros.valores());
	return valorData.updateValor(valor);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteValor = async function(id_empresa,id_filial,id_imobilizado){try 
{
	await  regras.valor_Exclusao(id_empresa,id_filial,id_imobilizado);
	return valorData.deleteValor(id_empresa,id_filial,id_imobilizado);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
