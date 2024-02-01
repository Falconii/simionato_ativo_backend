/* SERVICE padroes */
const padraoData = require('../data/padraoData');
const validacao = require('../util/validacao');
const parametros = require('../util/padraoParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/padraoRegra');
const TABELA = 'PADROES';
/* CRUD GET SERVICE */
exports.getPadrao = async function(id_empresa, id_usuario) {
    return padraoData.getPadrao(id_empresa, id_usuario);
};
/* CRUD GET ALL SERVICE */
exports.getPadroes = async function(params) {
    return padraoData.getPadroes(params);
};
//* CRUD - INSERT - SERVICE */
exports.insertPadrao = async function(padrao) {
    try {
        await regras.padrao_Inclusao(padrao);
        validacao.Validacao(TABELA, padrao, parametros.padroes());
        return padraoData.insertPadrao(padrao);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};
//* CRUD - UPDATE - SERVICE */
exports.updatePadrao = async function(padrao) {
    try {
        await regras.padrao_Alteracao(padrao);
        validacao.Validacao(TABELA, padrao, parametros.padroes());
        return padraoData.updatePadrao(padrao);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};
//* CRUD - DELETE - SERVICE */
exports.deletePadrao = async function(id_empresa, id_usuario) {
    try {
        await regras.padrao_Exclusao(id_empresa, id_usuario);
        return padraoData.deletePadrao(id_empresa, id_usuario);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};