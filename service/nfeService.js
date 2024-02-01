/* SERVICE nfes */
const nfeData = require('../data/nfeData');
const validacao = require('../util/validacao');
const parametros = require('../util/nfeParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/nfeRegra');
const TABELA = 'NFES';

/* CRUD GET SERVICE */
exports.getNfe = async function(params) {
    return nfeData.getNfe(params);
};

exports.getNfeByImobilizado = async function(id_empresa, id_filial, id_imobilizado, nfe) {
    return nfeData.getNfeByImobilizado(id_empresa, id_filial, id_imobilizado, nfe);
};

/* CRUD GET ALL SERVICE */
exports.getNfes = async function(params) {
    return nfeData.getNfes(params);
};
//* CRUD - INSERT - SERVICE */
exports.insertNfe = async function(nfe) {
    try {
        await regras.nfe_Inclusao(nfe);
        validacao.Validacao(TABELA, nfe, parametros.nfes());
        return nfeData.insertNfe(nfe);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};
//* CRUD - UPDATE - SERVICE */
exports.updateNfe = async function(nfe) {
    try {
        await regras.nfe_Alteracao(nfe);
        validacao.Validacao(TABELA, nfe, parametros.nfes());
        return nfeData.updateNfe(nfe);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};
//* CRUD - DELETE - SERVICE */
exports.deleteNfe = async function(id_empresa, id_filial, cnpj_fornecedor, razao_fornecedor, id_imobilizado, nfe, serie, item) {
    try {
        await regras.nfe_Exclusao(id_empresa, id_filial, cnpj_fornecedor, razao_fornecedor, id_imobilizado, nfe, serie, item);
        return nfeData.deleteNfe(id_empresa, id_filial, cnpj_fornecedor, razao_fornecedor, id_imobilizado, nfe, serie, item);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};