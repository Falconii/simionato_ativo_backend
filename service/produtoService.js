/* SERVICE produtos */
const produtoData = require('../data/produtoData');
const validacao = require('../util/validacao');
const parametros = require('../util/produtoParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/produtoRegra');
const TABELA = 'PRODUTOS';
/* CRUD GET SERVICE */
exports.getProduto = async function(id_empresa,id_filial,codigo){
	return produtoData.getProduto(id_empresa,id_filial,codigo);
};
/* CRUD GET ALL SERVICE */
exports.getProdutos = async function(params){
	return produtoData.getProdutos(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertProduto = async function(produto){
try 
{
	await regras.produto_Inclusao(produto);
	validacao.Validacao(TABELA,produto, parametros.produtos());
	return produtoData.insertProduto(produto);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateProduto = async function(produto){try 
{
	await regras.produto_Alteracao(produto);
	validacao.Validacao(TABELA,produto, parametros.produtos());
	return produtoData.updateProduto(produto);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteProduto = async function(id_empresa,id_filial,codigo){try 
{
	await  regras.produto_Exclusao(id_empresa,id_filial,codigo);
	return produtoData.deleteProduto(id_empresa,id_filial,codigo);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
