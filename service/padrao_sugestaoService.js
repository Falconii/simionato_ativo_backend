/* SERVICE padroes_sugestoes */
const padrao_sugestaoData = require('../data/padrao_sugestaoData');
const validacao = require('../util/validacao');
const parametros = require('../util/padrao_sugestaoParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/padrao_sugestaoRegra');
const TABELA = 'PADROES_SUGESTOES';
/* CRUD GET SERVICE */
exports.getPadrao_Sugestao = async function(id_cab,id_caract,id){
	return padrao_sugestaoData.getPadrao_Sugestao(id_cab,id_caract,id);
};
/* CRUD GET ALL SERVICE */
exports.getPadroes_Sugestoes = async function(params){
	return padrao_sugestaoData.getPadroes_Sugestoes(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertPadrao_Sugestao = async function(padrao_sugestao){
try 
{
	await regras.padrao_sugestao_Inclusao(padrao_sugestao);
	validacao.Validacao(TABELA,padrao_sugestao, parametros.padroes_sugestoes());
	return padrao_sugestaoData.insertPadrao_Sugestao(padrao_sugestao);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updatePadrao_Sugestao = async function(padrao_sugestao){try 
{
	await regras.padrao_sugestao_Alteracao(padrao_sugestao);
	validacao.Validacao(TABELA,padrao_sugestao, parametros.padroes_sugestoes());
	return padrao_sugestaoData.updatePadrao_Sugestao(padrao_sugestao);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deletePadrao_Sugestao = async function(id_cab,id_caract,id){try 
{
	await  regras.padrao_sugestao_Exclusao(id_cab,id_caract,id);
	return padrao_sugestaoData.deletePadrao_Sugestao(id_cab,id_caract,id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
