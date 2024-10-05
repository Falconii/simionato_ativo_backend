const credencialSrv = require ("../service/credencialService");
const { google } = require("googleapis");
const PORT = process.env.PORT || 3000;
const path = require("path");
const fs = require("fs");

// Verifica o espaço de armazenamento disponível no Google Drive
exports.checkStorageQuota = async function(driveService) { 
    try {
        const about = await driveService.about.get({
            fields: "storageQuota",
        });
        const totalStorage = (about.data.storageQuota.limit / 1024 ** 3).toFixed(2); //gb
        const usedStorage = (about.data.storageQuota.usage / 1024 ** 3).toFixed(2); //gb
        const remainingStorage = (totalStorage - usedStorage).toFixed(2); //gb

        return {"free":remainingStorage, "usado" :usedStorage , "total" : totalStorage };

    } catch (error) {
        throw error; 
    }
}

exports.loadCredencials = async function(id) { 
    try {
        const credencial = await credencialSrv.getCredencial(1);

          const client_id      = credencial.client_id;
          const client_secret  = credencial.client_secret;
          const client_uri     = credencial.redirect_uri;
          const tokens         = credencial.tokens;

         return {"client_id":client_id, "client_secret" :client_secret , "client_uri" : client_uri,"tokens" :  tokens };
         
    } catch (error) {
        throw error; 
    }
}


exports.getoauth2Client = function(params){

    try {
        const oauth2Client = new google.auth.OAuth2(
            params.client_id,
            params.client_secret,
            params.client_uri
            ); 

        oauth2Client.setCredentials(JSON.parse(params.tokens));

        return oauth2Client;

    } catch(error){
        throw error; 
    }

}

exports.saveFile = async function(driveService,file_name,folderId){

    try {
       const response = await driveService.files.create({
            requestBody: {
                name: file_name, 
                mimeType: "image/jpeg", 
                parents: [folderId], 
            },
            media: {
                mimeType: "image/jpeg",
                body: fs.createReadStream(`./fotos/${file_name}`), 
            },
        });

        return {"message":"Imagem Salva Com Sucesso!", "fileId":response.data.id};

    } catch(error){
        throw error; 
    }

}


exports.deleteFile = async function(driveService,fileId){

    try {
        

        const response = await driveService.files.delete({
            fileId: fileId,
        });


        return {"result": true};

    } catch(error){
        throw error; 
    }

}


exports.deleteFileOld = async function(foto){
    try {

        let arquivo = "";

        if (PORT == 3000) {
            arquivo =
                "C:/Repositorios/Simionato/ativo web/keys/googlekey.json";
        } else {
            arquivo = "./keys/googlekey.json";
        }

        const auth = new google.auth.GoogleAuth({
            keyFile: arquivo,
            scopes: ["https://www.googleapis.com/auth/drive"],
        });

        const driveService = google.drive({
            version: "v3",
            auth,
        });

        let existe = false;

        try {
            // Verifincando se existe ok
            const responseGet = await driveService.files.get({
                fileId: foto.id_file,
            });
            console.log("Arquivo Existe No GooGle Drive");
            existe = true;
        } catch (error) {
            console.log("Arquivo Não Existe No GooGle Drive");
            existe = false;
            console.log(error);
        }

        if (existe) {
            //Excluindo
            const responseDelete = await driveService.files.delete({
                fileId: foto.id_file,
            });

            console.log("Arquivo Excluido Com Sucesso!!!");
        }

        return {"result": true};

    } catch (error) {
        throw error; 
    }
 
}


exports.existFile = async function(driveService,fileId){

    try {
        
        let existe = false;

        const response = await driveService.files.get({
            fileId: fileId
        });

        existe = true;

        return {"result": existe,"data":response.data};

    } catch(error){
        throw error; 
    }

}


exports.renameFile = async function(driveService,fileId,newName){
    
    const body = {
        'name': newName
    }
    
    const response = await driveService.files.update({
        fileId: fileId,
        resource: body,
      });

    console.log("Retorno Do Google: ", response);

    return ({"message" : "Nome Alterado Com Sucesso!"});
}


exports.downloadFile = async function(driveService,fileId){
    
  try {

    const media = {
        'name': '.fotos/olha eu aqui.jpeg'
    }

    const file = await driveService.files.get({
      fileId: fileId,
      alt: 'media',
    });
    console.log("file.config.data",file.data);

    const bufferSymbol = Object.getOwnPropertySymbols(file.data).find(symbol => symbol.toString() === 'Symbol(buffer)');
    const buffer = file.data[bufferSymbol];
    console.log(buffer);

    return buffer;
  } catch (err) {
    throw err;
  }

  return ({"message" : "Nome Alterado Com Sucesso!"});
}