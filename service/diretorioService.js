const path = require("path");
const fs = require("fs");

/* CRUD GET ALL SERVICE */
exports.getDirFotos = function (dia) {
  const dirBase = global.appRoot;

  let retorno = [];

  console.log("Arquivos Diretorio Fotos");

  pathDia = path.resolve(`C:\\fotos\\${dia}\\`);

  const fotosList = fs.readdirSync(pathDia);

  let idx = 0;

  fotosList.forEach((arquivo) => {
    if (path.extname(arquivo) == ".png" || path.extname(arquivo) == ".jpg") {
      retorno.push(arquivo);
    }
  });
  return retorno;
};
