const nfeSrv = require('../service/nfeService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO nfes */

exports.nfe_Inclusao = async function(nfe) {
    try {
        params = {
            "id_empresa": nfe.id_empresa,
            "id_filial": nfe.id_filial,
            "cnpj_fornecedor": nfe.cnpj_fornecedor,
            "razao_fornecedor": nfe.razao_fornecedor,
            "id_imobilizado": nfe.id_imobilizado,
            "nfe": nfe.nfe,
            "serie": nfe.serie,
            "item": nfe.item
        }
        const obj = await nfeSrv.getNfe(params);
        if (obj != null) {
            throw new erroDB.UserException('Regra de negócio', [{ tabela: 'NFE', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
        }
    } catch (err) {
        throw err;
    }


    return;
}

exports.nfe_Alteracao = async function(nfe) {
    try {
        const obj = await nfeSrv.getNfe(nfe.id_empresa, nfe.id_filial, nfe.cnpj_fornecedor, nfe.razao_fornecedor, nfe.id_imobilizado, nfe.nfe, nfe.serie, nfe.item);
        if (obj == null) {
            throw new erroDB.UserException('Regra de negócio', [{ tabela: 'NFE', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
        }
    } catch (err) {
        throw err;
    }


    return;
}

exports.nfe_Exclusao = async function(id_empresa, id_filial, cnpj_fornecedor, razao_fornecedor, id_imobilizado, nfe, serie, item) {
    try {
        const obj = await nfeSrv.getNfe(id_empresa, id_filial, cnpj_fornecedor, razao_fornecedor, id_imobilizado, nfe, serie, item);
        if (obj == null) {
            throw new erroDB.UserException('Regra de negócio', [{ tabela: 'NFE', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
        }
    } catch (err) {
        throw err;
    }


    return;
}