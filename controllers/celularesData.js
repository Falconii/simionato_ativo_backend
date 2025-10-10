/* DATA celulares */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Celular) {
    return [
        Celular.id,
        Celular.androidid,
        Celular.modelo,
        Celular.fabricante,
        Celular.versao_os,
        Celular.status,
    ];
};
/* CRUD GET */
exports.getCelular = function(id) {
    strSql = `SELECT   
                 celulares.id AS id,
                 celulares.androidid AS androidid,
                 celulares.modelo AS modelo,
                 celulares.fabricante AS fabricante,
                 celulares.versao_os AS versao_os,
                 celulares.status AS status
              FROM celulares
              WHERE celulares.id = '${id}'`;
    console.log("getCelular", strSql);
    return db.oneOrNone(strSql);
};
/* CRUD GET ALL */
exports.getCelulares = function(params) {
    if (params) {
        let where = "";
        let orderby = "";
        let paginacao = "";

        if (!params.orderby) orderby = 'celulares.id';
        if (params.orderby === 'Modelo') orderby = 'celulares.modelo';

        if (orderby) orderby = " ORDER BY " + orderby;

        if (params.androidid) {
            if (where) where += " AND ";
            where += `celulares.id = '${params.id}' `;
        }
        if (params.status) {
            if (where) where += " AND ";
            where += `celulares.status = '${params.status}' `;
        }
        if (where) where = " WHERE " + where;

        if (params.contador === 'S') {
            const sqlStr = `SELECT COALESCE(COUNT(*), 0) AS total 
                            FROM celulares ${where}`;
            return db.one(sqlStr);
        } else {
            strSql = `SELECT 
                         celulares.id AS id,
                         celulares.androidid AS androidid,
                         celulares.modelo AS modelo,
                         celulares.fabricante AS fabricante,
                         celulares.versao_os AS versao_os,
                         celulares.status AS status
                      FROM celulares 
                      ${where} ${orderby} ${paginacao}`;
            return db.manyOrNone(strSql);
        }
    } else {
        strSql = `SELECT 
                     celulares.id AS id,
                     celulares.androidid AS androidid,
                     celulares.modelo AS modelo,
                     celulares.fabricante AS fabricante,
                     celulares.versao_os AS versao_os,
                     celulares.status AS status
                  FROM celulares`;
        return db.manyOrNone(strSql);
    }
};
/* CRUD - INSERT */
exports.insertCelular = function(celular) {
    strSql = `INSERT INTO celulares (
                 androidid, 
                 modelo, 
                 fabricante, 
                 versao_os, 
                 status
              ) VALUES (
                 '${celular.androidid}', 
                 '${celular.modelo}', 
                 '${celular.fabricante}', 
                 '${celular.versao_os}', 
                 '${celular.status}'
              ) 
    RETURNING *`;
    return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updateCelular = function(celular) {
    strSql = `UPDATE celulares SET
                 androidid = '${celular.androidid}',      
                 modelo = '${celular.modelo}', 
                 fabricante = '${celular.fabricante}', 
                 versao_os = '${celular.versao_os}', 
                 status = '${celular.status}'
              WHERE id = '${celular.id}'
    RETURNING *`;
    return db.oneOrNone(strSql);
};
/* CRUD - DELETE */
exports.deleteCelular = function(id) {
    strSql = `DELETE FROM celulares 
              WHERE id = '${id}'`;
    return db.oneOrNone(strSql);
};
