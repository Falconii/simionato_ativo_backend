/* SERVICE credenciais */
const arquivodriveData = require('../data/ArquivoDriveData');
const validacao = require('../util/validacao');
const parametros = require('../util/credencialParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/credencialRegra');
const TABELA = 'ARQUIVOS_DRIVE';

 exports.insertArquivo = async function(arquivo){
try 
{
	return arquivodriveData.insertArquivo(arquivo);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
