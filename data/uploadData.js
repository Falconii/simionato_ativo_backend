const db = require('../infra/database');

exports.insertDraft = async function(id_empresa, linha, tabela) {

    return db.oneOrNone('insert into draft(id_empresa,linha,tabela) values ($1,$2,$3) returning * ', [id_empresa, linha, tabela]);

};