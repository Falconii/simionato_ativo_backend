const credencialSrv = require ("../service/credencialService");
const { google } = require("googleapis");
const PORT = process.env.PORT || 3000;
const path = require("path");
const sharp = require('sharp');
const fs = require("fs");


// Função para redimensionar a imagem usando percentuais
async function resizeImage(inputPath, outputPath, widthPercent, heightPercent) {
    try {
      console.log(inputPath);
      // Obter metadados da imagem original
      const metadata = await sharp(inputPath).metadata();
      
      // Calcular novas dimensões
      const newWidth = Math.round(metadata.width * (widthPercent / 100));
      const newHeight = Math.round(metadata.height * (heightPercent / 100));
      
      // Redimensionar a imagem
      await sharp(inputPath)
        .resize(newWidth, newHeight)
        .toFile(outputPath);
      
      console.log(`Imagem redimensionada para ${newWidth}x${newHeight} e salva em ${outputPath}`);
    } catch (err) {
      console.error('Erro ao redimensionar a imagem:', err);
    }
  }

async function resizeImageFromBuffer(buffer, outputPath, widthPercent, heightPercent) {
  try {
    // Obter metadados da imagem original
    const metadata = await sharp(buffer).metadata();
    
    // Calcular novas dimensões
    const newWidth = Math.round(metadata.width * (widthPercent / 100));
    const newHeight = Math.round(metadata.height * (heightPercent / 100));
    
    var relativeWith   = newWidth ;
    var relativeHeight = newHeight ;

    if ((metadata.orientation == 5) || (metadata.orientation == 6)){
        relativeWith   = newHeight;
        relativeHeight = newWidth;
    }
    
    // Redimensionar a imagem
    await sharp(buffer)
    .rotate({
      1: 0,
      2: 0,
      3: 180,
      4: 180,
      5: 90,
      6: 90,
      7: -90,
      8: -90
    }[metadata.orientation] || 0)
      .resize(relativeWith, relativeHeight)
      .toFile(outputPath);
    
    console.log(`Imagem redimensionada para ${relativeWith}x${relativeHeight} e salva em ${outputPath}`);
  } catch (err) {
    console.error('Erro ao redimensionar a imagem:', err);
  }
}

async function resizeImagePixel(buffer, width, height) {
    try {
      // Obter metadados da imagem original
      const metadata = await sharp(buffer).metadata();
      
      // Redimensionar a imagem
      return await sharp(buffer)
        .resize(width, height)
        .toBuffer();
      
    } catch (err) {
      console.error('Erro ao redimensionar a imagem:', err);
    }
}


async function resizeImageToBuffer(buffer, widthPercent, heightPercent) {
    try {
      // Obter metadados da imagem original
      const metadata = await sharp(buffer).metadata();
      
      // Calcular novas dimensões
      const newWidth = Math.round(metadata.width * (widthPercent / 100));
      const newHeight = Math.round(metadata.height * (heightPercent / 100));
      
      var relativeWith   = newWidth ;
      var relativeHeight = newHeight ;

      if ((metadata.orientation == 5) || (metadata.orientation == 6)){
         relativeWith   = newHeight;
         relativeHeight = newWidth;
      }
      
      // Redimensionar a imagem
      return  await sharp(buffer)
      .rotate({
        1: 0,
        2: 0,
        3: 180,
        4: 180,
        5: 90,
        6: 90,
        7: -90,
        8: -90
      }[metadata.orientation] || 0)
        .resize(relativeWith, relativeHeight)
        .toBuffer();
      
      console.log(`Imagem redimensionada para ${relativeWith}x${relativeHeight} e salva em ${outputPath}`);
    } catch (err) {
      console.error('Erro ao redimensionar a imagem:', err);
    }
}

async function listFiles(driveService,folderId,tamPage,onePage) {
  try {
    let retorno = [];
    let tamMinino = 1363149;
    let pageToken = null;
    let totalFiles = 0;
   
    do {
        const res = await driveService.files.list({
          q: `'${folderId}' in parents `,
          spaces: 'drive',
          pageSize: tamPage,
          fields: 'nextPageToken, files(id, name, size, modifiedTime)',
          pageToken: pageToken
        });
        const files = res.data.files;
        totalFiles += files.length;
      files.forEach((file) => {
            let tam = "Não Definido";
            let size = 0;
            let unid = "";
            if (file.size < (1014*1024)) {
                size = (file.size / 1024).toFixed(2);
                unid = "KB";
            } else {
                size = (file.size / (1024 * 1024)).toFixed(2);
                unid = "MB";
            }
            tam =  `${size} ${unid}` ;
            const dir = {"id_file": file.id , "name_file" : file.name , "size" : tam , "data" : file.modifiedTime};
            retorno.push(dir);
          });
          pageToken = res.data.nextPageToken;
      }  while (onePage ? false : pageToken);
      console.log(`Total De Arquivos: ${totalFiles}`);
      return retorno;
  } catch (err) {
    console.error('Erro ao listar arquivos:', err);
  }
}

exports.checkStorageQuota = async function(driveService) { 
  try {
      const about = await driveService.about.get({
          fields: "storageQuota",
      });

      const toGB = (bytes) => (bytes / (1024 ** 3)).toFixed(2); // GB
      const toMB = (bytes) => (bytes / (1024 ** 2)).toFixed(2); // MB
      const toKB = (bytes) => (bytes /  1024 ).toFixed(2);      
  
      const totalStorage     =  toGB(about.data.storageQuota.limit);  // GB
      const usedStorage      =  toMB(about.data.storageQuota.usage);   // MB
      const remainingStorage =  toKB(about.data.storageQuota.limit-about.data.storageQuota.usage); // GB
  

      return {"origem" : "GOOGLE OAUTH 2.0", "free":remainingStorage, "usado" :usedStorage , "total" : totalStorage };

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


    //buscar informações
    const response = await driveService.files.get({
        fileId: fileId,
        fields: 'name, size'
    });

    const fileName = response.data.name;
    const fileSize = response.data.size;

    console.log(fileName,fileSize);
   
    const file = await driveService.files.get({
      fileId: fileId,
      alt: 'media',
    });
    console.log("file.config.data",file.config.data);

    const bufferSymbol = Object.getOwnPropertySymbols(file.data).find(symbol => symbol.toString() === 'Symbol(buffer)');
    const buffer = file.data[bufferSymbol];

    const metadata = await sharp(buffer).metadata();

    console.log(metadata.orientation);

   // Escrever o buffer em um arquivo
    fs.writeFile(`./fotos/${fileName}`, buffer, (err) => {
        if (err) {
            console.error('Erro ao salvar o arquivo:', err);
        } else {
            console.log('Arquivo salvo com sucesso!');
        }
    }); 

   //resize a foto com 50%

    await resizeImageFromBuffer(buffer, `./fotos/foto_menor.jpg`, 40, 40);

    return ({"message" : "Foto Redimensionada!"});

  } catch (err) {
    throw err;
  }
}

exports.showPicture = async function(driveService,fileId){
  
  try {
      
    const file = await driveService.files.get({
      fileId: fileId,
      alt: 'media',
    });

    const bufferSymbol = Object.getOwnPropertySymbols(file.data).find(symbol => symbol.toString() === 'Symbol(buffer)');
    const buffer = file.data[bufferSymbol];
      
    return await resizeImageToBuffer(buffer, 30, 30);

    //return await resizeImagePixel(buffer,70,70);

  } catch (err) {
    throw err;
  }
  

  /*
    Rotinas para compactar fotos no inventário Na mesma Pasta
  */


}

exports.diretorio = async function(driveService,folderId){

  try {
      
    const dir = await listFiles(driveService,folderId,50,false)

    return dir;

  } catch(error){
      throw error; 
  }

}

exports.changeFileNameGoogleDrive = async function(driveService,foto){
let arquivo = "";
try {

    try {
 
        const body = {
            'name': foto.file_name
        }
        
        const response = await driveService.files.update({
            fileId: foto.id_pasta,
            resource: body,
          });

          
        console.log("Retorno Do Google: ", response);

    } catch(err){
        throw err;
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
};


