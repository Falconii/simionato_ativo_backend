/* SERVICE fornecedores */
const fornecedorData = require('../data/fornecedorData');
const validacao = require('../util/validacao');
const parametros = require('../util/fornecedorParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/fornecedorRegra');
const TABELA = 'FORNECEDORES';
/* CRUD GET SERVICE */
exports.getFornecedor = async function(id_empresa, id_filial, id) {
    return fornecedorData.getFornecedor(id_empresa, id_filial, id);
};

exports.getFornecedorByCnpj = async function(id_empresa, id_filial, cnpj) {
    return fornecedorData.getFornecedorByCnpj(id_empresa, id_filial, cnpj);
};

/* CRUD GET ALL SERVICE */
exports.getFornecedores = async function(params) {
    return fornecedorData.getFornecedores(params);
};
//* CRUD - INSERT - SERVICE */
exports.insertFornecedor = async function(fornecedor) {
    try {
        await regras.fornecedor_Inclusao(fornecedor);
        validacao.Validacao(TABELA, fornecedor, parametros.fornecedores());
        return fornecedorData.insertFornecedor(fornecedor);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};
//* CRUD - UPDATE - SERVICE */
exports.updateFornecedor = async function(fornecedor) {
    try {
        await regras.fornecedor_Alteracao(fornecedor);
        validacao.Validacao(TABELA, fornecedor, parametros.fornecedores());
        return fornecedorData.updateFornecedor(fornecedor);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};
//* CRUD - DELETE - SERVICE */
exports.deleteFornecedor = async function(id_empresa, id_filial, id) {
    try {
        await regras.fornecedor_Exclusao(id_empresa, id_filial, id);
        return fornecedorData.deleteFornecedor(id_empresa, id_filial, id);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};