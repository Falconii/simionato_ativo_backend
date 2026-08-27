const jwt = require("jsonwebtoken");

const funcoes = require("../util/deparaFuncoes");

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
  if (!value) return "";

  let retorno = value;

  // Remove CRLF, tabs e múltiplas quebras de linha
  retorno = retorno.replace(/\r?\n|\r|\t/g, " ");

  // Remove múltiplos espaços
  retorno = retorno.replace(/\s+/g, " ");

  // Escapa aspas simples
  retorno = retorno.replace(/'/g, "''");

  // Remove caracteres especiais comuns
  retorno = retorno.replace(/[^\w\s.,-]/g, "");

  // Remove espaços no início e fim
  retorno = retorno.trim();

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

exports.trocavirgulaporponto = function (value) {
  if (value.trim() == ''){
    return '0';
  }
  let retorno = value.replace(",", ".");
  return retorno;
};

exports.semAcento = function (value) {
  const semAcento = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return semAcento;
};

exports.verifyToken = async function (token, ACCESS_SECRET) {
  return new Promise((resolve) => {
    jwt.verify(token, ACCESS_SECRET, (err, payload) => {
      console.log("Verificando token: ", payload);
      if (err) {
        if (err.name === "TokenExpiredError") {
          resolve({
            status: 401,
            mensagem: "Token expirado",
            id_empresa: 0,
            id_usuario: 0,
          });
        } else if (err.name === "JsonWebTokenError") {
          resolve({
            status: 403,
            mensagem: "Token inválido",
            id_empresa: 0,
            id_usuario: 0,
          });
        } else {
          resolve({
            status: 403,
            mensagem: `Token inválido ${err.message}`,
            id_empresa: 0,
            id_usuario: 0,
          });
        }
      } else {
        resolve({
          status: 200,
          mensagem: "Token OK",
          id_empresa: payload.id_empresa,
          id_usuario: payload.id_usuario,
        });
      }
    });
  });
};

exports.file_name_com_camera = function (filename) {
  const temCamera = filename.toLowerCase().includes("camera");
  return temCamera;
};

exports.tem_erro_codigo = function (
  id_empresa,
  id_local,
  id_inventario,
  id_imobilizado,
  filename
) {
  const dados = filename.split("_");
  if (dados.length < 4) {
    console.log("Erro: ", dados);
    return true;
  } else {
    const _id_empresa = Number(dados[0]);

    if (isNaN(_id_empresa)) {
      return true;
    }

    const _id_local = Number(dados[1]);

    if (isNaN(_id_local)) {
      return true;
    }

    const _id_inventario = Number(dados[2]);

    if (isNaN(_id_inventario)) {
      return true;
    }

    const _id_imobilizado = Number(dados[3]);

    if (isNaN(_id_imobilizado)) {
      return true;
    }

    if (
      _id_empresa !== id_empresa ||
      _id_local !== id_local ||
      _id_inventario !== id_inventario ||
      _id_imobilizado !== id_imobilizado
    ) {
      /*            console.log(
                                        "-----------------------------------------------------------------------"
                                    );
                                    console.log(id_empresa, id_local, id_inventario, id_imobilizado);
                                    console.log(dados[0], dados[1], dados[2], dados[3]);
                                    console.log(filename);
                                    console.log(
                                        "-----------------------------------------------------------------------"
                                    ); */
      return true;
    }
  }
  return false;
};
