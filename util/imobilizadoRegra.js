const imobilizadoSrv = require('../service/imobilizadoService');
const imobilizadoinventarioService = require('../service/imobilizadoinventarioService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO imobilizados */

exports.imobilizado_Inclusao = async function(imobilizado) {
    try {
        const obj = await imobilizadoSrv.getImobilizado(imobilizado.id_empresa, imobilizado.id_filial, imobilizado.codigo);
        if (obj != null) {
            throw new erroDB.UserException('Regra de negócio', [{ tabela: 'IMOBILIZADO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
        }
    } catch (err) {
        throw err;
    }


    return;
}

exports.imobilizado_Alteracao = async function(imobilizado) {
    try {
        const obj = await imobilizadoSrv.getImobilizado(imobilizado.id_empresa, imobilizado.id_filial, imobilizado.codigo);
        if (obj == null) {
            throw new erroDB.UserException('Regra de negócio', [{ tabela: 'IMOBILIZADO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
        }
    } catch (err) {
        throw err;
    }


    return;
}

exports.imobilizado_Exclusao = async function(id_empresa, id_filial, codigo) {
    try {
        const obj = await imobilizadoSrv.getImobilizado(id_empresa, id_filial, codigo);
        if (obj == null) {
            throw new erroDB.UserException('Regra de negócio', [{ tabela: 'IMOBILIZADO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
        }
        param = {
            "id_empresa": id_empresa,
            "id_filial": id_filial,
            "id_inventario": 0,
            "id_imobilizado": codigo,
            "id_cc": "",
            "id_grupo": 0,
            "descricao": "",
            "status": 0,
            "new_cc": "",
            "new_codigo": 0,
            "id_usuario": 0,
            "origem": "",
            "pagina": 0,
            "tamPagina": 50,
            "contador": "S",
            "orderby": "",
            "sharp": false
        }

        const invs = await imobilizadoinventarioService.getImobilizadosinventarios(param);

        console.log(`invs => ${invs.total}`);

        if (invs.total > 0) {
            throw new erroDB.UserException('Regra de negócio', [{ tabela: 'IMOBILIZADO', message: `"EXCLUSÃO" Existem Inventários Associadas A Este Produto!` }]);
        }

    } catch (err) {
        throw err;
    }


    return;
}