/* DATA realoc_transf */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Realocado){
return [ 
			Realocado.id_empresa, 
			Realocado.id_local, 
			Realocado.id_inventario, 
			Realocado.id_realocado, 
			Realocado.id_transferido, 
			Realocado.novo_realocado, 
			Realocado.status, 
			Realocado.user_insert, 
			Realocado.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getRealocado = function(id_empresa,id_local,id_inventario,id_realocado,id_transferido){
	strSql = ` select   
			   param.id_empresa as  id_empresa  
			,  param.id_local as  id_local  
			,  param.id_inventario as  id_inventario  
			,  param.id_realocado as  id_realocado  
			,  param.id_transferido as  id_transferido  
			,  param.novo_realocado as  novo_realocado  
			,  param.status as  status  
			,  param.user_insert as  user_insert  
			,  param.user_update as  user_update    
 			FROM realoc_transf param 	     
			 where param.id_empresa = ${id_empresa} and  param.id_local = ${id_local} and  param.id_inventario = ${id_inventario} and  param.id_realocado = ${id_realocado} and  param.id_transferido = ${id_transferido}  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getRealocados = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'param.id_empresa,id_local,id_inventario,id_realocado';
	if(params.orderby == 'ID_REALOCADO') orderby = 'param.id_empresa,id_local,id_inventario,id_realocado';
	if(params.orderby == 'ID_TRANSFERIDO') orderby = 'param.id_empresa,id_local,id_inventario,id_transferido';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `param.id_empresa = ${params.id_empresa} `;
	}
	if(params.id_local  !== 0 ){
		if (where != "") where += " and "; 
		where += `param.id_local = ${params.id_local} `;
	}
	if(params.id_inventario  !== 0 ){
		if (where != "") where += " and "; 
		where += `param.id_inventario = ${params.id_inventario} `;
	}
	if(params.id_realocado  !== 0 ){
		if (where != "") where += " and "; 
		where += `param.id_realocado = ${params.id_realocado} `;
	}
	if(params.id_transferido  !== 0 ){
		if (where != "") where += " and "; 
		where += `param.id_transferido = ${params.id_transferido} `;
	}
	if (where != "") where = " where " + where;
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM realoc_transf param      
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   param.id_empresa as  id_empresa  
			,  param.id_local as  id_local  
			,  param.id_inventario as  id_inventario  
			,  param.id_realocado as  id_realocado  
			,  param.id_transferido as  id_transferido  
			,  param.novo_realocado as  novo_realocado  
			,  param.status as  status  
			,  param.user_insert as  user_insert  
			,  param.user_update as  user_update     
			FROM realoc_transf param      
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   param.id_empresa as  id_empresa  
			,  param.id_local as  id_local  
			,  param.id_inventario as  id_inventario  
			,  param.id_realocado as  id_realocado  
			,  param.id_transferido as  id_transferido  
			,  param.novo_realocado as  novo_realocado  
			,  param.status as  status  
			,  param.user_insert as  user_insert  
			,  param.user_update as  user_update    
			FROM realoc_transf param			     `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertRealocado = function(realocado){
	strSql = `insert into realoc_transf (
		     id_empresa 
		 ,   id_local 
		 ,   id_inventario 
		 ,   id_realocado 
		 ,   id_transferido 
		 ,   novo_realocado 
		 ,   status 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${realocado.id_empresa} 
		 ,   ${realocado.id_local} 
		 ,   ${realocado.id_inventario} 
		 ,   ${realocado.id_realocado} 
		 ,   ${realocado.id_transferido} 
		 ,   ${realocado.novo_realocado} 
		 ,   ${realocado.status} 
		 ,   ${realocado.user_insert} 
		 ,   ${realocado.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateRealocado = function(realocado){
	strSql = `update   realoc_transf set  
		     novo_realocado = ${realocado.novo_realocado} 
 		 ,   status = ${realocado.status} 
 		 ,   user_insert = ${realocado.user_insert} 
 		 ,   user_update = ${realocado.user_update} 
 		 where id_empresa = ${realocado.id_empresa} and  id_local = ${realocado.id_local} and  id_inventario = ${realocado.id_inventario} and  id_realocado = ${realocado.id_realocado} and  id_transferido = ${realocado.id_transferido}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteRealocado = function(id_empresa,id_local,id_inventario,id_realocado,id_transferido){
	strSql = `delete from realoc_transf 
		 where id_empresa = ${id_empresa} and  id_local = ${id_local} and  id_inventario = ${id_inventario} and  id_realocado = ${id_realocado} and  id_transferido = ${id_transferido}  `;
 	return  db.oneOrNone(strSql);
}


exports.processarRealocar = function(id_empresa, id_local, id_inventario,status) {
    strSql = `SELECT   
                _qtd from realocar(${id_empresa}, ${id_local}, ${id_inventario},${status})`;

    console.log("-->",strSql);
    return db.oneOrNone(strSql);
};


/* CRUD - UPDATE */
exports.updateRealocado_status = function(realocado) {
    strSql = `UPDATE realoc_transf SET
                 status        = ${realocado.status},      
                 user_update   = ${realocado.user_update}
				 where id_empresa = ${realocado.id_empresa} and  id_local = ${realocado.id_local} and  id_inventario = ${realocado.id_inventario} and  id_realocado = ${realocado.id_realocado} and  id_transferido = ${realocado.id_transferido} 
    RETURNING *`;
    console.log("Update ==>",strSql);
    return db.oneOrNone(strSql);
};
