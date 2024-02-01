/* SERVICE centroscustos */
const centrocustoData = require('../data/centrocustoData');
const validacao = require('../util/validacao');
const parametros = require('../util/centrocustoParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/centrocustoRegra');
const TABELA = 'CENTROSCUSTOS';
/* CRUD GET SERVICE */
exports.getCentrocusto = async function(id_empresa,id_filial,codigo){
	return centrocustoData.getCentrocusto(id_empresa,id_filial,codigo);
};
/* CRUD GET ALL SERVICE */
exports.getCentroscustos = async function(params){
	return centrocustoData.getCentroscustos(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertCentrocusto = async function(centrocusto){
try 
{
	await regras.centrocusto_Inclusao(centrocusto);
	validacao.Validacao(TABELA,centrocusto, parametros.centroscustos());
	return centrocustoData.insertCentrocusto(centrocusto);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateCentrocusto = async function(centrocusto){try 
{
	await regras.centrocusto_Alteracao(centrocusto);
	validacao.Validacao(TABELA,centrocusto, parametros.centroscustos());
	return centrocustoData.updateCentrocusto(centrocusto);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteCentrocusto = async function(id_empresa,id_filial,codigo){try 
{
	await  regras.centrocusto_Exclusao(id_empresa,id_filial,codigo);
	return centrocustoData.deleteCentrocusto(id_empresa,id_filial,codigo);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
