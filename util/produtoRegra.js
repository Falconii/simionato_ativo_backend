const produtoSrv = require('../service/produtoService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO produtos */

exports.produto_Inclusao = async function(produto) { 
	try { 
		const obj = await produtoSrv.getProduto(produto.id_empresa,produto.id_filial,produto.codigo);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PRODUTO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.produto_Alteracao = async function(produto) { 
	try { 
		const obj = await produtoSrv.getProduto(produto.id_empresa,produto.id_filial,produto.codigo);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PRODUTO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.produto_Exclusao = async function(id_empresa,id_filial,codigo) { 
	try { 
		const obj = await produtoSrv.getProduto(id_empresa,id_filial,codigo);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PRODUTO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

