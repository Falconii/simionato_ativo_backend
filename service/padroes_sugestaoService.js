/* SERVICE padroes_sugestoes */
const padroes_sugestaoData = require('../data/padroes_sugestaoData');
const validacao = require('../util/validacao');
const parametros = require('../util/padroes_sugestaoParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/padroes_sugestaoRegra');
const TABELA = 'PADROES_SUGESTOES';
/* CRUD GET SERVICE */
exports.getPadroes_Sugestao = async function(id_empresa,id_cab,id_caract,id){
	return padroes_sugestaoData.getPadroes_Sugestao(id_empresa,id_cab,id_caract,id);
};
/* CRUD GET ALL SERVICE */
exports.getPadroes_Sugestoes = async function(params){
	return padroes_sugestaoData.getPadroes_Sugestoes(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertPadroes_Sugestao = async function(padroes_sugestao){
try 
{
	await regras.padroes_sugestao_Inclusao(padroes_sugestao);
	validacao.Validacao(TABELA,padroes_sugestao, parametros.padroes_sugestoes());
	return padroes_sugestaoData.insertPadroes_Sugestao(padroes_sugestao);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updatePadroes_Sugestao = async function(padroes_sugestao){try 
{
	await regras.padroes_sugestao_Alteracao(padroes_sugestao);
	validacao.Validacao(TABELA,padroes_sugestao, parametros.padroes_sugestoes());
	return padroes_sugestaoData.updatePadroes_Sugestao(padroes_sugestao);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deletePadroes_Sugestao = async function(id_empresa,id_cab,id_caract,id){try 
{
	await  regras.padroes_sugestao_Exclusao(id_empresa,id_cab,id_caract,id);
	return padroes_sugestaoData.deletePadroes_Sugestao(id_empresa,id_cab,id_caract,id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
