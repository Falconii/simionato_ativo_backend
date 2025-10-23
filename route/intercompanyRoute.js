/* ROUTE eventos  */
const db = require("../infra/database");
const express = require("express");
const router = express.Router();
const lancamentoSrv = require("../service/lancamentoService");
const fotoSrv = require("../service/fotoService");
const imobilizadoSrv = require("../service/imobilizadoService");
const imobilizadoinventarioSrv = require("../service/imobilizadoinventarioService");
const empresaSrv = require("../service/empresaService");
const erroDB = require('../util/userfunctiondb');
const response = require("../util/respostaPadrao");
const fotoController = require("../controllers/fotoController");

/*
  Pegar movimentação de inventário de ativo de um local "origem" e transferir para outro local "destino"
  No local de origem, será excluido o ativo, e a movimentação de inventario
  No local de destino, será inserido a movimentação de inventario origem assim como as fotos.
  O Lancamento de inventario do destino será substituido pelo do origem.
*/


router.post("/transfere_ativo_intercompany", async function (req, res) {

 console.log("Iniciando Processamento de Evento de Ativo");

    const id_empresa              = req.body.id_empresa;
    const id_filial_origem        = req.body.id_filial_origem;
    const id_inventario_origem     = req.body.id_inventario_origem;
    const id_filial_destino       = req.body.id_filial_destino;
    const id_inventario_destino   = req.body.id_inventario_destino;
    const id_imobilizado          = req.body.id_imobilizado;




    // Validação
    const camposObrigatorios = ["id_empresa","id_filial_origem","id_inventario_origem","id_filial_destino","id_inventario_destino","id_imobilizado"];
    const camposAusentes = camposObrigatorios.filter(campo => !req.body[campo]);
    if (camposAusentes.length > 0) {
      return response.validationError(res, camposAusentes);
    }

    
    console.log("Parametros Obrigatórios Presentes",id_empresa,id_filial_origem,id_inventario_origem,id_filial_destino,id_inventario_destino,id_imobilizado);

    const lancamento_origem = await lancamentoSrv.getLancamento(id_empresa, id_filial_origem, id_inventario_origem,id_imobilizado);

    if (lancamento_origem == null) {
      return response.notFound(res, `Lançamento de origem não encontrado.`);
    }


    const lancamento_destino = await lancamentoSrv.getLancamento(id_empresa, id_filial_destino, id_inventario_destino,id_imobilizado);

    if (lancamento_destino == null) {
      return response.notFound(res, `Lançamento de destino não encontrado.`);
    }

    //ativos devem ser iguais
    if (lancamento_origem.id_imobilizado != lancamento_destino.id_imobilizado) {
      return response.validationError(res, [`Os lançamentos devem pertencer ao mesmo ativo.`]);
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

    /* pesquisar fotos na origem e transferir para o destino */
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
        await fotoController.copiarArquivo(
          foto.id_empresa,
          foto.id_file,
          foto.id_pasta,
          foto.file_name
        );  

        //Insert foto no destino
        try {
              const nova_foto = await fotoSrv.insertFoto(foto);
              console.log("Foto Transferida =>",nova_foto);
        } catch (error) {
              console.error("Ignorada a inclusao");
        }

        //Deleta foto da origem
        try {
              await fotoSrv.deleteFoto(foto.id_empresa, foto.id_local, foto.id_inventario, foto.id_imobilizado, foto.id_pasta, foto.id_file,foto.file_name);
        } catch (error) {
              console.error("Ignorada a deleção");
        }
   }
    //deleta ativo do invetario origem
    try {
      await imobilizadoinventarioSrv.deleteImobilizadoinventario(lancamento_origem.id_empresa, lancamento_origem.id_filial, lancamento_origem.id_inventario,lancamento_origem.id_imobilizado);
    } catch (error) {
      console.error("Erro ao deletar imobilizado inventario de origem, ignorado");
    }
    //deleta ativo origem
    try {
      await imobilizadoSrv.deleteImobilizado(lancamento_origem.id_empresa, lancamento_origem.id_filial,lancamento_origem.id_imobilizado);
    } catch (error) {
      console.error("Erro ao deletar imobilizado de origem, ignorado");
    }
    //Deleta fotos do lancamento destino
    try {
    await lancamentoSrv.deleteLancamento(lancamento_destino.id_empresa, lancamento_destino.id_filial, lancamento_destino.id_inventario,lancamento_destino.id_imobilizado);
    } catch (error) {
      console.error("Erro ao deletar fotos do lancamento destino, ignorado");
    }
    //Insere fotos do lancamento origem no destino
    try{
    await lancamentoSrv.insertLancamento(lancamento_destino);
    } catch (error) {
      console.error("Erro ao inserir lancamento destino, ignorado");
    }
    
    //Deleta lançamento origem
    try { 
       await lancamentoSrv.deleteLancamento(lancamento_origem.id_empresa, lancamento_origem.id_filial, lancamento_origem.id_inventario,lancamento_origem.id_imobilizado);
    } catch (error) {
       console.error("Erro ao deletar lancamento de origem, ignorado");
    }

    
  return response.success(res,"OK", { lancamento_origem,lancamento_destino,fotos });
 
});



module.exports = router;
