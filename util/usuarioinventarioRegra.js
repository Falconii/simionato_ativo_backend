const usuarioinventarioSrv = require('../service/usuarioinventarioService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO usuariosinventarios */

exports.usuarioinventario_Inclusao = async function(usuarioinventario) { 
	try { 
		const obj = await usuarioinventarioSrv.getUsuarioinventario(usuarioinventario.id_empresa,usuarioinventario.id_filial,usuarioinventario.id_inventario,usuarioinventario.id_usuario);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'USUARIOINVENTARIO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.usuarioinventario_Alteracao = async function(usuarioinventario) { 
	try { 
		const obj = await usuarioinventarioSrv.getUsuarioinventario(usuarioinventario.id_empresa,usuarioinventario.id_filial,usuarioinventario.id_inventario,usuarioinventario.id_usuario);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'USUARIOINVENTARIO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.usuarioinventario_Exclusao = async function(id_empresa,id_filial,id_inventario,id_usuario) { 
	try { 
		const obj = await usuarioinventarioSrv.getUsuarioinventario(id_empresa,id_filial,id_inventario,id_usuario);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'USUARIOINVENTARIO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

