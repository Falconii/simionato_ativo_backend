const  dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
const parametroSrv = require("./service/parametroService");
var os = require("os");
const PORT = process.env.PORT || 3000;
const app = express();
global.appRoot = path.resolve(__dirname);

app.use(express.json());

const allowCors = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // colocar os dominios permitidos | ex: 127.0.0.1:3000

    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, X-Access-Token, X-Key"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET, PUT, POST, DELETE, OPTIONS, PATCH"
    );

    res.header("Access-Control-Allow-Credentials", "false");

    next();
};

app.use(allowCors);

app.use("/", require("./route/helloRoute.js"));
app.use("/", require("./route/empresaRoute.js"));
app.use("/", require("./route/localRoute.js"));
app.use("/", require("./route/usuarioRoute.js"));
app.use("/", require("./route/grupousuarioRoute.js"));
app.use("/", require("./route/principalRoute.js"));
app.use("/", require("./route/produtoRoute.js"));
app.use("/", require("./route/grupoRoute.js"));
app.use("/", require("./route/centrocustoRoute.js"));
app.use("/", require("./route/fornecedorRoute.js"));
app.use("/", require("./route/empresaRoute.js"));
app.use("/", require("./route/grupoRoute.js"));
app.use("/", require("./route/centrocustoRoute.js"));
app.use("/", require("./route/imobilizadoRoute.js"));
app.use("/", require("./route/imobilizadoinventarioRoute.js"));
app.use("/", require("./route/nfeRoute.js"));
app.use("/", require("./route/valorRoute.js"));
app.use("/", require("./route/inventarioRoute.js"));
app.use("/", require("./route/usuarioinventarioRoute.js"));
app.use("/", require("./route/usuarioinventarioRoute.js"));
app.use("/", require("./route/lancamentoRoute.js"));
app.use("/", require("./route/parametroRoute.js"));
app.use("/", require("./route/custom/parametroRoute.js"));
app.use("/", require("./route/padraoRoute.js"));
app.use("/", require("./route/LoadFileRouter.js"));
app.use("/", require("./route/fotoRoute.js"));
app.use("/", require("./route/correcaoRoute.js"));
app.use("/", require("./route/googleDriveV4Route.js"));
//app.use("/", require("./route/diretorioRoute.js"));
app.use("/", require("./route/sendMailRoute.js"));
app.use("/", require("./route/googledriveinformationRoute.js"));
app.use("/", require("./route/googleRoute.js"));
app.use("/", require("./route/fileRoute.js"));
app.use("/", require("./route/padrao_cabRoute.js"));
app.use("/", require("./route/padrao_caracteristicaRoute.js"));
app.use("/", require("./route/padrao_sugestaoRoute.js"));
app.use("/", require("./route/deparaRoute.js"));
app.use("/", require("./route/realocadoRoute.js"));



app.listen(PORT, () => {
    console.log(`Servidor No Ar. Porta ${PORT}`);
});

//atualizando a key

refresh();

async function refresh() {
    let arquivo = "";
    //google drive falconi
    //Buscando key google

    const param = await parametroSrv.getParametro(1, "key", "googledrive", 999);
   
    if (param == null) {
        console.log("Não Foi Encontrada Chave GOOGLE DRIVE");
        return ;
    }
    if (PORT == 3000) {
        arquivo =
            "C:/Repositorios/Simionato/ativo web/keys/googlekey.json";
    } else {
        arquivo = "keys/googlekey.json";
    }

    try {
        var writeStream = fs.createWriteStream(arquivo);
        writeStream.write(param.parametro);
        writeStream.end();
        console.log("Chave Atualizada Com Sucesso!");
    } catch (error) {
        console.log(`Erro Na Gravação googlekey, No Servidor ${error}`);
    }
 
    //google drive simionato
    //Buscando key google
    const param2 = await parametroSrv.getParametro(
        1,
        "key-000001-000014-000010",
        "googledrive",
        999
    );
    if (param2 == null) {
        console.log("Não Foi Encontrada Chave GOOGLE DRIVE-SIMONATO");
        return;
    }
    if (PORT == 3000) {
        arquivo =
            "C:/Repositorios/Simionato/ativo web/keys/google-simionato-000001-000014-000010-key.json";
    } else {
        arquivo = "keys/google-simionato-000001-000014-000010-key.json";
    }

    try {
        var writeStream = fs.createWriteStream(arquivo);
        writeStream.write(param2.parametro);
        writeStream.end();
        console.log("Chave Atualizada Com Sucesso Simionato!");
    } catch (error) {
        console.log(`Erro Na Gravação googlekey SIMIONATO, No Servidor ${error}`);
    }

    //google drive intelli-simionato
    //Buscando key google
    const param3 = await parametroSrv.getParametro(
        1,
        "key-intelli",
        "googledrive",
        999
    );
    if (param3 == null) {
        console.log("Não Foi Encontrada Chave GOOGLE DRIVE-INTELLI-SIMONATO");
        return;
    }
    if (PORT == 3000) {
        arquivo =
            "C:/Repositorios/Simionato/ativo web/keys/intelli-simionato.json";
    } else {
        arquivo = "keys/intelli-simionato.json";
    }

    try {
        var writeStream = fs.createWriteStream(arquivo);
        writeStream.write(param3.parametro);
        writeStream.end();
        console.log("Chave Atualizada Com Sucesso iNTELLI-Simionato!");
    } catch (error) {
        console.log(
            `Erro Na Gravação googlekey INTELLI-SIMIONATO, No Servidor ${error}`
        );
    }
}