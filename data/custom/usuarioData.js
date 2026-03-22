/* DATA usuarios */
const db = require(",,/../infra/database");
const shared = require("../../util/shared.js");

/* CRUD GET ALL*/
exports.getUsuariosByDepara = function (params) {
  where = "";
  orderby = "";
  paginacao = "";

  if (params.orderby == "")
    orderby = "param.id_empresa,param.id_local,param.id_inventario,param.de";
  if (params.orderby == "000001")
    orderby = "param.id_empresa,param.id_local,param.id_inventario,param.de";

  if (orderby != "") orderby = " order by " + orderby;
  if (params.id_empresa !== 0) {
    if (where != "") where += " and ";
    where += `param.id_empresa = ${params.id_empresa} `;
  }
  if (params.id_local !== 0) {
    if (where != "") where += " and ";
    where += `param.id_local = ${params.id_local} `;
  }
  if (params.id_inventario !== 0) {
    if (where != "") where += " and ";
    where += `param.id_inventario = ${params.id_inventario} `;
  }
  if (params.de !== 0) {
    if (where != "") where += " and ";
    where += `param.de = ${params.de} `;
  }
  if (params.para !== 0) {
    if (where != "") where += " and ";
    where += `param.para = ${params.para} `;
  }
  if (params.status !== -1) {
    if (where != "") where += " and ";
    where += `param.status = ${params.status} `;
  }
  if (params.id_usuario !== 0) {
    if (where != "") where += " and ";
    where += `param.id_usuario = ${params.id_usuario} `;
  }
  if (where != "") where = " where " + where;
  if (params.pagina != 0) {
    paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
  }

  if (where != "") where = " where " + where;
  if (params.contador == "S") {
    sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM usuarios usu   
				 inner join gruposusuarios gru on gru.id_empresa = usu.id_empresa and gru.codigo = usu.grupo   
				  ${where} `;
    return db.one(sqlStr);
  } else {
    strSql = `select   
			   usu.id_empresa as  id_empresa  
			,  usu.id as  id  
			,  usu.cnpj_cpf as  cnpj_cpf  
			,  usu.razao as  razao  
			,  to_char(usu.cadastr, 'DD/MM/YYYY') as cadastr  
			,  usu.rua as  rua  
			,  usu.nro as  nro  
			,  usu.complemento as  complemento  
			,  usu.bairro as  bairro  
			,  usu.cidade as  cidade  
			,  usu.uf as  uf  
			,  usu.cep as  cep  
			,  usu.tel1 as  tel1  
			,  usu.tel2 as  tel2  
			,  usu.email as  email  
			,  usu.obs as  obs  
			,  usu.senha as  senha  
			,  usu.grupo as  grupo  
			,  usu.ativo as  ativo  
			,  usu.user_insert as  user_insert  
			,  usu.user_update as  user_update  
			,  gru.descricao as  grupo_descricao  
			,  case
			       when coalesce(pad.id_usuario,0) = 0 then 'N'
				   else                                   'S'
			   end as tem_padrao
			, coalesce(emp.razao,'') as empresa
			, coalesce(local.razao,'') as local
			, coalesce(inv.descricao,'') as inventario
			, '0' as flag
			FROM depara   
				 inner join gruposusuarios gru on gru.id_empresa = usu.id_empresa and gru.codigo     = usu.grupo 
				 inner join usuarios       us  on de.id_empresa  = usu.id_empresa and de.id_usuario  = usu.id
  			${where} 			${orderby} ${paginacao} `;
    return db.manyOrNone(strSql);
  }
};
