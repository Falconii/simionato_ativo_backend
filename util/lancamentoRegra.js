const lancamentoSrv = require('../service/lancamentoService');
const imobilizadoinventarioSrv = require('../service/imobilizadoinventarioService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO lancamentos */

exports.lancamento_Inclusao = async function(lancamento) {
    try {
        const obj = await lancamentoSrv.getLancamento(lancamento.id_empresa, lancamento.id_filial, lancamento.id_inventario, lancamento.id_imobilizado);
        if (obj != null) {
            throw new erroDB.UserException('Regra de negócio', [{ tabela: 'LANCAMENTO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
        }

        const obj_new = await imobilizadoinventarioSrv.getImobilizadoinventario(lancamento.id_empresa, lancamento.id_filial, lancamento.id_inventario, lancamento.new_codigo);
        if (obj_new != null) {
            throw new erroDB.UserException('Regra de negócio', [{ tabela: 'IMOBILIZADOINVENTARIO', message: `"INCLUSÃO" NOVO CÓDIGO Já Existe Na Base De Dados.!` }]);
        }

    } catch (err) {
        throw err;
    }


    return;
}

exports.lancamento_Alteracao = async function(lancamento) {
    try {
        const obj = await lancamentoSrv.getLancamento(lancamento.id_empresa, lancamento.id_filial, lancamento.id_inventario, lancamento.id_imobilizado);
        if (obj == null) {
            throw new erroDB.UserException('Regra de negócio', [{ tabela: 'LANCAMENTO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
        }
    } catch (err) {
        throw err;
    }


    return;
}

exports.lancamento_Exclusao = async function(id_empresa, id_filial, id_inventario, id_imobilizado) {
    try {
        const obj = await lancamentoSrv.getLancamento(id_empresa, id_filial, id_inventario, id_imobilizado);
        if (obj == null) {
            throw new erroDB.UserException('Regra de negócio', [{ tabela: 'LANCAMENTO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
        }
    } catch (err) {
        throw err;
    }


    return;
}