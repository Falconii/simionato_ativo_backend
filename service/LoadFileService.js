const uploaddata = require('../data/uploadData');
const centrocustoSrv = require('../service/centrocustoService');
const grupoSrv = require('../service/grupoService');
const produtoSrv = require('../service/produtoService');
const principalSrv = require('../service/principalService');
const imobilizadoSrv = require('../service/imobilizadoService');
const nfeSrv = require('../service/nfeService');
const valorSrv = require('../service/valorService');
const shared = require('../util/shared.js');
const parse = require('../shared/ParseCSV');
const fs = require("fs");
const readline = require('readline');

exports.create = async(req, res, id_empresa, id_local, id_usuario) => {
    let centro_custos = [];
    let grupos = [];
    let produtos = [];
    let imobilizados = [];
    let principal = [];
    let nfes = [];
    let valores = []
    let ct = 0;
    let nro_linha = 0;
    let result = { "message": "Processamento OK" };
    const { name } = req.body;
    const file = req.file;
    var dadosPlanilha = readline.createInterface({
        input: fs.createReadStream(file.path)
    });
    for await (let linha of dadosPlanilha) {
        nro_linha++;
        if (nro_linha > 1) {
            const campos = parse.ParseCVS("", linha, ";");
            if (campos.length != 34) {
                result = { "message": "Processamento Com Erro!" };
            }
            //centro de custo
            ct = 0;
            const idx_cc = centro_custos.findIndex(cc => {
                return cc.cod_cc.trim() == campos[10].trim();
            });
            if (campos[10].trim() !== "" && idx_cc == -1) {
                ct++;
                centro_custos.push({ "idx": ct, "cod_cc": campos[10], "desc_cc": campos[11] });
                const centrocustoModel = {
                    "id_empresa": id_empresa,
                    "id_filial": id_local,
                    "codigo": campos[10],
                    "descricao": campos[11],
                    "user_insert": id_usuario,
                    "user_update": 0
                }
                const registro = await centrocustoSrv.insertCentrocusto(centrocustoModel);
            }
            result = centro_custos;
            //grupo 
            ct = 0;
            const idx_gr = grupos.findIndex(gr => {
                return gr.cod_grupo.trim() == campos[8].trim();
            });
            if (campos[8].trim() !== "" && idx_gr == -1) {
                ct++;
                grupos.push({ "idx": ct, "cod_grupo": campos[8], "desc_grupo": campos[9] });
                const grupoModel = {
                    "id_empresa": id_empresa,
                    "id_filial": id_local,
                    "codigo": campos[8],
                    "descricao": campos[9],
                    "user_insert": id_usuario,
                    "user_update": 0
                }
                const registro = await grupoSrv.insertGrupo(grupoModel);
            }
            //produtos 
            ct = 0;
            const idx_pro = produtos.findIndex(pr => {
                return pr.cod_produto.trim() == campos[1].trim();
            });
            if (campos[1].trim() !== "" && idx_pro == -1) {
                ct++;
                let cod_produto = parseInt(campos[4].trim(), 10);
                if (isNaN(cod_produto)) {
                    cod_produto = 0;
                }
                let estado = 0;
                if (campos[0].trim() != '') {
                    if (campos[0].trim() == "NOVO") {
                        estado = 1;
                    } else {
                        estado = 3;
                    }
                }
                produtos.push({ "idx": ct, "cod_produto": campos[1], "desc_produto": campos[2] });
                const produtosModel = {
                    "id_empresa": id_empresa,
                    "id_filial": id_local,
                    "codigo": campos[1],
                    "estado": estado,
                    "descricao": shared.excluirCaracteres(campos[2]),
                    "ncm": campos[3],
                    "id_principal": cod_produto,
                    "user_insert": id_usuario,
                    "user_update": 0
                }
                const registro = await produtoSrv.insertProduto(produtosModel);
            }

            //principal 
            ct = 0;
            const idx_main = principal.findIndex(pr => {
                return pr.cod_produto.trim() == campos[4].trim();
            });
            if (campos[4].trim() !== "" && idx_main == -1) {
                ct++;
                principal.push({ "idx": ct, "cod_produto": campos[4], "desc_produto": campos[4] });
                const principalModel = {
                    "id_empresa": id_empresa,
                    "id_filial": id_local,
                    "codigo": campos[4],
                    "descricao": shared.excluirCaracteres(campos[5]),
                    "user_insert": id_usuario,
                    "user_update": 0
                }
                const registro = await principalSrv.insertPrincipal(principalModel);
            }

            //imobilizados
            ct = 0;
            const idx_mob = imobilizados.findIndex(imo => {
                return imo.cod_imobilizado.trim() == campos[6].trim();
            });
            if (campos[6].trim() !== "" && idx_mob == -1) {
                ct++;
                imobilizados.push({ "idx": ct, "cod_imobilizado": campos[6], "desc_imobilizado": campos[7] });

                const ImobilizadoModel = {
                    "id_empresa": id_empresa,
                    "id_filial": id_local,
                    "codigo": campos[6],
                    "descricao": shared.excluirCaracteres(campos[7]),
                    "cod_grupo": campos[8],
                    "cod_cc": campos[10],
                    "nfe": campos[14],
                    "serie": campos[15],
                    "item": campos[16],
                    "origem": "P",
                    "user_insert": id_usuario,
                    "user_update": 0,
                }
                const registro = await imobilizadoSrv.insertImobilizado(ImobilizadoModel);
            }


            //nfe
            ct = 0;
            const idx_nfe = nfes.findIndex(nf => {
                return (nf.imobilizado == campos[6] && nf.nfe == campos[14] && nf.serie == campos[15] && nf.item == campos[16]);
            });
            if (campos[14].trim() !== "" && idx_nfe == -1) {

                nfes.push({
                    "idx": ct,
                    "id_empresa": id_empresa,
                    "id_filial": id_local,
                    "cnpj_fornecedor": campos[12],
                    "razao_fornecedor": shared.excluirCaracteres(campos[13]),
                    "id_imobilizado": campos[6],
                    "nfe": campos[14],
                    "serie": campos[15],
                    "item": campos[16]
                });
                const NfesModel = {
                    "id_empresa": id_empresa,
                    "id_filial": id_local,
                    "cnpj_fornecedor": campos[12],
                    "razao_fornecedor": shared.excluirCaracteres(campos[13]),
                    "id_imobilizado": campos[6],
                    "nfe": campos[14],
                    "serie": campos[15],
                    "item": campos[16],
                    "chavee": campos[17],
                    "dtemissao": campos[25],
                    "dtlancamento": campos[26],
                    "qtd": shared.excluirVirgulasePontos(campos[18]),
                    "punit": shared.excluirVirgulasePontos(campos[19]),
                    "totalitem": shared.excluirVirgulasePontos(campos[20]),
                    "vlrcontabil": shared.excluirVirgulasePontos(campos[21]),
                    "baseicms": shared.excluirVirgulasePontos(campos[22]),
                    "percicms": shared.excluirVirgulasePontos(campos[23]),
                    "vlrcicms": shared.excluirVirgulasePontos(campos[24]),
                    "user_insert": id_usuario,
                    "user_update": 0,
                }
                const registro = await nfeSrv.insertNfe(NfesModel);
            }

            //valores
            ct = 0;
            const idx_valor = valores.findIndex(val => {
                return (
                    val.id_empresa == id_empresa && val.id_filial == id_local && val.id_imobilizado == campos[6]
                )
            });
            if (idx_valor == -1) {
                ct++;
                valores.push({ "idx": ct, "cod_imobilizado": campos[12], "dtaquisicao": campos[27] });

                const ValorModel = {
                    "id_empresa": id_empresa,
                    "id_filial": id_local,
                    "id_imobilizado": campos[6],
                    "dtaquisicao": campos[27],
                    "vlraquisicao": shared.excluirVirgulasePontos(campos[28]),
                    "totaldepreciado": shared.excluirVirgulasePontos(campos[29]),
                    "vlrresidual": shared.excluirVirgulasePontos(campos[30]),
                    "reavalicao": shared.excluirVirgulasePontos(campos[31]),
                    "deemed": shared.excluirVirgulasePontos(campos[32]),
                    "vlrconsolidado": shared.excluirVirgulasePontos(campos[33]),
                    "user_insert": id_usuario,
                    "user_update": 0,
                }
                const registro = await valorSrv.insertValor(ValorModel);
            }

        }
    }

    return result;
}

exports.createV2 = async(req, res) => {
    const { name } = req.body;
    const file = req.file;
    return { "message": "Deu Certo !!" };
}

exports.delete = async(req, res) => {
    try {
        const { name } = req.body;
        const file = req.file;
        fs.unlinkSync(file.path);
        res.status(200).json({ 'message': 'Arquivo Excluído!', 'path': file.path })

    } catch (erro) {
        res.status(500).json({ 'message': erro.message });
    }
}