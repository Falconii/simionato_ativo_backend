/* ROUTE eventos  */
const db = require("../infra/database");
const express = require("express");
const router = express.Router();
const imobilizadoSrv = require("../service/imobilizadoService");
const imobilizadoinventarioSrv = require("../service/imobilizadoinventarioService");
const lancamentoSrv = require("../service/lancamentoService");
const empresaSrv = require("../service/empresaService");
const localSrv = require("../service/localService");
const centrocustoSrv = require("../service/centrocustoService");
const gruposrv = require("../service/grupoService");
const produtoSrv = require("../service/produtoService");
const principalSrv = require("../service/principalService");  
const nfeSrv = require("../service/nfeService");
const valorSrv = require("../service/valorService");
const erroDB = require('../util/userfunctiondb');
const response = require("../util/respostaPadrao");
const { autenticarToken} = require('../middleware/autenticartoken');

router.use(autenticarToken);



async function BaixaAtivo(imobilizado,imobilizadoinventario,lancamento) 
{
    if (lancamento != null) {
        lancamento.estado = 6; //baixado
        try {
           lancamento = await lancamentoSrv.updateLancamento(lancamento);
        } catch (error) {
            throw new Error("Erro Ao Alterar Situação do Lançamento");
        }
    } else {
      try {
        await imobilizadoinventarioSrv.deleteImobilizadoinventario(
          imobilizadoinventario.id_empresa,
          imobilizadoinventario.id_filial,
          imobilizadoinventario.id_inventario,
          imobilizadoinventario.id_imobilizado
        );  
      } catch (error) {
          throw new Error("Erro Ao Excluir Ativo Do Inventario");
      }
      try{
        await imobilizadoSrv.deleteImobilizado(
          imobilizadoinventario.id_empresa,
          imobilizadoinventario.id_filial,
          imobilizadoinventario.id_imobilizado
      ); 
      } catch (error) {
          throw new Error("Erro Ao Excluir Ativo");
      }           
    }
}

async function TrocarCC(imobilizado,imobilizadoinventario,lancamento,cc_novo) 
{
    if (lancamento != null) {
        lancamento.new_cc = cc_novo;
        try {
            lancamento.situacao = 3; //transferência em andamento;
            lancamento = await lancamentoSrv.updateLancamento(lancamento);
        } catch (error) {
            throw new Error("Erro Ao Alterar Situação do Lançamento");
        }
    } else {
      try {
          imobilizado.cod_cc = cc_novo;
          imobilizado = await imobilizadoSrv.updateImobilizado(imobilizado);
      } catch (error) {
          throw new Error("Erro Ao Alterar Centro de Custo do Ativo");
      }
    }
}


router.post("/trocarsituacaocc", async function (req, res) {
  /*
   {
      "id_empresa":1,
      "id_filial"  :14,   "Valores válidos 14 = COPPERSTEEL, 15 = INTELLI, 16 = TRES LAGOAS".
      "id_inventario":15, "Valores Validos 10 = COPPERSTEEL, 11= INTELLI,  12 = TRES LAGOAS".
      "codigo_ativo": 1,  
      "cod_evento" : 1,   "Valores Válidos 1 = Baixa do Ativo, 2 = Troca de Centro de Custo".
      "cc_novo":"",       "Usado apenas para o evento 2 - Troca de Centro de Custo"
    }
    validar os parametros e rejeitar se estiverem errados incluir também os campos do ativo
    validar se o ativo existe
    
  */
 console.log("Iniciando Processamento de Evento de Ativo");
   try {

    const id_empresa = req.body.id_empresa;
    const id_filial = req.body.id_filial;
    const id_inventario = req.body.id_inventario;
    const codigo_ativo = req.body.codigo_ativo;
    const cod_evento = req.body.cod_evento;
    const cc_novo = req.body.cc_novo;

    // Validação
    const camposObrigatorios = ["id_empresa", "id_filial", "id_inventario", "codigo_ativo", "cod_evento"];
    const camposAusentes = camposObrigatorios.filter(campo => !req.body[campo]);
    if (camposAusentes.length > 0) {
      return response.validationError(res, camposAusentes);
    }
    console.log("Parametros Obrigatórios Presentes",id_empresa,id_filial,id_inventario,codigo_ativo,cod_evento);
    
    if (id_filial != 999) {
       return response.error(res, "API Em Teste Usar Somente Local 999");
    };

    if (cod_evento == 2 && (!cc_novo || cc_novo.trim() === "")) {
      return response.validationError(res, ["cc_novo"]);
    }
    // Empresa
    const empresa = await empresaSrv.getEmpresa(id_empresa);
    if (!empresa) {
      return response.notFound(res, "Empresa", { id_empresa });
    }
    const local = await localSrv.getLocal(id_empresa, id_filial);
    if (local == null) {
      return response.notFound(res, "Local", { id_filial });
      }
    const imobilizado = await imobilizadoSrv.getImobilizado(
      id_empresa,
      id_filial,
      codigo_ativo,
    );
    if (imobilizado == null) {
         return response.notFound(res, "Ativo", { codigo_ativo });
    };

    let imoiventario = await imobilizadoinventarioSrv.getImobilizadoinventario(
      id_empresa,
      id_filial,
      id_inventario,
      codigo_ativo
    );

    let lancamento = await lancamentoSrv.getLancamento(id_empresa, id_filial, id_inventario, codigo_ativo);

    if (cod_evento == 1)
    {
        if (imoiventario !==null) {
           try {
            await BaixaAtivo(imobilizado,imoiventario,lancamento);
            console.log("Ativo Baixado Com Sucesso");
           } catch (error) {
            return response.error(res,error.message, { imobilizado });
           }
        } else {
            console.log("Ativo Não Esta Associado Ao Inventário");
            return response.error(res,"Ativo Não Esta Associado Ao Inventário", { imobilizado });
        }
    }

    if (cod_evento == 2)
    {
       if (imoiventario !==null) {
        try{
            const novocc = await centrocustoSrv.getCentrocusto(id_empresa,id_filial, cc_novo);
            if (novocc == null) {
                return response.notFound(res, "Centro de Custo Novo Não Cadastrado", { cc_novo });
            }
        } catch (error) {
            return response.error(res,"Erro Na Pesquisa Do Novo Centro De Custo", { cc_novo });
        }
        try {
              await TrocarCC(imobilizado,imoiventario,lancamento,cc_novo);
        } catch (error) {
            return response.error(res,"Erro Ao Trocar O CC Do Ativo", { imobilizado,imobilizado});
        }
       }
    }
     if (cod_evento == 1 && lancamento == null) {
        return response.success(res,"Ativo Baixado Com Sucesso - Como Não Foi Inventariado. Foi Excluido Da Base", { imobilizado });
     } 
     if (cod_evento == 1 && lancamento!== null) {
         return response.success(res,"Ativo Baixado Com Sucesso - Como Foi Inventariado. Foi Alterado O Lançamento", { lancamento });
      }
    if (cod_evento == 2) {
      console.log("Ativo Alterado Com Sucesso - Troca de Centro de Custo");
        return response.success(res,"Processamento Executado Com Sucesso. Alterado O Lançamento.", { lancamento });
    }   
      return response.error(res,"Processamento Não Efetuado"); 
  } catch (err) {
    console.log("Erro no processamento do evento", err);
    if (err.name == "MyExceptionDB") {
       return response.error(res,message);
    } else {
      return response.backenderror(res,"err.message");
    }
  };
});




router.post("/novoativo", async function (req, res) {
  /*
 {
	"id_empresa" : 1,
	"id_local"   : 15,
	"id_inventario": 10,
	"produto": {
								"id_empresa": 1,
								"id_local": 15,
								"codigo": 75146,
								"estado": 1,
								"descricao": "INSTALAÇÃO REDE OXIGÊNIO MONTAGEM QUADRO",
								"ncm": "99999999       ",
	           },
	"principal":{
								"id_empresa": 1,
								"id_local": 15,
								"codigo": 162,
								"descricao": "ELEVADOR DE CANECAS PARA RESÍDUOS DE FUNDIÇÃO                   ",
	            },
	"imobilizado":{
								"id_empresa": 1,
								"id_local": 15,
								"codigo": 2,
								"descricao": "ESTABILIZADOR ELÉTRICO DE TENSÃO   3K1VA MONO ISO LITE 220-220",
								"cod_grupo": 5,
								"cod_cc": "3-15",
								"condicao": 9,
								"apelido": "APELIDO",
								"id_principal": 0,
								"nfe": "143",
								"serie": "2",
								"item": "0",
								"origem": "P",
	            },
"grupo":      {
                "id_empresa": 1,
                "id_filial": 15,
                "codigo": 5,
                "descricao": "EQUIPAMENTOS DE INFORMÁTICA"
              },
  "centrocusto":{
                "id_empresa": 1,
                "id_filial": 15,
                "codigo": "3-15",
                "descricao": "COPPERSTEEL - ADMINISTRAÇÃO"
        },
  "nfe": {
							"id_empresa": 1,
							"id_filial": 14,
							"cnpj_fornecedor": "",
							"razao_fornecedor": "",
							"id_imobilizado": 116,
							"serie": "0",
							"item": "0",
							"chavee": "",
							"dtemissao": "",
							"dtlancamento": "",
							"qtd": "0.0000",
							"punit": "0.0000",
							"totalitem": "0.00",
							"baseicms": "0.0000",
							"percicms": "0.00",
							"vlrcicms": "0.0000",
				  },
	"valor":{
							"id_empresa": 1,
							"id_filial": 14,
							"id_imobilizado": 5509,
							"dtaquisicao": "16/06/2023",
							"vlraquisicao": "1.0000",
							"totaldepreciado": "335.0400",
							"vlrresidual": "3014.9600",
							"reavalicao": "0.0000",
							"deemed": "0.0000",
							"vlrconsolidado": "3014.9600",
							"user_insert": 16,
							"user_update": 0,
							"imo_descricao": "BEBEDOURO INDUSTRIAL, MARCA JC, MOD. BB100L/3, Nº SÉRIE 140623"
						}
}
    
  */
 
  try {

    const id_empresa = req.body.id_empresa;
    const id_local = req.body.id_local;
    const produto = req.body.produto;
    const principal = req.body.principal;
    const imobilizado = req.body.imobilizado;
    const grupo = req.body.grupo;
    const centrocusto = req.body.centrocusto;
    const nfe = req.body.nfe;
    const valor = req.body.valor;

    // Validação
    const camposObrigatorios = ["id_empresa", "id_local", "produto","principal","imobilizado","grupo","centrocusto","nfe","valor"];

    const camposAusentes = camposObrigatorios.filter(campo => !req.body[campo]);
    if (camposAusentes.length > 0) {
      return response.validationError(res, camposAusentes);
    }


    // Empresa
    const empresa = await empresaSrv.getEmpresa(id_empresa);
    if (!empresa) {
      return response.notFound(res, "Empresa", { id_empresa });
    }

    const local = await localSrv.getLocal(id_empresa, id_local);
    if (local == null) {
      return response.notFound(res, "Local", { id_local });
      }
    
    console.log("imobilizado",imobilizado);

    const _imobilizado = await imobilizadoSrv.getImobilizado(
      id_empresa,
      id_local,
      imobilizado.codigo,
    );

    
    if (_imobilizado !== null) {
         return response.conflit(res, "Ativo Já Cadastrado", imobilizado);
    };
   

    const _grupo = await gruposrv.getGrupo(
      grupo.id_empresa,
      grupo.id_filial,
      grupo.codigo
    );

    if (_grupo == null) {
      try {
        _grupo = await gruposrv.insertGrupo(grupo);   
      } catch (error) {
        return response.error(res,"Erro Ao Incluir Grupo", { grupo });
      }
    }

    const _centrocusto = await centrocustoSrv.getCentrocusto(centrocusto.id_empresa,centrocusto.id_filial, centrocusto.codigo);    
    if (_centrocusto == null) {
      try {
        await centrocustoSrv.insertCentrocusto(centrocusto);      
      } catch (error) {
        return response.error(res,"Erro Ao Incluir Centro de Custo", { centrocusto });
      }
    }
                
   
    const _produto = await produtoSrv.getProduto(
      id_empresa, id_local, produto.codigo);
    if (_produto == null) {
      try {
        await produtoSrv.insertProduto(produto);
      } catch (error) {
        return response.error(res,"Erro Ao Incluir Produto", { produto });
      }
    }        

     
    const _principal = await principalSrv.getPrincipal(
        id_empresa, id_local, principal.codigo);
      if (_principal == null) {
        try {
          await principalSrv.insertPrincipal(principal);  
        } catch (error) {
          return response.error(res,"Erro Ao Incluir Principal", { principal });
        }
      }
        


     const _nfe = await nfeSrv.getNfeByImobilizado(
                _imobilizado.id_empresa,
                _imobilizado.id_filial,
                _imobilizado.id_imobilizado,
                _imobilizado.nfe,
                _imobilizado.serie,
                _imobilizado.item);

     if (_nfe == null) {
          try {
            await nfeSrv.insertNfe(nfe);      
          } catch (error) {
            return response.error(res,"Erro Ao Incluir NFE", { nfe });
          }
        }

     const _valor = await valorSrv.getValor( _imobilizado.id_empresa,
                _imobilizado.id_filial, 
                _imobilizado.id_imobilizado);

      if (valor==null){ 
          try {
            await valorSrv.insertValor(valor);      
          } catch (error) {
            return response.error(res,"Erro Ao Incluir Valor", { valor });
          }
        }

     return response.success(res,"Processamento Executado Com Sucesso", { imobilizado });

  } catch (err) {
    if (err.name == "MyExceptionDB") {
       return response.error(res,message, { imobilizado : imobilizado });
    } else {
      return response.backenderror(res,err.message,err);
    }
  };
});

module.exports = router;
