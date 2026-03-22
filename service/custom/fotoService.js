/* SERVICE fotos */
const fotoData = require("../../data/custom/fotoData");
const parametros = require("../../util/fotoParametros");
const erroDB = require("../../util/userfunctiondb");
const TABELA = "FOTOS";
/* CRUD GET SERVICE */

/* CRUD GET ALL SERVICE */
exports.FotosParaCorrigir = async function(params) {
    return fotoData.FotosParaCorrigir(params);
};