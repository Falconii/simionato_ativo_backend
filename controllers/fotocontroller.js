const fs = require("fs");
const erroDB = require('../util/userfunctiondb');
const { google } = require("googleapis");
const funcoes       = require("../util/googleFuncoes");   // autenticação, upload, etc.
const inventarioSrv = require("../service/inventarioService");
const lancamentoSrv = require("../service/lancamentoService");
const imobilizadoSrv = require("../service/imobilizadoService");
const imobilizadoinventarioSrv = require("../service/imobilizadoinventarioService");
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
    id_file, file_name,id_usuario, data, destaque, obs, localizacao
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

async function copiarArquivo(id_empresa,fileId, pastaDestinoId, novoNome) {
   // Autenticação Google
  try {
  const params = await funcoes.loadCredencials(id_empresa);
  const oauth2Client = funcoes.getoauth2Client(params);
  const driveService = google.drive({ version: "v3", auth: oauth2Client });
  console.log(`Iniciando cópia do arquivo ID: ${fileId} para a pasta ID: ${pastaDestinoId} com o nome: ${novoNome}`);

  // Verifica se já existe um arquivo com o mesmo nome na pasta destino
  const arquivosExistentes = await driveService.files.list({
    q: `'${pastaDestinoId}' in parents and name = '${novoNome}' and trashed = false`,
    fields: 'files(id, name)',
  });

 console.log('Verificando existência de arquivo com o mesmo nome na pasta destino...'); 

  if (arquivosExistentes.data.files.length > 0) {
    console.log(`Já existe um arquivo chamado "${novoNome}" na pasta destino. Nenhuma cópia foi feita.`);
    return;
  }
console.log('Não arquivo com o mesmo nome na pasta destino. Prosseguindo com a cópia...');
  // Copia o arquivo com novo nome
  const resposta = await driveService.files.copy({
    fileId,
    requestBody: {
      name: novoNome,
      parents: [pastaDestinoId],
    },
  });

  console.log('Arquivo copiado com sucesso:', resposta.data);
  return ;
} catch (error) {
      throw error;
}
}

//FUNÇÃO HARDCODE PARA SOLUÇÃO ESPECÍFICA 
function getAtivos421(){
   let retorno = [];
   let obj = null;
   const ativos = [4732,4773,4775,4776,4777,4783,4807,4808,4809,4820,4827,4828,4829,4837,4873,4874,4903,4916,4917,4969,4970,4973,4978,4979,4995,4996,4997,4998,5019,5033,5035,5055,5089,5091,5119,5134,5155,5200,5273,5462,5493,5495];
   /*
    const ativos = [--2957,2958,2959,2966,2967,3037,3187,3255,3383,3384,3385,3386,3399,3445,3446,3508,3539,3541,3561,3816,3820,3823,3826,3832,3833,3849,3850,3854,3855,3871,3872,3873,3874,3875,3876,3877,3878,3879,3880,3881,3882,3883,3884,3885,3886,3887,3888,3921,3962,3972,3980,3982,3983,
                    --3986,3987,3990,3994,3995,4025,4026,4027,4034,4035,4056,4075,4089,4091,4094,4114,4135,4141,4152,4171,4172,4173,4174, 4188,4192,4216,4217,4218,4219,4220,4221,4222,4223,4439,4440,4441,4442,4467,4490,4491,4535,4536,4545,4548,4554,4570,4576,4584,4585,4651,4652,4730,4731,
                    --4732,4773,4775,4776,4777,4783,4807,4808,4809,4820,4827,4828,4829,4837,4873,4874,4903,4916,4917,4969,4970,4973,4978,4979,4995,4996,4997,4998,5019,5033,5035,5055,5089,5091,5119,5134,5155,5200,5273,5462,5493,5495];
    */
    for (const id_imobilizado of ativos){   
        obj = {
                "id_empresa"             : 1,
              "id_filial_origem"        : 16,
              "id_inventario_origem"    : 12,
              "id_filial_destino"       : 14,
              "id_inventario_destino"   : 10,
              "id_imobilizado"          : id_imobilizado  
               };
        retorno.push(obj);
    }
    return retorno;
}

async function funcaoAjusta421(){

    console.log("Iniciando ajuste 421");
    const ativos = getAtivos421();

    for (const ativo of ativos) {
            console.log("Processando Ativo =>",ativo.id_imobilizado);
            const id_empresa       = ativo.id_empresa;
            const id_filial_origem = ativo.id_filial_origem;
            const id_inventario_origem = ativo.id_inventario_origem;
            const id_filial_destino = ativo.id_filial_destino;
            const id_inventario_destino = ativo.id_inventario_destino;
            const id_imobilizado = ativo.id_imobilizado;

            let lancamento_origem = await lancamentoSrv.getLancamento(id_empresa, id_filial_origem, id_inventario_origem,id_imobilizado);
        
            if (lancamento_origem == null) {
               continue;
            } 
            
        
        
            let lancamento_destino = await lancamentoSrv.getLancamento(id_empresa, id_filial_destino, id_inventario_destino,id_imobilizado);
        
            if (lancamento_destino == null) {
              console.log("Lançamento destino não existe, ignorando ativo =>",id_imobilizado);
              continue;
            } else {
                 //Deleta lançamento origem
              try { 
                await lancamentoSrv.deleteLancamento(lancamento_destino.id_empresa, lancamento_destino.id_filial, lancamento_destino.id_inventario,lancamento_destino.id_imobilizado);
              } catch (error) {
                console.error("Erro ao deletar lancamento de origem, ignorado");
              }
            }
            console.log("Processando Ativo =>",id_imobilizado);
            //ativos devem ser iguais
            if (lancamento_origem.id_imobilizado != lancamento_destino.id_imobilizado) {
              continue
            }
            
            //Atualiza lançamento destino
            lancamento_destino.id_imobilizado	=	lancamento_origem.id_imobilizado;
            lancamento_destino.id_usuario		=	lancamento_origem.id_usuario	;
            lancamento_destino.id_lanca			=	0		                        ;
            lancamento_destino.obs				  =	lancamento_origem.obs			;
            lancamento_destino.dtlanca			=	lancamento_origem.dtlanca		;
            lancamento_destino.estado			  =	lancamento_origem.estado		;
            lancamento_destino.new_codigo		=	lancamento_origem.new_codigo	;
            lancamento_destino.new_cc			  =	lancamento_origem.new_cc.replace("-","#");
            lancamento_destino.condicao			=	lancamento_origem.condicao		;
            lancamento_destino.book				  =	lancamento_origem.book			;
            lancamento_destino.user_insert		=	lancamento_origem.user_insert	;
            lancamento_destino.user_update		=	lancamento_origem.user_update	;
        
            //pesquisar fotos na origem e transferir para o destino */
            params = {
                      "id_empresa"    : lancamento_origem.id_empresa,
                      "id_local"      : lancamento_origem.id_filial,
                      "id_inventario" : lancamento_origem.id_inventario, 
                      "id_imobilizado": lancamento_origem.id_imobilizado,
                      "id_pasta"      : "",
                      "id_file"       : "", 
                      "file_name"     : "", 
                      "destaque"      : "", 
                      "pagina"        : 0, 
                      "tamPagina"     : 50, 
                      "contador"      :"N", 
                      "orderby"       :"", 
                      "sharp"         :false 
                    }
        
            const fotos = await fotoSrv.getFotos(params);
        
          for (const foto of fotos) {

            
                //Deleta foto da origem
                try {
                      await fotoSrv.deleteFoto(foto.id_empresa, foto.id_local, foto.id_inventario, foto.id_imobilizado, foto.id_pasta, foto.id_file,foto.file_name);
                } catch (error) {
                      console.error("Ignorada a deleção");
                }

                // Atualiza os dados da foto
                foto.id_empresa    = lancamento_destino.id_empresa;
                foto.id_local      = lancamento_destino.id_filial;
                foto.id_inventario = lancamento_destino.id_inventario;
        
                const prefixoOrigem = `${lancamento_origem.id_empresa.toString().padStart(2,'0')}_${lancamento_origem.id_filial.toString().padStart(6,'0')}_${lancamento_origem.id_inventario.toString().padStart(6,'0')}_${lancamento_origem.id_imobilizado.toString().padStart(6,'0')}_`;
                const prefixoDestino = `${lancamento_destino.id_empresa.toString().padStart(2,'0')}_${lancamento_destino.id_filial.toString().padStart(6,'0')}_${lancamento_destino.id_inventario.toString().padStart(6,'0')}_${lancamento_destino.id_imobilizado.toString().padStart(6,'0')}_`;
        
                foto.file_name = foto.file_name.replace(prefixoOrigem, prefixoDestino);
                foto.file_original = foto.file_name;
        
                console.log("Transferindo Foto =>",foto.file_name);
                // Copia o arquivo com verificação
                await copiarArquivo(
                  foto.id_empresa,
                  foto.id_file,
                  foto.id_pasta,
                  foto.file_name
                );  
                //Deleta lançamento origem
                try { 
                  await lancamentoSrv.deleteLancamento(id_empresa, id_filial_origem, id_inventario_origem,id_imobilizado);
                } catch (error) {
                  console.error("Erro ao deletar lancamento de origem, ignorado");
                }
          
                //Insert foto no destino
                try {
                      const nova_foto = await fotoSrv.insertFoto(foto);
                      console.log("Foto Transferida =>",nova_foto);
                } catch (error) {
                      console.error("Ignorada a inclusao");
                }
        
      }
      //deleta ativo do innvetario origem
      try {
        await imobilizadoinventarioSrv.deleteImobilizadoinventario(id_empresa, id_filial_origem, id_inventario_origem,id_imobilizado);
      } catch (error) {
        console.error("Erro ao deletar imobilizado inventario de origem, ignorado");
      }
      //deleta ativo origem
      try {
        await imobilizadoSrv.deleteImobilizado(id_empresa,id_filial_origem,id_imobilizado);
      } catch (error) {
        console.error("Erro ao deletar imobilizado de origem, ignorado");
      }
      //Deleta  lancamento destino
      try {
        await lancamentoSrv.deleteLancamento(id_empresa,id_filial_destino, id_inventario_destino,id_imobilizado_destino);
      } catch (error) {
        console.error("Erro ao deletar fotos do lancamento destino, ignorado");
      }
      //Insere lancamento origem no destino
      console.log("Inserindo lancamento destino =>",lancamento_destino);
      try{
        await lancamentoSrv.insertLancamento(lancamento_destino);
      } catch (error) {
        console.error("Erro ao inserir lancamento destino, ignorado");
      }
            
          
    }

    console.log("Ajuste 421 Finalizado");

}


async function processaUploadFotoWebPasta(req) {
  console.log("📥 [processaUploadFotoWebPasta] Iniciando processamento...");

  // Extrai dados

   const foto = req.body.foto ? JSON.parse(req.body.foto) : {};
  const {
    id_usuario 
  } = req.body;

  
  
  fotoSaved = null;

  // Autenticação Google
  const params = await funcoes.loadCredencials(foto.id_empresa);
  const oauth2Client = funcoes.getoauth2Client(params);
  const driveService = google.drive({ version: "v3", auth: oauth2Client });

  // Inventário
  const inventario = await inventarioSrv.getInventario(foto.id_empresa, foto.id_local, foto.id_inventario);

  const folder_id = inventario.folder_id;

  const file_name = foto.file_name.replace(".png", ".jpg");

  const file_name_foto_upload = req.file.originalname;

  // Monta Objeto Foto
 let nova_foto = {
      "id_empresa" 			 	 : foto.id_empresa, 
      "id_local" 			 		 : foto.id_local,
      "id_inventario" 		 : foto.id_inventario,
      "id_imobilizado" 		 : foto.id_imobilizado,
      "id_pasta" 			 		 : folder_id, 
      "id_file" 			 		 : foto.id_file,
      "file_name" 			 	 : foto.file_name.replace(".png", ".jpg"),
      "file_name_original" : foto.file_name_originalS,
      "id_usuario" 			 	 : foto.id_usuario,
      "data" 				 		   : foto.data,
      "destaque" 			 		 : foto.destaque,
      "obs" 				 		   : foto.obs,
      "localizacao"		     : foto.localizacao,
      "user_insert" 		 	 : id_usuario, 
      "user_update"		 		 : 0
  }

  //Verifica se foto já existe na pasta nova do Drive para evitar duplicidade
  let foto_pasta_nova = await fotoSrv.getFoto(nova_foto.id_empresa, nova_foto.id_local, nova_foto.id_inventario, nova_foto.id_imobilizado, nova_foto.id_pasta, nova_foto.id_file, nova_foto.file_name);

  if (foto_pasta_nova !== null){  
     return {"erro" : "Foto Nova já existe no banco de dados, operação de upload ignorada", "message": "Foto Nova já existe no banco de dados, operação de upload ignorada"};
  }


  // Verifica e exclui arquivo anterior do Drive
  /* let existeDrive = false;
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
  } */


  // Upload do novo arquivo
  const saved = await funcoes.saveFile(driveService,file_name_foto_upload, file_name, folder_id);
  nova_foto.id_file = saved.fileId;
  nova_foto.file_name = file_name;
  nova_foto.id_pasta = folder_id;
  nova_foto.localizacao = 'N';
  

  console.log("-->",nova_foto)

  fotoSaved = await fotoSrv.insertFoto(nova_foto);

   try {
    fs.unlinkSync(`./fotos/${file_name_foto_upload}`);
  } catch (err) {
    console.error("⚠️ Erro ao deletar arquivo local:", err);
  }
  
  return  {"erro" : "", "message": "Foto processada com sucesso", "foto": fotoSaved};
}


module.exports = {
  processaUploadFotoDisp,processaUploadFotoWeb,sincronizarFileName,copiarArquivo,getAtivos421,funcaoAjusta421,processaUploadFotoWebPasta
};