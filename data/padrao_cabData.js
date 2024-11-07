/* DATA padroes_cab */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Padrao_Cab){
return [ 
			Padrao_Cab.id, 
			Padrao_Cab.apelido, 
			Padrao_Cab.descricao, 
			Padrao_Cab.user_insert, 
			Padrao_Cab.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getPadrao_Cab = function(id){
	strSql = ` select   
			   cab.id as  id  
			,  cab.apelido as  apelido  
			,  cab.descricao as  descricao  
			,  cab.user_insert as  user_insert  
			,  cab.user_update as  user_update    
 			FROM padroes_cab cab 	     
			 where cab.id = ${id}  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getPadroes_Cab = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'cab.id';
	if(params.orderby == 'ID') orderby = 'cab.id';
	if(params.orderby == 'APELIDO') orderby = 'cab.apelido';
	if(params.orderby == 'DESCRICAO') orderby = 'cab.descricao';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id  !== 0 ){
		if (where != "") where += " and "; 
		where += `cab.id = ${params.id} `;
	}
	if(params.apelido.trim()  !== ''){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `cab.apelido = '${params.apelido}' `;
		} else 
		{
			where += `cab.apelido like '%${params.apelido.trim()}%' `;
		}
	}
	if(params.descricao.trim()  !== ''){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `cab.descricao = '${params.descricao}' `;
		} else 
		{
			where += `cab.descricao like '%${params.descricao.trim()}%' `;
		}
	}
	if(params.id_usuario  !== 0 ){
		if (where != "") where += " and "; 
		where += `cab.id_usuario = ${params.id_usuario} `;
	}


	if (where != "") where = " where " + where;

	
	if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset ((${params.pagina} - 1) * ${params.tamPagina})`;
	}

	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM padroes_cab cab      
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   cab.id as  id  
			,  cab.apelido as  apelido  
			,  cab.descricao as  descricao  
			,  cab.user_insert as  user_insert  
			,  cab.user_update as  user_update     
			FROM padroes_cab cab      
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   cab.id as  id  
			,  cab.apelido as  apelido  
			,  cab.descricao as  descricao  
			,  cab.user_insert as  user_insert  
			,  cab.user_update as  user_update    
			FROM padroes_cab cab			     `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertPadrao_Cab = function(padrao_cab){
	strSql = `insert into padroes_cab (
		     apelido 
		 ,   descricao 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     '${padrao_cab.apelido}' 
		 ,   '${padrao_cab.descricao}' 
		 ,   ${padrao_cab.user_insert} 
		 ,   ${padrao_cab.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updatePadrao_Cab = function(padrao_cab){
	strSql = `update   padroes_cab set  
		     apelido = '${padrao_cab.apelido}' 
 		 ,   descricao = '${padrao_cab.descricao}' 
 		 ,   user_insert = ${padrao_cab.user_insert} 
 		 ,   user_update = ${padrao_cab.user_update} 
 		 where id = ${padrao_cab.id}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deletePadrao_Cab = function(id){
	strSql = `delete from padroes_cab 
		 where id = ${id}  `;
 	return  db.oneOrNone(strSql);
}


