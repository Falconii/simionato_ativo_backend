/* SERVICE usuariosinventarios */
const usuarioinventarioData = require('../data/usuarioinventarioData');
const validacao = require('../util/validacao');
const parametros = require('../util/usuarioinventarioParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/usuarioinventarioRegra');
const TABELA = 'USUARIOSINVENTARIOS';
/* CRUD GET SERVICE */
exports.getUsuarioinventario = async function(id_empresa,id_filial,id_inventario,id_usuario){
	return usuarioinventarioData.getUsuarioinventario(id_empresa,id_filial,id_inventario,id_usuario);
};
/* CRUD GET ALL SERVICE */
exports.getUsuariosinventarios = async function(params){
	return usuarioinventarioData.getUsuariosinventarios(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertUsuarioinventario = async function(usuarioinventario){
try 
{
	await regras.usuarioinventario_Inclusao(usuarioinventario);
	validacao.Validacao(TABELA,usuarioinventario, parametros.usuariosinventarios());
	return usuarioinventarioData.insertUsuarioinventario(usuarioinventario);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateUsuarioinventario = async function(usuarioinventario){try 
{
	await regras.usuarioinventario_Alteracao(usuarioinventario);
	validacao.Validacao(TABELA,usuarioinventario, parametros.usuariosinventarios());
	return usuarioinventarioData.updateUsuarioinventario(usuarioinventario);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteUsuarioinventario = async function(id_empresa,id_filial,id_inventario,id_usuario){try 
{
	await  regras.usuarioinventario_Exclusao(id_empresa,id_filial,id_inventario,id_usuario);
	return usuarioinventarioData.deleteUsuarioinventario(id_empresa,id_filial,id_inventario,id_usuario);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
