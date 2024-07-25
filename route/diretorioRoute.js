/* ROUTE empresas */
const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");

const getDirectories = async (source) =>
  (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

/* ROTA GETONE empresa */
router.get("/api/diretorio", async function (req, res) {
  const dirBase = global.appRoot;
  const filenames = fs.readdirSync(dirBase);
  filenames.map((filename) => {
    console.log(filename);
  });

  /*  fileObjs = fs.readdirSync(dirBase, { withFileTypes: true });

                                     fileObjs.forEach((file) => {
                                       console.log(file.Symbol(type));
                                     }); */

  console.log("Arquivos Diretorio Fotos");

  /*  const fotosList = fs.readdirSync(dirBase + "/fotos");

         fotosList.forEach((arquivo) => {
           console.log(arquivo);
         });
        */
  console.log("Fotos Dia 15");

  path15 = path.resolve("C:\\fotos\\15\\");

  const fotos15List = fs.readdirSync(path15);
  let idx = 0;
  fotos15List.forEach((arquivo) => {
    if (path.extname(arquivo) == ".png") {
      console.log(arquivo);
      idx++;
    }
  });
  console.log(`Total De Fotos Dia 15 ${idx}`);

  /*
                                            const diretorios = getDirectories(dirBase);

                                            diretorios.forEach((diretorio) => {
                                              console.log(diretorio);
                                            });
                                            */

  res.status(200).json({
    dirBase: dirBase,
    dirCMD: path.basename(path.resolve(process.cwd())),
  });
});

module.exports = router;
