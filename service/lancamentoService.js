/* SERVICE lancamentos */
const lancamentoData = require("../data/lancamentoData");
const validacao = require("../util/validacao");
const parametros = require("../util/lancamentoParametros");
const erroDB = require("../util/userfunctiondb");
const regras = require("../util/lancamentoRegra");
const TABELA = "LANCAMENTOS";
/* CRUD GET SERVICE */
exports.getLancamento = async function(
    id_empresa,
    id_filial,
    id_inventario,
    id_imobilizado
) {
    return lancamentoData.getLancamento(
        id_empresa,
        id_filial,
        id_inventario,
        id_imobilizado
    );
};
/* CRUD GET ALL SERVICE */
exports.getLancamentos = async function(params) {
    return lancamentoData.getLancamentos(params);
};
//* CRUD - INSERT - SERVICE */
exports.insertLancamento = async function(lancamento) {
    try {
        await regras.lancamento_Inclusao(lancamento);
        validacao.Validacao(TABELA, lancamento, parametros.lancamentos());
        return lancamentoData.insertLancamento(lancamento);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};
//* CRUD - UPDATE - SERVICE */
exports.updateLancamento = async function(lancamento) {
    try {
        await regras.lancamento_Alteracao(lancamento);
        validacao.Validacao(TABELA, lancamento, parametros.lancamentos());
        return lancamentoData.updateLancamento(lancamento);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};
//* CRUD - DELETE - SERVICE */
exports.deleteLancamento = async function(
    id_empresa,
    id_filial,
    id_inventario,
    id_imobilizado
) {
    try {
        await regras.lancamento_Exclusao(
            id_empresa,
            id_filial,
            id_inventario,
            id_imobilizado
        );
        return lancamentoData.deleteLancamento(
            id_empresa,
            id_filial,
            id_inventario,
            id_imobilizado
        );
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};

exports.getResumoLancamentos = async function(params) {
    console.log(`Chegue na Servico getResumoLancamentos`);
    return lancamentoData.getResumoLancamentos(params);
};

exports.getEvolucaoLancamentos = async function(params) {
    return lancamentoData.getEvolucaoLancamentos(params);
};