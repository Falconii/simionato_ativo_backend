/* SERVICE tokens */
const tokenData = require("../data/tokenData");
const empresaData = require("../data/empresaData");
const validacao = require("../util/validacao");
const parametros = require("../util/tokenParametros");
const erroDB = require("../util/userfunctiondb");
const regras = require("../util/tokenRegra");
const shared = require("../util/shared");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const TABELA = "TOKENS";
const validade = 30;

let ACCESS_SECRET = "";
let REFRESH_SECRET = "";

if (process.env.FRASE_ACCESS) {
  ACCESS_SECRET = process.env.FRASE_ACCESS;
  console.log("Frase Access Do Parametro FRASE_ACCESS");
} else {
  ACCESS_SECRET = fs.readFileSync("./frase_access.txt", "utf8");
  console.log("Frase Access do arquivo frase.txt");
}

if (process.env.FRASE_REFRESH) {
  REFRESH_SECRET = process.env.FRASE_REFRESH;
  console.log("Frase Refresh Do Parametro: FRASE_REFRESH");
} else {
  REFRESH_SECRET = fs.readFileSync("./frase_refresh.txt", "utf8");
  console.log("Frase Refresh do arquivo frase.txt");
}

/* CRUD GET SERVICE */
exports.getToken = async function (id_empresa, id_usuario, token, tipo) {
  return tokenData.getToken(id_empresa, id_usuario, token, tipo);
};
/* CRUD GET ALL SERVICE */
exports.getTokens = async function (params) {
  return tokenData.getTokens(params);
};
//* CRUD - INSERT - SERVICE */
exports.insertToken = async function (token) {
  try {
    console.log("Inserting token:", token);
    await regras.token_Inclusao(token);
    validacao.Validacao(TABELA, token, parametros.tokens());
    return tokenData.insertToken(token);
  } catch (err) {
    throw new erroDB.UserException(err.erro, err);
  }
};
//* CRUD - UPDATE - SERVICE */
exports.updateToken = async function (token) {
  try {
    await regras.token_Alteracao(token);
    validacao.Validacao(TABELA, token, parametros.tokens());
    return tokenData.updateToken(token);
  } catch (err) {
    throw new erroDB.UserException(err.erro, err);
  }
};
//* CRUD - DELETE - SERVICE */
exports.deleteToken = async function (id_empresa, id_usuario, token, tipo) {
  try {
    await regras.token_Exclusao(id_empresa, id_usuario, token, tipo);
    return tokenData.deleteToken(id_empresa, id_usuario, token, tipo);
  } catch (err) {
    throw new erroDB.UserException(err.erro, err);
  }
};

exports.deleteTokenByUser = async function (id_empresa, id_usuario) {
  try {
    return tokenData.deleteTokenByUser(id_empresa, id_usuario);
  } catch (err) {
    throw new erroDB.UserException(err.erro, err);
  }
};

exports.generateAccessToken = function (user) {
  return jwt.sign(
    { id_empresa: user.id_empresa, id_usuario: user.id },
    ACCESS_SECRET,
    { expiresIn: `${validade}d` }
  );
};

exports.generateRefreshToken = function (use) {
  return jwt.sign(
    { id_empresa: user.id_empresa, id_usuario: user.id },
    REFRESH_SECRET,
    { expiresIn: `${validade}d` }
  );
};

exports.getTokenOnly = async function (id_empresa, token) {
  return tokenData.getTokenOnly(id_empresa, token);
};

exports.verifyToken = async function (token) {
  try {
    const result = await shared.verifyToken(token, ACCESS_SECRET);
    return result;
  } catch (err) {
    return { status: 403, mensagem: `Token inválido ${err}`, id_usuario: 0 };
  }
};
