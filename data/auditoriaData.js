/* DATA auditorias */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Auditoria){
return [ 
			Auditoria.id_empresa, 
			Auditoria.id_filial, 
			Auditoria.id_inventario, 
			Auditoria.id, 
			Auditoria.dtacao, 
			Auditoria.acao, 
			Auditoria.escopo, 
			Auditoria.id_usuario, 
			Auditoria.histo_antes, 
			Auditoria.histo_atual, 
			Auditoria.user_insert, 
			Auditoria.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getAuditoria = function(id){
	strSql = ` select   
			   auditoria.id_empresa as  id_empresa  
			,  auditoria.id_filial as  id_filial  
			,  auditoria.id_inventario as  id_inventario  
			,  auditoria.id as  id  
			,  auditoria.dtacao as  dtacao  
			,  auditoria.acao as  acao  
			,  auditoria.escopo as  escopo  
			,  auditoria.id_usuario as  id_usuario  
			,  auditoria.histo_antes as  histo_antes  
			,  auditoria.histo_atual as  histo_atual  
			,  auditoria.user_insert as  user_insert  
			,  auditoria.user_update as  user_update    
 			FROM auditorias auditoria 	     
			 where auditoria.id = ${id}  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getAuditorias = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'auditoria.id_empresa,auditoria.id_filial,auditoria.id_inventario,auditoria.id_imobilizado,auditoria.id';
	if(params.orderby == '000001') orderby = 'auditoria.id_empresa,auditoria.id_filial,auditoria.id_inventario,auditoria.id_imobilizado,auditoria.id';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `auditoria.id_empresa = ${params.id_empresa} `;
	}
	if(params.id_filial  !== 0 ){
		if (where != "") where += " and "; 
		where += `auditoria.id_filial = ${params.id_filial} `;
	}
	if(params.id_inventario  !== 0 ){
		if (where != "") where += " and "; 
		where += `auditoria.id_inventario = ${params.id_inventario} `;
	}
	if(params.escopo.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `auditoria.escopo = '${params.escopo}' `;
		} else 
		{
			where += `auditoria.escopo like '%${params.escopo.trim()}%' `;
		}
	}
	if(params.acao.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `auditoria.acao = '${params.acao}' `;
		} else 
		{
			where += `auditoria.acao like '%${params.acao.trim()}%' `;
		}
	}
	if(params.id_imobilizado  !== 0 ){
		if (where != "") where += " and "; 
		where += `auditoria.id_imobilizado = ${params.id_imobilizado} `;
	}
	if(params.id_usuario  !== 0 ){
		if (where != "") where += " and "; 
		where += `auditoria.id_usuario = ${params.id_usuario} `;
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM auditorias auditoria      
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   auditoria.id_empresa as  id_empresa  
			,  auditoria.id_filial as  id_filial  
			,  auditoria.id_inventario as  id_inventario  
			,  auditoria.id as  id  
			,  auditoria.dtacao as  dtacao  
			,  auditoria.acao as  acao  
			,  auditoria.escopo as  escopo  
			,  auditoria.id_usuario as  id_usuario  
			,  auditoria.histo_antes as  histo_antes  
			,  auditoria.histo_atual as  histo_atual  
			,  auditoria.user_insert as  user_insert  
			,  auditoria.user_update as  user_update     
			FROM auditorias auditoria      
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   auditoria.id_empresa as  id_empresa  
			,  auditoria.id_filial as  id_filial  
			,  auditoria.id_inventario as  id_inventario  
			,  auditoria.id as  id  
			,  auditoria.dtacao as  dtacao  
			,  auditoria.acao as  acao  
			,  auditoria.escopo as  escopo  
			,  auditoria.id_usuario as  id_usuario  
			,  auditoria.histo_antes as  histo_antes  
			,  auditoria.histo_atual as  histo_atual  
			,  auditoria.user_insert as  user_insert  
			,  auditoria.user_update as  user_update    
			FROM auditorias auditoria			     `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertAuditoria = function(auditoria){
	strSql = `insert into auditorias (
		     id_empresa 
		 ,   id_filial 
		 ,   id_inventario 
		 ,   dtacao 
		 ,   acao 
		 ,   escopo 
		 ,   id_usuario 
		 ,   histo_antes 
		 ,   histo_atual 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${auditoria.id_empresa} 
		 ,   ${auditoria.id_filial} 
		 ,   ${auditoria.id_inventario} 
		 ,   ${auditoria.dtacao} 
		 ,   '${auditoria.acao}' 
		 ,   '${auditoria.escopo}' 
		 ,   ${auditoria.id_usuario} 
		 ,   '${auditoria.histo_antes}' 
		 ,   '${auditoria.histo_atual}' 
		 ,   ${auditoria.user_insert} 
		 ,   ${auditoria.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateAuditoria = function(auditoria){
	strSql = `update   auditorias set  
		     id_empresa = ${auditoria.id_empresa} 
 		 ,   id_filial = ${auditoria.id_filial} 
 		 ,   id_inventario = ${auditoria.id_inventario} 
 		 ,   dtacao = ${auditoria.dtacao} 
 		 ,   acao = '${auditoria.acao}' 
 		 ,   escopo = '${auditoria.escopo}' 
 		 ,   id_usuario = ${auditoria.id_usuario} 
 		 ,   histo_antes = '${auditoria.histo_antes}' 
 		 ,   histo_atual = '${auditoria.histo_atual}' 
 		 ,   user_insert = ${auditoria.user_insert} 
 		 ,   user_update = ${auditoria.user_update} 
 		 where id = ${auditoria.id}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteAuditoria = function(id){
	strSql = `delete from auditorias 
		 where id = ${id}  `;
 	return  db.oneOrNone(strSql);
}


