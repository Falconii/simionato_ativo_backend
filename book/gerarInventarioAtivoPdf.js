'use strict';
/**
 * Gera o PDF "Inventário de Ativo Imobilizado", uma página por registro.
 * Compatível com Node 14 (pdfkit 0.13.x).
 *
 * Uso:  node book/gerarInventarioAtivoPdf.js [caminho_saida.pdf]
 */
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const Code128Auto = require('jsbarcode/bin/barcodes/CODE128/CODE128_AUTO.js').default;

// ---------- dados ----------
const MAX_FOTOS = 4;
const ASSINATURAS = [
    'Responsável pela Conferência\n(Nome / Assinatura)',
    'Data da Baixa\n____ / ____ / ________',
    'Aprovação\n(Nome / Assinatura)',
];
const SITUACAO = {
    0: 'NÃO INVENTARIADO', 1: 'INVENTARIADO', 2: 'INVENTARIADO', 3: 'INVENTARIADO',
    4: 'INVENTARIADO', 5: 'NÃO ENCONTRADO', 6: 'BAIXADO',
};

/**
 * Converte um registro de imobilizadosinventarios nos dados da página.
 * ctx = { empresa, local, inventario }
 */
function montarDados(r, ctx) {
    const obs = (r.lanc_obs || '').trim();
    return {
        titulo: 'BOOK - Inventário de Ativo Imobilizado',
        empresa: ctx.empresa || '',
        local: ctx.local || '',
        inventario: ctx.inventario || '',
        etiquetaAntiga: String(r.id_imobilizado || ''),
        etiquetaNova: r.new_codigo ? String(r.new_codigo).padStart(6, '0') : '',
        descricao: r.imo_descricao || '',
        centroCusto: [r.new_cc || r.imo_cod_cc, r.new_cc ? r.new_cc_descricao : r.cc_descricao]
            .filter(Boolean).join(' - '),
        dataAquisicao: r.val_data_aquisicao || '',
        status: SITUACAO[r.status] || '',
        baixa: r.status === 6,
        observacao: obs,
        especificacaoBaixa: obs,
        fotos: [], // preenchido em gerar(): [{ legenda, buffer }]
        assinaturas: ASSINATURAS.map((a) => a.toUpperCase()),
    };
}

// ---------- estilo ----------
const COR = {
    texto: '#1a1a1a',
    vermelho: '#c8102e',
    vermelhoEscuro: '#9b0d22',
    rosaFundo: '#fbe3e6',
    rosaBorda: '#f0b4bb',
    cinzaBorda: '#c9ced6',
    cinzaFundo: '#f3f5f8',
    barra: '#4a4d52',
    preto: '#16161a',
    intelli: '#861414',
};
const FONTE = 'Helvetica';
const FONTE_B = 'Helvetica-Bold';

// Página A4 retrato (595 x 842 pt).
const LARGURA = 595;
const ALTURA = 842;
const MARGEM = 30;
const LARG_UTIL = LARGURA - 2 * MARGEM;

function cabecalho(doc, d) {
    // faixa escura e vermelho da Intelli, de ponta a ponta no topo
    doc.save();
    doc.moveTo(0, 0).lineTo(380, 0).bezierCurveTo(345, 20, 200, 34, 0, 37).closePath().fill(COR.preto);
    doc.moveTo(0, 34).bezierCurveTo(170, 32, 310, 20, 355, 3).lineTo(363, 3)
        .bezierCurveTo(315, 27, 170, 42, 0, 42).closePath().fill(COR.intelli);
    doc.restore();

    // logo da Intelli sobre a faixa (PNG já reduzido; o pdfkit o embute uma única vez)
    doc.image(LOGO_BOOK, MARGEM, 3, { height: 40 });

    doc.font(FONTE).fontSize(9).fillColor(COR.texto)
        .text(d.pagina, LARGURA - MARGEM - 150, 20, { width: 150, align: 'right', lineBreak: false });

    doc.font(FONTE_B).fontSize(18).fillColor(COR.texto)
        .text(d.titulo, 0, 55, { width: LARGURA, align: 'center', lineBreak: false });
}

const LOGO_BOOK = path.join(__dirname, '..', 'logo', 'logo_intelli_book.png');

const XVALOR = 140;

/** Campo com valor que quebra em até maxLinhas linhas. Retorna o Y do próximo campo. */
function campo(doc, rotulo, valor, y, maxLinhas) {
    maxLinhas = maxLinhas || 1;
    const largura = LARGURA - MARGEM - XVALOR;
    doc.font(FONTE_B).fontSize(10).fillColor(COR.texto).text(rotulo, MARGEM, y, { lineBreak: false });
    doc.font(FONTE).fontSize(10);
    const linha = doc.currentLineHeight(true);
    let texto = valor || '';
    const cabe = (t) => doc.heightOfString(t, { width: largura }) <= maxLinhas * linha + 1;
    if (!cabe(texto)) { // corta e acrescenta reticências só se passar do limite de linhas
        while (texto.length > 1 && !cabe(texto + '…')) texto = texto.slice(0, -1);
        texto = texto.trimEnd() + '…';
    }
    const h = doc.heightOfString(texto, { width: largura });
    doc.text(texto, XVALOR, y, { width: largura });
    return y + Math.max(18, h + 6.5);
}

function corStatus(d) {
    return d.baixa ? COR.vermelho : COR.barra;
}

function badgeStatus(doc, x, y, h, texto, cor) {
    doc.font(FONTE_B).fontSize(9);
    const w = Math.max(54, doc.widthOfString(texto) + 20);
    doc.roundedRect(x, y, w, h, 3).fill(cor);
    doc.fillColor('#fff').text(texto, x, y + (h - 9) / 2 + 1, { width: w, align: 'center', lineBreak: false });
}

/** Desenha os campos e retorna o Y onde termina o bloco. */
function dadosPrincipais(doc, d) {
    let y = 92;
    y = campo(doc, 'EMPRESA:', d.empresa, y);
    y = campo(doc, 'LOCAL:', d.local, y);
    y = campo(doc, 'INVENTÁRIO:', d.inventario, y);
    y = campo(doc, 'ATIVO:', d.etiquetaNova, y);
    y = campo(doc, 'DESCRIÇÃO:', d.descricao, y, 3);
    y = campo(doc, 'CENTRO DE CUSTO:', d.centroCusto, y, 2);

    doc.font(FONTE_B).fontSize(10).fillColor(COR.texto).text('STATUS:', MARGEM, y + 3, { lineBreak: false });
    badgeStatus(doc, XVALOR, y, 17, d.status, corStatus(d));
    y += 26;

    doc.font(FONTE_B).fontSize(10).fillColor(COR.texto).text('OBSERVAÇÃO:', MARGEM, y, { lineBreak: false });
    doc.font(FONTE).fontSize(9.5)
        .text(d.observacao, XVALOR, y, { width: LARGURA - MARGEM - XVALOR, height: 24, ellipsis: true });
    y += 32;

    y = campo(doc, 'DATA AQUISIÇÃO:', d.dataAquisicao, y);
    return y;
}

function secaoFotos(doc, d, yInicio) {
    const y0 = Math.max(285, yInicio + 12);
    const barraH = 20;
    const gap = 10;
    const capH = 16;
    const fotoW = (LARG_UTIL - 3 * gap) / 2;
    const fotoH = 150 - (y0 - 285) / 2; // encolhe as fotos se os campos de cima ocuparam mais linhas
    const altura = barraH + gap + 2 * (fotoH + capH) + 2 * gap;

    doc.roundedRect(MARGEM, y0, LARG_UTIL, altura, 4).lineWidth(1).strokeColor(COR.cinzaBorda).stroke();
    doc.roundedRect(MARGEM, y0, LARG_UTIL, barraH, 4).fill(COR.barra);
    doc.rect(MARGEM, y0 + 10, LARG_UTIL, barraH - 10).fill(COR.barra);
    doc.roundedRect(MARGEM + 10, y0 + 5, 16, 10, 2).fill('#fff');
    doc.circle(MARGEM + 18, y0 + 10, 3).fill(COR.barra);
    doc.font(FONTE_B).fontSize(10).fillColor('#fff').text('FOTOS DO ATIVO', MARGEM + 34, y0 + 5.5, { lineBreak: false });

    // 4 quadros em grade 2 x 2 + legendas
    for (let i = 0; i < MAX_FOTOS; i++) {
        const foto = d.fotos[i] || { legenda: `FOTO ${i + 1}`, buffer: null };
        const x = MARGEM + gap + (i % 2) * (fotoW + gap);
        const y = y0 + barraH + gap + Math.floor(i / 2) * (fotoH + capH + gap);
        doc.rect(x, y, fotoW, fotoH).lineWidth(0.8).fillAndStroke('#fafafa', COR.cinzaBorda);
        if (foto.buffer) {
            doc.image(foto.buffer, x + 1, y + 1, { fit: [fotoW - 2, fotoH - 2], align: 'center', valign: 'center' });
        }
        doc.rect(x, y + fotoH, fotoW, capH).lineWidth(0.8).fillAndStroke(COR.cinzaFundo, COR.cinzaBorda);
        doc.font(FONTE).fontSize(8).fillColor(COR.texto)
            .text(foto.legenda, x, y + fotoH + 4.5, { width: fotoW, align: 'center', lineBreak: false });
    }
    return y0 + altura;
}

// Logo Intelli: lê os <path> do SVG (logo/logo_intelli.svg) e desenha como vetor.
const LOGO = (() => {
    try {
        const svg = fs.readFileSync(path.join(__dirname, '..', 'logo', 'logo_intelli.svg'), 'utf8');
        const [, w, h] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
        const paths = (svg.match(/<path[^>]*>/g) || []).map((tag) => ({
            d: (tag.match(/\sd="([^"]+)"/) || [])[1],
            fill: (tag.match(/\sfill="([^"]+)"/) || [])[1] || 'black',
            evenodd: /fill-rule="evenodd"/.test(tag),
        })).filter((p) => p.d && p.fill !== 'none');
        return { w: Number(w), h: Number(h), paths };
    } catch (e) {
        return { w: 105, h: 32, paths: [] };
    }
})();

function desenharLogo(doc, x, y, largura) {
    doc.save();
    doc.translate(x, y).scale(largura / LOGO.w);
    LOGO.paths.forEach((p) => doc.path(p.d).fill(p.fill, p.evenodd ? 'evenodd' : 'nonzero'));
    doc.restore();
}

function codigoBarras(texto) {
    const enc = new Code128Auto(texto, {}).encode();
    return enc.data; // string de 0/1 (1 = barra), 1 módulo por caractere
}

function caixaEtiqueta(doc, d, ey) {
    // Etiqueta de patrimônio: 5 x 1,5 cm
    const cm = 72 / 2.54;
    const ew = 5 * cm, eh = 1.5 * cm, ex = MARGEM;

    // chapa metálica
    const grad = doc.linearGradient(ex, ey, ex, ey + eh);
    grad.stop(0, '#e4e6e9').stop(0.5, '#c4c7cb').stop(1, '#d6d8db');
    doc.roundedRect(ex, ey, ew, eh, 3).fill(grad);
    doc.roundedRect(ex, ey, ew, eh, 3).lineWidth(0.6).strokeColor('#8d9095').stroke();

    // logo Intelli (SVG)
    const lw = 54, lh = lw * LOGO.h / LOGO.w;
    desenharLogo(doc, ex + 6, ey + (eh - lh) / 2, lw);

    // "Patrimônio" + código de barras + número
    const bx = ex + 68, bw = ew - 68 - 8;
    doc.font(FONTE_B).fontSize(7.5).fillColor(COR.preto).text('Patrimônio', bx, ey + 3.5, { width: bw, align: 'center', lineBreak: false });
    if (!d.etiquetaNova) return; // sem código novo: etiqueta sem barras
    const bits = codigoBarras(d.etiquetaNova);
    const mod = bw / bits.length;
    const by = ey + 13, bh = 17;
    for (let i = 0; i < bits.length; ) {
        if (bits[i] !== '1') { i++; continue; }
        let j = i;
        while (j < bits.length && bits[j] === '1') j++;
        doc.rect(bx + i * mod, by, (j - i) * mod, bh);
        i = j;
    }
    doc.fill(COR.preto);
    doc.font(FONTE_B).fontSize(9.5).fillColor(COR.preto).text(d.etiquetaNova, bx, by + bh + 1.5, { width: bw, align: 'center', lineBreak: false });
}

function assinaturas(doc, d) {
    const yTracejado = 735;
    doc.lineWidth(1).strokeColor('#555').dash(4, { space: 3 })
        .moveTo(MARGEM, yTracejado).lineTo(LARGURA - MARGEM, yTracejado).stroke().undash();

    const w = 150, gap = (LARG_UTIL - 3 * w) / 2;
    [0, 1, 2].forEach((i) => {
        const x = MARGEM + i * (w + gap);
        doc.lineWidth(0.8).strokeColor('#555').moveTo(x, 782).lineTo(x + w, 782).stroke();
        const [l1, l2] = d.assinaturas[i].split('\n');
        doc.font(FONTE).fontSize(7.5).fillColor(COR.texto)
            .text(l1, x, 788, { width: w, align: 'center', lineBreak: false })
            .text(l2, x, 798, { width: w, align: 'center', lineBreak: false });
    });
}

/**
 * Gera um PDF com uma página para cada registro.
 * @param {string} caminhoSaida arquivo PDF a ser gravado
 * @param {Array}  registros    linhas de imobilizadosinventarios
 * @param {Object} ctx          { empresa, local, inventario, obterFotos?, onProgress?, onInicio? }
 *                              obterFotos(registro) -> Promise<[{ legenda, buffer }]> (buscada página a página)
 */
function gerar(caminhoSaida, registros, ctx) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            size: [LARGURA, ALTURA],
            margin: 0,
            autoFirstPage: false,
            info: { Title: 'Inventário de Ativo Imobilizado', Author: 'Simionato Auditorias Independentes' },
        });
        const stream = fs.createWriteStream(caminhoSaida);
        stream.on('finish', () => resolve(caminhoSaida));
        stream.on('error', reject);
        doc.pipe(stream);

        const total = registros.length;
        (async () => {
            for (let i = 0; i < total; i++) {
                const r = registros[i];
                if (ctx.onInicio) ctx.onInicio(i + 1, total, r);
                doc.addPage({ size: [LARGURA, ALTURA], margin: 0 });
                const d = montarDados(r, ctx);
                d.pagina = `Página ${i + 1} de ${total}`;
                d.fotos = ctx.obterFotos ? await ctx.obterFotos(r) : [];
                cabecalho(doc, d);
                const yCampos = dadosPrincipais(doc, d);
                const fim = secaoFotos(doc, d, yCampos);
                caixaEtiqueta(doc, d, fim + 18);
                assinaturas(doc, d);
                d.fotos = null; // libera os buffers da página
                if (ctx.onProgress) ctx.onProgress(i + 1, total, r);
            }
            doc.end();
        })().catch(reject);
    });
}

module.exports = { gerar, montarDados };
