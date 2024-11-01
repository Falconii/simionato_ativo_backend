const deparaSrv = require ("../service/deparaService");
const fotoSrv   = require("../service/fotoService");
const funcoes   = require("../util/googleFuncoes");

const { google } = require("googleapis");


async function atualizaFileName(lsFotos){


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


}

exports.testeChangeInventario = async function(id_empresa,id_local,id_inventario){

    var params = {
        id_empresa : id_empresa,
        id_local: id_local,
        id_inventario: id_inventario,
        status: 1
    }

    try {
        //status 1
        const _status1 = await deparaSrv.processarDePara(params);

        //status 2
        params.status = 2;
        const _status2 = await deparaSrv.processarDePara(params);

        //status 3
        params.status = 3;
        const status3 =  await deparaSrv.processarDePara(params);

        const params2 = {
            id_empresa : id_empresa,
            id_local: id_local,
            id_inventario: id_inventario,
            status: 3,
            de : 0,
            para: 0
        }

        lsDeparas = await deparaSrv.getDeparas(params2);

        if (lsDeparas != null){

            for (const depara of lsDeparas) {

                const param = 	{
                    "id_empresa":id_empresa, 
                    "id_local":id_local, 
                    "id_inventario":id_inventario, 
                    "id_imobilizado":depara.para, 
                    "id_pasta":"", 
                    "id_file":"", 
                    "file_name":"", 
                    "destaque":"N", 
                    "pagina":0, 
                    "tamPagina":50, 
                    "contador":"N", 
                    "orderby":"", 
                    "sharp":false 
                }
                const lsFotos =  await fotoSrv.getFotos(param)

                if (lsFotos != null){

                    const message = await atualizaFileName(lsFotos);

                    console.log(message)
                }


                depara.status = 4;
                depara.user_update = 16;

                const reg = await deparaSrv.updateDe_Para(depara);

            }

        }

        return {"message":"Processamento OK"};

    } catch( error){
        throw error;
    }
}