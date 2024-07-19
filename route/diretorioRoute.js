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

  fileObjs = fs.readdirSync(dirBase, { withFileTypes: true });

  fileObjs.forEach((file) => {
    //console.log(file.Symbol(type));
  });

  console.log("Só diretorios");

  const diretorios = getDirectories(dirBase);

  diretorios.forEach((diretorio) => {
    console.log(diretorio);
  });

  res.status(200).json({
    dirBase: dirBase,
    dirCMD: path.basename(path.resolve(process.cwd())),
  });
});
/* ROTA CONSULTA POST empresas */
router.post("/api/files", async function (req, res) {
  /*
                              	{
                              		"id":0, 
                              		"razao":"", 
                              		"cnpj_cpf":"", 
                              		"pagina":0, 
                              		"tamPagina":50, 
                              		"contador":"N", 
                              		"orderby":"", 
                              		"sharp":false 
                              	}
                              */
  try {
    res.status(200).json({ message: "OK" });
    /*
		const params = req.body;
		const lsRegistros = await empresaSrv.getEmpresas(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Empresa Nenhum Registro Encontrado!' });
		}
		else
		{
			res.status(200).json(lsRegistros);
		}
            */
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Empresa", message: err.message });
    }
  }
});

module.exports = router;
