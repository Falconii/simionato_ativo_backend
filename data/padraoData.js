/* DATA padroes */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Padrao) {
    return [
        Padrao.id_empresa,
        Padrao.id_usuario,
        Padrao.id_empresa_padrao,
        Padrao.id_local_padrao,
        Padrao.id_inv_padrao,
        Padrao.user_insert,
        Padrao.user_update,
    ];
};
/* CRUD GET */
exports.getPadrao = function(id_empresa, id_usuario) {
        strSql = ` select   
			   padrao.id_empresa as  id_empresa  
			,  padrao.id_usuario as  id_usuario  
			,  padrao.id_empresa_padrao as  id_empresa_padrao  
			,  padrao.id_local_padrao as  id_local_padrao  
			,  padrao.id_inv_padrao as  id_inv_padrao  
			,  padrao.user_insert as  user_insert  
			,  padrao.user_update as  user_update  
			,  coalesce(emp.razao,'Empresa Não Definida!') as empresa_razao
            ,  coalesce(locais.razao,'Local Não Definido!') as local_razao
            ,  coalesce(invent.descricao,'Inventário Não Definido!') as inve_descricao  
 			FROM padroes padrao 	
			 left join empresas emp     on emp.id = padrao.id_empresa_padrao 
			 left join locais   locais  on locais.id_empresa = padrao.id_empresa_padrao  and 
			                               locais.id = padrao.id_local_padrao
			 left join inventarios invent on invent.id_empresa = padrao.id_empresa_padrao  and 
			                                invent.id_filial = padrao.id_local_padrao    and 
										    invent.codigo    = padrao.id_inv_padrao     
			 where padrao.id_empresa = ${id_empresa} and  padrao.id_usuario = ${id_usuario}  `;
        console.log("getPadrao", strSql)
        return db.oneOrNone(strSql);
    }
    /* CRUD GET ALL*/
exports.getPadroes = function(params) {
        if (params) {
            where = "";
            orderby = "";
            paginacao = "";

            if (params.orderby == '') orderby = 'param.id_empresa';
            if (params.orderby == 'Usuário') orderby = 'param.id_empresa,param.id_usuario';

            if (orderby != "") orderby = " order by " + orderby;
            if (params.id_empresa !== 0) {
                if (where != "") where += " and ";
                where += `padrao.id_empresa = ${params.id_empresa} `;
            }
            if (params.id_usuario !== 0) {
                if (where != "") where += " and ";
                where += `padrao.id_usuario = ${params.id_usuario} `;
            }
            if (where != "") where = " where " + where;
            if (params.contador == 'S') {
                sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM padroes padrao      
				  ${ where} `;
                return db.one(sqlStr);
            } else {
                strSql = `select   
			   padrao.id_empresa as  id_empresa  
			,  padrao.id_usuario as  id_usuario  
			,  padrao.id_empresa_padrao as  id_empresa_padrao  
			,  padrao.id_local_padrao as  id_local_padrao  
			,  padrao.id_inv_padrao as  id_inv_padrao  
			,  padrao.user_insert as  user_insert  
			,  padrao.user_update as  user_update    
			,  coalesce(emp.razao,'Empresa Não Definida!') as empresa_razao
            ,  coalesce(locais.razao,'Local Não Definido!') as local_razao
            ,  coalesce(invent.descricao,'Inventário Não Definido!') as inve_descricao    
			FROM padroes padrao      
			left join empresas emp     on emp.id = padrao.id_empresa_padrao 
			left join locais   locais  on locais.id_empresa = padrao.id_empresa_padrao  and 
										  locais.id = padrao.id_local_padrao
			left join inventarios invent on invent.id_empresa = padrao.id_empresa_padrao  and 
										   invent.id_filial = padrao.id_local_padrao    and 
										   invent.codigo    = padrao.id_inv_padrao
			${where} 			${ orderby} ${ paginacao} `;
                return db.manyOrNone(strSql);
            }
        } else {
            strSql = `select   
			   padrao.id_empresa as  id_empresa  
			,  padrao.id_usuario as  id_usuario  
			,  padrao.id_empresa_padrao as  id_empresa_padrao  
			,  padrao.id_local_padrao as  id_local_padrao  
			,  padrao.id_inv_padrao as  id_inv_padrao  
			,  padrao.user_insert as  user_insert  
			,  padrao.user_update as  user_update    
			,  coalesce(emp.razao,'Empresa Não Definida!') as empresa_razao
            ,  coalesce(locais.razao,'Local Não Definido!') as local_razao
            ,  coalesce(invent.descricao,'Inventário Não Definido!') as inve_descricao  
			FROM padroes padrao	
			left join empresas emp     on emp.id = padrao.id_empresa_padrao 
			left join locais   locais  on locais.id_empresa = padrao.id_empresa_padrao  and 
										  locais.id = padrao.id_local_padrao
			left join inventarios invent on invent.id_empresa = padrao.id_empresa_padrao  and 
										   invent.id_filial = padrao.id_local_padrao    and 
										   invent.codigo    = padrao.id_inv_padrao
			`;
            return db.manyOrNone(strSql);
        }
    }
    /* CRUD - INSERT */
exports.insertPadrao = function(padrao) {
    strSql = `insert into padroes (
		     id_empresa 
		 ,   id_usuario 
		 ,   id_empresa_padrao 
		 ,   id_local_padrao 
		 ,   id_inv_padrao 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${padrao.id_empresa} 
		 ,   ${padrao.id_usuario} 
		 ,   ${padrao.id_empresa_padrao} 
		 ,   ${padrao.id_local_padrao} 
		 ,   ${padrao.id_inv_padrao} 
		 ,   ${padrao.user_insert} 
		 ,   ${padrao.user_update} 
		 ) 
 returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updatePadrao = function(padrao) {
        strSql = `update   padroes set  
		     id_empresa_padrao = ${padrao.id_empresa_padrao} 
 		 ,   id_local_padrao = ${padrao.id_local_padrao} 
 		 ,   id_inv_padrao = ${padrao.id_inv_padrao} 
 		 ,   user_insert = ${padrao.user_insert} 
 		 ,   user_update = ${padrao.user_update} 
 		 where id_empresa = ${padrao.id_empresa} and  id_usuario = ${padrao.id_usuario}  returning * `;
        return db.oneOrNone(strSql);
    }
    /* CRUD - DELETE */
exports.deletePadrao = function(id_empresa, id_usuario) {
    strSql = `delete from padroes 
		 where id_empresa = ${id_empresa} and  id_usuario = ${id_usuario}  `;
    return db.oneOrNone(strSql);
}