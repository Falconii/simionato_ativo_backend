/* DATA padroes_sugestoes */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Padrao_Sugestao){
return [ 
			Padrao_Sugestao.id_cab, 
			Padrao_Sugestao.id_caract, 
			Padrao_Sugestao.id, 
			Padrao_Sugestao.descricao, 
			Padrao_Sugestao.user_insert, 
			Padrao_Sugestao.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getPadrao_Sugestao = function(id_cab,id_caract,id){
	strSql = ` select   
			   sug.id_cab as  id_cab  
			,  sug.id_caract as  id_caract  
			,  sug.id as  id  
			,  sug.descricao as  descricao  
			,  sug.user_insert as  user_insert  
			,  sug.user_update as  user_update  
			,  cab.descricao as  apelido_descricao  
			,  caract.descricao as  caracteristica_descricao    
 			FROM padroes_sugestoes sug 	  
				 inner join padroes_cab cab on sug.id_cab = cab.id
				 inner join padroes_caracteristica caract on sug.id_cab = cab.id and sug.id_caract = caract.id   
			 where sug.id_cab = ${id_cab} and  sug.id_caract = ${id_caract} and  sug.id = ${id}  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getPadroes_Sugestoes = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'sug.id_cab,sug.id_caract';
	if(params.orderby == 'ID') orderby = 'sug.id_cab,sug.id_caract,sug.id';
	if(params.orderby == 'DESCRICAO') orderby = 'sug.descricao';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_cab  !== 0 ){
		if (where != "") where += " and "; 
		where += `sug.id_cab = ${params.id_cab} `;
	}
	if(params.id_caract  !== 0 ){
		if (where != "") where += " and "; 
		where += `sug.id_caract = ${params.id_caract} `;
	}
	if(params.id  !== 0 ){
		if (where != "") where += " and "; 
		where += `sug.id = ${params.id} `;
	}
	if(params.descricao.trim()  !== ''){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `sug.descricao = '${params.descricao}' `;
		} else 
		{
			where += `sug.descricao like '%${params.descricao.trim()}%' `;
		}
	}
	if (where != "") where = " where " + where;
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM padroes_sugestoes sug   
				 inner join padroes_cab cab on sug.id_cab = cab.id
				 inner join padroes_caracteristica caract on sug.id_cab = cab.id and sug.id_caract = caract.id   
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   sug.id_cab as  id_cab  
			,  sug.id_caract as  id_caract  
			,  sug.id as  id  
			,  sug.descricao as  descricao  
			,  sug.user_insert as  user_insert  
			,  sug.user_update as  user_update  
			,  cab.descricao as  apelido_descricao  
			,  caract.descricao as  caracteristica_descricao     
			FROM padroes_sugestoes sug   
				 inner join padroes_cab cab on sug.id_cab = cab.id
				 inner join padroes_caracteristica caract on sug.id_cab = cab.id and sug.id_caract = caract.id   
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   sug.id_cab as  id_cab  
			,  sug.id_caract as  id_caract  
			,  sug.id as  id  
			,  sug.descricao as  descricao  
			,  sug.user_insert as  user_insert  
			,  sug.user_update as  user_update  
			,  cab.descricao as  apelido_descricao  
			,  caract.descricao as  caracteristica_descricao    
			FROM padroes_sugestoes sug			   
				 inner join padroes_cab cab on sug.id_cab = cab.id
				 inner join padroes_caracteristica caract on sug.id_cab = cab.id and sug.id_caract = caract.id  `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertPadrao_Sugestao = function(padrao_sugestao){
	strSql = `insert into padroes_sugestoes (
		     id_cab 
		 ,   id_caract 
		 ,   descricao 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${padrao_sugestao.id_cab} 
		 ,   ${padrao_sugestao.id_caract} 
		 ,   '${padrao_sugestao.descricao}' 
		 ,   ${padrao_sugestao.user_insert} 
		 ,   ${padrao_sugestao.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updatePadrao_Sugestao = function(padrao_sugestao){
	strSql = `update   padroes_sugestoes set  
		     descricao = '${padrao_sugestao.descricao}' 
 		 ,   user_insert = ${padrao_sugestao.user_insert} 
 		 ,   user_update = ${padrao_sugestao.user_update} 
 		 where id_cab = ${padrao_sugestao.id_cab} and  id_caract = ${padrao_sugestao.id_caract} and  id = ${padrao_sugestao.id}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deletePadrao_Sugestao = function(id_cab,id_caract,id){
	strSql = `delete from padroes_sugestoes 
		 where id_cab = ${id_cab} and  id_caract = ${id_caract} and  id = ${id}  `;
 	return  db.oneOrNone(strSql);
}


