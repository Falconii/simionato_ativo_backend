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
  id_imobilizado
) {
  return imobilizadoinventarioData.getExisteImoInventarioComMovimento(
    id_empresa,
    id_filial,
    id_imobilizado
  );
};

exports.deleteImobilizadoinventarioall = async function (
  id_empresa,
  id_filial,
  id_imobilizado
) {
  try {
    return imobilizadoinventarioData.deleteImobilizadoinventarioall(
      id_empresa,
      id_filial,
      id_imobilizado
    );
  } catch (err) {
    throw new erroDB.UserException(err.erro, err);
  }
};

