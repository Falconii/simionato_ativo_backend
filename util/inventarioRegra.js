const inventarioSrv = require('../service/inventarioService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO inventarios */

exports.inventario_Inclusao = async function(inventario) {
    console.log('inventario_Inclusao', inventario);
    try {
        const obj = await inventarioSrv.getInventario(inventario.id_empresa, inventario.id_filial, inventario.codigo);
        if (obj != null) {
            throw new erroDB.UserException('Regra de negócio', [{ tabela: 'INVENTARIO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
        }
    } catch (err) {
        throw err;
    }


    return;
}

exports.inventario_Alteracao = async function(inventario) {
    try {
        const obj = await inventarioSrv.getInventario(inventario.id_empresa, inventario.id_filial, inventario.codigo);
        if (obj == null) {
            throw new erroDB.UserException('Regra de negócio', [{ tabela: 'INVENTARIO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
        }
    } catch (err) {
        throw err;
    }


    return;
}

exports.inventario_Exclusao = async function(id_empresa, id_filial, codigo) {
    try {
        const obj = await inventarioSrv.getInventario(id_empresa, id_filial, codigo);
        if (obj == null) {
            throw new erroDB.UserException('Regra de negócio', [{ tabela: 'INVENTARIO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
        }
    } catch (err) {
        throw err;
    }


    return;
}