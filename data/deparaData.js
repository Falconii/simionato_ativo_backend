/* DATA celulares */
const db = require('../infra/database');

/* CRUD GET */
exports.processarDePara = function(params) {
    strSql = `SELECT   
                select _qtd from call_change_inv(${params.id_empresa},${params.id_local},${params.id_inventario},${params.status})`;
    return db.oneOrNone(strSql);
};

/* CRUD GET ALL*/
exports.getDeParas = function(params){
    
        where = "";
        orderby = "";
        paginacao = "";
    
        if(params.orderby == '') orderby = 'depara.id_empresa,depara.id_local,depara.id_inventario,depara.de';
    
        if (orderby != "") orderby = " order by " + orderby;

        if(params.id_empresa  !== 0 ){
            if (where != "") where += " and "; 
            where += `depara.id_empresa = ${params.id_empresa} `;
        }

        if(params.id_local  !== 0 ){
            if (where != "") where += " and "; 
            where += `depara.id_local = ${params.id_local} `;
        }

        if(params.id_inventario  !== 0 ){
            if (where != "") where += " and "; 
            where += `depara.id_inventario = ${params.id_inventario} `;
        }

        if(params.status  !== 0 ){
            if (where != "") where += " and "; 
            where += `depara.status = ${params.status-1} `;
        }

        if(params.de  !== 0 ){
            if (where != "") where += " and "; 
            where += `depara.de = ${params.de} `;
        }

        if(params.para  !== 0 ){
            if (where != "") where += " and "; 
            where += `depara.para = ${params.para} `;
        }

        if (where != "") where = " where " + where;

        if (params.contador == 'S') {
            sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
                      FROM depara depara      
                      ${ where} `;
            return db.one(sqlStr);

        }  else {
            strSql = `select   
                   depara.id_empresa    as  ind_empresa
                ,  depara.id_local      as  id_local
                ,  depara.id_inventario as  id_inventario
                ,  depara.de            as  de
                ,  depara.para          as  para
                ,  depara.status        as  status 
                ,  param.user_insert    as  user_insert  
                ,  param.user_update    as  user_update     
                FROM depara depara      
                ${where} 			${ orderby} ${ paginacao} `;
                return  db.manyOrNone(strSql);
            }	
    }