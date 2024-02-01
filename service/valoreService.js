/* SERVICE valores */
const valoreData = require('../data/valoreData');
const validacao = require('../util/validacao');
const parametros = require('../util/valoreParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/valoreRegra');
const TABELA = 'VALORES';
/* CRUD GET SERVICE */
exports.getValore = async function(id_empresa, id_filial, id_imobilizado) {
    return valoreData.getValore(id_empresa, id_filial, id_imobilizado);
};
/* CRUD GET ALL SERVICE */
exports.getValores = async function(params) {
    return valoreData.getValores(params);
};
//* CRUD - INSERT - SERVICE */
exports.insertValore = async function(valore) {
    try {
        await regras.valore_Inclusao(valore);
        validacao.Validacao(TABELA, valore, parametros.valores());
        return valoreData.insertValore(valore);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};
//* CRUD - UPDATE - SERVICE */
exports.updateValore = async function(valore) {
    try {
        await regras.valore_Alteracao(valore);
        validacao.Validacao(TABELA, valore, parametros.valores());
        return valoreData.updateValore(valore);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};
//* CRUD - DELETE - SERVICE */
exports.deleteValore = async function(id_empresa, id_filial, id_imobilizado) {
    try {
        await regras.valore_Exclusao(id_empresa, id_filial, id_imobilizado);
        return valoreData.deleteValore(id_empresa, id_filial, id_imobilizado);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};



//* CRUD - DELETE - SERVICE Excluir */
exports.deleteValorex = async function(id_empresa, id_filial, id_imobilizado) {
    try {
        await regras.valore_Exclusao(id_empresa, id_filial, id_imobilizado);
        return valoreData.deleteValore(id_empresa, id_filial, id_imobilizado);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};