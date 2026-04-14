const imobilizadoSrv = require("../service/imobilizadoService");
const imobilizadoinventarioService = require("../service/custom/imobilizadoinventarioService");
const erroDB = require("../util/userfunctiondb");
const shared = require("../util/shared");
/* REGRA DE NEGOCIO imobilizados */

exports.imobilizado_Inclusao = async function (imobilizado) {
  try {
    const obj = await imobilizadoSrv.getImobilizado(
      imobilizado.id_empresa,
      imobilizado.id_filial,
      imobilizado.codigo,
    );
    if (obj != null) {
      throw new erroDB.UserException("Regra de negócio", [
        {
          tabela: "IMOBILIZADO",
          message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!`,
        },
      ]);
    }
  } catch (err) {
    throw err;
  }

  return;
};

exports.imobilizado_Alteracao = async function (imobilizado) {
  try {
    const obj = await imobilizadoSrv.getImobilizado(
      imobilizado.id_empresa,
      imobilizado.id_filial,
      imobilizado.codigo,
    );
    if (obj == null) {
      throw new erroDB.UserException("Regra de negócio", [
        {
          tabela: "IMOBILIZADO",
          message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!`,
        },
      ]);
    }
  } catch (err) {
    throw err;
  }

  return;
};

exports.imobilizado_Exclusao = async function (
  id_empresa,
  id_filial,
  codigo,
  id_inventario,
) {
  try {
    const obj = await imobilizadoSrv.getImobilizado(
      id_empresa,
      id_filial,
      codigo,
      id_inventario,
    );
    if (obj == null) {
      throw new erroDB.UserException("Regra de negócio", [
        {
          tabela: "IMOBILIZADO",
          message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!`,
        },
      ]);
    }

    const invs =
      await imobilizadoinventarioService.getExisteImoInventarioComMovimento(
        id_empresa,
        id_filial,
        codigo,
        id_inventario,
      );

    if (invs.total > 0) {
      throw new erroDB.UserException("Regra de negócio", [
        {
          tabela: "IMOBILIZADO",
          message: `"EXCLUSÃO" Existem De  Associados Ou Fotos Associados A Este Ativo!`,
        },
      ]);
    }
  } catch (err) {
    throw err;
  }

  return;
};
