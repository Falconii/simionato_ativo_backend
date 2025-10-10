const fs = require("fs");
const erroDB = require('../util/userfunctiondb');
const { google } = require("googleapis");
const funcoes       = require("../util/googleFuncoes");   // autenticação, upload, etc.
const inventarioSrv = require("../service/inventarioService");
const fotoSrv = require("../service/fotoService");

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
