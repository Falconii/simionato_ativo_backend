/* SERVICE imobilizadosinventarios */
const imobilizadoinventarioData = require("../../data/custom/imobilizadoinventarioData");
const validacao = require("../../util/validacao");
const parametros = require("../../util/imobilizadoinventarioParametros");
const erroDB = require("../../util/userfunctiondb");
const regras = require("../../util/imobilizadoinventarioRegra");
const TABELA = "IMOBILIZADOSINVENTARIOS";

exports.getExisteImoInventarioComMovimento = async function (
  id_empresa,
  id_filial,
  id_imobilizado,
  id_inventario,
) {
  return imobilizadoinventarioData.getExisteImoInventarioComMovimento(
    id_empresa,
    id_filial,
    id_imobilizado,
    id_inventario,
  );
};
