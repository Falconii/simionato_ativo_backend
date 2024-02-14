/* SERVICE fotos */
const fotoData = require('../data/fotoData');
const validacao = require('../util/validacao');
const parametros = require('../util/fotoParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/fotoRegra');
const TABELA = 'FOTOS';
/* CRUD GET SERVICE */
exports.getFoto = async function(id_empresa,id_local,id_inventario,id_imobilizado,id_pasta,id_file,file_name){
	return fotoData.getFoto(id_empresa,id_local,id_inventario,id_imobilizado,id_pasta,id_file,file_name);
};
/* CRUD GET ALL SERVICE */
exports.getFotos = async function(params){
	return fotoData.getFotos(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertFoto = async function(foto){
try 
{
	await regras.foto_Inclusao(foto);
	validacao.Validacao(TABELA,foto, parametros.fotos());
	return fotoData.insertFoto(foto);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateFoto = async function(foto){try 
{
	await regras.foto_Alteracao(foto);
	validacao.Validacao(TABELA,foto, parametros.fotos());
	return fotoData.updateFoto(foto);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteFoto = async function(id_empresa,id_local,id_inventario,id_imobilizado,id_pasta,id_file,file_name){try 
{
	await  regras.foto_Exclusao(id_empresa,id_local,id_inventario,id_imobilizado,id_pasta,id_file,file_name);
	return fotoData.deleteFoto(id_empresa,id_local,id_inventario,id_imobilizado,id_pasta,id_file,file_name);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
