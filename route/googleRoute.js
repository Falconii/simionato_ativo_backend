const db = require("../infra/database");
const express = require("express");
const router = express.Router();
const fotoSrv = require("../service/fotoService");
const credencialSrv = require("../service/credencialService");
const uploadFotosV2 = require("../config/uploadFotosV2");
const inventarioSrv = require("../service/inventarioService")
const funcoes       = require("../util/googleFuncoes");
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

router.get("/api/saveImage", async (req, res) => {
    try {

          const credencial = await credencialSrv.getCredencial(1);


          const client_id      = credencial.client_id;
          const client_secret  = credencial.client_secret;
          const client_uri     = credencial.redirect_uri;
          const tokens         = credencial.tokens;

          const oauth2Client = new google.auth.OAuth2(
              client_id,
              client_secret,
              client_uri
              ); 
    
          oauth2Client.setCredentials(JSON.parse(tokens));


        const drive = google.drive({ version: "v3", auth: oauth2Client });
        const folderId = "1i5exZMWijaDqRkF3diGH5MtgyiLePnS5";
        const response = await drive.files.create({
            requestBody: {
                name: "uploaded_from_node.jpg", 
                mimeType: "image/jpeg", 
                parents: [folderId], 
            },
            media: {
                mimeType: "image/jpeg",
                body: fs.createReadStream("fotos/01_000014_000010_006000_A-626CP2 - GABI (9).JPG"), 
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(409).json({'message':error});
    }
});

router.get("/api/freedisco", async (req, res) => {
        try {

          const params       = await funcoes.loadCredencials(1);

          const oauth2Client = funcoes.getoauth2Client(params);

          const driveService = google.drive({ version: "v3", auth: oauth2Client });

          const result       = await funcoes.checkStorageQuota(driveService);

          res.status(200).json(result);

        } catch (error) {
            res.status(409).json({"message":error});
        }
});

router.get("/api/existefile/:file_id", async (req, res) => {
    try {

      const {file_id}    = req.params;

      const params       = await funcoes.loadCredencials(1);

      const oauth2Client = funcoes.getoauth2Client(params);

      const driveService = google.drive({ version: "v3", auth: oauth2Client });

      const result       = await funcoes.existFile(driveService,file_id);

      res.status(200).json(result);

    } catch (error) {
        res.status(409).json({"message":error});
    }
});

router.post(
  "/api/uploadfotov5",
  uploadFotosV2.single("file"),
  async function(req, res) {

    try {
      console.log("Entrei Na Rota uploadfoto V5!");

      const {id_empresa}			= req.body;
      const {id_local} 				= req.body;
      const {id_inventario}  	    = req.body;
      const {id_imobilizado}	    = req.body;
      const {id_pasta} 				= req.body;
      const {id_file} 				= req.body;
      const {id_usuario}			= req.body;
      const {data} 		    	    = req.body;
      const {destaque} 				= req.body;
      const {obs} 					= req.body;
      const file_name               = `${req.file.originalname}`;
      const old_name                = `${req.body.old_name}`;
      let existeDrive               = false;
      let arquivo                   = "";
      let acao                      = "";


      const params          = await funcoes.loadCredencials(1);

      const oauth2Client    = funcoes.getoauth2Client(params);

      const driveService    = google.drive({ version: "v3", auth: oauth2Client });

      const inventario      = await inventarioSrv.getInventario(id_empresa,id_local,id_inventario);

      
      console.log("Folder => ",inventario.folder_id);

      console.log(
          "id_empresa",
          id_empresa,
          "\nid_local",
          id_local,
          "\nid_inventario",
          id_inventario,
          "\nid_imobilizado",
          id_imobilizado,
          "\ndata",
          data,
          "\ndestaque",
          destaque,
          "\nobs",
          obs,
          "\nid_pasta",
          id_pasta,
          "\nid_file",
          id_file,
          "\nid_usuario",
          id_usuario,
          "\nfile_name",
          file_name,
          "\nold_name",
          old_name
      );

      let foto = await fotoSrv.getFoto(
          id_empresa,
          id_local,
          id_inventario,
          id_imobilizado,
          id_pasta,
          id_file,
          old_name
      );

      console.log("FOTO",foto);

      
      acao = "inclusao";

      if (foto == null) {
          foto = {
              id_empresa: id_empresa,
              id_local: id_local,
              id_inventario: id_inventario,
              id_imobilizado: id_imobilizado,
              id_pasta: inventario.folder_id,
              id_file: "",
              file_name: file_name,
              file_name_original: req.file.originalname,
              id_usuario: id_usuario,
              data: data,
              destaque: destaque,
              obs: obs,
              user_insert: id_usuario,
              user_update: 0,
          };
        }
        else {
          const deleteFoto = await fotoSrv.deleteFoto(
            id_empresa,
            id_local,
            id_inventario,
            id_imobilizado,
            id_pasta,
            id_file,
            old_name);
          foto.id_pasta          =  inventario.folder_id,
          foto.id_file           = "",
          foto.file_name         = file_name,
          foto.file_name_original= req.file.originalname,
          foto.id_usuario        = id_usuario;
          foto.data              = data;
          foto.destaque          = destaque;
          foto.obs               = obs;
          foto.id_usuario        = id_usuario;
          foto.user_update       = id_usuario;
      }

     console.log("ChegueiGUEI AQUI",id_file,id_file.trim().length);

     if (id_file && (id_file.trim() !== "")){

        console.log("VOU VERFIFICAR ARQUIVO");

        try {
         const checkFile = await funcoes.existFile(driveService,id_file)
            existeDrive = checkFile.result;
        } catch(err){
            existeDrive = false;
        }
      } 

      if (existeDrive){

         deleted = await funcoes.deleteFile(driveService,id_file);

         console.log("Arquivo Excluido !!");

      }

      console.log("passei aqui 999");

      const saved = await funcoes.saveFile(driveService,file_name,inventario.folder_id)

      foto.id_pasta = inventario.folder_id
      foto.id_file  = saved.fileId;

      let fotoSaved = null;

      if (acao == "inclusao") {

        fotoSaved = await fotoSrv.insertFoto(foto);

      } 

      console.log("fotoSaved",fotoSaved);

      res.status(200).json({ code: "200", message: "Foto Registrada", fileName:fotoSaved.file_name});

      
       try {
            fs.unlinkSync(`./fotos/${file_name}`);
        } catch (err) {
            console.error(err);
        }  

    } catch (err) {
      console.log(err);
          if (err.name == "MyExceptionDB") {
              res.status(409).json(err);
          } else {
              res
                  .status(500)
                  .json({ erro: "BAK-END", tabela: "fotos", message: err.message });
          }
    }
  }
);

router.post("/api/deleteuploadfotoV5", async function(req, res) {
  let arquivo = "";
  try {
      const foto = req.body;
    

      try{

        if (foto.id_pasta.trim() == '1Oc4S6bEQy_TPPPSsxzl1gYkOs8wvwuWq'){ //google falconi

          funcoes.deleteFileOld(foto);

        } else {


              const params          = await funcoes.loadCredencials(1);

              const oauth2Client    = funcoes.getoauth2Client(params);
        
              const driveService    = google.drive({ version: "v3", auth: oauth2Client });
        
              const inventario      = await inventarioSrv.getInventario(foto.id_empresa,foto.id_local,foto.id_inventario);
              
              funcoes.deleteFile(driveService,foto.id_file);

        }

      } catch(error){

        throw error; 

      }

      //deleta do banco
      const registro = await fotoSrv.deleteFoto(
          foto.id_empresa,
          foto.id_local,
          foto.id_inventario,
          foto.id_imobilizado,
          foto.id_pasta,
          foto.id_file,
          foto.file_name
      );
      if (registro == null) {
          res.status(200).json({
              message: "Foto Excluída Com Sucesso!",
          });
      }
  } catch (err) {
      if (err.name == "MyExceptionDB") {
          res.status(409).json(err);
      } else {
          res
              .status(500)
              .json({ erro: "BAK-END", tabela: "Foto", message: err.message });
      }
  }
});

router.get(
  "/api/downloadv5/:id_file",async function(req, res) {

    try {
      console.log("Entrei Na Rota downLoadfoto!");
      
      const {id_file} 				    = req.params;

      const params          = await funcoes.loadCredencials(1);

      const oauth2Client    = funcoes.getoauth2Client(params);

      const driveService    = google.drive({ version: "v3", auth: oauth2Client });
     
     const result        = await funcoes.downloadFile(driveService,id_file);

     res.status(200).json(result);

    } catch (err) {
          if (err.name == "MyExceptionDB") {
              res.status(409).json(err);
          } else {
              res
                  .status(500)
                  .json({ erro: "BAK-END", tabela: "fotos", message: err.message });
          }
    }
  }
);


router.get(
  "/api/showfotov5/:id_file",async function(req, res) {

    try {
      console.log("Entrei Na Rota downLoadfoto!");
      
      const {id_file} 				    = req.params;

      const params          = await funcoes.loadCredencials(1);

      const oauth2Client    = funcoes.getoauth2Client(params);

      const driveService    = google.drive({ version: "v3", auth: oauth2Client });
     
     const image         = await funcoes.showPicture(driveService,id_file);

     if (!image || image.length === 0) {
      return res.status(404).send('Imagem não encontrada');
     } else {
      res.set('Content-Type', 'image/jpeg');
      res.set('Content-Disposition', 'inline');
      res.status(200).send(image);
    }
    } catch (err) {
          if (err.name == "MyExceptionDB") {
              res.status(409).json(err);
          } else {
              res
                  .status(500)
                  .json({ erro: "BAK-END", tabela: "fotos", message: err.message });
          }
    }
  }
);
 

router.get(
  "/api/diretorio",async function(req, res) {

    try {
      console.log("Entrei Na Rota diretorio!");
      
      const params          = await funcoes.loadCredencials(1);

      const oauth2Client    = funcoes.getoauth2Client(params);

      const driveService    = google.drive({ version: "v3", auth: oauth2Client });

      const folder_id       = "1eQuwNcfTmpYUWUIvlGBouodico8WrjoD";
     
      const response        = await funcoes.diretorio(driveService,folder_id);

      res.status(200).json(response);

    } catch (err) {
          if (err.name == "MyExceptionDB") {
              res.status(409).json(err);
          } else {
              res
                  .status(500)
                  .json({ erro: "BAK-END", tabela: "fotos", message: err.message });
          }
    }
  }
);
 

module.exports = router;