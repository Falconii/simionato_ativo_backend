/* DATA celulares */
const db = require('../infra/database');

   /* CRUD - INSERT */
   exports.insertDe_Para = function(depara) {
    strSql = `insert into de_para (
		   id_empresa,id_local,id_inventario,de,para,status,user_insert,user_update
		 ) 
		 values(
		     ${depara.id_empresa} 
		 ,   ${depara.id_local} 
		 ,   ${depara.id_inventario} 
		 ,   ${depara.de}
         ,   ${depara.para}
         ,   ${depara.status}
		 ,   ${depara.user_insert} 
		 ,   ${depara.user_update} 
		 ) 
     returning * `;
    console.log("Insert =>",strSql);
    return db.oneOrNone(strSql);
};

/* CRUD - UPDATE */
exports.updateDe_Para = function(depara) {
    strSql = `UPDATE de_para SET
                 status        = ${depara.status},      
                 user_update   = ${depara.user_update}
              WHERE id_empresa = ${depara.id_empresa} and id_local = ${depara.id_local} and id_inventario = ${depara.id_inventario} and de = ${depara.de} and para = ${depara.para}
    RETURNING *`;
    console.log("Update ==>",strSql);
    return db.oneOrNone(strSql);
};

/* CRUD GET */
exports.processarDePara = function(params) {
    strSql = `SELECT   
                _qtd from call_change_inv(${params.id_empresa},${params.id_local},${params.id_inventario},${params.status})`;

    console.log("-->",strSql);
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
            where += `depara.status = ${params.status} `;
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
                      FROM de_para depara      
                      ${ where} `;
            return db.one(sqlStr);

        }  else {
            strSql = `select   
                   depara.id_empresa    as  id_empresa
                ,  depara.id_local      as  id_local
                ,  depara.id_inventario as  id_inventario
                ,  depara.de            as  de
                ,  depara.para          as  para
                ,  depara.status        as  status 
                ,  depara.user_insert    as  user_insert  
                ,  depara.user_update    as  user_update     
                FROM de_para depara      
                ${where} 			${ orderby} ${ paginacao} `;
                console.log("==>",strSql)
                return  db.manyOrNone(strSql);
            }	
    }