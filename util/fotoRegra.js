const fotoSrv = require('../service/fotoService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO fotos */

exports.foto_Inclusao = async function(foto) { 
	try { 
		const obj = await fotoSrv.getFoto(foto.id_empresa,foto.id_local,foto.id_inventario,foto.id_imobilizado,foto.id_pasta,foto.id_file,foto.file_name);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'FOTO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.foto_Alteracao = async function(foto) { 
	try { 
		const obj = await fotoSrv.getFoto(foto.id_empresa,foto.id_local,foto.id_inventario,foto.id_imobilizado,foto.id_pasta,foto.id_file,foto.file_name);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'FOTO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.foto_Exclusao = async function(id_empresa,id_local,id_inventario,id_imobilizado,id_pasta,id_file,file_name) { 
	try { 
		const obj = await fotoSrv.getFoto(id_empresa,id_local,id_inventario,id_imobilizado,id_pasta,id_file,file_name);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'FOTO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

