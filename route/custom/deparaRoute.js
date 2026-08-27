/* ROUTE de_para */
const db = require("../../infra/database");
const express = require("express");
const router = express.Router();
const deparaSrv = require("../../service/custom/deparaService");
const deparaService = require("../../service/deparaService");
const auditoriaSrv = require("../../service/auditoriaService");
const imobilizadoSrv = require("../../service/imobilizadoService");
const fotoSrv = require("../../service/fotoService");
const imobilizadoinventarioSrv = require("../../service/imobilizadoinventarioService");
const lancamentoSrv = require("../../service/lancamentoService");
const funcoes = require("../../util/deparaFuncoes");
const fotoControle = require("../../controllers/fotocontroller")

/* processar depara */
router.post("/api/processardepara", async function(req, res) {
    try {
        const credencial = req.body;
        const registro = await deparaSrv.processarDePara(credencial);
        if (registro == null) {
            res.status(409).json({ message: "Arquivo De Para Processado!" });
        } else {
            res.status(200).json(registro);
        }
    } catch (err) {
        if (err.name == "MyExceptionDB") {
            res.status(409).json(err);
        } else {
            res
                .status(500)
                .json({ erro: "BAK-END", tabela: "DePara", message: err.message });
        }
    }
});

router.post("/api/substituirativo", async function(req, res) {
    try {
        const { id_empresa, id_local, id_inventario } = req.body;

        const registro = await funcoes.SubstituirAtivo(
            id_empresa,
            id_local,
            id_inventario,
        );

        if (registro == null) {
            res.status(409).json({ message: "Falha No Processamento!" });
        } else {
            res.status(200).json(registro);
        }
    } catch (err) {
        if (err.name == "MyExceptionDB") {
            res.status(409).json(err);
        } else {
            res
                .status(500)
                .json({ erro: "BAK-END", tabela: "DePara", message: err.message });
        }
    }
});

router.post("/api/deparaativo", async function(req, res) {
    try {
        const { id_empresa, id_local, id_inventario, id_imobilizado, id_usuario } =
        req.body;

        const registro = await funcoes.DeParaAtivo(
            id_empresa,
            id_local,
            id_inventario,
            id_imobilizado,
            id_usuario,
        );

        if (registro == null) {
            res.status(409).json({ message: "Falha No Processamento!" });
        } else {
            res.status(200).json(registro);
        }
    } catch (err) {
        if (err.name == "MyExceptionDB") {
            res.status(409).json(err);
        } else {
            res
                .status(500)
                .json({ erro: "BAK-END", tabela: "DePara", message: err.message });
        }
    }
});

router.post("/api/canceladepara", async function(req, res) {
    try {

      

        const { id_empresa, id_local, id_inventario,id_usuario,de,para } =    req.body;

        
        let parFotos = { 
            "id_empresa":id_empresa, 
            "id_local":id_local, 
            "id_inventario":id_inventario, 
            "id_imobilizado":para, 
            "id_pasta" : "", 
            "id_file":"", 
            "file_name":"", 
            "destaque":"", 
            "localizacao":"L",
            "pagina":0, 
            "tamPagina":50, 
            "contador":"N", 
            "orderby":"", 
            "sharp":false 
        };


        const fotos = await fotoSrv.getFotos(parFotos);

        if (fotos  && fotos.length > 0){
             res.status(409).json({ message: "Existem Fotos No Celular! DEPARA Não realizado!" });
            return;
        }

        //carrega as fotos para correcao do nome no final do processo

                parFotos = { 
            "id_empresa":id_empresa, 
            "id_local":id_local, 
            "id_inventario":id_inventario, 
            "id_imobilizado":para, 
            "id_pasta" : "", 
            "id_file":"", 
            "file_name":"", 
            "destaque":"", 
            "localizacao":"",
            "pagina":0, 
            "tamPagina":50, 
            "contador":"N", 
            "orderby":"", 
            "sharp":false 
        };

        const lsFotos = await fotoSrv.getFotos(parFotos);
      
      
        const depara = await deparaService.getDepara(id_empresa, id_local, id_inventario, de, para);

        if (!depara) {
            res.status(409).json({ message: "DePara Não Encontrado!" });
            return;
        }   


        if (depara.status !== 4) {
            res.status(409).json({ message: "DePara Não Processado" });
            return;
        }

        const par = {
        
                "id_empresa" : id_empresa, 
                "id_filial"   : id_local, 
                "id_inventario" : 0, 
                "escopo": "imobilizados", 
                "acao": "delete", 
                "id_imobilizado": de, 
                "id_usuario":0, 
                "pagina":0, 
                "tamPagina":50, 
                "contador":"N", 
                "orderby":"", 
                "sharp":false 
	
        };

        const auditoria = await auditoriaSrv.getAuditorias(par);

        if (!auditoria || auditoria.length === 0) {
            res.status(409).json({ message: "Auditoria Não Encontrada!" });
            return;
        }

        const texto = auditoria[0].histo_antes;

        const limpo = texto.replace(/\\"/g, '"');

        const json = JSON.parse(limpo);

        imobilizado = json[0];

        imobilizado.user_insert = id_usuario;

        
        const lancamento = await lancamentoSrv.getLancamento(id_empresa,id_local,id_inventario,para);

        if (lancamento == null) {
            res.status(409).json({ message: "Lançamento Do Inventario Não Encontrado !" });
            return ;
        }

        const registro = await imobilizadoSrv.insertImobilizadoCancela_DePara(imobilizado);

        
         if (registro == null) {
            depara.status = 5;
            await deparaService.updateDepara(depara);
            res.status(409).json({ message: "Imobilizado Não Foi Cadastrado!" });
            return ;
        }
        
        const imo_inv = {
            id_empresa: registro.id_empresa,
            id_filial: registro.id_filial,
            id_inventario: id_inventario,
            id_imobilizado: registro.codigo,
            id_lanca: 0,
            status: 0,
            new_codigo: 0,
            new_cc: "",
            condicao: registro.condicao,
            book: "N",
            user_insert: registro.user_insert,
            user_update: 0,
            imo_descricao: "",
            imo_cod_cc: "",
            imo_cod_grupo: 0,
            cc_descricao: "",
            grupo_descricao: "",
            lanc_id_usuario: 0,
            lanc_dt_lanca: "",
            lanc_obs: "",
            lanc_estado: 0,
            usu_razao: "",
            new_cc_descricao: "",
        };

        const imo =  await imobilizadoinventarioSrv.insertImobilizadoinventario(imo_inv);

        if (imo == null) {
            depara.status = 6;
            await deparaService.updateDepara(depara);
            res
            .status(409)
            .json({ message: "Imobilizado Não Incluído No Inventário!" });
            return 
        }

        const lancamentoAlterado = await lancamentoSrv.updateChangeImobilizado(lancamento,de);

         if (lancamentoAlterado == null) {
            depara.status = 7;
            await deparaService.updateDepara(depara);
            res
            .status(409)
            .json({ message: "Lançamento De Inventario Não Foi Alterado!" });
            return 
        }

        depara.status = 9;

        let deparaAlterado = await deparaService.updateDepara(depara);

        if (deparaAlterado == null) {
            depara.status = 8;
            await deparaService.updateDepara(depara);
            res
            .status(409)
            .json({ message: "Falha Na Atualização Do Status Do DE PARA STATUS 9 !" });
            return 
        }
        
       try{

            for (const foto of lsFotos) {

                const file_name_alterado = `${foto.id_empresa.toString().padStart(2,'0')}_${foto.id_local.toString().padStart(6,'0')}_${foto.id_inventario.toString().padStart(6,'0')}_${de.toString().padStart(6,'0')}_${foto.file_name.slice(25)}`;
                
                await fotoSrv.updateFotoCancelamentoDePara(foto,de,file_name_alterado,id_usuario);
                                  
           }
        } catch(err){
            console.log("error ==> ",err);
        }
      
        //atualiza as fotos

        parFotos = { 
            "id_empresa":id_empresa, 
            "id_local":id_local, 
            "id_inventario":id_inventario, 
            "id_imobilizado":de, 
            "id_pasta" : "", 
            "id_file":"", 
            "file_name":"", 
            "destaque":"", 
            "localizacao":"",
            "pagina":0, 
            "tamPagina":50, 
            "contador":"N", 
            "orderby":"", 
            "sharp":false 
        };

        const lsFotosAlteradas = await fotoSrv.getFotos(parFotos);

        await fotoControle.atualizaFileNameDB_GD(lsFotosAlteradas);

        deparaAlterado.status = 0;

        deparaAlterado = await  deparaService.updateDepara(deparaAlterado);

        await deparaService.deleteDepara(deparaAlterado.id_empresa,deparaAlterado.id_local,deparaAlterado.id_inventario,deparaAlterado.de,deparaAlterado.para);

        res.status(200).json({ message: "Finalizado Com Sucesso!",auditoria: auditoria[0], imobilizado : registro, imo_inv : imo_inv,lancamento:lancamentoAlterado, depara: deparaAlterado, lsFotos: lsFotos});

    } catch (err) {
        if (err.name == "MyExceptionDB") {
            res.status(409).json(err);
        } else {
            res
                .status(500)
                .json({ erro: "BAK-END", tabela: "DePara", message: err.message });
        }
    }
});


module.exports = router;