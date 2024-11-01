/* SERVICE credenciais */
const deparaData = require('../data/deparaData');
const TABELA = 'depara';

/* Processar DePara */
exports.processarDePara = async function(params){
	return deparaData.processarDePara(params);
};


/* CRUD GET ALL SERVICE */
exports.getDeparas = async function(params){
	return deparaData.getDeParas(params);
};

exports.updateDe_Para = async function(depara){
	return deparaData.updateDe_Para(depara);
}
