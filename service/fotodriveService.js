const fotodriveData = require('../data/fotodriveData');
const erroDB = require('../util/userfunctiondb');
const TABELA = 'FOTO_DRIVE';

/* INSERT FOTO_DRIVE SERVICE */
exports.insertFotoDrive = async function(fotodrive) {
    try {
        // Inserção de foto_drive no banco de dados
        return await fotodriveData.insertFotoDrive(fotodrive);
    } catch (err) {
        throw new erroDB.UserException(err.erro || 'Erro ao inserir o foto_drive', err);
    }
};