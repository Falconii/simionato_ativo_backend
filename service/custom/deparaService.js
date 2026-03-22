/* SERVICE de_para */
const deparaData = require("../../data/custom/deparaData");
const TABELA = "depara";

/* Processar DePara */
exports.processarDePara = async function(params) {
    return deparaData.processarDePara(params);
};

exports.processarDeParaV2 = async function(params) {
    return deparaData.processarDeParaV2(params);
};

exports.existeDepara = async function(
    id_empresa,
    id_local,
    id_inventario,
    ativo,
) {
    return deparaData.existeDepara(id_empresa, id_local, id_inventario, ativo);
};