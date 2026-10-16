'use strict';
/**
 * Busca as fotos de um imobilizado no Google Drive e devolve Buffers JPEG já reduzidos
 * (nada é gravado em disco).
 */
const sharp = require('sharp');
const { google } = require('googleapis');
const funcoes = require('../util/googleFuncoes');
const fotoSrv = require('../service/fotoService');

const PORT = process.env.PORT || 3000;
const PASTA_GOOGLE_FALCONI = '1Oc4S6bEQy_TPPPSsxzl1gYkOs8wvwuWq';
const MAX_FOTOS = 4;
const MAX_LARGURA = 900; // px; o quadro no PDF tem ~255 x 150 pt
const MAX_ALTURA = 600;

/** Cria o provedor de drives (credenciais carregadas uma única vez por geração). */
async function criarProvedor() {
    const params = await funcoes.loadCredencials(1);
    let oauth = null;
    let conta = null;

    return function drivePara(id_pasta) {
        if ((id_pasta || '').trim() === PASTA_GOOGLE_FALCONI) {
            if (!conta) {
                const keyFile = PORT == 3000
                    ? 'C:/Repositorios/Simionato/ativo web/keys/googlekey.json'
                    : './keys/googlekey.json';
                const auth = new google.auth.GoogleAuth({
                    keyFile,
                    scopes: ['https://www.googleapis.com/auth/drive'],
                });
                conta = google.drive({ version: 'v3', auth });
            }
            return conta;
        }
        if (!oauth) {
            oauth = google.drive({ version: 'v3', auth: funcoes.getoauth2Client(params) });
        }
        return oauth;
    };
}

async function baixarFoto(drive, id_file) {
    const resp = await drive.files.get({ fileId: id_file, alt: 'media' }, { responseType: 'arraybuffer' });
    return sharp(Buffer.from(resp.data))
        .rotate() // aplica a orientação EXIF
        .resize(MAX_LARGURA, MAX_ALTURA, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();
}

/**
 * Retorna [{ legenda, buffer }] com até 4 fotos do imobilizado.
 * Foto que não existe mais no Drive é ignorada (a próxima ocupa o lugar).
 */
async function obterFotos(drivePara, ctx, registro) {
    const lista = await fotoSrv.getFotos({
        id_empresa: ctx.id_empresa,
        id_local: ctx.id_filial,
        id_inventario: ctx.id_inventario,
        id_imobilizado: registro.id_imobilizado,
        id_pasta: '',
        id_file: '',
        file_name: '',
        destaque: '',
        orderby: '',
        pagina: 0,
        contador: 'N',
        sharp: false,
    });

    // tenta algumas fotos além das 4 para compensar registros cujo arquivo não existe mais no Drive
    const candidatas = (lista || []).slice(0, MAX_FOTOS * 2);
    const baixadas = await Promise.all(candidatas.map(async (f) => {
        try {
            return await baixarFoto(drivePara(f.id_pasta), f.id_file);
        } catch (err) {
            console.warn(`Book: foto ${f.id_file} do imobilizado ${registro.id_imobilizado} indisponível no Drive: ${err.message}`);
            return null;
        }
    }));
    return baixadas
        .filter(Boolean)
        .slice(0, MAX_FOTOS)
        .map((buffer, i) => ({ legenda: `FOTO ${i + 1}`, buffer }));
}

module.exports = { criarProvedor, obterFotos };
