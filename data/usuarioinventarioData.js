/* DATA usuariosinventarios */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Usuarioinventario) {
    return [
        Usuarioinventario.id_empresa,
        Usuarioinventario.id_filial,
        Usuarioinventario.id_inventario,
        Usuarioinventario.id_usuario,
        Usuarioinventario.user_insert,
        Usuarioinventario.user_update,
    ];
};
/* CRUD GET */
exports.getUsuarioinventario = function(id_empresa, id_filial, id_inventario, id_usuario) {
        strSql = ` select   
			   usu_inv.id_empresa as  id_empresa  
			,  usu_inv.id_filial as  id_filial  
			,  usu_inv.id_inventario as  id_inventario  
			,  usu_inv.id_usuario as  id_usuario  
			,  usu_inv.user_insert as  user_insert  
			,  usu_inv.user_update as  user_update  
			,  usu.razao as  ususario_razao  
			,  inv.descricao as  inv_descricao    
 			FROM usuariosinventarios usu_inv 	  
				 inner join usuarios usu on usu.id_empresa = usu_inv.id_empresa and usu.id = usu_inv.id_usuario
				 inner join inventarios inv on inv.id_empresa = usu_inv.id_empresa and inv.id_filial = usu_inv.id_filial and inv.codigo = usu_inv.id_inventario  
			 where usu_inv.id_empresa = ${id_empresa} and  usu_inv.id_filial = ${id_filial} and  usu_inv.id_inventario = ${id_inventario} and  usu_inv.id_usuario = ${id_usuario}  `;
        console.log('getUsuarioinventario', strSql);
        return db.oneOrNone(strSql);
    }
    /* CRUD GET ALL*/
exports.getUsuariosinventarios = function(params) {
        if (params) {
            where = "";
            orderby = "";
            paginacao = "";

            if (params.orderby == '') orderby = 'usu_inv.id_empresa,usu_inv.id_filial';
            if (params.orderby == 'Filial') orderby = 'usu_inv.id_empresa,usu_inv.id_filial';
            if (params.orderby == 'Inventario') orderby = 'usu_inv.id_empresa,usu_inv.id_filial,usu_inv.id_inventario';
            if (params.orderby == 'Usuário') orderby = 'usu_inv.id_empresa,usu_inv.id_filial,usu_inv.id_usuario';

            if (orderby != "") orderby = " order by " + orderby;
            if (params.id_empresa !== 0) {
                if (where != "") where += " and ";
                where += `usu_inv.id_empresa = ${params.id_empresa} `;
            }
            if (params.id_inventario !== 0) {
                if (where != "") where += " and ";
                where += `usu_inv.id_inventario = ${params.id_inventario} `;
            }
            if (params.id_usuario !== 0) {
                if (where != "") where += " and ";
                where += `usu_inv.id_usuario = ${params.id_usuario} `;
            }
            if (where != "") where = " where " + where;
            if (params.contador == 'S') {
                sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM usuariosinventarios usu_inv   
				 inner join usuarios usu on usu.id_empresa = usu_inv.id_empresa and usu.id = usu_inv.id_usuario
				 inner join inventarios inv on inv.id_empresa = usu_inv.id_empresa and inv.id_filial = usu_inv.id_filial and inv.codigo = usu_inv.id_inventario  
				  ${ where} `;
                return db.one(sqlStr);
            } else {
                strSql = `select   
			   usu_inv.id_empresa as  id_empresa  
			,  usu_inv.id_filial as  id_filial  
			,  usu_inv.id_inventario as  id_inventario  
			,  usu_inv.id_usuario as  id_usuario  
			,  usu_inv.user_insert as  user_insert  
			,  usu_inv.user_update as  user_update  
			,  usu.razao as  ususario_razao  
			,  inv.descricao as  _descricao     
			FROM usuariosinventarios usu_inv   
				 inner join usuarios usu on usu.id_empresa = usu_inv.id_empresa and usu.id = usu_inv.id_usuario
				 inner join inventarios inv on inv.id_empresa = usu_inv.id_empresa and inv.id_filial = usu_inv.id_filial and inv.codigo = usu_inv.id_inventario   
			${where} 			${ orderby} ${ paginacao} `;
                return db.manyOrNone(strSql);
            }
        } else {
            strSql = `select   
			   usu_inv.id_empresa as  id_empresa  
			,  usu_inv.id_filial as  id_filial  
			,  usu_inv.id_inventario as  id_inventario  
			,  usu_inv.id_usuario as  id_usuario  
			,  usu_inv.user_insert as  user_insert  
			,  usu_inv.user_update as  user_update  
			,  usu.razao as  ususario_razao  
			,  inv.descricao as  imo_descricao    
			FROM usuariosinventarios usu_inv			   
				 inner join usuarios usu on usu.id_empresa = usu_inv.id_empresa and  usu.codigo = usu_inv.id_usuario
				 inner join inventarios imo on inv.id_empresa = usu_inv.id_empresa and inv.id_filial = usu_inv.id_filial and inv.codigo = usu_inv.id_usuario  `;
            return db.manyOrNone(strSql);
        }
    }
    /* CRUD - INSERT */
exports.insertUsuarioinventario = function(usuarioinventario) {
    strSql = `insert into usuariosinventarios (
		     id_empresa 
		 ,   id_filial 
		 ,   id_inventario 
		 ,   id_usuario 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${usuarioinventario.id_empresa} 
		 ,   ${usuarioinventario.id_filial} 
		 ,   ${usuarioinventario.id_inventario} 
		 ,   ${usuarioinventario.id_usuario} 
		 ,   ${usuarioinventario.user_insert} 
		 ,   ${usuarioinventario.user_update} 
		 ) 
 returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updateUsuarioinventario = function(usuarioinventario) {
        strSql = `update   usuariosinventarios set  
		     user_insert = ${usuarioinventario.user_insert} 
 		 ,   user_update = ${usuarioinventario.user_update} 
 		 where id_empresa = ${usuarioinventario.id_empresa} and  id_filial = ${usuarioinventario.id_filial} and  id_inventario = ${usuarioinventario.id_inventario} and  id_usuario = ${usuarioinventario.id_usuario}  returning * `;
        return db.oneOrNone(strSql);
    }
    /* CRUD - DELETE */
exports.deleteUsuarioinventario = function(id_empresa, id_filial, id_inventario, id_usuario) {
    strSql = `delete from usuariosinventarios 
		 where id_empresa = ${id_empresa} and  id_filial = ${id_filial} and  id_inventario = ${id_inventario} and  id_usuario = ${id_usuario}  `;
    return db.oneOrNone(strSql);
}