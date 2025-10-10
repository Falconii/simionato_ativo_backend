const fs = require("fs");
const erroDB = require('../util/userfunctiondb');
const { google } = require("googleapis");
const funcoes       = require("../util/googleFuncoes");   // autenticação, upload, etc.
const inventarioSrv = require("../service/inventarioService");
const fotoSrv = require("../service/fotoService");
//const { file } = require("googleapis/build/src/apis/file");
//const { param } = require("../route/googleRoute");


const PORT = process.env.PORT || 3000;

async function atualizaFileNameDB_GD(lsFotos){


    const params          = await funcoes.loadCredencials(1);

    let  driveService;

    for (const foto of lsFotos) {


        if (foto.id_pasta.trim() == '1Oc4S6bEQy_TPPPSsxzl1gYkOs8wvwuWq') { //google falconi

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
    
            driveService = google.drive({
                version: "v3",
                auth,
            });

        } else {
    
            const oauth2Client    = funcoes.getoauth2Client(params);
        
            driveService    = google.drive({ version: "v3", auth: oauth2Client });
    
        }

        try {

                
              const res = await funcoes.renameFile(driveService,foto.id_file,foto.file_name);

                

        } catch(error){

                 throw error

        }
         

    }

    return `Total de Fotos Processadas: ${lsFotos.length}`;

}
/*
async function processaUploadFotoDisp(req) {
  console.log("📥 [processaUploadFoto] Iniciando processamento...");

  // Extrai dados
  const {
    id_empresa, id_local, id_inventario, id_imobilizado, id_pasta,
    id_file, id_usuario, data, destaque, obs, localizacao, file_name
  } = req.body;
  const file_name_foto_upload = req.file.originalname;
  fotoSaved = null;


  // Autenticação Google
  const params = await funcoes.loadCredencials(id_empresa);
  const oauth2Client = funcoes.getoauth2Client(params);
  const driveService = google.drive({ version: "v3", auth: oauth2Client });

  // Inventário
  const inventario = await inventarioSrv.getInventario(id_empresa, id_local, id_inventario);
  const folder_id = inventario.folder_id;

  // Verifica se foto já existe
  let foto_antiga = await fotoSrv.getFoto(id_empresa, id_local, id_inventario, id_imobilizado, id_pasta, id_file, file_name);
  if (foto_antiga !== null){

     await fotoSrv.deleteFoto(id_empresa,id_local,id_inventario,id_imobilizado,id_pasta,id_file,file_name); 

     fotoSaved = foto_antiga;

  } else {

      throw new erroDB.UserException('Regra de negócio', [{ tabela: 'UPLOAD FOTO DO DISPOSITIVO', message: `Não Existe Registro Temporário De Foto Do Dispositivo` }]);

  }
  // Verifica e exclui arquivo anterior do Drive
  let existeDrive = false;
  if (id_file && id_file.trim() !== "") {
    try {
      const checkFile = await funcoes.existFile(driveService, id_file);
      existeDrive = checkFile.result;
    } catch (err) {
      existeDrive = false;
    }

    if (existeDrive) {
      await funcoes.deleteFile(driveService, id_file);
      console.log("🗑️ Arquivo antigo do Drive excluído");
    }
  }
  // Upload do novo arquivo
  const saved = await funcoes.saveFile(driveService,file_name_foto_upload, file_name, folder_id);

  foto_antiga.id_file = saved.fileId;
  foto_antiga.file_name = file_name;
  foto_antiga.id_pasta = folder_id;
  foto_antiga.localizacao = 'N';
  
  fotoSaved = await fotoSrv.insertFoto(foto_antiga);

   try {
    fs.unlinkSync(`./fotos/${file_name_foto_upload}`);
  } catch (err) {
    console.error("⚠️ Erro ao deletar arquivo local:", err);
  }
  


  return fotoSaved;
}


async function processaUploadFotoWeb(req) {
  console.log("📥 [processaUploadFoto] Iniciando processamento...");

  // Extrai dados
  const {
    id_empresa, id_local, id_inventario, id_imobilizado, id_pasta,
    id_file, id_usuario, data, destaque, obs, localizacao, file_name
  } = req.body;
  const file_name_foto_upload = req.file.originalname;
  fotoSaved = null;


  // Autenticação Google
  const params = await funcoes.loadCredencials(id_empresa);
  const oauth2Client = funcoes.getoauth2Client(params);
  const driveService = google.drive({ version: "v3", auth: oauth2Client });

  // Inventário
  const inventario = await inventarioSrv.getInventario(id_empresa, id_local, id_inventario);
  const folder_id = inventario.folder_id;

  // Monta Objeto Foto
  let foto = {
      "id_empresa" 			 	 : id_empresa, 
      "id_local" 			 		 : id_local,
      "id_inventario" 		 : id_inventario,
      "id_imobilizado" 		 : id_imobilizado,
      "id_pasta" 			 		 : id_pasta, 
      "id_file" 			 		 : id_file,
      "file_name" 			 	 : file_name,
      "file_name_original" : file_name,
      "id_usuario" 			 	 : id_usuario,
      "data" 				 		   : data,
      "destaque" 			 		 : destaque,
      "obs" 				 		   : obs,
      "localizacao"		     : localizacao,
      "user_insert" 		 	 : id_usuario, 
      "user_update"		 		 : 0
  }

  // Verifica e exclui arquivo anterior do Drive
  let existeDrive = false;
  if (id_file && id_file.trim() !== "") {
    try {
      const checkFile = await funcoes.existFile(driveService, id_file);
      existeDrive = checkFile.result;
    } catch (err) {
      existeDrive = false;
    }

    if (existeDrive) {
      await funcoes.deleteFile(driveService, id_file);
      console.log("🗑️ Arquivo antigo do Drive excluído");
    }
  }
  // Upload do novo arquivo
  const saved = await funcoes.saveFile(driveService,file_name_foto_upload, file_name, folder_id);
  foto.id_file = saved.fileId;
  foto.file_name = file_name;
  foto.id_pasta = folder_id;
  foto.localizacao = 'N';
  

  console.log("-->",foto)

  fotoSaved = await fotoSrv.insertFoto(foto);

   try {
    fs.unlinkSync(`./fotos/${file_name_foto_upload}`);
  } catch (err) {
    console.error("⚠️ Erro ao deletar arquivo local:", err);
  }
  
  return fotoSaved;
}
/* Esta funcao sincroniza o file_name das fotos do DB com as fotos do Google Drive
   para que o app mobile consiga baixar as fotos corretamente.
   */

async function sincronizarFileName(req){
    try {
        const { id_empresa, id_local, id_inventario,id_pasta,id_usuario,pagina } = req.body;

        let  params = {
                        "id_empresa":id_empresa, 
                        "id_local":id_local , 
                        "id_inventario":id_inventario, 
                        "id_imobilizado":0, 
                        "id_pasta":id_pasta, 
                        "id_file":"", 
                        "file_name":"", 
                        "destaque":"", 
                        "pagina":0, 
                        "tamPagina":100, 
                        "contador":"S", 
                        "orderby":"", 
                        "sharp":false
        }
        
        
       const total_registros = await fotoSrv.getFotos(params);

       let totalPaginas = Math.ceil(total_registros.total / params.tamPagina);

        console.log("Total de Fotos  =>",total_registros.total," em ",totalPaginas," páginas  ");

        params.pagina = pagina;
        params.tamPagina = 100;
        params.contador = "N";

        console.log(`Total de Fotos a Processar => ${total_registros.total}`);
     

         const fotos = await fotoSrv.getFotos(params);

        //const fotos = await fotoSrv.getFotosTempo();

        if (fotos?.length > 0) {
            for (const foto of fotos) {
                console.log("foto =>",foto.file_name);  
              }
        }

       const message = await atualizaFileNameDB_GD(fotos);

        console.log(message)

        return fotos.length;
    } 
    catch (error) {  
        throw error;
    }
  }

module.exports = {
  //processaUploadFotoDisp,processaUploadFotoWeb,sincronizarFileName
  sincronizarFileName
}