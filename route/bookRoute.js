/* ROUTE book */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const path = require('path');
const os = require('os');
const fs = require('fs');
const { gerar } = require('../book/gerarInventarioAtivoPdf');
const imoSrv = require('../service/imobilizadoinventarioService');
const inventarioSrv = require('../service/inventarioService.js');
const empresaSrv = require('../service/empresaService.js');
const localSrv = require('../service/localService.js');
const fotosDrive = require('../book/fotosDrive');

const DIR_BOOK = path.resolve(__dirname, '..', 'rel_book');
const NOME_VALIDO = /^book_[\w-]+\.pdf$/;
const jobs = new Map(); // filename -> { status, total, atual, erro }

function formatarDuracao(ms) {
    const total = Math.round(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return (h ? h + 'h ' : '') + (h || m ? m + 'min ' : '') + s + 's';
}

async function processarBook(arquivo, registros, params, dados, job) {
    const tmp = arquivo + '.tmp';
    const inicio = Date.now();
    try {
        await fs.promises.mkdir(DIR_BOOK, { recursive: true });
        console.log(`Book ${path.basename(arquivo)}: iniciado (${registros.length} ativos)`);
        const drivePara = await fotosDrive.criarProvedor();
        await gerar(tmp, registros, {
            empresa: dados.emp.razao,
            local: dados.local.razao,
            inventario: dados.inventario.descricao,
            obterFotos: (registro) => fotosDrive.obterFotos(drivePara, params, registro),
            onInicio: (atual, total, r) => {
                console.log(`Book ${path.basename(arquivo)}: ${atual} de ${total} - buscando ativo ${r.id_imobilizado}`);
            },
            onProgress: (atual, total, r) => {
                job.atual = atual;
                console.log(`Book ${path.basename(arquivo)}: ${atual} de ${total} - ativo ${r.id_imobilizado} pronto`);
            },
        });
        await fs.promises.rename(tmp, arquivo); // só aparece com o nome final quando estiver completo
        job.status = 'pronto';
        job.duracao = formatarDuracao(Date.now() - inicio);
        console.log(`Book ${path.basename(arquivo)}: concluído em ${job.duracao}`);
    } catch (err) {
        console.error(`Book: erro ao gerar ${path.basename(arquivo)} após ${formatarDuracao(Date.now() - inicio)}`, err);
        job.status = 'erro';
        job.erro = err.message;
        fs.unlink(tmp, () => {});
    }
}

/* CONSULTA O ANDAMENTO DO BOOK */
router.get("/status/:filename", function(req, res) {
    const filename = req.params.filename;
    if (!NOME_VALIDO.test(filename)) return res.status(400).json({ message: 'Nome de arquivo inválido' });
    const job = jobs.get(filename);
    if (job) return res.status(200).json(job);
    // servidor reiniciado: se o arquivo existe, está pronto
    if (fs.existsSync(path.join(DIR_BOOK, filename))) return res.status(200).json({ status: 'pronto' });
    res.status(404).json({ message: 'Book não encontrado' });
});

/* BAIXA O BOOK PRONTO (o arquivo não é apagado) */
router.get("/download/:filename", function(req, res) {
    const filename = req.params.filename;
    if (!NOME_VALIDO.test(filename)) return res.status(400).json({ message: 'Nome de arquivo inválido' });
    const arquivo = path.join(DIR_BOOK, filename);
    if (!fs.existsSync(arquivo)) return res.status(404).json({ message: 'Book não encontrado ou ainda em processamento' });
    res.download(arquivo, filename);
});

/* ROTA CONSULTA POST auditorias */
router.post("/gerarbook",async function(req, res) {
/*
    {
    "id_empresa":   1,
    "id_filial":   14,
    "id_inventario":   10,
    "id_imobilizado": 308,
    "id_cc":   "",
    "id_grupo":   0,
    "descricao":   "",
    "observacao":   "",
    "status":   1,
    "new_cc":   "",
    "new_codigo":   0,
    "id_usuario":   0,
    "origem":   "",
    "condicao":   0,
    "book":   "",
    "dtinicial":   "",
    "dtfinal":   "",
    "id_principal":   0,
    "apelido":   "",
    "nfe":   "",
    "filtra_depara":   "",
    "pagina":   1,
    "tamPagina":  20,
    "contador":   "N",
    "orderby":   "",
    "sharp":   false
    }
*/
try 
    {
        const params = req.body;

        const imobilizados = await imoSrv.getImobilizadosinventarios(params);

        const inventario = await inventarioSrv.getInventario(params.id_empresa, params.id_filial, params.id_inventario);
        const emp = await empresaSrv.getEmpresa(params.id_empresa);
        const local = await localSrv.getLocal(params.id_empresa, params.id_filial);
        if (emp == null || local == null || inventario == null)
        {
            return res.status(409).json({ message: 'Empresa, Local Ou Inventário Não Encontrados!' });
        }
        if (!imobilizados || imobilizados.length == 0)
        {
            return res.status(409).json({ message: 'Nenhum Registro Encontrado!' });
        }

        // uma página por imobilizado (a consulta pode repetir o imobilizado por foto)
        const unicos = [];
        const vistos = new Set();
        imobilizados.forEach((r) => {
            if (!vistos.has(r.id_imobilizado)) { vistos.add(r.id_imobilizado); unicos.push(r); }
        });

        //resultado da pesquisa
        /*
            {
                id_empresa: 1,
                id_filial: 15,
                id_inventario: 11,
                id_imobilizado: 3,
                id_lanca: 14304,
                status: 4,
                new_codigo: 2944,
                new_cc: '12-2',
                condicao: 1,
                book: 'N',
                user_insert: 1,
                user_update: 0,
                imo_descricao: 'EXPECTRÔMETRO GNR OPTICO     ESA DESK 04018EDKO',
                imo_cod_cc: '3-15',
                imo_cod_grupo: 5,
                imo_nfe: '',
                imo_serie: '',
                imo_item: '',
                imo_origem: 'P',
                imo_principal: 0,
                imo_apelido: 'APELIDO',
                cc_descricao: 'DEPARTAMENTO DE PRODUÇÃO-LABORATÓRIO',
                grupo_descricao: 'MÁQ EQUIP LABORATÓRIO - REAVAL                              ',
                lanc_id_usuario: 29,
                lanc_obs: 'EQUIPAMENTO - ESPECTRÔMETRO GNR MOD: ESA-DESK N/S: 04018EDKO1 POT: 0.5KW (FUNDIÇÃO ADMINISTRATIVO CQ) (OBSOLETO)',
                lanc_dt_lanca: '29/08/2025',
                lanc_estado: 4,
                lanc_condicao: 1,
                lanc_book: 'N',
                usu_razao: 'ANDRE DA CONCEIÇÃO',
                new_cc_descricao: 'INTELLI IND.TERM.ELETR.LTDA - FUNDIÇÃO-CONTROLE DE QUALIDADE',
                princ_descricao: '',
                para_ativo: 0,
                para_status: 0,
                de_ativo: 0,
                de_status: 0,
                val_data_aquisicao: '31/12/2007',
                nfes_nfes_qtd: '0',
                nfes_nfes_punit: '0',
                nfes_nfes_totalitem: '0',
                nfes_nfes_vlrcontabil: '0'
            }
    ]

        */

        // gera em segundo plano e responde na hora; o arquivo fica em rel_book/ (não é apagado)
        const filename = 'book_' + params.id_empresa + '_' + params.id_filial + '_' + params.id_inventario + '_' + Date.now() + '.pdf';
        const arquivo = path.join(DIR_BOOK, filename);
        const job = { status: 'processando', total: unicos.length, atual: 0, erro: null };
        jobs.set(filename, job);

        res.status(200).json({ message: 'Book em processamento', filename: filename, total: unicos.length });

        processarBook(arquivo, unicos, params, { emp, local, inventario }, job);

   
}
catch (err)
    {
        if(err.name == 'MyExceptionDB')
        {
            res.status(409).json(err);
        }
        else
        {
            res.status(500).json({ erro: 'BAK-END', tabela: 'Auditoria', message: err.message });
        }
    }
})

module.exports = router;