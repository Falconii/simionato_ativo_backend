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
const erroDB = require("../util/userfunctiondb");
const response = require("../util/respostaPadrao");
const shared = require("../util/shared.js");
const { autenticarToken} = require('../middleware/autenticartoken');
router.use(autenticarToken); 

async function BaixaAtivo(imobilizado, imobilizadoinventario, lancamento) {
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
    try {
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

async function TrocarCC(
  imobilizado,
  imobilizadoinventario,
  lancamento,
  cc_novo
) {
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
    const id_usuario = req.id_usuario;

    // Validação
    const camposObrigatorios = [
      "id_empresa",
      "id_filial",
      "id_inventario",
      "codigo_ativo",
      "cod_evento",
    ];
    const camposAusentes = camposObrigatorios.filter(
      (campo) => !req.body[campo]
    );

    if (!req.id_usuario) {
      camposAusentes.push("id_usuario");
    }

    if (camposAusentes.length > 0) {
      return response.validationError(res, camposAusentes);
    }

    if (id_filial != 15) {
      return response.error(res, "API Somente Para Local INTELLI - Filial 15");
    }

    if (cod_evento < 1 || cod_evento > 2) {
      return response.error(res, "Parametro cod_evento Inválido");
    }

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
      codigo_ativo
    );
    if (imobilizado == null) {
      return response.notFound(res, "Ativo", { codigo_ativo });
    }

    let imoiventario = await imobilizadoinventarioSrv.getImobilizadoinventario(
      id_empresa,
      id_filial,
      id_inventario,
      codigo_ativo
    );


    let lancamento = await lancamentoSrv.getLancamento(
      id_empresa,
      id_filial,
      id_inventario,
      codigo_ativo
    );

    if (lancamento != null) {
      const hoje = new Date();
      const dataString = hoje.toLocaleDateString("pt-BR");
      lancamento.dtlanca = dataString;
      lancamento.id_usuario = id_usuario;
      lancamento.user_insert = id_usuario;
      lancamento.user_update = id_usuario;
    }

    if (cod_evento == 1) {
      if (imoiventario !== null) {
        try {
          await BaixaAtivo(imobilizado, imoiventario, lancamento);
          console.log("Ativo Baixado Com Sucesso");
        } catch (error) {
          return response.error(res, error.message, { imobilizado });
        }
      } else {
        console.log("Ativo Não Esta Associado Ao Inventário");
        return response.error(res, "Ativo Não Esta Associado Ao Inventário", {codigo_ativo});
      }
    }

    if (cod_evento == 2) {
      if (imoiventario !== null) {
        try {
          const novocc = await centrocustoSrv.getCentrocusto(
            id_empresa,
            id_filial,
            cc_novo
          );
          if (novocc == null) {
            return response.notFound(
              res,
              "Centro de Custo Novo Não Cadastrado",
              { cc_novo }
            );
          }
        } catch (error) {
          return response.error(
            res,
            "Erro Na Pesquisa Do Novo Centro De Custo",
            { cc_novo }
          );
        }
        try {
          await TrocarCC(imobilizado, imoiventario, lancamento, cc_novo);
        } catch (error) {
          return response.error(res, "Erro Ao Trocar O CC Do Ativo", {
            imobilizado,
            imobilizado,
          });
        }
      }
    }
    if (cod_evento == 1 && lancamento == null) {
      return response.success(
        res,
        "Ativo Baixado Com Sucesso - Como Não Foi Inventariado. Foi Excluido Da Base",
        { imobilizado }
      );
    }
    if (cod_evento == 1 && lancamento !== null) {
      return response.success(
        res,
        "Ativo Baixado Com Sucesso - Como Foi Inventariado. Foi Alterado O Lançamento",
        { lancamento }
      );
    }
    if (cod_evento == 2) {
      if (lancamento == null) {
        return response.success(
          res,
          "Processamento Executado Com Sucesso. Alterado O No Cadastro.",
          { imobilizado }
        );
      } else {
        return response.success(
          res,
          "Processamento Executado Com Sucesso. Alterado O Lançamento.",
          { lancamento }
        );
      }
    }
    return response.error(res, "Processamento Não Efetuado");
  } catch (err) {
    console.log("Erro no processamento do evento", err);
    if (err.name == "MyExceptionDB") {
      return response.error(res, message);
    } else {
      return response.backenderror(res, "err.message");
    }
  }
});

router.post("/novoativo", async function (req, res) {
  /*
                                                          {
                                                          	"id_filial"   : 999,
                                                          	"id_inventario" : 999,
                                                          	"produto": {
                                                          								"codigo": 130001,
                                                          								"estado": 1,
                                                          								"descricao": "INSTALAÇÃO REDE OXIGÊNIO MONTAGEM QUADRO",
                                                          								"ncm": "99999999       "
                                                          	           },
                                                          	"principal":{
                                                          								"codigo": 163,
                                                          								"descricao": "ELEVADOR DE CANECAS PARA RESÍDUOS DE FUNDIÇÃO"
                                                          	            },
                                                          	"imobilizado":{
                                                          								"codigo": 130001,
                                                          								"descricao": "ESTABILIZADOR ELÉTRICO DE TENSÃO   3K1VA MONO ISO LITE 220-220",
                                                          								"cod_grupo": 5,
                                                          								"cod_cc": "3-15",
                                                          								"condicao": 9,
                                                          								"apelido": "APELIDO",
                                                          								"nfe": "143",
                                                          								"serie": "2",
                                                          								"item": "0",
                                                          								"origem": "P"
                                                          	            },
                                                          "grupo":      {
                                                                          "codigo": 5,
                                                                          "descricao": "EQUIPAMENTOS DE INFORMÁTICA"
                                                                        },
                                                            "centrocusto":{
                                                                          "codigo": "3-15",
                                                                          "descricao": "COPPERSTEEL - ADMINISTRAÇÃO"
                                                                  },
                                                            "nfe": {
                                                          							"cnpj_fornecedor": "MARIA DA PENHA",
                                                          							"razao_fornecedor": "025.078.678-84",
                                                          		          "nfe" : "143",
                                                          							"serie": "2",
                                                          							"item": "60",
                                                          							"chavee": "123456789012345678901234567890123456789012",
                                                          							"dtemissao": "16/06/1964",
                                                          							"dtlancamento": "20/06/1964",
                                                          							"qtd":  100.0000,
                                                          							"punit": 1.50,
                                                          							"totalitem": 150.00,
                                                          						  "vlrcontabil":150.89,
                                                          							"baseicms":  150.0000,
                                                          							"percicms":  12.00,
                                                          							"vlrcicms":  12.5000
                                                          				 },
                                                          	"valor":{
                                                          							"dtaquisicao" : "16/06/2023",
                                                          							"vlraquisicao":  1.0000,
                                                          							"totaldepreciado": 335.0400,
                                                          							"vlrresidual":  3014.9600,
                                                          							"reavalicao":  234.0000,
                                                          							"deemed":  890.908,
                                                          							"vlrconsolidado":  3014.9600 
                                                          						}
                                                          }
                                                           

                                                          */

  try {
    const id_empresa = req.user.id_empresa;
    const id_usuario = req.user.id_usuario;
    const id_inventario = req.body.id_inventario;
    const id_filial = req.body.id_filial;
    const produto = req.body.produto;
    const principal = req.body.principal;
    const imobilizado = req.body.imobilizado;
    const grupo = req.body.grupo;
    const centrocusto = req.body.centrocusto;
    const nfe = req.body.nfe;
    const valor = req.body.valor;

    console.log("use", req.user);
    console.log("id_empresa", id_empresa);

    // Validação
    const dados = {
      ...req.body,
      id_empresa: req.user.id_empresa,
      id_usuario: req.user.id_usuario,
    };

    const camposObrigatorios = [
      "id_empresa",
      "id_usuario",
      "id_filial",
      "produto",
      "principal",
      "imobilizado",
      "grupo",
      "centrocusto",
      "nfe",
      "valor",
    ];

    const camposAusentes = camposObrigatorios.filter((campo) => !dados[campo]);

    if (camposAusentes.length > 0) {
      return response.validationError(res, camposAusentes);
    }

    /* Campos vazios {} Obrigatorios*/

    const camposVazios = [];

    if (Object.entries(imobilizado).length === 0) {
      camposVazios.push({ imobilizado: {} });
    }

    if (Object.entries(grupo).length === 0) {
      camposVazios.push({ grupo: {} });
    }

    if (Object.entries(centrocusto).length === 0) {
      camposVazios.push({ centrocusto: {} });
    }

    if (camposVazios.length > 0) {
      return response.validationError(res, camposVazios);
    }

    imobilizado.id_empresa = id_empresa;
    imobilizado.id_filial = id_filial;

    if (!(id_empresa == 1 && id_filial == 15)) {
      return response.error(
        res,
        "API Em Teste - Permitido Somente Para A Intelli"
      );
    }

    if (!(principal == null) && !(principal.codigo == null)) {
      imobilizado.principal = principal.codigo;
    } else {
      imobilizado.principal = 0;
    }
    imobilizado.user_insert = id_usuario;
    imobilizado.user_update = 0;

    grupo.id_empresa = id_empresa;
    grupo.id_filial = id_filial;
    grupo.user_insert = id_usuario;
    grupo.user_update = 0;

    centrocusto.id_empresa = id_empresa;
    centrocusto.id_filial = id_filial;
    centrocusto.user_insert = id_usuario;
    centrocusto.user_update = 0;

    /* console.log("user", req.user);
                                                                                                                                                            console.log("produto", produto);
                                                                                                                                                            console.log("principal", principal);
                                                                                                                                                            console.log("imobilizado", imobilizado);
                                                                                                                                                            console.log("grupo", grupo);
                                                                                                                                                            console.log("centro custo", centrocusto);
                                                                                                                                                            console.log("nfe", nfe); */

    // Empresa
    const empresa = await empresaSrv.getEmpresa(id_empresa);
    if (!empresa) {
      return response.notFound(res, "Empresa", { id_empresa });
    }

    const filial = await localSrv.getLocal(id_empresa, id_filial);

    if (filial == null) {
      return response.notFound(res, "filial", { id_filial });
    }

    /* Rejeita Processamento de Imobilizado Já Foi Cadastrado */

    const _imobilizado = await imobilizadoSrv.getImobilizado(
      id_empresa,
      id_filial,
      imobilizado.codigo
    );

    if (_imobilizado !== null) {
      return response.conflit(res, "Ativo Já Existe Na Base De Dados", {
        id_empresa: id_empresa,
        id_filial: id_filial,
        id_imobilizado: imobilizado.codigo,
      });
    }
    console.log("Ponto A");
    if (!(Object.entries(produto).length === 0)) {
      produto.id_empresa = id_empresa;
      produto.id_filial = id_filial;
      produto.user_insert = id_usuario;
      produto.user_update = 0;

      const _produto = await produtoSrv.getProduto(
        id_empresa,
        id_filial,
        produto.codigo
      );
      if (!(Object.entries(produto).length === 0)) {
        try {
          if (!(Object.entries(principal).length === 0)) {
            produto.id_principal = principal.codigo;
          } else {
            produto.id_principal = 0;
          }
          await produtoSrv.insertProduto(produto);
        } catch (error) {
          return response.error(res, "Erro Ao Incluir Produto", {
            produto: produto,
            error: error,
          });
        }
      }
    }

    console.log("Ponto A1");
    if (!(Object.entries(principal).length === 0)) {
      console.log("Incluindo Principal", principal);
      principal.id_empresa = id_empresa;
      principal.id_filial = id_filial;
      principal.user_insert = id_usuario;
      principal.user_update = 0;
      const _principal = await principalSrv.getPrincipal(
        id_empresa,
        id_filial,
        principal.codigo
      );
      if (_principal == null) {
        try {
          await principalSrv.insertPrincipal(principal);
        } catch (error) {
          return response.error(res, "Erro Ao Incluir Principal", {
            principal: principal,
            error: error,
          });
        }
      }
    }
    console.log("_imobilizado", _imobilizado);
    if (_imobilizado == null) {
      try {
        if (!(Object.entries(nfe).length === 0) && nfe !== null) {
          imobilizado.nfe = nfe.nfe;
          imobilizado.serie = nfe.serie;
          imobilizado.item = nfe.item;
        } else {
          imobilizado.nfe = "";
          imobilizado.serie = "";
          imobilizado.item = "";
        }
        console.log(
          "Validando Tamanhos dos Campos",
          imobilizado.descricao.length
        );
        console.log(
          "Validando Tamanhos dos Campos",
          imobilizado.apelido.length
        );
        if (imobilizado.descricao.length > 150) {
          return response.error(
            res,
            "Erro Ao Incluir Imobilizado - Campo Descrição Maior Que 150 Caracteres"
          );
        }
        if (imobilizado.apelido.length > 30) {
          return response.error(
            res,
            "Erro Ao Incluir Imobilizado - Campo Apelido Maior Que 30 Caracteres"
          );
        }
        console.log("Incluindo Imobilizado", imobilizado);
        (imobilizado.descricao = shared
          .excluirCaracteres(imobilizado.descricao)
          .toUpperCase()),
          (imobilizado.apelido = shared
            .excluirCaracteres(imobilizado.apelido)
            .toUpperCase()),
          await imobilizadoSrv.insertImobilizado(imobilizado);
      } catch (error) {
        return response.error(res, "Erro Ao Incluir Imobilizado", {
          imobilizado: imobilizado,
          error: error,
        });
      }
    }

    console.log("Ponto A2");
    const _grupo = await gruposrv.getGrupo(
      grupo.id_empresa,
      grupo.id_filial,
      grupo.codigo
    );

    if (_grupo == null) {
      try {
        await gruposrv.insertGrupo(grupo);
      } catch (error) {
        return response.error(res, "Erro Ao Incluir Grupo", {
          grupogrupo: grupogrupo,
          error: error,
        });
      }
    }

    const _centrocusto = await centrocustoSrv.getCentrocusto(
      centrocusto.id_empresa,
      centrocusto.id_filial,
      centrocusto.codigo
    );

    if (_centrocusto == null) {
      try {
        await centrocustoSrv.insertCentrocusto(centrocusto);
      } catch (error) {
        return response.error(res, "Erro Ao Incluir Centro de Custo", {
          centrocusto: centrocusto,
          error: error,
        });
      }
    }
    console.log("Ponto A3");
    if (!(Object.entries(nfe).length === 0)) {
      if (imobilizado !== null && nfe !== null) {
        nfe.id_empresa = id_empresa;
        nfe.id_filial = id_filial;
        nfe.id_imobilizado = imobilizado.codigo;
        nfe.user_insert = id_usuario;
        nfe.user_update = 0;
        const _nfe = await nfeSrv.getNfeByImobilizado(
          nfe.id_empresa,
          nfe.id_filial,
          nfe.id_imobilizado,
          nfe.nfe,
          nfe.serie,
          nfe.item
        );
        if (_nfe.length == 0) {
          try {
            console.log("Incluindo NFE", nfe);
            await nfeSrv.insertNfe(nfe);
          } catch (error) {
            return response.error(res, "Erro Ao Incluir NFE", {
              nfe: nfe,
              error: error,
            });
          }
        }
      }
    }

    if (!(Object.entries(valor).length === 0)) {
      valor.id_empresa = id_empresa;
      valor.id_filial = id_filial;
      valor.id_imobilizado = imobilizado.codigo;
      valor.user_insert = id_usuario;
      valor.user_update = 0;
      const _valor = await valorSrv.getValor(
        imobilizado.id_empresa,
        imobilizado.id_filial,
        imobilizado.codigo
      );

      if (_valor == null) {
        try {
          valor.id_empresa = imobilizado.id_empresa;
          valor.id_filial = imobilizado.id_filial;
          valor.id_imobilizado = imobilizado.codigo;
          await valorSrv.insertValor(valor);
        } catch (error) {
          return response.error(res, "Erro Ao Incluir Valor", {
            valor: valor,
            error: error,
          });
        }
      }
    }

    const imoiventario = {
      id_empresa: id_empresa,
      id_filial: id_filial,
      id_inventario: id_inventario,
      id_imobilizado: imobilizado.codigo,
      id_lanca: 0,
      status: 0,
      new_codigo: 0,
      new_cc: "",
      condicao: 9,
      book: "N",
      user_insert: id_usuario,
      user_update: 0,
    };

    if (!(Object.entries(imobilizado).length === 0)) {
      const _imoiventario =
        await imobilizadoinventarioSrv.getImobilizadoinventario(
          imoiventario.id_empresa,
          imoiventario.id_filial,
          imoiventario.id_inventario,
          imoiventario.id_imobilizado
        );

      if (_imoiventario == null) {
        try {
          await imobilizadoinventarioSrv.insertImobilizadoinventario(
            imoiventario
          );
        } catch (error) {
          return response.error(res, "Erro Ao Incluir Produto No Inventario", {
            imoiventario: imoiventario,
            error: error,
          });
        }
      }
    }
    return response.success(res, "Processamento Executado Com Sucesso", {
      produto: produto,
      principal: principal,
      imobilizado: imobilizado,
      grupo: grupo,
      centrocusto: centrocusto,
      nfe: nfe,
      valor: valor,
      imoiventario: imoiventario,
    });
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      return response.error(res, message, {
        err: err,
      });
    } else {
      return response.backenderror(res, err.message, err);
    }
  }
});



router.put("/alteracaodescricaoativo", async function (req, res) {
  /*
    {
      "id_filial"  :14,   "Valores válidos 14 = COPPERSTEEL, 15 = INTELLI, 16 = TRES LAGOAS".
      "codigo_ativo": 1,  
      "descricao" : "Nova descrição",   
    }    

  */
  console.log("Iniciando Processamento de Evento Alteração de Descrição do Ativo");
  try {
    
    const id_empresa = req.id_empresa;
    const id_usuario = req.id_usuario;
    const id_filial = req.body.id_filial;
    const codigo_ativo = req.body.codigo_ativo;
    const descricao = req.body.descricao.toUpperCase();

    // Validação
    const camposObrigatorios = [
      "id_filial",
      "codigo_ativo",
      "descricao",
    ];
    const camposAusentes = camposObrigatorios.filter(
      (campo) => !req.body[campo]
    );

    if (!req.id_empresa) {
      camposAusentes.push("id_empresa");
    }

    if (!req.id_usuario) {
      camposAusentes.push("id_usuario");
    }

    if (camposAusentes.length > 0) {
      return response.validationError(res, camposAusentes);
    }

    if (id_filial != 999) {
      return response.error(res, "API Somente Para Local HOMOLOGAÇÃO - Filial 999");
    }

    if (descricao.trim() === "") {
      return response.validationErrorMessage(res, "Descrição está vazio", ["descricao"]);
    }

    if (descricao.trim().length > 255) {
      return response.validationErrorMessage(res, "Descrição Excede o Limite de 255 Caracteres", ["descricao"]);
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
      codigo_ativo
    );
    if (imobilizado == null) {
      return response.notFound(res, "Ativo", { codigo_ativo });
    }

    imobilizado.descricao = descricao;
    imobilizado.user_update = id_usuario;

    const alterado = await imobilizadoSrv.updateImobilizado(imobilizado);

    if (alterado) {
      return response.success(res, "Descrição do Ativo Alterada Com Sucesso", {
        imobilizado: imobilizado,
      });
    } else {
      return response.error(res, "Erro Ao Alterar Descrição do Ativo", {
        imobilizado: imobilizado,
      });
    }
  } catch (err) {
    console.log("Erro no processamento do evento", err);
    if (err.name == "MyExceptionDB") {
      return response.error(res, message);
    } else {
      return response.backenderror(res, "err.message");
    }
  }
});

module.exports = router;
