/* SERVICE inventarios */
const inventarioData = require('../data/inventarioData');
const validacao = require('../util/validacao');
const parametros = require('../util/inventarioParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/inventarioRegra');
const TABELA = 'INVENTARIOS';
/* CRUD GET SERVICE */
exports.getInventario = async function(id_empresa, id_filial, codigo) {
    return inventarioData.getInventario(id_empresa, id_filial, codigo);
};

exports.getResumo = async function(id_empresa, id_filial, codigo) {
    return inventarioData.getResumo(id_empresa, id_filial, codigo);
};

/* CRUD GET ALL SERVICE */
exports.getInventarios = async function(params) {
    return inventarioData.getInventarios(params);
};
//* CRUD - INSERT - SERVICE */
exports.insertInventario = async function(inventario) {
    try {
        await regras.inventario_Inclusao(inventario);
        validacao.Validacao(TABELA, inventario, parametros.inventarios());
        return inventarioData.insertInventario(inventario);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};
//* CRUD - UPDATE - SERVICE */
exports.updateInventario = async function(inventario) {
    try {
        await regras.inventario_Alteracao(inventario);
        validacao.Validacao(TABELA, inventario, parametros.inventarios());
        return inventarioData.updateInventario(inventario);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};
//* CRUD - DELETE - SERVICE */
exports.deleteInventario = async function(id_empresa, id_filial, codigo) {
    try {
        await regras.inventario_Exclusao(id_empresa, id_filial, codigo);
        return inventarioData.deleteInventario(id_empresa, id_filial, codigo);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};