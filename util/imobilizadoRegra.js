const imobilizadoSrv = require("../service/imobilizadoService");
const imobilizadoinventarioService = require("../service/custom/imobilizadoinventarioService");
const deparaSrv = require("../service/custom/deparaService");
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
    const deparas = await deparaSrv.existeDeparaLocal(
        imobilizado.id_empresa,
        imobilizado.id_filial,
        imobilizado.codigo,
      );
  
      if (deparas.length > 0) {
        throw new erroDB.UserException("Regra de negócio", [
          {
            tabela: "IMOBILIZADO",
            message: `"INCLUSÃO" Ativo Pertence A Lista "DE PARA"!`,
          },
        ]);
      }
  } catch (err) {
    throw err;
  }

  return;
};

exports.imobilizado_Inclusao_Cancela_DePara = async function (imobilizado) {
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
    const deparas = await deparaSrv.existeDeparaLocal(
        imobilizado.id_empresa,
        imobilizado.id_filial,
        imobilizado.codigo,
      );
  
      if (deparas.length > 0) {
        throw new erroDB.UserException("Regra de negócio", [
          {
            tabela: "IMOBILIZADO",
            message: `"ALTERAÇÃO" Ativo Pertence A Lista "DE PARA"!`,
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
  codigo
) {
  try {
    const obj = await imobilizadoSrv.getImobilizado(
      id_empresa,
      id_filial,
      codigo
    );
    if (obj == null) {
      throw new erroDB.UserException("Regra de negócio", [
        {
          tabela: "IMOBILIZADO",
          message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!`,
        },
      ]);
    }
    const deparas = await deparaSrv.existeDeparaLocal(
        id_empresa,
        id_filial,
        codigo
      );
  
      if (deparas.length > 0) {
        throw new erroDB.UserException("Regra de negócio", [
          {
            tabela: "IMOBILIZADO",
            message: `"EXCLUSÃO" Ativo Pertence A Lista "DE PARA"!`,
          },
        ]);
      }
    const invs =
      await imobilizadoinventarioService.getExisteImoInventarioComMovimento(
        id_empresa,
        id_filial,
        codigo
      );

    if (invs.length > 0) {
      throw new erroDB.UserException("Regra de negócio", [
        {
          tabela: "IMOBILIZADO",
          message: `"EXCLUSÃO" Existem Ativos Lançamentos Ou Fotos Associados A Este Ativo!`,
        },
      ]);
    }
  } catch (err) {
    throw err;
  }

  return;
};
