/* DATA credenciais */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Credencial){
return [ 
			Credencial.id, 
			Credencial.client_id, 
			Credencial.client_secret, 
			Credencial.redirect_uri, 
			Credencial.code, 
			Credencial.tokens, 
			Credencial.user_insert, 
			Credencial.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getCredencial = function(id){
	strSql = ` select   
			   param.id as  id  
			,  param.client_id as  client_id  
			,  param.client_secret as  client_secret  
			,  param.redirect_uri as  redirect_uri  
			,  param.code as  code  
			,  param.tokens as  tokens  
			,  param.refresh_token refresh_token
			,  param.user_insert as  user_insert  
			,  param.user_update as  user_update    
 			FROM credenciais param 	     
			 where param.id = ${id}  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getCredenciais = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'param.id';
	if(params.orderby == 'CLIENTE_ID') orderby = 'param.client_id';
	if(params.orderby == 'CLIENTE_SECRET') orderby = 'param.client_secret';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id  !== 0 ){
		if (where != "") where += " and "; 
		where += `param.id = ${params.id} `;
	}
	if(params.client_id.trim()  !== ''){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `param.client_id = '${params.client_id}' `;
		} else 
		{
			where += `param.client_id like '%${params.client_id.trim()}%' `;
		}
	}
	if(params.client_secret.trim()  !== ''){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `param.client_secret = '${params.client_secret}' `;
		} else 
		{
			where += `param.client_secret like '%${params.client_secret.trim()}%' `;
		}
	}
	if (where != "") where = " where " + where;
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM credenciais param      
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   param.id as  id  
			,  param.client_id as  client_id  
			,  param.client_secret as  client_secret  
			,  param.redirect_uri as  redirect_uri  
			,  param.code as  code  
			,  param.tokens as  tokens  
			,  param.refresh_token as refresh_token
			,  param.user_insert as  user_insert  
			,  param.user_update as  user_update     
			FROM credenciais param      
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   param.id as  id  
			,  param.client_id as  client_id  
			,  param.client_secret as  client_secret  
			,  param.redirect_uri as  redirect_uri  
			,  param.code as  code  
			,  param.tokens as  tokens  
			,  param.refresh_token refresh_token
			,  param.user_insert as  user_insert  
			,  param.user_update as  user_update    
			FROM credenciais param			     `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertCredencial = function(credencial){
	strSql = `insert into credenciais (
		     client_id 
		 ,   client_secret 
		 ,   redirect_uri 
		 ,   code 
		 ,   tokens 
		 ,   refresh_token
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     '${credencial.client_id}' 
		 ,   '${credencial.client_secret}' 
		 ,   '${credencial.redirect_uri}' 
		 ,   '${credencial.code}' 
		 ,   '${credencial.tokens}' 
		 ,   '${credencial.refresh_token}' 
		 ,   ${credencial.user_insert} 
		 ,   ${credencial.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateCredencial = function(credencial){
	strSql = `update   credenciais set  
		     client_id = '${credencial.client_id}' 
 		 ,   client_secret = '${credencial.client_secret}' 
 		 ,   redirect_uri = '${credencial.redirect_uri}' 
 		 ,   code = '${credencial.code}' 
 		 ,   tokens = '${credencial.tokens}' 
		 ,   refresh_token = '${credencial.refresh_token}' 
 		 ,   user_insert = ${credencial.user_insert} 
 		 ,   user_update = ${credencial.user_update} 
 		 where id = ${credencial.id}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteCredencial = function(id){
	strSql = `delete from credenciais 
		 where id = ${id}  `;
 	return  db.oneOrNone(strSql);
}


