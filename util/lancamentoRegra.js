const lancamentoSrv = require("../service/lancamentoService");
const deparaSrv = require("../service/custom/deparaService");
const erroDB = require("../util/userfunctiondb");
const shared = require("../util/shared");
/* REGRA DE NEGOCIO lancamentos */

exports.lancamento_Inclusao = async function (lancamento) {
  try {
    const obj = await lancamentoSrv.getLancamento(
      lancamento.id_empresa,
      lancamento.id_filial,
      lancamento.id_inventario,
      lancamento.id_imobilizado,
    );
    if (obj != null) {
      throw new erroDB.UserException("Regra de negócio", [
        {
          tabela: "LANCAMENTO",
          message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!`,
        },
      ]);
    }
    if (lancamento.new_codigo != 0) {
      const duplicidade = await lancamentoSrv.checkDuplicidadeNewCodigo({
        acao: "INSERT",
        id_empresa: lancamento.id_empresa,
        id_filial: lancamento.id_filial,
        id_inventario: lancamento.id_inventario,
        new_codigo: lancamento.new_codigo,
        id_imobilizado: lancamento.id_imobilizado,
        id_lanca: lancamento.id_lanca,
      });

      const total = Number(duplicidade[0].total);

      if (total > 0) {
        throw new erroDB.UserException("Regra de negócio", [
          {
            tabela: "LANCAMENTO",
            message: `"ALTERAÇÃO" Já Existe Um Registro Com O "Novo Código" Informado.!`,
          },
        ]);
      }
    }
  } catch (err) {
    throw err;
  }

  return;
};

exports.lancamento_Alteracao = async function (lancamento) {
  try {
    const obj = await lancamentoSrv.getLancamento(
      lancamento.id_empresa,
      lancamento.id_filial,
      lancamento.id_inventario,
      lancamento.id_imobilizado,
    );
    if (obj == null) {
      throw new erroDB.UserException("Regra de negócio", [
        {
          tabela: "LANCAMENTO",
          message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!`,
        },
      ]);
    }
    const deparas = await deparaSrv.existeDepara(
      lancamento.id_empresa,
      lancamento.id_filial,
      lancamento.id_inventario,
      lancamento.id_imobilizado,
    );

    if (deparas.length > 0) {
      throw new erroDB.UserException("Regra de negócio", [
        {
          tabela: "LANCAMENTO",
          message: `"ALTERAÇÃO" Ativo Pertence A LIsta "DE PARA"!`,
        },
      ]);
    }

    if (lancamento.new_codigo != 0) {
      const duplicidade = await lancamentoSrv.checkDuplicidadeNewCodigo({
        acao: "UPDATE",
        id_empresa: lancamento.id_empresa,
        id_filial: lancamento.id_filial,
        id_inventario: lancamento.id_inventario,
        new_codigo: lancamento.new_codigo,
        id_imobilizado: lancamento.id_imobilizado,
        id_lanca: lancamento.id_lanca,
      });

      const total = Number(duplicidade[0].total);

      if (total > 0) {
        throw new erroDB.UserException("Regra de negócio", [
          {
            tabela: "LANCAMENTO",
            message: `"ALTERAÇÃO" Já Existe Um Registro Com O "Novo Código" Informado.!`,
          },
        ]);
      }
    }
  } catch (err) {
    throw err;
  }

  return;
};

exports.lancamento_Exclusao = async function (
  id_empresa,
  id_filial,
  id_inventario,
  id_imobilizado,
) {
  try {
    const obj = await lancamentoSrv.getLancamento(
      id_empresa,
      id_filial,
      id_inventario,
      id_imobilizado,
    );
    if (obj == null) {
      throw new erroDB.UserException("Regra de negócio", [
        {
          tabela: "LANCAMENTO",
          message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!`,
        },
      ]);
    }
    const deparas = await deparaSrv.existeDepara(
      id_empresa,
      id_filial,
      id_inventario,
      id_imobilizado,
    );

    if (deparas.length > 0) {
      throw new erroDB.UserException("Regra de negócio", [
        {
          tabela: "LANCAMENTO",
          message: `"EXCLUSÃO" Ativo Pertence A LIsta "DE PARA"!`,
        },
      ]);
    }
  } catch (err) {
    throw err;
  }

  return;
};
