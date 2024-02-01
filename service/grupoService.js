/* SERVICE grupos */
const grupoData = require('../data/grupoData');
const validacao = require('../util/validacao');
const parametros = require('../util/grupoParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/grupoRegra');
const TABELA = 'GRUPOS';
/* CRUD GET SERVICE */
exports.getGrupo = async function(id_empresa,id_filial,codigo){
	return grupoData.getGrupo(id_empresa,id_filial,codigo);
};
/* CRUD GET ALL SERVICE */
exports.getGrupos = async function(params){
	return grupoData.getGrupos(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertGrupo = async function(grupo){
try 
{
	await regras.grupo_Inclusao(grupo);
	validacao.Validacao(TABELA,grupo, parametros.grupos());
	return grupoData.insertGrupo(grupo);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateGrupo = async function(grupo){try 
{
	await regras.grupo_Alteracao(grupo);
	validacao.Validacao(TABELA,grupo, parametros.grupos());
	return grupoData.updateGrupo(grupo);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteGrupo = async function(id_empresa,id_filial,codigo){try 
{
	await  regras.grupo_Exclusao(id_empresa,id_filial,codigo);
	return grupoData.deleteGrupo(id_empresa,id_filial,codigo);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
