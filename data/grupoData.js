/* DATA grupos */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Grupo) {
    return [
        Grupo.id_empresa,
        Grupo.id_filial,
        Grupo.codigo,
        Grupo.descricao,
        Grupo.user_insert,
        Grupo.user_update,
    ];
};
/* CRUD GET */
exports.getGrupo = function(id_empresa, id_filial, codigo) {
        strSql = ` select   
			   grupo.id_empresa as  id_empresa  
			,  grupo.id_filial as  id_filial  
			,  grupo.codigo as  codigo  
			,  grupo.descricao as  descricao  
			,  grupo.user_insert as  user_insert  
			,  grupo.user_update as  user_update    
 			FROM grupos grupo 	     
			 where grupo.id_empresa = ${id_empresa} and  grupo.id_filial = ${id_filial} and  grupo.codigo = ${codigo}  `;
        return db.oneOrNone(strSql);
    }
    /* CRUD GET ALL*/
exports.getGrupos = function(params) {
        if (params) {
            where = "";
            orderby = "";
            paginacao = "";

            if (params.orderby == '') orderby = 'grupo.id_empresa,grupo.id_filial,grupo.codigo';
            if (params.orderby == 'Filial') orderby = 'grupo.id_empresa,grupo.id_filial';
            if (params.orderby == 'Codigo') orderby = 'grupo.id_empresa,grupo.id_filial,grupo.codigo';
            if (params.orderby == 'Descrição') orderby = 'grupo.id_empresa,grupo.id_filial,grupo.descricao';

            if (orderby != "") orderby = " order by " + orderby;
            if (params.id_empresa !== 0) {
                if (where != "") where += " and ";
                where += `grupo.id_empresa = ${params.id_empresa} `;
            }
            if (params.id_filial !== 0) {
                if (where != "") where += " and ";
                where += `grupo.id_filial = ${params.id_filial} `;
            }
            if (params.codigo !== 0) {
                if (where != "") where += " and ";
                where += `grupo.codigo = ${params.codigo} `;
            }
            if (params.descricao.trim() !== '') {
                if (where != "") where += " and ";
                if (params.sharp) {
                    where += `grupo.descricao = '${params.descricao}' `;
                } else {
                    where += `grupo.descricao like '%${params.descricao.trim()}%' `;
                }
            }
            if (where != "") where = " where " + where;

            if (params.pagina != 0) {
                paginacao = `limit ${params.tamPagina} offset ((${params.pagina} - 1) * ${params.tamPagina})`;
            }


            if (params.contador == 'S') {
                sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM grupos grupo      
				  ${ where} `;
                return db.one(sqlStr);
            } else {
                strSql = `select   
			   grupo.id_empresa as  id_empresa  
			,  grupo.id_filial as  id_filial  
			,  grupo.codigo as  codigo  
			,  grupo.descricao as  descricao  
			,  grupo.user_insert as  user_insert  
			,  grupo.user_update as  user_update     
			FROM grupos grupo      
			${where} 			${ orderby} ${ paginacao} `;
                return db.manyOrNone(strSql);
            }
        } else {
            strSql = `select   
			   grupo.id_empresa as  id_empresa  
			,  grupo.id_filial as  id_filial  
			,  grupo.codigo as  codigo  
			,  grupo.descricao as  descricao  
			,  grupo.user_insert as  user_insert  
			,  grupo.user_update as  user_update    
			FROM grupos grupo			     `;
            return db.manyOrNone(strSql);
        }
    }
    /* CRUD - INSERT */
exports.insertGrupo = function(grupo) {
    strSql = `insert into grupos (
		     id_empresa 
		 ,   id_filial 
		 ,   codigo 
		 ,   descricao 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${grupo.id_empresa} 
		 ,   ${grupo.id_filial} 
		 ,   ${grupo.codigo} 
		 ,   '${grupo.descricao}' 
		 ,   ${grupo.user_insert} 
		 ,   ${grupo.user_update} 
		 ) 
 returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updateGrupo = function(grupo) {
        strSql = `update   grupos set  
		     descricao = '${grupo.descricao}' 
 		 ,   user_insert = ${grupo.user_insert} 
 		 ,   user_update = ${grupo.user_update} 
 		 where id_empresa = ${grupo.id_empresa} and  id_filial = ${grupo.id_filial} and  codigo = ${grupo.codigo}  returning * `;
        return db.oneOrNone(strSql);
    }
    /* CRUD - DELETE */
exports.deleteGrupo = function(id_empresa, id_filial, codigo) {
    strSql = `delete from grupos 
		 where id_empresa = ${id_empresa} and  id_filial = ${id_filial} and  codigo = ${codigo}  `;
    return db.oneOrNone(strSql);
}