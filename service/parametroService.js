/* SERVICE parametros */
const parametroData = require('../data/parametroData');
////const validacao = require('../util/validacao');
////const parametros = require('../util/parametrostabelas');
const erroDB = require('../util/userfunctiondb');
////const regras = require('../util/regrasdenegocio');
const TABELA = 'PARAMETROS';
/* CRUD GET SERVICE */
exports.getParametro = async function(id_empresa, modulo, assinatura, id_usuario) {
    return parametroData.getParametro(id_empresa, modulo, assinatura, id_usuario);
};
/* CRUD GET ALL SERVICE */
exports.getParametros = async function(params) {
    return parametroData.getParametros(params);
};
//* CRUD - INSERT - SERVICE */
exports.insertParametro = async function(parametro) {
    try {
        //await regras.Clientes_Inclusao(cliente);
        //validacao.Validacao(TABELA, cliente, parametros.Clientes());
        return parametroData.insertParametro(parametro);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};
//* CRUD - UPDATE - SERVICE */
exports.updateParametro = async function(parametro) {
    try {
        //await regras.Parametros_Inclusao(parametro);
        //validacao.Validacao(TABELA, parametro, parametros.Parametros());
        return parametroData.updateParametro(parametro);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};
//* CRUD - DELETE - SERVICE */
exports.deleteParametro = async function(id_empresa, modulo, id_usuario) {
    try {
        //await regras.Parametros_Exclusao(id_empresa,modulo,id_usuario);
        //validacao.Validacao(TABELA, parametro, parametros.Parametros());
        return parametroData.deleteParametro(id_empresa, modulo, assinatura, id_usuario);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};