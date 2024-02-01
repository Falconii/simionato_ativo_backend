/* DATA valores */
const db = require('../infra/database');
const shared = require('../util/shared.js');

/* GET CAMPOS */
exports.getCampos = function(Valor) {
    return [
        Valor.id_empresa,
        Valor.id_filial,
        Valor.id_imobilizado,
        Valor.dtaquisicao,
        Valor.vlraquisicao,
        Valor.totaldepreciado,
        Valor.vlrresidual,
        Valor.reavalicao,
        Valor.deemed,
        Valor.vlrconsolidado,
        Valor.user_insert,
        Valor.user_update,
    ];
};
/* CRUD GET */
exports.getValor = function(id_empresa, id_filial, id_imobilizado) {
        strSql = ` select   
			   val.id_empresa as  id_empresa  
			,  val.id_filial as  id_filial  
			,  val.id_imobilizado as  id_imobilizado  
			, to_char(val.dtaquisicao, 'DD/MM/YYYY') as dtaquisicao  
			,  val.vlraquisicao as  vlraquisicao  
			,  val.totaldepreciado as  totaldepreciado  
			,  val.vlrresidual as  vlrresidual  
			,  val.reavalicao as  reavalicao  
			,  val.deemed as  deemed  
			,  val.vlrconsolidado as  vlrconsolidado  
			,  val.user_insert as  user_insert  
			,  val.user_update as  user_update  
			,  imo.descricao as  imo_descricao    
 			FROM valores val 	  
				 inner join imobilizados imo on imo.id_empresa = val.id_empresa and imo.id_filial = val.id_filial and imo.codigo = val.id_imobilizado   
			 where val.id_empresa = ${id_empresa} and  val.id_filial = ${id_filial} and  val.id_imobilizado = ${id_imobilizado}  `;
        return db.oneOrNone(strSql);
    }
    /* CRUD GET ALL*/
exports.getValores = function(params) {
        if (params) {
            where = "";
            orderby = "";
            paginacao = "";

            if (params.orderby == '') orderby = 'val.id_empresa,val.id_filial';
            if (params.orderby == 'Filial') orderby = 'val.id_empresa,val.id_filial';
            if (params.orderby == 'Imobilizado') orderby = 'val.id_empresa,val.id_filial,val.id_imobilizado';

            if (orderby != "") orderby = " order by " + orderby;
            if (params.id_empresa !== 0) {
                if (where != "") where += " and ";
                where += `val.id_empresa = ${params.id_empresa} `;
            }
            if (params.id_filial !== 0) {
                if (where != "") where += " and ";
                where += `val.id_filial = ${params.id_filial} `;
            }
            if (params.id_imobilizado !== 0) {
                if (where != "") where += " and ";
                where += `val.id_imobilizado = ${params.id_imobilizado} `;
            }
            if (where != "") where = " where " + where;
            if (params.contador == 'S') {
                sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM valores val   
				 inner join imobilizados imo on imo.id_empresa = val.id_empresa and imo.id_filial = val.id_filial and imo.codigo = val.id_imobilizado   
				  ${ where} `;
                return db.one(sqlStr);
            } else {
                strSql = `select   
			   val.id_empresa as  id_empresa  
			,  val.id_filial as  id_filial  
			,  val.id_imobilizado as  id_imobilizado  
			, to_char(val.dtaquisicao, 'DD/MM/YYYY') as dtaquisicao  
			,  val.vlraquisicao as  vlraquisicao  
			,  val.totaldepreciado as  totaldepreciado  
			,  val.vlrresidual as  vlrresidual  
			,  val.reavalicao as  reavalicao  
			,  val.deemed as  deemed  
			,  val.vlrconsolidado as  vlrconsolidado  
			,  val.user_insert as  user_insert  
			,  val.user_update as  user_update  
			,  imo.descricao as  imo_descricao     
			FROM valores val   
				 inner join imobilizados imo on imo.id_empresa = val.id_empresa and imo.id_filial = val.id_filial and imo.codigo = val.id_imobilizado   
			${where} 			${ orderby} ${ paginacao} `;
                return db.manyOrNone(strSql);
            }
        } else {
            strSql = `select   
			   val.id_empresa as  id_empresa  
			,  val.id_filial as  id_filial  
			,  val.id_imobilizado as  id_imobilizado  
			, to_char(val.dtaquisicao, 'DD/MM/YYYY') as dtaquisicao  
			,  val.vlraquisicao as  vlraquisicao  
			,  val.totaldepreciado as  totaldepreciado  
			,  val.vlrresidual as  vlrresidual  
			,  val.reavalicao as  reavalicao  
			,  val.deemed as  deemed  
			,  val.vlrconsolidado as  vlrconsolidado  
			,  val.user_insert as  user_insert  
			,  val.user_update as  user_update  
			,  imo.descricao as  imo_descricao    
			FROM valores val			   
				 inner join imobilizados imo on imo.id_empresa = val.id_empresa and imo.id_filial = val.id_filial and imo.codigo = val.id_imobilizado  `;
            return db.manyOrNone(strSql);
        }
    }
    /* CRUD - INSERT */
exports.insertValor = function(valor) {
    strSql = `insert into valores (
		     id_empresa 
		 ,   id_filial 
		 ,   id_imobilizado 
		 ,   dtaquisicao 
		 ,   vlraquisicao 
		 ,   totaldepreciado 
		 ,   vlrresidual 
		 ,   reavalicao 
		 ,   deemed 
		 ,   vlrconsolidado 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${valor.id_empresa} 
		 ,   ${valor.id_filial} 
		 ,   ${valor.id_imobilizado} 
		 ,   ${shared.formatDateYYYYMMDD(valor.dtaquisicao)} 
		 ,   ${valor.vlraquisicao} 
		 ,   ${valor.totaldepreciado} 
		 ,   ${valor.vlrresidual} 
		 ,   ${valor.reavalicao} 
		 ,   ${valor.deemed} 
		 ,   ${valor.vlrconsolidado} 
		 ,   ${valor.user_insert} 
		 ,   ${valor.user_update} 
		 ) 
 returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updateValor = function(valor) {
        strSql = `update   valores set  
		     dtaquisicao = '${shared.formatDateYYYYMMDD(valor.dtaquisicao)}' 
 		 ,   vlraquisicao = ${valor.vlraquisicao} 
 		 ,   totaldepreciado = ${valor.totaldepreciado} 
 		 ,   vlrresidual = ${valor.vlrresidual} 
 		 ,   reavalicao = ${valor.reavalicao} 
 		 ,   deemed = ${valor.deemed} 
 		 ,   vlrconsolidado = ${valor.vlrconsolidado} 
 		 ,   user_insert = ${valor.user_insert} 
 		 ,   user_update = ${valor.user_update} 
 		 where id_empresa = ${valor.id_empresa} and  id_filial = ${valor.id_filial} and  id_imobilizado = ${valor.id_imobilizado}  returning * `;
        return db.oneOrNone(strSql);
    }
    /* CRUD - DELETE */
exports.deleteValor = function(id_empresa, id_filial, id_imobilizado) {
    strSql = `delete from valores 
		 where id_empresa = ${id_empresa} and  id_filial = ${id_filial} and  id_imobilizado = ${id_imobilizado}  `;
    return db.oneOrNone(strSql);
}