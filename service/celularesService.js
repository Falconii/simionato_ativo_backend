const celularesData = require('../data/celularesData');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/celularRegra');
const TABELA = 'CELULARES';

/* GET ONE CELULAR SERVICE */
exports.getCelular = async function(id) {
    try {
        return await celularesData.getCelular(id);
    } catch (err) {
        throw new erroDB.UserException(err.erro || 'Erro ao buscar o celular', err);
    }
};
/* GET ALL CELULARES SERVICE */
exports.getCelulares = async function(params) {
    try {
        return await celularesData.getCelulares(params);
    } catch (err) {
        throw new erroDB.UserException(err.erro || 'Erro ao buscar a lista de celulares', err);
    }
};
/* INSERT CELULAR SERVICE */
exports.insertCelular = async function(celular) {
    try {
        // Regras de inclusão de celular
        await regras.celular_Inclusao(celular);

        // Validação dos campos do celular
        validacao.Validacao(TABELA, celular, parametros.celulares());

        // Inserção de celular no banco de dados
        return await celularesData.insertCelular(celular);
    } catch (err) {
        throw new erroDB.UserException(err.erro || 'Erro ao inserir o celular', err);
    }
};
/* UPDATE CELULAR SERVICE */
exports.updateCelular = async function(celular) {
    if (!celular.id || isNaN(celular.id)) {
        throw new erroDB.UserException('ID obrigatório para atualização', { erro: 'ID não fornecido ou inválido' });
    }
    try {
        await regras.celular_Alteracao(celular);
        validacao.Validacao(TABELA, celular, parametros.celulares());
        return await celularesData.updateCelular(celular);
    } catch (err) {
        throw new erroDB.UserException(err.erro || 'Erro ao atualizar o celular', err);
    }
};
/* DELETE CELULAR SERVICE */
exports.deleteCelular = async function(id) {
    if (!id || isNaN(id)) {
        throw new erroDB.UserException('ID obrigatório para exclusão', { erro: 'ID não fornecido ou inválido' });
    }
    try {
        await regras.celular_Exclusao(id);
        return await celularesData.deleteCelular(id);
    } catch (err) {
        throw new erroDB.UserException(err.erro || 'Erro ao deletar o celular', err);
    }
};

