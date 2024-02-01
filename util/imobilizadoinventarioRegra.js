const imobilizadoinventarioSrv = require('../service/imobilizadoinventarioService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO imobilizadosinventarios */

exports.imobilizadoinventario_Inclusao = async function(imobilizadoinventario) {
    try {
        console.log('imobilizadoinventario_Inclusao', imobilizadoinventario)
        const obj = await imobilizadoinventarioSrv.getImobilizadoinventario(imobilizadoinventario.id_empresa, imobilizadoinventario.id_filial, imobilizadoinventario.id_inventario, imobilizadoinventario.id_imobilizado);
        if (obj != null) {
            throw new erroDB.UserException('Regra de negócio', [{ tabela: 'IMOBILIZADOINVENTARIO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
        }


    } catch (err) {
        throw err;
    }


    return;
}

exports.imobilizadoinventario_Alteracao = async function(imobilizadoinventario) {
    try {
        const obj = await imobilizadoinventarioSrv.getImobilizadoinventario(imobilizadoinventario.id_empresa, imobilizadoinventario.id_filial, imobilizadoinventario.id_inventario, imobilizadoinventario.id_imobilizado);
        if (obj == null) {
            throw new erroDB.UserException('Regra de negócio', [{ tabela: 'IMOBILIZADOINVENTARIO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
        }
    } catch (err) {
        throw err;
    }


    return;
}

exports.imobilizadoinventario_Exclusao = async function(id_empresa, id_filial, id_inventario, id_imobilizado) {
    try {
        const obj = await imobilizadoinventarioSrv.getImobilizadoinventario(id_empresa, id_filial, id_inventario, id_imobilizado);
        if (obj == null) {
            throw new erroDB.UserException('Regra de negócio', [{ tabela: 'IMOBILIZADOINVENTARIO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
        }
    } catch (err) {
        throw err;
    }


    return;
}