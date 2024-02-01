/* DATA produtos */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Produto) {
    return [
        Produto.id_empresa,
        Produto.id_filial,
        Produto.codigo,
        Produto.estado,
        Produto.descricao,
        Produto.ncm,
        Produto.id_principal,
        Produto.user_insert,
        Produto.user_update,
    ];
};
/* CRUD GET */
exports.getProduto = function(id_empresa, id_filial, codigo) {
        strSql = ` select   
			   prod.id_empresa as  id_empresa  
			,  prod.id_filial as  id_filial  
			,  prod.codigo as  codigo  
			,  prod.estado as  estado  
			,  prod.descricao as  descricao  
			,  prod.ncm as  ncm  
			,  prod.id_principal as  id_principal  
			,  prod.user_insert as  user_insert  
			,  prod.user_update as  user_update  
			,  coalesce(princ.descricao,'') as  princ_descricao    
 			FROM produtos prod 	  
				 left join principais princ on princ.id_empresa = prod.id_empresa and princ.id_filial = prod.id_filial and princ.codigo = prod.id_principal   
			 where prod.id_empresa = ${id_empresa} and  prod.id_filial = ${id_filial} and  prod.codigo = ${codigo}  `;
        return db.oneOrNone(strSql);
    }
    /* CRUD GET ALL*/
exports.getProdutos = function(params) {
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
                where += `prod.id_empresa = ${params.id_empresa} `;
            }
            if (params.id_filial !== 0) {
                if (where != "") where += " and ";
                where += `prod.id_filial = ${params.id_filial} `;
            }
            if (params.codigo !== 0) {
                if (where != "") where += " and ";
                where += `prod.codigo = ${params.codigo} `;
            }
            if (params.descricao.trim() !== '') {
                if (where != "") where += " and ";
                if (params.sharp) {
                    where += `prod.descricao = '${params.descricao}' `;
                } else {
                    where += `prod.descricao like '%${params.descricao.trim()}%' `;
                }
            }
            if (where != "") where = " where " + where;

            if (params.pagina != 0) {
                paginacao = `limit ${params.tamPagina} offset ((${params.pagina} - 1) * ${params.tamPagina})`;
            }


            if (params.contador == 'S') {
                sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM produtos prod   
				 left join principais princ on princ.id_empresa = prod.id_empresa and princ.id_filial = prod.id_filial and princ.codigo = prod.id_principal   
				  ${ where} `;
                return db.one(sqlStr);
            } else {
                strSql = `select   
			   prod.id_empresa as  id_empresa  
			,  prod.id_filial as  id_filial  
			,  prod.codigo as  codigo  
			,  prod.estado as  estado  
			,  prod.descricao as  descricao  
			,  prod.ncm as  ncm  
			,  prod.id_principal as  id_principal  
			,  prod.user_insert as  user_insert  
			,  prod.user_update as  user_update  
			,  coalesce(princ.descricao,'') as  princ_descricao     
			FROM produtos prod   
				 left join principais princ on princ.id_empresa = prod.id_empresa and princ.id_filial = prod.id_filial and princ.codigo = prod.id_principal   
			${where} 			${ orderby} ${ paginacao} `;
                return db.manyOrNone(strSql);
            }
        } else {
            strSql = `select   
			   prod.id_empresa as  id_empresa  
			,  prod.id_filial as  id_filial  
			,  prod.codigo as  codigo  
			,  prod.estado as  estado  
			,  prod.descricao as  descricao  
			,  prod.ncm as  ncm  
			,  prod.id_principal as  id_principal  
			,  prod.user_insert as  user_insert  
			,  prod.user_update as  user_update  
			,  coalesce(princ.descricao,'') as  princ_descricao    
			FROM produtos prod			   
				 left join principais princ on princ.id_empresa = prod.id_empresa and princ.id_filial = prod.id_filial and princ.codigo = prod.id_principal  `;
            return db.manyOrNone(strSql);
        }
    }
    /* CRUD - INSERT */
exports.insertProduto = function(produto) {
    strSql = `insert into produtos (
		     id_empresa 
		 ,   id_filial 
		 ,   codigo 
		 ,   estado 
		 ,   descricao 
		 ,   ncm 
		 ,   id_principal 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${produto.id_empresa} 
		 ,   ${produto.id_filial} 
		 ,   ${produto.codigo} 
		 ,   ${produto.estado} 
		 ,   '${produto.descricao}' 
		 ,   '${produto.ncm}' 
		 ,   ${produto.id_principal} 
		 ,   ${produto.user_insert} 
		 ,   ${produto.user_update} 
		 ) 
 returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updateProduto = function(produto) {
        strSql = `update   produtos set  
		     estado = ${produto.estado} 
 		 ,   descricao = '${produto.descricao}' 
 		 ,   ncm = '${produto.ncm}' 
 		 ,   id_principal = ${produto.id_principal} 
 		 ,   user_insert = ${produto.user_insert} 
 		 ,   user_update = ${produto.user_update} 
 		 where id_empresa = ${produto.id_empresa} and  id_filial = ${produto.id_filial} and  codigo = ${produto.codigo}  returning * `;
        return db.oneOrNone(strSql);
    }
    /* CRUD - DELETE */
exports.deleteProduto = function(id_empresa, id_filial, codigo) {
    strSql = `delete from produtos 
		 where id_empresa = ${id_empresa} and  id_filial = ${id_filial} and  codigo = ${codigo}  `;
    return db.oneOrNone(strSql);
}