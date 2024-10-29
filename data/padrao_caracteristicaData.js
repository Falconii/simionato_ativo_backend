/* DATA padroes_caracteristica */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Padrao_Caracteristica){
return [ 
			Padrao_Caracteristica.id_cab, 
			Padrao_Caracteristica.id, 
			Padrao_Caracteristica.descricao, 
			Padrao_Caracteristica.user_insert, 
			Padrao_Caracteristica.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getPadrao_Caracteristica = function(id_cab,id){
	strSql = ` select   
			   caract.id_cab as  id_cab  
			,  caract.id as  id  
			,  caract.descricao as  descricao  
			,  caract.user_insert as  user_insert  
			,  caract.user_update as  user_update  
			,  cab.descricao as  apelido_descricao    
 			FROM padroes_caracteristica caract 	  
				 inner join padroes_cab cab on caract.id_cab = cab.id   
			 where caract.id_cab = ${id_cab} and  caract.id = ${id}  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getPadroes_Caracteristica = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'caract.cab_id,caract.id';
	if(params.orderby == 'ID') orderby = 'caract.cab_id,caract.id';
	if(params.orderby == 'DESCRICAO') orderby = 'caract.descricao';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_cab  !== 0 ){
		if (where != "") where += " and "; 
		where += `caract.id_cab = ${params.id_cab} `;
	}
	if(params.id  !== 0 ){
		if (where != "") where += " and "; 
		where += `caract.id = ${params.id} `;
	}
	if(params.descricao.trim()  !== ''){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `caract.descricao = '${params.descricao}' `;
		} else 
		{
			where += `caract.descricao like '%${params.descricao.trim()}%' `;
		}
	}
	if (where != "") where = " where " + where;
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM padroes_caracteristica caract   
				 inner join padroes_cab cab on caract.id_cab = cab.id   
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   caract.id_cab as  id_cab  
			,  caract.id as  id  
			,  caract.descricao as  descricao  
			,  caract.user_insert as  user_insert  
			,  caract.user_update as  user_update  
			,  cab.descricao as  apelido_descricao     
			FROM padroes_caracteristica caract   
				 inner join padroes_cab cab on caract.id_cab = cab.id   
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   caract.id_cab as  id_cab  
			,  caract.id as  id  
			,  caract.descricao as  descricao  
			,  caract.user_insert as  user_insert  
			,  caract.user_update as  user_update  
			,  cab.descricao as  apelido_descricao    
			FROM padroes_caracteristica caract			   
				 inner join padroes_cab cab on caract.id_cab = cab.id  `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertPadrao_Caracteristica = function(padrao_caracteristica){
	strSql = `insert into padroes_caracteristica (
		     id_cab 
		 ,   descricao 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${padrao_caracteristica.id_cab} 
		 ,   '${padrao_caracteristica.descricao}' 
		 ,   ${padrao_caracteristica.user_insert} 
		 ,   ${padrao_caracteristica.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updatePadrao_Caracteristica = function(padrao_caracteristica){
	strSql = `update   padroes_caracteristica set  
		     descricao = '${padrao_caracteristica.descricao}' 
 		 ,   user_insert = ${padrao_caracteristica.user_insert} 
 		 ,   user_update = ${padrao_caracteristica.user_update} 
 		 where id_cab = ${padrao_caracteristica.id_cab} and  id = ${padrao_caracteristica.id}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deletePadrao_Caracteristica = function(id_cab,id){
	strSql = `delete from padroes_caracteristica 
		 where id_cab = ${id_cab} and  id = ${id}  `;
 	return  db.oneOrNone(strSql);
}


