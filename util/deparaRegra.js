const deparaSrv = require("../service/deparaService");
const erroDB = require("../util/userfunctiondb");
const shared = require("../util/shared");
/* REGRA DE NEGOCIO de_para */

exports.depara_Inclusao = async function(depara) {
    try {
        const obj = await deparaSrv.getDepara(
            depara.id_empresa,
            depara.id_local,
            depara.id_inventario,
            depara.de,
            depara.para,
        );
        if (obj != null) {
            throw new erroDB.UserException("Regra de negócio", [{
                tabela: "DEPARA",
                message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!`,
            }, ]);
        }
        const par = {
            id_empresa: depara.id_empresa,
            id_local: depara.id_local,
            id_inventario: 0,
            de: 0,
            para: depara.para,
            status: -1,
            id_usuario: 0,
            pagina: 0,
            tamPagina: 50,
            contador: "N",
            orderby: "",
            sharp: false,
        };
        const para = await deparaSrv.getDeparas(par);

        if (para.length > 0) {
            throw new erroDB.UserException("Regra de negócio", [{
                tabela: "DEPARA",
                message: `"INCLUSÃO" Ativo "PARA" - Já Foi Incluído!`,
            }, ]);
        }
    } catch (err) {
        throw err;
    }

    return;
};

exports.depara_Alteracao = async function(depara) {
    try {
        const obj = await deparaSrv.getDepara(
            depara.id_empresa,
            depara.id_local,
            depara.id_inventario,
            depara.de,
            depara.para,
        );
        if (obj == null) {
            throw new erroDB.UserException("Regra de negócio", [{
                tabela: "DEPARA",
                message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!`,
            }, ]);
        }
    } catch (err) {
        throw err;
    }

    return;
};

exports.depara_Exclusao = async function(
    id_empresa,
    id_local,
    id_inventario,
    de,
    para,
) {
    try {
        const obj = await deparaSrv.getDepara(
            id_empresa,
            id_local,
            id_inventario,
            de,
            para,
        );
        if (obj == null) {
            throw new erroDB.UserException("Regra de negócio", [{
                tabela: "DEPARA",
                message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!`,
            }, ]);
        }
    } catch (err) {
        throw err;
    }

    return;
};