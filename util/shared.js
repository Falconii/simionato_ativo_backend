const jwt = require('jsonwebtoken');

function adicionaZero(numero) {
  if (numero <= 9) return "0" + numero;
  else return "" + numero;
}

exports.formatDate = function (date) {
  if (date == null) {
    return null;
  }

  if (typeof date === "string") {
    if (date.length > 10) date = date.substring(0, 10);
    return date;
  } else {
    data = new Date(date);
    return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  }
};

exports.formatDateYYYYMMDD = function (date) {
  if (date == null) {
    return null;
  }
  if (typeof date === "string") {
    if (date.trim().length == 0) {
      return "null";
    }
    if (date.length > 10) date = date.substring(0, 10);
    date = date.split("/");
    return "'" + [date[2], date[1], date[0]].join("-") + "'";
  } else {
    return date.yyyymmdd();
  }
};

exports.IfNUllNoAspas = function (date) {
  if (date == "null") return "null";

  return `'${date}'`;
};

Date.prototype.yyyymmdd = function () {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [
    this.getFullYear(),
    (mm > 9 ? "" : "0") + mm,
    (dd > 9 ? "" : "0") + dd,
  ].join("-");
};

exports.formatDateHour = function (date) {
  return date;
};

exports.excluirCaracteres = function (value) {
  const searchRegExp = /'/g;
  let retorno = value.replace(searchRegExp, "''");
  retorno = retorno.replace(/\r?\n|\r/g, " ");
  return retorno;
};

exports.excluirVirgulasePontos = function (value) {
  let retorno = "";
  if (typeof value == "string") {
    if (value.length == 0) return "0";
    for (x = value.length - 1; x >= 0; x--) {
      if (value[x] == "," || value[x] == ".") {
        if (value[x] == ",") retorno = "." + retorno;
        if (value[x] == ".") retorno = "" + retorno;
      } else {
        retorno = value[x] + retorno;
      }
    }
  } else {
    retorno = "0";
  }
  return retorno;
};


exports.semAcento = function (value) {
  const semAcento = value.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  return semAcento;
};



exports.verifyToken = async function(token, ACCESS_SECRET) {
  return new Promise((resolve) => {
    jwt.verify(token, ACCESS_SECRET, (err, payload) => {
      console.log("Verificando token: ", payload);
      if (err) {
        if (err.name === 'TokenExpiredError') {
          resolve({ status: 401, mensagem: 'Token expirado', id_empresa:0,id_usuario:0})
        } else if (err.name === 'JsonWebTokenError') {
          resolve({ status: 403, mensagem: 'Token inválido', id_empresa:0,id_usuario: 0 });
        } else {    
           resolve({ status: 403, mensagem: `Token inválido ${err.message}`,id_empresa:0, id_usuario: 0 });
        }
      } else {
        resolve({ status: 200, mensagem: 'Token OK', id_empresa:payload.id_empresa,id_usuario: payload.id_usuario });
      }
    });
  });
};

