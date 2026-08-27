/* DATA celulares */
const db = require("../../infra/database");

/* CRUD GET */
exports.processarDePara = function(params) {
    strSql = `SELECT   
                _qtd from call_change_inv(${params.id_empresa},${params.id_local},${params.id_inventario},${params.status})`;

    console.log("-->", strSql);
    return db.oneOrNone(strSql);
};

exports.processarDeParaV2 = function(params) {
    strSql = `SELECT   
                _qtd from de_para_v2(${params.id_empresa},${params.id_local},${params.id_inventario},${params.status},${params.id_usuario},${params.id_imobilizado})`;

    console.log("-->", strSql);
    return db.oneOrNone(strSql);
};

exports.existeDepara = function(id_empresa, id_local, id_inventario, ativo) {
    strSql = `select * from de_para 
		 where id_empresa = ${id_empresa} and  id_local = ${id_local} and  id_inventario = ${id_inventario} and ( de = ${ativo} or  para = ${ativo} )  `;

    console.log("existeDepara", strSql);
    return db.manyOrNone(strSql);
};

exports.existeDeparaLocal = function(id_empresa, id_local, ativo) {
    strSql = `select * from de_para 
		 where id_empresa = ${id_empresa} and  id_local = ${id_local} and  ( de = ${ativo} or  para = ${ativo} )  `;

    console.log("existeDepara", strSql);
    return db.manyOrNone(strSql);
};