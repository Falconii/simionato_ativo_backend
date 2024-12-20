/* DATA imobilizadosinventarios */
const db = require("../infra/database");
const shared = require("../util/shared.js");

/* GET CAMPOS */
exports.getCampos = function (Imobilizadoinventario) {
  return [
    Imobilizadoinventario.id_empresa,
    Imobilizadoinventario.id_filial,
    Imobilizadoinventario.id_inventario,
    Imobilizadoinventario.id_imobilizado,
    Imobilizadoinventario.id_lanca,
    Imobilizadoinventario.status,
    Imobilizadoinventario.new_codigo,
    Imobilizadoinventario.new_cc,
    Imobilizadoinventario.condicao,
    Imobilizadoinventario.book,
    Imobilizadoinventario.user_insert,
    Imobilizadoinventario.user_update,
  ];
};
/* CRUD GET */
exports.getImobilizadoinventario = function (
  id_empresa,
  id_filial,
  id_inventario,
  id_imobilizado
) {
  strSql = ` select   
			   imo_inv.id_empresa as  id_empresa  
			,  imo_inv.id_filial as  id_filial  
			,  imo_inv.id_inventario as  id_inventario  
			,  imo_inv.id_imobilizado as  id_imobilizado  
			,  imo_inv.id_lanca as  id_lanca  
			,  imo_inv.status as  status  
			,  imo_inv.new_codigo as  new_codigo  
			,  imo_inv.new_cc as  new_cc  
      ,  imo_inv.condicao as  condicao 
      ,  imo_inv.book     as  book
			,  imo_inv.user_insert as  user_insert  
			,  imo_inv.user_update as  user_update  
			,  imo.descricao as  imo_descricao  
      ,  imo.cod_cc    as  imo_cod_cc
      ,  imo.cod_grupo as  imo_cod_grupo 
      ,  imo.nfe           as imo_nfe 
      ,  imo.serie         as imo_serie 
      ,  imo.item          as imo_item  
      ,  imo.origem        as imo_origem
      ,  imo.principal     as imo_principal
			,  cc.descricao as  cc_descricao  
			,  gru.descricao as  grupo_descricao  
			,  coalesce(lanca.id_usuario,0) as  lanc_id_usuario  
			,  coalesce(lanca.obs,'') as  lanc_obs 
			,  coalesce(to_char(lanca.dtlanca, 'DD/MM/YYYY'),'') as  lanc_dt_lanca 
			,  coalesce(lanca.estado,0) as  lanc_estado    
			,  coalesce(usu.razao,'') as  usu_razao     
      ,  coalesce(new_cc.descricao,'') as  new_cc_descricao 
      ,  coalesce(princ.descricao,'') as  princ_descricao 
 			FROM imobilizadosinventarios imo_inv 	  
				 inner join imobilizados  imo on imo.id_empresa = imo_inv.id_empresa and imo.id_filial = imo_inv.id_filial and imo.codigo = imo_inv.id_imobilizado
				 inner join centroscustos cc  on cc.id_empresa = imo_inv.id_empresa and cc.id_filial = imo_inv.id_filial and cc.codigo = imo.cod_cc
				 inner join grupos gru    on  gru.id_empresa = imo_inv.id_empresa and gru.id_filial = imo_inv.id_filial and gru.codigo = imo.cod_grupo
				 left join  lancamentos   lanca on lanca.id_empresa = imo_inv.id_empresa and lanca.id_filial = imo_inv.id_filial and lanca.id_inventario = imo_inv.id_inventario and lanca.id_imobilizado = imo_inv.id_imobilizado and imo_inv.id_lanca = lanca.id_lanca   
         left join usuarios    usu   on usu.id_empresa = imo_inv.id_empresa and usu.id = lanca.id_usuario
         left join centroscustos new_cc on new_cc.id_empresa = imo_inv.id_empresa and new_cc.id_filial = imo_inv.id_filial and new_cc.codigo = imo_inv.new_cc
         left join principais princ  on imo.id_empresa = princ.id_empresa and imo.id_filial = princ.id_filial and imo.principal = princ.codigo
			 where imo_inv.id_empresa = ${id_empresa} and  imo_inv.id_filial = ${id_filial} and  imo_inv.id_inventario = ${id_inventario} and  imo_inv.id_imobilizado = ${id_imobilizado}  `;
  console.log("getimobilizado", strSql);
  return db.oneOrNone(strSql);
};

exports.getImobilizadoinventarioExisteNew = function (
  id_empresa,
  id_filial,
  id_inventario,
  id_imobilizado,
  new_codigo,
  inclusao
) {
  let where = "";
  if (!inclusao) {
    where = ` and  imo_inv.id_imobilizado <> ${id_imobilizado} `;
  }
  strSql = ` select   
			   imo_inv.id_empresa as  id_empresa  
			,  imo_inv.id_filial as  id_filial  
			,  imo_inv.id_inventario as  id_inventario  
			,  imo_inv.id_imobilizado as  id_imobilizado  
			,  imo_inv.new_codigo as  new_codigo 
 			FROM imobilizadosinventarios imo_inv
			where imo_inv.id_empresa = ${id_empresa} and  imo_inv.id_filial = ${id_filial} and  imo_inv.id_inventario = ${id_inventario} ${where} and  imo_inv.new_codigo = ${new_codigo}  `;
  console.log("getimobilizado", strSql);
  return db.manyOrNone(strSql);
};
/* CRUD GET ALL*/
exports.getImobilizadosinventarios = function (params) {
  if (params) {
    console.log(params);
    where = "";
    orderby = "";
    paginacao = "";

    if (params.orderby == "")
      orderby =
        "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_inventario,imo_inv.id_imobilizado";
    //Ativo-Antigo    
    if (params.orderby == "001")
      orderby =
        "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_inventario,imo_inv.id_imobilizado";
    //Ativo-Novo
    if (params.orderby == "002")
      orderby =
        "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_inventario,imo_inv.new_codigo";
    //CC-Antigo
    if (params.orderby == "003")
      orderby =
        "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_inventario,imo.cod_cc,imo_inv.id_imobilizado";
    //CC-Novo
    if (params.orderby == "004")
      orderby =
        "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_inventario,imo_inv.new_cc,imo_inv.id_imobilizado";
    //Grupo
    if (params.orderby == "005")
      orderby =
        "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_inventario,imo.cod_grupo,imo_inv.id_imobilizado";
    //Descrição
    if (params.orderby == "006")
      orderby =
        "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_inventario,imo.descricao";
     //Observação
     if (params.orderby == "007")
      orderby =
        "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_inventario,coalesce(lanca.obs,'')";
    //Data
     //Data
     if (params.orderby == "008")
      orderby =
        "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_inventario,lanca.dtlanca";

    if (orderby != "") orderby = " order by " + orderby;

    if (params.id_empresa !== 0) {
      if (where != "") where += " and ";
      where += `imo_inv.id_empresa = ${params.id_empresa} `;
    }
    if (params.id_filial !== 0) {
      if (where != "") where += " and ";
      where += `imo_inv.id_filial = ${params.id_filial} `;
    }
    if (params.id_inventario !== 0) {
      if (where != "") where += " and ";
      where += `imo_inv.id_inventario = ${params.id_inventario} `;
    }
    if (params.id_imobilizado !== 0) {
      if (where != "") where += " and ";
      where += `imo_inv.id_imobilizado = ${params.id_imobilizado} `;
    }
    if (params.id_cc.trim() !== "") {
      if (where != "") where += " and ";
       where += `( imo.cod_cc = '${params.id_cc}' OR imo_inv.new_cc = '${params.id_cc}' )`;
    }

    if (params.dtinicial !== '') {
      if (where != "") where += " and ";
      where += `( lanca.dtlanca >=  ${shared.formatDateYYYYMMDD(params.dtinicial)} and  lanca.dtlanca <=  ${shared.formatDateYYYYMMDD(params.dtfinal)} ) `;
    }

    if (params.id_grupo !== 0) {
      if (where != "") where += " and ";
      where += `imo.cod_grupo = ${params.id_grupo} `;
    }
    if (params.descricao !== "") {
      if (where != "") where += " and ";
      if (params.sharp) {
        where += `unaccent(imo.descricao) = '${shared.semAcento(params.descricao)})' `;
      } else {
        where += `unaccent(imo.descricao) like '%${shared.semAcento(params.descricao.trim())}%' `;
      }
    }
    console.log("observacao", params.observacao);
    if (params.observacao) {
      if (params.observacao !== "") {
        if (where != "") where += " and ";
        if (params.sharp) {
          where += `unaccent(lanca.obs)  = '${shared.semAcento(params.observacao)}' `;
        } else {
          where += `unaccent(lanca.obs)  like '%${shared.semAcento(params.observacao.trim())}%' `;
        }
      }
    }
    if (params.status !== -1) {
      if (where != "") where += " and ";
      if (params.status == 90) {
        where += `imo_inv.status > 0 `;
      } else {
        where += `imo_inv.status = ${params.status} `;
      }
    }
    if (params.new_cc.trim() !== "") {
      if (where != "") where += " and ";
      where += `imo_inv.new_cc = '${params.new_cc}' `;
    }
    if (params.new_codigo !== 0) {
      if (where != "") where += " and ";
      where += `imo_inv.new_codigo = ${params.new_codigo} `;
    }
    if (params.condicao !== 0) {
      if (where != "") where += " and ";
      where += `imo_inv.condicao = ${params.condicao} `;
    }
    if (params.book !== "") {
      if (where != "") where += " and ";
      where += `imo_inv.book = '${params.book}'`;
    }
    if (params.id_usuario !== 0) {
      if (where != "") where += " and ";
      where += `lanca.id_usuario = ${params.id_usuario} `;
    }

    
    if (params.id_principal){
      if (params.id_principal !== 0) {
        if (where != "") where += " and ";
        where += `imo.principal = ${params.id_principal} `;
      }
   }
    
    if (params.origem.trim() !== "") {
      if (where != "") where += " and ";
      if (params.sharp) {
        where += `imo.origem = '${params.origem}' `;
      } else {
        where += `imo.origem like '%${params.origem.trim()}%' `;
      }
    }
    if (where != "") where = " where " + where;

    if (params.pagina != 0) {
      paginacao = `limit ${params.tamPagina} offset ((${params.pagina} - 1) * ${params.tamPagina})`;
    }

    if (params.contador == "S") {
      sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM imobilizadosinventarios imo_inv   
				 inner join imobilizados imo on imo.id_empresa = imo_inv.id_empresa and imo.id_filial = imo_inv.id_filial and imo.codigo = imo_inv.id_imobilizado
				 inner join centroscustos cc on cc.id_empresa = imo_inv.id_empresa and cc.id_filial = imo_inv.id_filial and cc.codigo = imo.cod_cc
				 inner join grupos gru on gru.id_empresa = imo_inv.id_empresa and gru.id_filial = imo_inv.id_filial and gru.codigo = imo.cod_grupo
				 left join lancamentos lanca on lanca.id_empresa = imo_inv.id_empresa and lanca.id_filial = imo_inv.id_filial and lanca.id_inventario = imo_inv.id_inventario and lanca.id_imobilizado = imo_inv.id_imobilizado and imo_inv.id_lanca = lanca.id_lanca   
				  ${where} `;
      console.log("getImobilizadosinventarios-Contador", sqlStr);
      return db.one(sqlStr);
    } else {
      strSql = `select   
			   imo_inv.id_empresa as  id_empresa  
			,  imo_inv.id_filial as  id_filial  
			,  imo_inv.id_inventario as  id_inventario  
			,  imo_inv.id_imobilizado as  id_imobilizado  
			,  imo_inv.id_lanca as  id_lanca  
			,  imo_inv.status as  status  
			,  imo_inv.new_codigo as  new_codigo  
			,  imo_inv.new_cc as  new_cc  
      ,  imo_inv.condicao as  condicao 
      ,  imo_inv.book     as  book
			,  imo_inv.user_insert as  user_insert  
			,  imo_inv.user_update as  user_update  
			,  imo.descricao as  imo_descricao  
      ,  imo.cod_cc    as  imo_cod_cc
      ,  imo.cod_grupo as  imo_cod_grupo 
      ,  imo.nfe           as imo_nfe 
      ,  imo.serie         as imo_serie 
      ,  imo.item          as imo_item  
      ,  imo.origem        as imo_origem
      ,  imo.principal     as imo_principal
			,  cc.descricao as  cc_descricao  
			,  gru.descricao as  grupo_descricao  
			,  coalesce(lanca.id_usuario,0) as  lanc_id_usuario  
			,  coalesce(lanca.obs,'') as  lanc_obs 
			,  coalesce(to_char(lanca.dtlanca, 'DD/MM/YYYY'),'') as  lanc_dt_lanca 
			,  coalesce(lanca.estado,0) as  lanc_estado  
      ,  coalesce(lanca.condicao,0) as  lanc_condicao
      ,  coalesce(lanca.book,'') as  lanc_book    
			,  coalesce(usu.razao,'') as  usu_razao   
      ,  coalesce(new_cc.descricao,'') as  new_cc_descricao   
      ,  coalesce(princ.descricao,'') as  princ_descricao   
			FROM imobilizadosinventarios imo_inv   
				 inner join imobilizados imo on imo.id_empresa = imo_inv.id_empresa and imo.id_filial = imo_inv.id_filial and imo.codigo = imo_inv.id_imobilizado
				 inner join centroscustos cc on cc.id_empresa = imo_inv.id_empresa and cc.id_filial = imo_inv.id_filial and cc.codigo = imo.cod_cc
				 inner join grupos gru on gru.id_empresa = imo_inv.id_empresa and gru.id_filial = imo_inv.id_filial and gru.codigo = imo.cod_grupo
				 left join lancamentos lanca on lanca.id_empresa = imo_inv.id_empresa and lanca.id_filial = imo_inv.id_filial and lanca.id_inventario = imo_inv.id_inventario and lanca.id_imobilizado = imo_inv.id_imobilizado and imo_inv.id_lanca = lanca.id_lanca   
				 left join usuarios      usu on usu.id_empresa = imo_inv.id_empresa and usu.id = lanca.id_usuario
         left join centroscustos new_cc on new_cc.id_empresa = imo_inv.id_empresa and new_cc.id_filial = imo_inv.id_filial and new_cc.codigo = imo_inv.new_cc
         left join principais princ  on imo.id_empresa = princ.id_empresa and imo.id_filial = princ.id_filial and imo.principal = princ.codigo
			${where} 			${orderby} ${paginacao} `;
      console.log("==>", strSql);
      return db.manyOrNone(strSql);
    }
  } else {
    strSql = `select   
			   imo_inv.id_empresa as  id_empresa  
			,  imo_inv.id_filial as  id_filial  
			,  imo_inv.id_inventario as  id_inventario  
			,  imo_inv.id_imobilizado as  id_imobilizado  
			,  imo_inv.id_lanca as  id_lanca  
			,  imo_inv.status as  status  
			,  imo_inv.new_codigo as  new_codigo  
			,  imo_inv.new_cc as  new_cc  
			,  imo_inv.user_insert as  user_insert  
			,  imo_inv.user_update as  user_update  
			,  imo.descricao as  imo_descricao  
            ,  imo.cod_cc    as  imo_cod_cc
            ,  imo.cod_grupo as  imo_cod_grupo 
            ,  imo.nfe           as imo_nfe 
            ,  imo.serie         as imo_serie 
            ,  imo.item          as imo_item  
            ,  imo.origem        as imo_origem
            ,  cc.descricao as  cc_descricao  
            ,  gru.descricao as  grupo_descricao  
            ,  coalesce(lanca.id_usuario,0) as  lanc_id_usuario  
            ,  coalesce(lanca.obs,'') as  lanc_obs 
            ,  coalesce(to_char(lanca.dtlanca, 'DD/MM/YYYY'),'') as  lanc_dt_lanca
            ,  coalesce(lanca.estado,0) as  lanc_estado    
            ,  coalesce(usu.razao,'') as  usu_razao   
            ,  coalesce(new_cc.descricao,'') as  new_cc_descricao   
			FROM imobilizadosinventarios imo_inv			   
				 inner join imobilizados imo on imo.id_empresa = imo_inv.id_empresa and imo.id_filial = imo_inv.id_filial and imo.codigo = imo_inv.id_imobilizado
				 inner join centroscustos cc on cc.id_empresa = imo_inv.id_empresa and cc.id_filial = imo_inv.id_filial and cc.codigo = imo.cod_cc
				 inner join grupos gru on gru.id_empresa = imo_inv.id_empresa and gru.id_filial = imo_inv.id_filial and gru.codigo = imo.cod_grupo
				 left join lancamentos lanca on lanca.id_empresa = imo_inv.id_empresa and lanca.id_filial = imo_inv.id_filial and lanca.id_inventario = imo_inv.id_inventario and lanca.id_imobilizado = imo_inv.id_imobilizado and imo_inv.id_lanca = lanca.id_lanca  
                 left join usuarios    usu   on usu.id_empresa = imo_inv.id_empresa and usu.id = lanca.id_usuario
                 left join centroscustos new_cc on new_cc.id_empresa = imo_inv.id_empresa and new_cc.id_filial = imo_inv.id_filial and new_cc.codigo = imo_inv.new_cc `;
    return db.manyOrNone(strSql);
  }
};

exports.getImobilizadosinventariosFotos = function (params) {
    console.log("Fotos Inventario Parametros",params);
    where = "";
    orderby = "";
    paginacao = "";

    if (params.orderby == "")
      orderby =
        "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_inventario,imo_inv.id_imobilizado";
    if (params.orderby == "Filial")
      orderby =
        "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_inventario,imo_inv.id_imobilizado";
    if (params.orderby == "Inventario")
      orderby =
        "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_inventario,imo_inv.id_imobilizado";
    if (params.orderby == "Imobilizado")
      orderby =
        "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_inventario,imo_inv.id_imobilizado";
    if (params.orderby == "Descrição")
      orderby =
        "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_inventario,imo.descricao";
    if (params.orderby == "CC")
      orderby =
        "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_inventario,imo.id_cc,imo_inv.id_imobilizado";

    if (orderby != "") orderby = " order by " + orderby;

    try {
      if (params.id_empresa !== 0) {
        if (where != "") where += " and ";
        where += `imo_inv.id_empresa = ${params.id_empresa} `;
      }
      if (params.id_filial !== 0) {
        if (where != "") where += " and ";
        where += `imo_inv.id_filial = ${params.id_filial} `;
      }
      if (params.id_inventario !== 0) {
        if (where != "") where += " and ";
        where += `imo_inv.id_inventario = ${params.id_inventario} `;
      }
      if (params.id_imobilizado !== 0) {
        if (where != "") where += " and ";
        where += `imo_inv.id_imobilizado = ${params.id_imobilizado} `;
      }
      if (params.id_cc.trim() !== "") {
        if (where != "") where += " and ";
        where += `imo.cod_cc = '${params.id_cc}' `;
      }

      if (params.dtinicial !== '') {
        if (where != "") where += " and ";
        where += `( lanca.dtlanca >=  ${shared.formatDateYYYYMMDD(params.dtinicial)} and  lanca.dtlanca <=  ${shared.formatDateYYYYMMDD(params.dtfinal)} ) `;
      }

      if (params.id_grupo !== 0) {
        if (where != "") where += " and ";
        where += `imo.cod_grupo = ${params.id_grupo} `;
      }
      if (params.descricao !== "") {
        if (where != "") where += " and ";
        if (params.sharp) {
          where += `unaccent(imo.descricao) = '${shared.semAcento(params.descricao)}' `;
        } else {
          where += `unaccent(imo.descricao) like '%${shared.semAcento(params.descricao.trim())}%' `;
        }
      }
      if (params.observacao) {
        if (params.observacao !== "") {
          if (where != "") where += " and ";
          if (params.sharp) {
            where += `unaccent(lanca.obs)  = '${shared.semAcento(params.observacao)}' `;
          } else {
            where += `unaccent(lanca.obs)  like '%${shared(params.observacao.trim())}%' `;
          }
        }
      }
      if (params.status !== -1) {
        if (where != "") where += " and ";
        if (params.status == 90) {
          where += `imo_inv.status > 0 `;
        } else {
          where += `imo_inv.status = ${params.status} `;
        }
      }
      if (params.new_cc.trim() !== "") {
        if (where != "") where += " and ";
        where += `imo_inv.new_cc = '${params.new_cc}' `;
      }
      if (params.new_codigo !== 0) {
        if (where != "") where += " and ";
        where += `imo_inv.new_codigo = ${params.new_codigo} `;
      }
      if (params.condicao !== 0) {
        if (where != "") where += " and ";
        where += `imo_inv.condicao = ${params.condicao} `;
      }
      if (params.book !== "") {
        if (where != "") where += " and ";
        where += `imo_inv.book = '${params.book}'`;
      }
      if (params.id_usuario !== 0) {
        if (where != "") where += " and ";
        where += `lanca.id_usuario = ${params.id_usuario} `;
      }
      if (params.origem.trim() !== "") {
        if (where != "") where += " and ";
        if (params.sharp) {
          where += `imo.origem = '${params.origem}' `;
        } else {
          where += `imo.origem like '%${params.origem.trim()}%' `;
        }
      }
      if (params.id_principal){
          if (params.id_principal !== 0) {
            if (where != "") where += " and ";
            where += `imo.principal = ${params.id_principal} `;
          }
       }

      if (where != "") where = " where " + where;

      if (params.pagina != 0) {
        paginacao = `limit ${params.tamPagina} offset ((${params.pagina} - 1) * ${params.tamPagina})`;
      }
    } catch(error){
        console.log("Erro Na Montagem Do Where",error);
    }
    
    if (params.contador == "S") {
      sqlStr = `SELECT COALESCE(COUNT(*),0) as total  from
                (select
                      imo_inv.id_empresa    as  id_empresa
                    ,  imo_inv.id_filial     as  id_filial
                    ,  imo_inv.id_inventario as  id_inventario
                    ,  imo_inv.id_imobilizado as  id_imobilizado
                FROM imobilizadosinventarios imo_inv
                inner join imobilizados imo on imo.id_empresa = imo_inv.id_empresa and imo.id_filial = imo_inv.id_filial and imo.codigo = imo_inv.id_imobilizado
                inner join centroscustos cc on cc.id_empresa = imo_inv.id_empresa and cc.id_filial = imo_inv.id_filial and cc.codigo = imo.cod_cc
                inner join grupos gru on gru.id_empresa = imo_inv.id_empresa and gru.id_filial = imo_inv.id_filial and gru.codigo = imo.cod_grupo
                inner join fotos foto on foto.id_empresa = imo_inv.id_empresa and foto.id_local = imo_inv.id_filial and foto.id_inventario = imo_inv.id_inventario and foto.id_imobilizado = imo_inv.id_imobilizado
                left join lancamentos lanca on lanca.id_empresa = imo_inv.id_empresa and lanca.id_filial = imo_inv.id_filial and lanca.id_inventario = imo_inv.id_inventario and lanca.id_imobilizado = imo_inv.id_imobilizado and imo_inv.id_lanca = lanca.id_lanca
                left join usuarios      usu on usu.id_empresa = imo_inv.id_empresa and usu.id = lanca.id_usuario       
                left join centroscustos new_cc on new_cc.id_empresa = imo_inv.id_empresa and new_cc.id_filial = imo_inv.id_filial and new_cc.codigo = imo_inv.new_cc
                ${where}
                group by 	
                      imo_inv.id_empresa   
                    ,  imo_inv.id_filial    
                    ,  imo_inv.id_inventario
                    ,  imo_inv.id_imobilizado ) as tabela
				 `;
      console.log("Fotos Inventario Contador", sqlStr);
      return db.one(sqlStr);
    } else {
      strSql = `select   distinct
	     imo_inv.id_empresa as  id_empresa
	  ,  imo_inv.id_filial as  id_filial
	  ,  imo_inv.id_inventario as  id_inventario
	  ,  imo_inv.id_imobilizado as  id_imobilizado
	  ,  imo_inv.id_lanca as  id_lanca
	  ,  imo_inv.status as  status
	  ,  imo_inv.new_codigo as  new_codigo
	  ,  imo_inv.new_cc as  new_cc
    ,  imo_inv.condicao as  condicao
    ,  imo_inv.book     as  book
	  ,  imo_inv.user_insert as  user_insert
	  ,  imo_inv.user_update as  user_update
	  ,  imo.descricao as  imo_descricao
    ,  imo.cod_cc    as  imo_cod_cc
    ,  imo.cod_grupo as  imo_cod_grupo
    ,  imo.nfe           as imo_nfe
    ,  imo.serie         as imo_serie
    ,  imo.item          as imo_item
    ,  imo.origem        as imo_origem
	  ,  cc.descricao as  cc_descricao
	  ,  gru.descricao as  grupo_descricao
	  ,  coalesce(lanca.id_usuario,0) as  lanc_id_usuario
	  ,  coalesce(lanca.obs,'') as  lanc_obs
    ,  coalesce(to_char(lanca.dtlanca, 'DD/MM/YYYY'),'') as  lanc_dt_lanca
	  ,  coalesce(lanca.estado,0) as  lanc_estado
    ,  coalesce(lanca.condicao,0) as  lanc_condicao
    ,  coalesce(lanca.book,'') as  lanc_book
    ,  coalesce(usu.razao,'') as  usu_razao
    ,  coalesce(new_cc.descricao,'') as  new_cc_descricao
    FROM imobilizadosinventarios imo_inv
    inner join imobilizados imo on imo.id_empresa = imo_inv.id_empresa and imo.id_filial = imo_inv.id_filial and imo.codigo = imo_inv.id_imobilizado
    inner join centroscustos cc on cc.id_empresa = imo_inv.id_empresa and cc.id_filial = imo_inv.id_filial and cc.codigo = imo.cod_cc
    inner join grupos gru on gru.id_empresa = imo_inv.id_empresa and gru.id_filial = imo_inv.id_filial and gru.codigo = imo.cod_grupo
    inner join fotos foto on foto.id_empresa = imo_inv.id_empresa and foto.id_local = imo_inv.id_filial and foto.id_inventario = imo_inv.id_inventario and foto.id_imobilizado = imo_inv.id_imobilizado
    left join lancamentos lanca on lanca.id_empresa = imo_inv.id_empresa and lanca.id_filial = imo_inv.id_filial and lanca.id_inventario = imo_inv.id_inventario and lanca.id_imobilizado = imo_inv.id_imobilizado and imo_inv.id_lanca = lanca.id_lanca
    left join usuarios      usu on usu.id_empresa = imo_inv.id_empresa and usu.id = lanca.id_usuario       
    left join centroscustos new_cc on new_cc.id_empresa = imo_inv.id_empresa and new_cc.id_filial = imo_inv.id_filial and new_cc.codigo = imo_inv.new_cc
			${where} ${orderby} ${paginacao} `;
      console.log("Fotos Inventario", strSql);
      return db.manyOrNone(strSql);
    }
  };

exports.getImobilizadosinventariosResumo = function (params) {
  if (params) {
    console.log(params);
    where = "";
    orderby = "";
    paginacao = "";

    if (params.orderby == "")
      orderby =
        "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_inventario,imo_inv.id_imobilizado";
    if (params.orderby == "Filial")
      orderby =
        "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_inventario,imo_inv.id_imobilizado";
    if (params.orderby == "Inventario")
      orderby =
        "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_inventario,imo_inv.id_imobilizado";
    if (params.orderby == "Imobilizado")
      orderby =
        "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_inventario,imo_inv.id_imobilizado";
    if (params.orderby == "Descrição")
      orderby =
        "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_inventario,imo.descricao";
    if (params.orderby == "CC")
      orderby =
        "imo_inv.id_empresa,imo_inv.id_filial,imo_inv.id_inventario,imo.id_cc,imo_inv.id_imobilizado";

    if (orderby != "") orderby = " order by " + orderby;
    if (params.id_empresa !== 0) {
      if (where != "") where += " and ";
      where += `imo_inv.id_empresa = ${params.id_empresa} `;
    }
    if (params.id_filial !== 0) {
      if (where != "") where += " and ";
      where += `imo_inv.id_filial = ${params.id_filial} `;
    }
    if (params.id_inventario !== 0) {
      if (where != "") where += " and ";
      where += `imo_inv.id_inventario = ${params.id_inventario} `;
    }
    if (params.id_imobilizado !== 0) {
      if (where != "") where += " and ";
      where += `imo_inv.id_imobilizado = ${params.id_imobilizado} `;
    }
    if (params.id_cc.trim() !== "") {
      if (where != "") where += " and ";
      where += `imo.cod_cc = '${params.id_cc}' `;
    }
    if (params.dtinicial !== '') {
      if (where != "") where += " and ";
      where += `( lanca.dtlanca >=  ${shared.formatDateYYYYMMDD(params.dtinicial)} and  lanca.dtlanca <=  ${shared.formatDateYYYYMMDD(params.dtfinal)} ) `;
    }

    if (params.id_grupo !== 0) {
      if (where != "") where += " and ";
      where += `imo.cod_grupo = ${params.id_grupo} `;
    }
    if (params.descricao !== "") {
      if (where != "") where += " and ";
      if (params.sharp) {
        where += `unaccent(imo.descricao) = '${shared.semAcento(params.descricao)}' `;
      } else {
        where += `unaccent(imo.descricao) like '%${shared.semAcento(params.descricao.trim())}%' `;
      }
    }
    if (params.status !== -1) {
      if (where != "") where += " and ";
      where += `imo_inv.status = ${params.status} `;
    }
    if (params.new_cc.trim() !== "") {
      if (where != "") where += " and ";
      where += `imo_inv.new_cc = '${params.new_cc}' `;
    }
    if (params.new_codigo !== 0) {
      if (where != "") where += " and ";
      where += `imo_inv.new_codigo = ${params.new_codigo} `;
    }
    if (params.id_usuario !== 0) {
      if (where != "") where += " and ";
      where += `lanca.id_usuario = ${params.id_usuario} `;
    }
    if (params.origem.trim() !== "") {
      if (where != "") where += " and ";
      if (params.sharp) {
        where += `imo.origem = '${params.origem}' `;
      } else {
        where += `imo.origem like '%${params.origem.trim()}%' `;
      }
    }
    if (where != "") where = " where " + where;

    if (params.pagina != 0) {
      paginacao = `limit ${params.tamPagina} offset ((${params.pagina} - 1) * ${params.tamPagina})`;
    }

    if (params.contador == "S") {
      sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM imobilizadosinventarios imo_inv   
				 inner join imobilizados imo on imo.id_empresa = imo_inv.id_empresa and imo.id_filial = imo_inv.id_filial and imo.codigo = imo_inv.id_imobilizado
				 inner join centroscustos cc on cc.id_empresa = imo_inv.id_empresa and cc.id_filial = imo_inv.id_filial and cc.codigo = imo.cod_cc
				 inner join grupos gru on gru.id_empresa = imo_inv.id_empresa and gru.id_filial = imo_inv.id_filial and gru.codigo = imo.cod_grupo
				 left join lancamentos lanca on lanca.id_empresa = imo_inv.id_empresa and lanca.id_filial = imo_inv.id_filial and lanca.id_inventario = imo_inv.id_inventario and lanca.id_imobilizado = imo_inv.id_imobilizado and imo_inv.id_lanca = lanca.id_lanca   
				  ${where} `;
      return db.one(sqlStr);
    } else {
      strSql = `select   
			   imo_inv.id_empresa as  id_empresa  
			,  imo_inv.id_filial as  id_filial  
			,  imo_inv.id_inventario as  id_inventario  
			,  imo_inv.id_imobilizado as  id_imobilizado  
			,  imo_inv.id_lanca as  id_lanca  
			,  imo_inv.status as  status  
			,  imo_inv.new_codigo as  new_codigo  
			,  imo_inv.new_cc as  new_cc
      ,  imo_inv.condicao as  condicao 
      ,  imo_inv.book     as  book
			,  imo_inv.user_insert as  user_insert  
			,  imo_inv.user_update as  user_update  
			,  imo.descricao as  imo_descricao  
            ,  imo.cod_cc    as  imo_cod_cc
            ,  imo.cod_grupo as  imo_cod_grupo 
            ,  imo.nfe           as imo_nfe 
            ,  imo.serie         as imo_serie 
            ,  imo.item          as imo_item  
            ,  imo.origem        as imo_origem
			,  cc.descricao as  cc_descricao  
			,  gru.descricao as  grupo_descricao  
			,  coalesce(lanca.id_usuario,0) as  lanc_id_usuario  
			,  coalesce(lanca.obs,'') as  lanc_obs 
			,  coalesce(to_char(lanca.dtlanca, 'DD/MM/YYYY'),'') as  lanc_dt_lanca 
			,  coalesce(lanca.estado,0) as  lanc_estado  
			,  coalesce(usu.razao,'') as  usu_razao   
            ,  coalesce(new_cc.descricao,'') as  new_cc_descricao   
			FROM imobilizadosinventarios imo_inv   
				 inner join imobilizados imo on imo.id_empresa = imo_inv.id_empresa and imo.id_filial = imo_inv.id_filial and imo.codigo = imo_inv.id_imobilizado
				 inner join centroscustos cc on cc.id_empresa = imo_inv.id_empresa and cc.id_filial = imo_inv.id_filial and cc.codigo = imo.cod_cc
				 inner join grupos gru on gru.id_empresa = imo_inv.id_empresa and gru.id_filial = imo_inv.id_filial and gru.codigo = imo.cod_grupo
				 left join lancamentos lanca on lanca.id_empresa = imo_inv.id_empresa and lanca.id_filial = imo_inv.id_filial and lanca.id_inventario = imo_inv.id_inventario and lanca.id_imobilizado = imo_inv.id_imobilizado and imo_inv.id_lanca = lanca.id_lanca   
				 left join usuarios      usu on usu.id_empresa = imo_inv.id_empresa and usu.id = lanca.id_usuario
                 left join centroscustos new_cc on new_cc.id_empresa = imo_inv.id_empresa and new_cc.id_filial = imo_inv.id_filial and new_cc.codigo = imo_inv.new_cc
			${where} 			${orderby} ${paginacao} `;
      console.log("==>", strSql);
      return db.manyOrNone(strSql);
    }
  } else {
    strSql = `select   
			   imo_inv.id_empresa as  id_empresa  
			,  imo_inv.id_filial as  id_filial  
			,  imo_inv.id_inventario as  id_inventario  
			,  imo_inv.id_imobilizado as  id_imobilizado  
			,  imo_inv.id_lanca as  id_lanca  
			,  imo_inv.status as  status  
			,  imo_inv.new_codigo as  new_codigo  
			,  imo_inv.new_cc as  new_cc  
			,  imo_inv.user_insert as  user_insert  
			,  imo_inv.user_update as  user_update  
			,  imo.descricao as  imo_descricao  
            ,  imo.cod_cc    as  imo_cod_cc
            ,  imo.cod_grupo as  imo_cod_grupo 
            ,  imo.nfe           as imo_nfe 
            ,  imo.serie         as imo_serie 
            ,  imo.item          as imo_item  
            ,  imo.origem        as imo_origem
			,  cc.descricao as  cc_descricao  
			,  gru.descricao as  grupo_descricao  
			,  coalesce(lanca.id_usuario,0) as  lanc_id_usuario  
			,  coalesce(lanca.obs,'') as  lanc_obs 
			,  coalesce(to_char(lanca.dtlanca, 'DD/MM/YYYY'),'') as  lanc_dt_lanca
			,  coalesce(lanca.estado,0) as  lanc_estado    
            ,  coalesce(usu.razao,'') as  usu_razao   
            ,  coalesce(new_cc.descricao,'') as  new_cc_descricao   
			FROM imobilizadosinventarios imo_inv			   
				 inner join imobilizados imo on imo.id_empresa = imo_inv.id_empresa and imo.id_filial = imo_inv.id_filial and imo.codigo = imo_inv.id_imobilizado
				 inner join centroscustos cc on cc.id_empresa = imo_inv.id_empresa and cc.id_filial = imo_inv.id_filial and cc.codigo = imo.cod_cc
				 inner join grupos gru on gru.id_empresa = imo_inv.id_empresa and gru.id_filial = imo_inv.id_filial and gru.codigo = imo.cod_grupo
				 left join lancamentos lanca on lanca.id_empresa = imo_inv.id_empresa and lanca.id_filial = imo_inv.id_filial and lanca.id_inventario = imo_inv.id_inventario and lanca.id_imobilizado = imo_inv.id_imobilizado and imo_inv.id_lanca = lanca.id_lanca  
                 left join usuarios    usu   on usu.id_empresa = imo_inv.id_empresa and usu.id = lanca.id_usuario
                 left join centroscustos new_cc on new_cc.id_empresa = imo_inv.id_empresa and new_cc.id_filial = imo_inv.id_filial and new_cc.codigo = imo_inv.new_cc `;
    return db.manyOrNone(strSql);
  }
};
/* CRUD - INSERT */
exports.insertImobilizadoinventario = function (imobilizadoinventario) {
  strSql = `insert into imobilizadosinventarios (
		     id_empresa 
		 ,   id_filial 
		 ,   id_inventario 
		 ,   id_imobilizado 
		 ,   id_lanca 
		 ,   status 
		 ,   new_codigo 
		 ,   new_cc 
         ,   condicao 
         ,   book     
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${imobilizadoinventario.id_empresa} 
		 ,   ${imobilizadoinventario.id_filial} 
		 ,   ${imobilizadoinventario.id_inventario} 
		 ,   ${imobilizadoinventario.id_imobilizado} 
		 ,   ${imobilizadoinventario.id_lanca} 
		 ,   ${imobilizadoinventario.status} 
		 ,   ${imobilizadoinventario.new_codigo} 
		 ,   '${imobilizadoinventario.new_cc}' 
 		 ,   ${imobilizadoinventario.condicao} 
 		 ,   '${imobilizadoinventario.book}'
		 ,   ${imobilizadoinventario.user_insert} 
		 ,   ${imobilizadoinventario.user_update} 
		 ) 
 returning * `;
  return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updateImobilizadoinventario = function (imobilizadoinventario) {
  strSql = `update   imobilizadosinventarios set  
		     id_lanca    = ${imobilizadoinventario.id_lanca} 
 		 ,   status      = ${imobilizadoinventario.status} 
 		 ,   new_codigo  = ${imobilizadoinventario.new_codigo} 
 		 ,   new_cc      = '${imobilizadoinventario.new_cc}' 
     ,   condicao    =  ${imobilizadoinventario.condicao} 
 		 ,   book        = '${imobilizadoinventario.book}' 
 		 ,   user_insert = ${imobilizadoinventario.user_insert} 
 		 ,   user_update = ${imobilizadoinventario.user_update} 
 		 where id_empresa = ${imobilizadoinventario.id_empresa} and  id_filial = ${imobilizadoinventario.id_filial} and  id_inventario = ${imobilizadoinventario.id_inventario} and  id_imobilizado = ${imobilizadoinventario.id_imobilizado}  returning * `;
  return db.oneOrNone(strSql);
};

/* CRUD - ANEXAR */
exports.anexarImobilizadoinventario = function (params) {
  strSql = `
           INSERT INTO public.imobilizadosinventarios(id_empresa, id_filial, id_inventario, id_imobilizado, id_lanca, status, new_codigo, new_cc,condicao,book, user_insert, user_update) 
           SELECT imo.id_empresa, imo.id_filial, ${params.id_inventario}, imo.codigo, 0, 0 ,0, '',imo.condicao,'N',1,0 
           FROM   imobilizados imo 
           LEFT JOIN imobilizadosinventarios imo_iven on 
           imo_iven.id_empresa = imo.id_empresa and
		       imo_iven.id_filial  = imo.id_filial  and
		       imo_iven.id_imobilizado    = imo.codigo and 
		       imo_iven.id_inventario    = ${params.id_inventario}
           WHERE  imo.id_empresa = ${params.id_empresa} and imo.id_filial = ${params.id_filial} and imo_iven.id_empresa is null
    `;
  console.log("anexarImobilizadoinventario", strSql);
  return db.oneOrNone(strSql);
};
/* CRUD - DELETE */
exports.deleteImobilizadoinventario = function (
  id_empresa,
  id_filial,
  id_inventario,
  id_imobilizado
) {
  strSql = `delete from imobilizadosinventarios 
		        where id_empresa = ${id_empresa} and  id_filial = ${id_filial} and  id_inventario = ${id_inventario} and  id_imobilizado = ${id_imobilizado}  `;
  return db.oneOrNone(strSql);
};
exports.getControleEtiquetas = function (params) {
  console.log(`getControleEtiquetas ${params}`);
  if (params) {
    console.log(params);
    where = "";
    orderby = "";
    paginacao = "";

    if (params.orderby == "") orderby = "imo_inv.NEW_CODIGO";

    if (orderby != "") orderby = " order by " + orderby;
    if (params.id_empresa !== 0) {
      if (where != "") where += " and ";
      where += `imo_inv.id_empresa = ${params.id_empresa} `;
    }
    if (params.id_filial !== 0) {
      if (where != "") where += " and ";
      where += `imo_inv.id_filial = ${params.id_filial} `;
    }
    if (params.id_inventario !== 0) {
      if (where != "") where += " and ";
      where += `imo_inv.id_inventario = ${params.id_inventario} `;
    }
    if (params.id_imobilizado !== 0) {
      if (where != "") where += " and ";
      where += `imo_inv.id_imobilizado = ${params.id_imobilizado} `;
    }
    if (params.id_cc.trim() !== "") {
      if (where != "") where += " and ";
      if (params.sharp) {
        where += `imo.cod_cc = '${params.id_cc}' `;
      } else {
        where += `imo.cod_cc like '%${params.id_cc.trim()}%' `;
      }
    }
    if (params.id_grupo !== 0) {
      if (where != "") where += " and ";
      where += `imo.cod_grupo = ${params.id_grupo} `;
    }
    if (params.descricao !== "") {
      if (where != "") where += " and ";
      if (params.sharp) {
        where += `unaccent(imo.descricao) = '${shared.semAcento(params.descricao)}' `;
      } else {
        where += `unaccent(imo.descricao) like '%${shared.semAcento(params.descricao.trim())}%' `;
      }
    }
    if (params.status !== -1) {
      if (where != "") where += " and ";
      if (params.status == 90) {
        where += `imo_inv.status > 0 `;
      } else {
        where += `imo_inv.status = ${params.status} `;
      }
    }
    if (params.new_cc.trim() !== "") {
      if (where != "") where += " and ";
      if (params.sharp) {
        where += `imo_inv.new_cc = '${params.new_cc}' `;
      } else {
        where += `imo_inv.new_cc like '%${params.new_cc.trim()}%' `;
      }
    }
    if (params.new_codigo !== 0) {
      if (where != "") where += " and ";
      where += `imo_inv.new_codigo = ${params.new_codigo} `;
    }
    if (params.condicao !== 0) {
      if (where != "") where += " and ";
      where += `imo_inv.condicao = ${params.condicao} `;
    }
    if (params.book !== "") {
      if (where != "") where += " and ";
      where += `imo_inv.book = '${params.book}'`;
    }
    if (params.origem.trim() !== "") {
      if (where != "") where += " and ";
      if (params.sharp) {
        where += `imo.origem = '${params.origem}' `;
      } else {
        where += `imo.origem like '%${params.origem.trim()}%' `;
      }
    }
    if (where != "") where = " where " + where;

    if (params.pagina != 0) {
      paginacao = `limit ${params.tamPagina} offset ((${params.pagina} - 1) * ${params.tamPagina})`;
    }

    if (params.contador == "S") {
      sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM imobilizadosinventarios imo_inv
                  INNER JOIN imobilizados IMO ON imo.id_empresa = imo_inv.id_empresa AND IMO.ID_FILIAL = imo_inv.ID_FILIAL AND imo.CODIGO = imo_inv.id_imobilizado
				  ${where} `;
      console.log("getControleEtiquetas", sqlStr);
      return db.one(sqlStr);
    } else {
      strSql = `SELECT imo_inv.id_imobilizado as old_codigo,imo_inv.NEW_CODIGO as novo_codigo,IMO.DESCRICAO as descricao
                      FROM imobilizadosinventarios imo_inv
                      INNER JOIN imobilizados IMO ON imo.id_empresa = imo_inv.id_empresa AND IMO.ID_FILIAL = imo_inv.ID_FILIAL AND imo.CODIGO = imo_inv.id_imobilizado
			          ${where} ${orderby} ${paginacao} `;
      console.log("==>", strSql);
      return db.manyOrNone(strSql);
    }
  }
};
