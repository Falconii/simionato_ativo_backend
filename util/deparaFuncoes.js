const deparaSrv = require("../service/deparaService");
const deparaCustomSrv = require("../service/custom/deparaService");
const fotoSrv = require("../service/fotoService");
const realocadoSrv = require("../service/realocadoService");
const funcoes = require("../util/googleFuncoes");
const { google } = require("googleapis");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;

function retira_camera_foto(fileName) {
    var retorno = fileName;

    const now = new Date();

    // Obtém a hora, minuto, segundos e milissegundos
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    // Formata os valores em um texto
    const timeString = `${hours}_${minutes}_${seconds}_${milliseconds}`;

    retorno = retorno.replace("camera_foto", timeString);

    console.log("Novo Nome:", retorno);

    return retorno;
}

async function atualizaFileName(lsFotos) {
    const params = await funcoes.loadCredencials(1);

    let driveService;

    for (const foto of lsFotos) {
        //Corrige no BD se necessario

        const new_name = retira_camera_foto(foto.file_name);

        if (foto.id_pasta.trim() == "1Oc4S6bEQy_TPPPSsxzl1gYkOs8wvwuWq") {
            //google falconi

            let arquivo = "";

            if (PORT == 3000) {
                arquivo = "C:/Repositorios/Simionato/ativo web/keys/googlekey.json";
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
            const oauth2Client = funcoes.getoauth2Client(params);

            driveService = google.drive({ version: "v3", auth: oauth2Client });
        }

        try {
            const res = await funcoes.renameFile(
                driveService,
                foto.id_file,
                new_name,
            );

            const result = await fotoSrv.updateFotoFileName(foto, new_name);
        } catch (error) {
            throw error;
        }
    }
}

async function atualizaFileNameV2(lsFotos) {
    const params = await funcoes.loadCredencials(1);

    let driveService;

    for (const foto of lsFotos) {
        //Corrige no BD se necessario

        const new_name = exports.PadronizaNomeFotoV2(foto);

        if (foto.id_pasta.trim() == "1Oc4S6bEQy_TPPPSsxzl1gYkOs8wvwuWq") {
            //google falconi

            let arquivo = "";

            if (PORT == 3000) {
                arquivo = "C:/Repositorios/Simionato/ativo web/keys/googlekey.json";
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
            const oauth2Client = funcoes.getoauth2Client(params);

            driveService = google.drive({ version: "v3", auth: oauth2Client });
        }

        try {
            const res = await funcoes.renameFile(
                driveService,
                foto.id_file,
                new_name,
            );

            const result = await fotoSrv.updateFotoFileName(foto, new_name);
        } catch (error) {
            throw error;
        }
    }
}

exports.SubstituirAtivo = async function(
    id_empresa,
    id_local,
    id_inventario,
    id_usuario,
) {
    var params = {
        id_empresa: id_empresa,
        id_local: id_local,
        id_inventario: id_inventario,
        status: 1,
    };

    try {
        //status 1
        const _status1 = await deparaSrv.processarDePara(params);

        //status 2
        params.status = 2;
        const _status2 = await deparaSrv.processarDePara(params);

        //status 3
        params.status = 3;
        const status3 = await deparaSrv.processarDePara(params);

        const params2 = {
            id_empresa: id_empresa,
            id_local: id_local,
            id_inventario: id_inventario,
            status: 3,
            de: 0,
            para: 0,
        };

        lsDeparas = await deparaSrv.getDeparas(params2);

        if (lsDeparas != null) {
            for (const depara of lsDeparas) {
                const param = {
                    id_empresa: id_empresa,
                    id_local: id_local,
                    id_inventario: id_inventario,
                    id_imobilizado: depara.para,
                    id_pasta: "",
                    id_file: "",
                    file_name: "",
                    destaque: "N",
                    pagina: 0,
                    tamPagina: 50,
                    contador: "N",
                    orderby: "",
                    sharp: false,
                };
                const lsFotos = await fotoSrv.getFotos(param);

                if (lsFotos != null) {
                    //const message = await atualizaFileName(lsFotos);
                    //console.log(message);
                }

                depara.status = 4;
                depara.user_update = id_usuario;

                await deparaSrv.updateDe_Para(depara);
            }
        }

        return { message: "Processamento OK" };
    } catch (error) {
        throw error;
    }
};

exports.RealocarAtivo = async function(id_empresa, id_local, id_inventario) {
    var params = {
        id_empresa: id_empresa,
        id_local: id_local,
        id_inventario: id_inventario,
        status: 1,
    };

    try {
        //status 1
        const _status1 = await realocadoSrv.processarRealocar(
            id_empresa,
            id_local,
            id_inventario,
            1,
        );

        //status 2
        params.status = 2;
        const _status2 = await realocadoSrv.processarRealocar(
            id_empresa,
            id_local,
            id_inventario,
            2,
        );

        const params2 = {
            id_empresa: id_empresa,
            id_local: id_local,
            id_inventario: id_inventario,
            id_realocado: 0,
            id_transferido: 0,
            status: 2,
            de: 0,
            para: 0,
        };

        lsRealocados = await realocadoSrv.getRealocados(params2);

        console.log("lsRealocados =>", lsRealocados);

        if (lsRealocados != null) {
            for (const realocado of lsRealocados) {
                const param = {
                    id_empresa: id_empresa,
                    id_local: id_local,
                    id_inventario: id_inventario,
                    id_imobilizado: realocado.id_realocado,
                    id_pasta: "",
                    id_file: "",
                    file_name: "",
                    destaque: "N",
                    pagina: 0,
                    tamPagina: 50,
                    contador: "N",
                    orderby: "",
                    sharp: false,
                };

                let lsFotos = await fotoSrv.getFotos(param);

                console.log("lsFotos =>", lsFotos);

                if (lsFotos != null) {
                    const message = await atualizaFileName(lsFotos);

                    console.log(message);
                }

                param.id_imobilizado = realocado.novo_realocado;

                lsFotos = await fotoSrv.getFotos(param);

                if (lsFotos != null) {
                    const message = await atualizaFileName(lsFotos);

                    console.log(message);
                }

                realocado.status = 3;
                realocado.user_update = 16;

                const reg = await realocadoSrv.updateRealocado_status(realocado);
            }
        }

        return { message: "Processamento OK" };
    } catch (error) {
        throw error;
    }
};

exports.DeParaAtivo = async function(
    id_empresa,
    id_local,
    id_inventario,
    id_imobilizado,
    id_usuario,
) {
    var params = {
        id_empresa: id_empresa,
        id_local: id_local,
        id_inventario: id_inventario,
        status: 1,
        id_usuario,
        id_imobilizado,
    };

    try {
        //status 1
        const _status1 = await deparaCustomSrv.processarDeParaV2(params);

        //status 2
        params.status = 2;
        const _status2 = await deparaCustomSrv.processarDeParaV2(params);

        //status 3
        params.status = 3;
        const status3 = await deparaCustomSrv.processarDeParaV2(params);

        const params2 = {
            id_empresa: id_empresa,
            id_local: id_local,
            id_inventario: id_inventario,
            de: id_imobilizado,
            para: 0,
            status: 3,
            id_usuario: 0,
            pagina: 0,
            tamPagina: 50,
            contador: "N",
            orderby: "",
            sharp: false,
        };

        lsDeparas = await deparaSrv.getDeparas(params2);

        if (lsDeparas != null) {
            for (const depara of lsDeparas) {
                const param = {
                    id_empresa: id_empresa,
                    id_local: id_local,
                    id_inventario: id_inventario,
                    id_imobilizado: depara.para,
                    id_pasta: "",
                    id_file: "",
                    file_name: "",
                    destaque: "N",
                    pagina: 0,
                    tamPagina: 50,
                    contador: "N",
                    orderby: "",
                    sharp: false,
                };
                const lsFotos = await fotoSrv.getFotos(param);

                if (lsFotos != null) {
                    const message = await atualizaFileNameV2(lsFotos);
                    //console.log(message);
                }

                depara.status = 4;
                depara.user_update = id_usuario;

                await deparaSrv.updateDepara(depara);
            }
        }

        return { message: "Processamento OK" };
    } catch (error) {
        throw error;
    }
};

exports.CorrigeFileNamePadrao = async function(foto) {
    const params = await funcoes.loadCredencials(1);

    let driveService;

    console.log("Foto a", foto);

    const new_name = exports.PadronizaNomeFoto(foto);

    console.log("Foto b", foto);

    if (foto.id_pasta.trim() == "1Oc4S6bEQy_TPPPSsxzl1gYkOs8wvwuWq") {
        //google falconi

        let arquivo = "";

        if (PORT == 3000) {
            arquivo = "C:/Repositorios/Simionato/ativo web/keys/googlekey.json";
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
        const oauth2Client = funcoes.getoauth2Client(params);

        driveService = google.drive({ version: "v3", auth: oauth2Client });
    }
    console.log("foto c", foto);
    try {
        const res = await funcoes.renameFile(driveService, foto.id_file, new_name);

        const result = await fotoSrv.updateFotoFileName(foto, new_name);
    } catch (error) {
        throw error;
    }
};

exports.PadronizaNomeFoto = function(foto) {
    const uuid = crypto.randomUUID();
    const extensao = exports.pegarExtensao(foto.file_name_original);
    var retorno = `${foto.id_empresa.toString().padStart(2, "0")}_${foto.id_local.toString().padStart(6, "0")}_${foto.id_inventario.toString().padStart(6, "0")}_${foto.id_imobilizado.toString().padStart(6, "0")}_${uuid}${extensao}`;

    return retorno;
};

exports.PadronizaNomeFotoV2 = function(foto) {
    const uuid = crypto.randomUUID();
    const extensao = exports.pegarExtensao(foto.file_name_original);
    var retorno = `${foto.id_empresa.toString().padStart(2, "0")}_${foto.id_local.toString().padStart(6, "0")}_${foto.id_inventario.toString().padStart(6, "0")}_${foto.id_imobilizado.toString().padStart(6, "0")}_${uuid}${extensao}`;

    return retorno;
};

exports.retira_camera_foto = function(fileName) {
    return retira_camera_foto(fileName);
};

exports.pegarExtensao = function(nomeArquivo) {
    const partes = nomeArquivo.split(".");
    return partes.length > 1 ? "." + partes.pop() : "";
};