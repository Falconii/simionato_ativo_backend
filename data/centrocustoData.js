/* DATA centroscustos */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Centrocusto) {
    return [
        Centrocusto.id_empresa,
        Centrocusto.id_filial,
        Centrocusto.codigo,
        Centrocusto.descricao,
        Centrocusto.user_insert,
        Centrocusto.user_update,
    ];
};
/* CRUD GET */
exports.getCentrocusto = function(id_empresa, id_filial, codigo) {
        strSql = ` select   
			   cc.id_empresa as  id_empresa  
			,  cc.id_filial as  id_filial  
			,  cc.codigo as  codigo  
			,  cc.descricao as  descricao  
			,  cc.user_insert as  user_insert  
			,  cc.user_update as  user_update    
 			FROM centroscustos cc 	     
			 where cc.id_empresa = ${id_empresa} and  cc.id_filial = ${id_filial} and  cc.codigo = '${codigo}'  `;
        return db.oneOrNone(strSql);
    }
    /* CRUD GET ALL*/
exports.getCentroscustos = function(params) {
        if (params) {
            where = "";
            orderby = "";
            paginacao = "";

            if (params.orderby == '') orderby = 'cc.id_empresa,cc.id_filial,cc.codigo';
            if (params.orderby == 'Filial') orderby = 'cc.id_empresa,cc.id_filial';
            if (params.orderby == 'Codigo') orderby = 'cc.id_empresa,cc.id_filial,cc.codigo';
            if (params.orderby == 'Descrição') orderby = 'cc.id_empresa,cc.id_filial,cc.descricao';

            if (orderby != "") orderby = " order by " + orderby;
            if (params.id_empresa !== 0) {
                if (where != "") where += " and ";
                where += `cc.id_empresa = ${params.id_empresa} `;
            }
            if (params.id_filial !== 0) {
                if (where != "") where += " and ";
                where += `cc.id_filial = ${params.id_filial} `;
            }
            if (params.codigo.trim() !== '') {
                if (where != "") where += " and ";
                if (params.sharp) {
                    where += `cc.codigo = '${params.codigo}' `;
                } else {
                    where += `cc.codigo like '%${params.codigo.trim()}%' `;
                }
            }
            if (params.descricao.trim() !== '') {
                if (where != "") where += " and ";
                if (params.sharp) {
                    where += `cc.descricao = '${params.descricao}' `;
                } else {
                    where += `cc.descricao like '%${params.descricao.trim()}%' `;
                }
            }
            if (where != "") where = " where " + where;

            if (params.pagina != 0) {
                paginacao = `limit ${params.tamPagina} offset ((${params.pagina} - 1) * ${params.tamPagina})`;
            }


            if (params.contador == 'S') {
                sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM centroscustos cc      
				  ${ where} `;
                return db.one(sqlStr);
            } else {
                strSql = `select   
			   cc.id_empresa as  id_empresa  
			,  cc.id_filial as  id_filial  
			,  cc.codigo as  codigo  
			,  cc.descricao as  descricao  
			,  cc.user_insert as  user_insert  
			,  cc.user_update as  user_update     
			FROM centroscustos cc      
			${where} 			${ orderby} ${ paginacao} `;
                return db.manyOrNone(strSql);
            }
        } else {
            strSql = `select   
			   cc.id_empresa as  id_empresa  
			,  cc.id_filial as  id_filial  
			,  cc.codigo as  codigo  
			,  cc.descricao as  descricao  
			,  cc.user_insert as  user_insert  
			,  cc.user_update as  user_update    
			FROM centroscustos cc			     `;
            return db.manyOrNone(strSql);
        }
    }
    /* CRUD - INSERT */
exports.insertCentrocusto = function(centrocusto) {
    strSql = `insert into centroscustos (
		     id_empresa 
		 ,   id_filial 
		 ,   codigo 
		 ,   descricao 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${centrocusto.id_empresa} 
		 ,   ${centrocusto.id_filial} 
		 ,   '${centrocusto.codigo}' 
		 ,   '${centrocusto.descricao}' 
		 ,   ${centrocusto.user_insert} 
		 ,   ${centrocusto.user_update} 
		 ) 
 returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updateCentrocusto = function(centrocusto) {
        strSql = `update   centroscustos set  
		     descricao = '${centrocusto.descricao}' 
 		 ,   user_insert = ${centrocusto.user_insert} 
 		 ,   user_update = ${centrocusto.user_update} 
 		 where id_empresa = ${centrocusto.id_empresa} and  id_filial = ${centrocusto.id_filial} and  codigo = '${centrocusto.codigo}'  returning * `;
        return db.oneOrNone(strSql);
    }
    /* CRUD - DELETE */
exports.deleteCentrocusto = function(id_empresa, id_filial, codigo) {
    strSql = `delete from centroscustos 
		 where id_empresa = ${id_empresa} and  id_filial = ${id_filial} and  codigo = '${codigo}'  `;
    return db.oneOrNone(strSql);
}