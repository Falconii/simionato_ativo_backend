/* DATA principais */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Principal) {
    return [
        Principal.id_empresa,
        Principal.id_filial,
        Principal.codigo,
        Principal.descricao,
        Principal.user_insert,
        Principal.user_update,
    ];
};
/* CRUD GET */
exports.getPrincipal = function(id_empresa, id_filial, codigo) {
        strSql = ` select   
			   princ.id_empresa as  id_empresa  
			,  princ.id_filial as  id_filial  
			,  princ.codigo as  codigo  
			,  princ.descricao as  descricao  
			,  princ.user_insert as  user_insert  
			,  princ.user_update as  user_update    
 			FROM principais princ 	     
			 where princ.id_empresa = ${id_empresa} and  princ.id_filial = ${id_filial} and  princ.codigo = ${codigo}  `;
        return db.oneOrNone(strSql);
    }
    /* CRUD GET ALL*/
exports.getPrincipais = function(params) {
        if (params) {
            where = "";
            orderby = "";
            paginacao = "";

            if (params.orderby == '') orderby = 'princ.id_empresa,princ.id_filial,princ.codigo';
            if (params.orderby == 'Filial') orderby = 'princ.id_empresa,princ.id_filial';
            if (params.orderby == 'Codigo') orderby = 'princ.id_empresa,princ.id_filial,princ.codigo';
            if (params.orderby == 'Descrição') orderby = 'princ.id_empresa,princ.id_filial,princ.descricao';

            if (orderby != "") orderby = " order by " + orderby;
            if (params.id_empresa !== 0) {
                if (where != "") where += " and ";
                where += `princ.id_empresa = ${params.id_empresa} `;
            }
            if (params.id_filial !== 0) {
                if (where != "") where += " and ";
                where += `princ.id_filial = ${params.id_filial} `;
            }
            if (params.codigo !== 0) {
                if (where != "") where += " and ";
                where += `princ.codigo = ${params.codigo} `;
            }
            if (params.descricao.trim() !== '') {
                if (where != "") where += " and ";
                if (params.sharp) {
                    where += `princ.descricao = '${params.descricao}' `;
                } else {
                    where += `princ.descricao like '%${params.descricao.trim()}%' `;
                }
            }
            if (where != "") where = " where " + where;

            if (params.pagina != 0) {
                paginacao = `limit ${params.tamPagina} offset ((${params.pagina} - 1) * ${params.tamPagina})`;
            }


            if (params.contador == 'S') {
                sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM principais princ      
				  ${ where} `;
                return db.one(sqlStr);
            } else {
                strSql = `select   
			   princ.id_empresa as  id_empresa  
			,  princ.id_filial as  id_filial  
			,  princ.codigo as  codigo  
			,  princ.descricao as  descricao  
			,  princ.user_insert as  user_insert  
			,  princ.user_update as  user_update     
			FROM principais princ      
			${where} 			${ orderby} ${ paginacao} `;
                return db.manyOrNone(strSql);
            }
        } else {
            strSql = `select   
			   princ.id_empresa as  id_empresa  
			,  princ.id_filial as  id_filial  
			,  princ.codigo as  codigo  
			,  princ.descricao as  descricao  
			,  princ.user_insert as  user_insert  
			,  princ.user_update as  user_update    
			FROM principais princ			     `;
            return db.manyOrNone(strSql);
        }
    }
    /* CRUD - INSERT */
exports.insertPrincipal = function(principal) {
    strSql = `insert into principais (
		     id_empresa 
		 ,   id_filial 
		 ,   codigo 
		 ,   descricao 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${principal.id_empresa} 
		 ,   ${principal.id_filial} 
		 ,   ${principal.codigo} 
		 ,   '${principal.descricao}' 
		 ,   ${principal.user_insert} 
		 ,   ${principal.user_update} 
		 ) 
 returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updatePrincipal = function(principal) {
        strSql = `update   principais set  
		     descricao = '${principal.descricao}' 
 		 ,   user_insert = ${principal.user_insert} 
 		 ,   user_update = ${principal.user_update} 
 		 where id_empresa = ${principal.id_empresa} and  id_filial = ${principal.id_filial} and  codigo = ${principal.codigo}  returning * `;
        return db.oneOrNone(strSql);
    }
    /* CRUD - DELETE */
exports.deletePrincipal = function(id_empresa, id_filial, codigo) {
    strSql = `delete from principais 
		 where id_empresa = ${id_empresa} and  id_filial = ${id_filial} and  codigo = ${codigo}  `;
    return db.oneOrNone(strSql);
}