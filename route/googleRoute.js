const db = require("../infra/database");
const express = require("express");
const router = express.Router();
const fotoSrv = require("../service/fotoService");
const localSrv = require("../service/localService");
const empresaSrv = require("../service/empresaService");
const credencialSrv = require("../service/credencialService");
const uploadFotosV2 = require("../config/uploadFotosV2");
const inventarioSrv = require("../service/inventarioService");
const fotodriveSrv  = require("../service/fotodriveService");
const funcoes       = require("../util/googleFuncoes");
const fotoController = require("../controllers/fotocontroller.js");
const erroDB = require('../util/userfunctiondb');
const response = require("../util/respostaPadrao");
const fs = require("fs");
const PORT = process.env.PORT || 3000;
const { google } = require("googleapis");


router.get("/auth/google", async  (req, res) => {

  const credencial = await credencialSrv.getCredencial(1);

  const client_id      = credencial.client_id;
  const client_secret  = credencial.client_secret;
  const client_uri     = credencial.redirect_uri;

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    client_uri
    ); 
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/drive"
      ],
      prompt : "select_account",
      include_granted_scopes : 'true'
    });
    res.redirect(url);
  });

router.get("/google/redirect", async (req, res) => {

  var url = "";
  const credencial = await credencialSrv.getCredencial(1);
  const client_id      = credencial.client_id;
  const client_secret  = credencial.client_secret;
  const client_uri     = credencial.redirect_uri;

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    client_uri
    ); 
    if (PORT == 3000) {
          url = "http://localhost:4200/";
    } else {
          url = "https://falconii.github.io/simionato_ativo_frontend/";
    }

    const html = `<html>
  <head>
    <style>
        body {
            height: 90%;
            width: 90%;
            align-content: center;
            margin: 0;
            font-family: Roboto, "Helvetica Neue", sans-serif;
        }
        h1,h2 {
            color: navy;
            text-align: center;
        }
        .container {
          font-size: small;
          align-content: center;
          width: 50%;
          height: 50%;
          margin: auto;
        }
        .btnStack {
            font-family: Oswald;
            background-color: orange;
            color: #000;
            text-decoration: none;
            display: inline-block;
            padding: 6px 12px;
            margin-bottom: 0;
            font-size: 14px;
            font-weight: normal;
            line-height: 1.428571429;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            cursor: pointer;
            border: 1px solid transparent;
            border-radius: 4px;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            -o-user-select: none;
            user-select: none;
          }
        a.btnStack:hover {
          background-color: #000;
          color: #fff;
        }
        .button-container-right {
          display: flex;
          margin-top: 25px;
          justify-content: right;
          height: min-content;
          width: 95%;
        }
        .box {
          margin-bottom: 20px;
          border: 2px solid black;
          box-shadow: 10px 10px 5px 6px gray;
        }

    </style>
</head>
  <body>
    <div class="container box">
        <h1>AUTORIZAÇÃO INSTALADA</h1>
        <H2>Feche A Pagina e Reabra A Aplicação</H2>
        <link href='https://fonts.googleapis.com/css?family=Oswald:400' rel='stylesheet' type='text/css'>
        <div class="button-container-right">
           <a href="${url}" class="btnStack">Voltar A Aplicação</b>.com</a>
        </div>
    </div>
  </body>
</html>
`

    const { code } = req.query;

    const { tokens } = await oauth2Client.getToken(code);

    

    oauth2Client.setCredentials(tokens);

    try {
        credencial.code = code.trim;
        credencial.tokens =  JSON.stringify(tokens);
        const cred = await credencialSrv.updateCredencial(credencial);
        res.status(200).send(html);
    } catch(erro)
    {
      res.status(200).json({ code: "200", message: erro });
    } 
    
});



module.exports = router;