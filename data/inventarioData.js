/* DATA inventarios */
const db = require("../infra/database");
const shared = require("../util/shared.js");

/* GET CAMPOS */
exports.getCampos = function(Inventario) {
    return [
        Inventario.id_empresa,
        Inventario.id_filial,
        Inventario.codigo,
        Inventario.descricao,
        Inventario.id_responsavel,
        Inventario.data_inicial,
        Inventario.data_final,
        Inventario.data_encerra,
        Inventario.laudo,
        Inventario.user_insert,
        Inventario.user_update,
    ];
};
/* CRUD GET */
exports.getInventario = function(id_empresa, id_filial, codigo) {
    strSql = ` select   
			   inv.id_empresa as  id_empresa  
			,  inv.id_filial as  id_filial  
			,  inv.codigo as  codigo  
			,  inv.descricao as  descricao  
			,  inv.id_responsavel as  id_responsavel  
			, to_char(inv.data_inicial, 'DD/MM/YYYY') as data_inicial  
			, to_char(inv.data_final, 'DD/MM/YYYY') as data_final  
			, to_char(inv.data_encerra, 'DD/MM/YYYY') as data_encerra  
			,  inv.laudo as  laudo  
			,  inv.folder_id as folder_id
			,  inv.user_insert as  user_insert  
			,  inv.user_update as  user_update  
			,  local.razao as  local_razao  
			,  resp.razao as  resp_razao    
 			FROM inventarios inv 	  
				 inner join locais local on local.id_empresa = inv.id_empresa and local.id = inv.id_filial
				 inner join usuarios resp on resp.id_empresa = inv.id_empresa and resp.id = inv.id_responsavel   
			 where inv.id_empresa = ${id_empresa} and  inv.id_filial = ${id_filial} and  inv.codigo = ${codigo}  `;
    return db.oneOrNone(strSql);
};

exports.getResumo = function(id_empresa, id_filial, codigo) {
    strSql = ` select   
		_descricao as descricao,
		_responsavel as responsavel,
		_situacao as situacao,
		_total_ativos as total_ativos,
		_total_inventariados as total_inventariados, 
		_situacao_0 as situacao_0,
		_situacao_1 as situacao_1,
		_situacao_2 as situacao_2,
		_situacao_3 as situacao_3,
		_situacao_4 as situacao_4,
		_situacao_5 as situacao_5,
		_fotos      as fotos
 			FROM resumo_inventario(${id_empresa},${id_filial},${codigo})`;
    return db.oneOrNone(strSql);
};
/* CRUD GET ALL*/
exports.getInventarios = function(params) {
    if (params) {
        where = "";
        orderby = "";
        paginacao = "";

        if (params.orderby == "") orderby = "inv.id_empresa,inv.id_filial";
        if (params.orderby == "Filial") orderby = "inv.id_empresa,inv.id_filial";
        if (params.orderby == "Código")
            orderby = "inv.id_empresa,inv.id_filial,inv.codigo";
        if (params.orderby == "Descricao")
            orderby = "inv.id_empresa,inv.id_filial,inv.descricao";

        if (orderby != "") orderby = " order by " + orderby;
        if (params.id_empresa !== 0) {
            if (where != "") where += " and ";
            where += `inv.id_empresa = ${params.id_empresa} `;
        }
        if (params.id_filial !== 0) {
            if (where != "") where += " and ";
            where += `inv.id_filial = ${params.id_filial} `;
        }
        if (params.codigo !== 0) {
            if (where != "") where += " and ";
            where += `inv.codigo = ${params.codigo} `;
        }
        if (params.descricao.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `inv.descricao = '${params.descricao}' `;
            } else {
                where += `inv.descricao like '%${params.descricao.trim()}%' `;
            }
        }
        if (where != "") where = " where " + where;

        if (params.pagina != 0) {
            paginacao = `limit ${params.tamPagina} offset ((${params.pagina} - 1) * ${params.tamPagina})`;
        }

        if (params.contador == "S") {
            sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM inventarios inv   
				 inner join locais local on local.id_empresa = inv.id_empresa and local.id = inv.id_filial
				 inner join usuarios resp on resp.id_empresa = inv.id_empresa and resp.id = inv.id_responsavel   
				  ${where} `;
            return db.one(sqlStr);
        } else {
            strSql = `select   
			   inv.id_empresa as  id_empresa  
			,  inv.id_filial as  id_filial  
			,  inv.codigo as  codigo  
			,  inv.descricao as  descricao  
			,  inv.id_responsavel as  id_responsavel  
			, to_char(inv.data_inicial, 'DD/MM/YYYY') as data_inicial  
			, to_char(inv.data_final, 'DD/MM/YYYY') as data_final  
			, to_char(inv.data_encerra, 'DD/MM/YYYY') as data_encerra  
			,  inv.laudo as  laudo  
			,  inv.user_insert as  user_insert  
			,  inv.user_update as  user_update  
			,  local.razao as  local_razao  
			,  resp.razao as  resp_razao     
			FROM inventarios inv   
				 inner join locais local on local.id_empresa = inv.id_empresa and local.id = inv.id_filial
				 inner join usuarios resp on resp.id_empresa = inv.id_empresa and resp.id = inv.id_responsavel   
			${where} 			${orderby} ${paginacao} `;
            return db.manyOrNone(strSql);
        }
    } else {
        strSql = `select   
			   inv.id_empresa as  id_empresa  
			,  inv.id_filial as  id_filial  
			,  inv.codigo as  codigo  
			,  inv.descricao as  descricao  
			,  inv.id_responsavel as  id_responsavel  
			, to_char(inv.data_inicial, 'DD/MM/YYYY') as data_inicial  
			, to_char(inv.data_final, 'DD/MM/YYYY') as data_final  
			, to_char(inv.data_encerra, 'DD/MM/YYYY') as data_encerra  
			,  inv.laudo as  laudo  
			,  inv.user_insert as  user_insert  
			,  inv.user_update as  user_update  
			,  local.razao as  local_razao  
			,  resp.razao as  resp_razao    
			FROM inventarios inv			   
				 inner join locais local on local.id_empresa = inv.id_empresa and local.id = inv.id_filial
				 inner join usuarios resp on resp.id_empresa = inv.id_empresa and resp.id = inv.id_responsavel  `;
        return db.manyOrNone(strSql);
    }
};
/* CRUD - INSERT */
exports.insertInventario = function(inventario) {
    strSql = `insert into inventarios (
		     id_empresa 
		 ,   id_filial 
		 ,   descricao 
		 ,   id_responsavel 
		 ,   data_inicial 
		 ,   data_final 
		 ,   data_encerra 
		 ,   laudo 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${inventario.id_empresa} 
		 ,   ${inventario.id_filial} 
		 ,   '${inventario.descricao}' 
		 ,   ${inventario.id_responsavel} 
		 ,   ${shared.formatDateYYYYMMDD(inventario.data_inicial)} 
		 ,   ${shared.formatDateYYYYMMDD(inventario.data_final)}
		 ,   ${shared.formatDateYYYYMMDD(inventario.data_encerra)}
		 ,   '${inventario.laudo}' 
		 ,   ${inventario.user_insert} 
		 ,   ${inventario.user_update} 
		 ) 
 returning * `;
    console.log("InsertInventario", strSql);
    return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updateInventario = function(inventario) {
    strSql = `update   inventarios set  
		     descricao = '${inventario.descricao}' 
 		 ,   id_responsavel = ${inventario.id_responsavel} 
 		 ,   data_inicial = ${shared.formatDateYYYYMMDD(inventario.data_inicial)} 
 		 ,   data_final = ${shared.formatDateYYYYMMDD(inventario.data_final)}
 		 ,   data_encerra = ${shared.formatDateYYYYMMDD(inventario.data_encerra)} 
 		 ,   laudo = '${inventario.laudo}' 
 		 ,   user_insert = ${inventario.user_insert} 
 		 ,   user_update = ${inventario.user_update} 
 		 where id_empresa = ${inventario.id_empresa} and  id_filial = ${
    inventario.id_filial
  } and  codigo = ${inventario.codigo}  returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - DELETE */
exports.deleteInventario = function(id_empresa, id_filial, codigo) {
    strSql = `delete from inventarios 
		 where id_empresa = ${id_empresa} and  id_filial = ${id_filial} and  codigo = ${codigo}  `;
    return db.oneOrNone(strSql);
};