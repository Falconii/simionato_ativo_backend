/* DATA lancamentos */
const db = require("../infra/database");
const shared = require("../util/shared.js");

/* GET CAMPOS */
exports.getCampos = function (Lancamento) {
  return [
    Lancamento.id_empresa,
    Lancamento.id_filial,
    Lancamento.id_inventario,
    Lancamento.id_imobilizado,
    Lancamento.id_usuario,
    Lancamento.id_lanca,
    Lancamento.obs,
    Lancamento.dtlanca,
    Lancamento.estado,
    Lancamento.new_codigo,
    Lancamento.new_cc,
    Lancamento.condicao,
    Lancamento.book,
    Lancamento.user_insert,
    Lancamento.user_update,
  ];
};
/* CRUD GET */
exports.getLancamento = function (
  id_empresa,
  id_filial,
  id_inventario,
  id_imobilizado
) {
  strSql = ` select   
			   lanca.id_empresa as  id_empresa  
			,  lanca.id_filial as  id_filial  
			,  lanca.id_inventario as  id_inventario  
			,  lanca.id_imobilizado as  id_imobilizado  
			,  lanca.id_usuario as  id_usuario  
			,  lanca.id_lanca as  id_lanca  
			,  lanca.obs as  obs  
			, to_char(lanca.dtlanca, 'DD/MM/YYYY') as dtlanca  
			,  lanca.estado as  estado  
			,  lanca.new_codigo as  new_codigo  
			,  lanca.new_cc as  new_cc  
			,  lanca.condicao as  condicao 
			,  lanca.book     as  book 
			,  lanca.user_insert as  user_insert  
			,  lanca.user_update as  user_update  
			,  imo_inv.status as  imo_inv_status  
			,  inv.descricao as  inv_descricao  
			,  imo.cod_cc as  imo_cod_cc  
			,  imo.cod_grupo as  imo_cod_grupo  
			,  imo.descricao as  imo_descricao  
			,  usu.razao as  usu_razao    
 			FROM lancamentos lanca 	  
				 inner join imobilizadosinventarios imo_inv on imo_inv.id_empresa = lanca.id_empresa and imo_inv.id_filial = lanca.id_filial and imo_inv.id_inventario = lanca.id_inventario and imo_inv.id_imobilizado = lanca.id_imobilizado
				 inner join inventarios inv on inv.id_empresa = lanca.id_empresa and inv.id_filial = lanca.id_filial and inv.codigo = lanca.id_inventario 
				 inner join imobilizados imo on imo.id_empresa = imo_inv.id_empresa and imo.id_filial = imo_inv.id_filial and imo.codigo = imo_inv.id_imobilizado
				 inner join usuarios usu on usu.id_empresa = lanca.id_empresa and  usu.id  = lanca.id_usuario   
			 where lanca.id_empresa = ${id_empresa} and  lanca.id_filial = ${id_filial} and  lanca.id_inventario = ${id_inventario} and  lanca.id_imobilizado = ${id_imobilizado}  `;
  return db.oneOrNone(strSql);
};
/* CRUD GET ALL*/
exports.getLancamentos = function (params) {
  if (params) {
    where = "";
    orderby = "";
    paginacao = "";

    if (params.orderby == "") orderby = "imo_inv.id_empresa,imo_inv.id_filial";
    if (params.orderby == "Filial")
      orderby = "imo_inv.id_empresa,imo_inv.id_filial";
    if (params.orderby == "Nro")
      orderby = "imo_inv.id_empresa,imo_inv.id_filial";
    if (params.orderby == "Inventario")
      orderby = "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_inventario";
    if (params.orderby == "Imobilizado")
      orderby = "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_imobilizado";

    if (orderby != "") orderby = " order by " + orderby;
    if (params.id_empresa !== 0) {
      if (where != "") where += " and ";
      where += `lanca.id_empresa = ${params.id_empresa} `;
    }
    if (params.id_filial !== 0) {
      if (where != "") where += " and ";
      where += `lanca.id_filial = ${params.id_filial} `;
    }
    if (params.id_lanca !== 0) {
      if (where != "") where += " and ";
      where += `lanca.id_lanca = ${params.id_lanca} `;
    }
    if (params.id_inventario !== 0) {
      if (where != "") where += " and ";
      where += `lanca.id_inventario = ${params.id_inventario} `;
    }
    if (params.id_imobilizado !== 0) {
      if (where != "") where += " and ";
      where += `lanca.id_imobilizado = ${params.id_imobilizado} `;
    }
    if (where != "") where = " where " + where;
    if (params.contador == "S") {
      sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM lancamentos lanca   
				 inner join imobilizadosinventarios imo_inv on imo_inv.id_empresa = lanca.id_empresa and imo_inv.id_filial = lanca.id_filial and imo_inv.id_inventario = lanca.id_inventario and imo_inv.id_imobilizado = lanca.id_imobilizado
				 inner join inventarios inv on inv.id_empresa = lanca.id_empresa and inv.id_filial = lanca.id_filial and inv.codigo = lanca.id_inventario 
				 inner join imobilizados imo on imo.id_empresa = imo_inv.id_empresa and imo.id_filial = imo_inv.id_filial and imo.codigo = imo_inv.id_imobilizado
				 inner join usuarios usu on usu.id_empresa = lanca.id_empresa and  usu.id  = lanca.id_usuario   
				  ${where} `;
      return db.one(sqlStr);
    } else {
      strSql = `select   
			   lanca.id_empresa as  id_empresa  
			,  lanca.id_filial as  id_filial  
			,  lanca.id_inventario as  id_inventario  
			,  lanca.id_imobilizado as  id_imobilizado  
			,  lanca.id_usuario as  id_usuario  
			,  lanca.id_lanca as  id_lanca  
			,  lanca.obs as  obs  
			, to_char(lanca.dtlanca, 'DD/MM/YYYY') as dtlanca  
			,  lanca.estado as  estado  
			,  lanca.new_codigo as  new_codigo  
			,  lanca.new_cc as  new_cc  
			,  lanca.condicao as  condicao 
			,  lanca.book     as  book 
			,  lanca.user_insert as  user_insert  
			,  lanca.user_update as  user_update  
			,  imo_inv.status as  imo_inv_status  
			,  inv.descricao as  inv_descricao  
			,  imo.cod_cc as  imo_cod_cc  
			,  imo.cod_grupo as  imo_cod_grupo  
			,  imo.descricao as  imo_descricao  
			,  usu.razao as  usu_razao     
			FROM lancamentos lanca   
				 inner join imobilizadosinventarios imo_inv on imo_inv.id_empresa = lanca.id_empresa and imo_inv.id_filial = lanca.id_filial and imo_inv.id_inventario = lanca.id_inventario and imo_inv.id_imobilizado = lanca.id_imobilizado
				 inner join inventarios inv on inv.id_empresa = lanca.id_empresa and inv.id_filial = lanca.id_filial and inv.codigo = lanca.id_inventario 
				 inner join imobilizados imo on imo.id_empresa = imo_inv.id_empresa and imo.id_filial = imo_inv.id_filial and imo.codigo = imo_inv.id_imobilizado
				 inner join usuarios usu on usu.id_empresa = lanca.id_empresa and  usu.id  = lanca.id_usuario   
			${where} 			${orderby} ${paginacao} `;
      return db.manyOrNone(strSql);
    }
  } else {
    strSql = `select   
			   lanca.id_empresa as  id_empresa  
			,  lanca.id_filial as  id_filial  
			,  lanca.id_inventario as  id_inventario  
			,  lanca.id_imobilizado as  id_imobilizado  
			,  lanca.id_usuario as  id_usuario  
			,  lanca.id_lanca as  id_lanca  
			,  lanca.obs as  obs  
			, to_char(lanca.dtlanca, 'DD/MM/YYYY') as dtlanca  
			,  lanca.estado as  estado  
			,  lanca.new_codigo as  new_codigo  
			,  lanca.new_cc as  new_cc  
			,  lanca.user_insert as  user_insert  
			,  lanca.user_update as  user_update  
			,  imo_inv.status as  imo_inv_status  
			,  inv.descricao as  inv_descricao  
			,  imo.cod_cc as  imo_cod_cc  
			,  imo.cod_grupo as  imo_cod_grupo  
			,  imo.descricao as  imo_descricao  
			,  usu.razao as  usu_razao    
			FROM lancamentos lanca			   
				 inner join imobilizadosinventarios imo_inv on imo_inv.id_empresa = lanca.id_empresa and imo_inv.id_filial = lanca.id_filial and imo_inv.id_inventario = lanca.id_inventario and imo_inv.id_imobilizado = lanca.id_imobilizado
				 inner join inventarios inv on inv.id_empresa = lanca.id_empresa and inv.id_filial = lanca.id_filial and inv.codigo = lanca.id_inventario 
				 inner join imobilizados imo on imo.id_empresa = imo_inv.id_empresa and imo.id_filial = imo_inv.id_filial and imo.codigo = imo_inv.id_imobilizado
				 inner join usuarios usu on usu.id_empresa = lanca.id_empresa and  usu.id  = lanca.id_usuario  `;
    return db.manyOrNone(strSql);
  }
};
/* CRUD - INSERT */
exports.insertLancamento = function (lancamento) {
  strSql = `insert into lancamentos (
		     id_empresa 
		 ,   id_filial 
		 ,   id_inventario 
		 ,   id_imobilizado 
		 ,   id_usuario 
		 ,   obs 
		 ,   dtlanca 
		 ,   estado 
		 ,   new_codigo 
		 ,   new_cc 
		 ,   condicao
		 ,   book
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${lancamento.id_empresa} 
		 ,   ${lancamento.id_filial} 
		 ,   ${lancamento.id_inventario} 
		 ,   ${lancamento.id_imobilizado} 
		 ,   ${lancamento.id_usuario} 
		 ,   '${lancamento.obs}' 
		 ,   ${shared.formatDateYYYYMMDD(lancamento.dtlanca)}
		 ,   ${lancamento.estado} 
		 ,   ${lancamento.new_codigo} 
		 ,   '${lancamento.new_cc}' 
		 ,   ${lancamento.condicao} 
		 ,  '${lancamento.book}' 
		 ,   ${lancamento.user_insert} 
		 ,   ${lancamento.user_update} 
		 ) 
 returning * `;
  console.log("insertLancamento", strSql);
  return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updateLancamento = function (lancamento) {
  strSql = `update   lancamentos set  
		     id_usuario = ${lancamento.id_usuario} 
 		 ,   id_lanca = ${lancamento.id_lanca} 
 		 ,   obs = '${lancamento.obs}' 
 		 ,   dtlanca = ${shared.formatDateYYYYMMDD(lancamento.dtlanca)} 
 		 ,   estado = ${lancamento.estado} 
 		 ,   new_codigo = ${lancamento.new_codigo} 
 		 ,   new_cc = '${lancamento.new_cc}' 
		 ,   condicao = ${lancamento.condicao} 
		 ,   book     = '${lancamento.book}' 
 		 ,   user_insert = ${lancamento.user_insert} 
 		 ,   user_update = ${lancamento.user_update} 
 		 where id_empresa = ${lancamento.id_empresa} and  id_filial = ${
    lancamento.id_filial
  } and  id_inventario = ${lancamento.id_inventario} and  id_imobilizado = ${
    lancamento.id_imobilizado
  }  returning * `;
  console.log("updateLancamento", strSql);
  return db.oneOrNone(strSql);
};
/* CRUD - DELETE */
exports.deleteLancamento = function (
  id_empresa,
  id_filial,
  id_inventario,
  id_imobilizado
) {
  strSql = `delete from lancamentos 
		 where id_empresa = ${id_empresa} and  id_filial = ${id_filial} and  id_inventario = ${id_inventario} and  id_imobilizado = ${id_imobilizado}  `;
  return db.oneOrNone(strSql);
};

exports.getResumoLancamentos = function (params) {
  console.log(`Chegue na Data getResumoLancamentos ${params}`);
  if (params) {
    where = "";
    if (params.id_empresa !== 0) {
      if (where != "") where += " and ";
      where += `lanca.id_empresa = ${params.id_empresa} `;
    }
    if (params.id_filial !== 0) {
      if (where != "") where += " and ";
      where += `lanca.id_filial = ${params.id_filial} `;
    }
    if (params.id_inventario !== 0) {
      if (where != "") where += " and ";
      where += `lanca.id_inventario = ${params.id_inventario} `;
    }
    if (where != "") where = " where " + where;
    strSql = `
			select 
      			lanca.id_usuario
     			,usu.razao
	 			,count(*) as total
				from lancamentos lanca
				inner join usuarios usu on usu.id_empresa = lanca.id_empresa and usu.id = lanca.id_usuario 
				${where} 
				group by  
     			lanca.id_usuario
     			,usu.razao
				order by usu.razao `;
    console.log(`getResumoLancamentos ${strSql}`);
    return db.manyOrNone(strSql);
  }
};
