/* SERVICE imobilizadosinventarios */
const imobilizadoinventarioData = require("../data/imobilizadoinventarioData");
const validacao = require("../util/validacao");
const parametros = require("../util/imobilizadoinventarioParametros");
const erroDB = require("../util/userfunctiondb");
const regras = require("../util/imobilizadoinventarioRegra");
const TABELA = "IMOBILIZADOSINVENTARIOS";
/* CRUD GET SERVICE */
exports.getImobilizadoinventario = async function (
  id_empresa,
  id_filial,
  id_inventario,
  id_imobilizado
) {
  return imobilizadoinventarioData.getImobilizadoinventario(
    id_empresa,
    id_filial,
    id_inventario,
    id_imobilizado
  );
};

exports.getImobilizadoinventarioExisteNew = async function (
  id_empresa,
  id_filial,
  id_inventario,
  id_imobilizado,
  new_codigo,
  inclusao
) {
  return imobilizadoinventarioData.getImobilizadoinventarioExisteNew(
    id_empresa,
    id_filial,
    id_inventario,
    id_imobilizado,
    new_codigo,
    inclusao
  );
};

/* CRUD GET ALL SERVICE */
exports.getImobilizadosinventarios = async function (params) {
  return imobilizadoinventarioData.getImobilizadosinventarios(params);
};
//* CRUD - INSERT - SERVICE */
exports.insertImobilizadoinventario = async function (imobilizadoinventario) {
  try {
    await regras.imobilizadoinventario_Inclusao(imobilizadoinventario);
    validacao.Validacao(
      TABELA,
      imobilizadoinventario,
      parametros.imobilizadosinventarios()
    );
    return imobilizadoinventarioData.insertImobilizadoinventario(
      imobilizadoinventario
    );
  } catch (err) {
    //console.log("DEU ERRO : insertImobilizadoinventario", err);
    throw new erroDB.UserException(err.erro, err);
  }
};
//* CRUD - UPDATE - SERVICE */
exports.updateImobilizadoinventario = async function (imobilizadoinventario) {
  try {
    await regras.imobilizadoinventario_Alteracao(imobilizadoinventario);
    validacao.Validacao(
      TABELA,
      imobilizadoinventario,
      parametros.imobilizadosinventarios()
    );
    return imobilizadoinventarioData.updateImobilizadoinventario(
      imobilizadoinventario
    );
  } catch (err) {
    throw new erroDB.UserException(err.erro, err);
  }
};

exports.anexarImobilizadoinventario = async function (params) {
  try {
    return imobilizadoinventarioData.anexarImobilizadoinventario(params);
  } catch (err) {
    throw new erroDB.UserException(err.erro, err);
  }
};

//* CRUD - DELETE - SERVICE */
exports.deleteImobilizadoinventario = async function (
  id_empresa,
  id_filial,
  id_inventario,
  id_imobilizado
) {
  try {
    await regras.imobilizadoinventario_Exclusao(
      id_empresa,
      id_filial,
      id_inventario,
      id_imobilizado
    );
    return imobilizadoinventarioData.deleteImobilizadoinventario(
      id_empresa,
      id_filial,
      id_inventario,
      id_imobilizado
    );
  } catch (err) {
    throw new erroDB.UserException(err.erro, err);
  }
};
