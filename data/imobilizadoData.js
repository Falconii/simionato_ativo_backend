/* DATA imobilizados */
const db = require("../infra/database");
const shared = require("../util/shared.js");


/* GET CAMPOS */
exports.getCampos = function(Imobilizado) {
    return [
        Imobilizado.id_empresa,
        Imobilizado.id_filial,
        Imobilizado.codigo,
        Imobilizado.descricao,
        Imobilizado.cod_grupo,
        Imobilizado.cod_cc,
        Imobilizado.nfe,
        Imobilizado.serie,
        Imobilizado.item,
        Imobilizado.origem,
        Imobilizado.condicao,
        Imobilizado.apelido,
        Imobilizado.principal,
        Imobilizado.user_insert,
        Imobilizado.user_update,
    ];
};
/* CRUD GET */
exports.getImobilizado = function(id_empresa, id_filial, codigo) {
    strSql = ` select   
			   imo.id_empresa as  id_empresa  
			,  imo.id_filial as  id_filial  
			,  imo.codigo as  codigo  
			,  imo.descricao as  descricao  
			,  imo.cod_grupo as  cod_grupo  
			,  imo.cod_cc as  cod_cc  
			,  imo.nfe as  nfe  
			,  imo.serie as  serie  
			,  imo.item as  item  
			,  imo.origem  as origem
            ,  imo.principal  as principal
            ,  imo.condicao  as condicao
            ,  imo.apelido  as apelido
			,  imo.user_insert as  user_insert  
			,  imo.user_update as  user_update  
			,  gru.descricao as  grupo_descricao  
			,  cc.descricao as  cc_descricao  
			,  coalesce(nfe.razao_fornecedor,'') as  forne_razao    
            ,  coalesce(prin.descricao,'')       as prin_descricao
 			FROM imobilizados imo 	  
				 inner join grupos gru on gru.id_empresa = imo.id_empresa and gru.id_filial = imo.id_filial and gru.codigo = imo.cod_grupo
				 inner join centroscustos cc on cc.id_empresa = imo.id_empresa and cc.id_filial = imo.id_filial and cc.codigo = imo.cod_cc   
				 left  join nfes nfe on nfe.id_empresa = imo.id_empresa and nfe.id_filial = imo.id_filial and nfe.id_imobilizado = imo.codigo   
                 left  join principais prin on prin.id_empresa = imo.id_empresa and prin.id_filial = imo.id_filial and prin.codigo = imo.principal  
			 where imo.id_empresa = ${id_empresa} and  imo.id_filial = ${id_filial} and  imo.codigo = ${codigo}  `;
    return db.oneOrNone(strSql);
};
/* CRUD GET ALL*/
exports.getImobilizados = function(params) {
    if (params) {
        console.log("Parametros getImobilizados: ", params);

        where = "";
        orderby = "";
        paginacao = "";

        if (params.orderby == "") orderby = "imo.id_empresa,imo.id_filial";
        if (params.orderby == "Filial") orderby = "imo.id_empresa,imo.id_filial";
        if (params.orderby == "Código")
            orderby = "imo.id_empresa,imo.id_filial,imo.codigo";
        if (params.orderby == "Descricao")
            orderby = "imo.id_empresa,imo.id_filial,imo.descricao";

        if (orderby != "") orderby = " order by " + orderby;
        if (params.id_empresa !== 0) {
            if (where != "") where += " and ";
            where += `imo.id_empresa = ${params.id_empresa} `;
        }
        if (params.id_filial !== 0) {
            if (where != "") where += " and ";
            where += `imo.id_filial = ${params.id_filial} `;
        }
        if (params.codigo !== 0) {
            if (where != "") where += " and ";
            where += `imo.codigo = ${params.codigo} `;
        }
        if (params.descricao.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `imo.descricao = '${params.descricao}' `;
            } else {
                where += `imo.descricao like '%${params.descricao.trim()}%' `;
            }
        }
        if (params.grupo_cod !== 0) {
            if (where != "") where += " and ";
            where += `imo.cod_grupo = ${params.grupo_cod} `;
        }
        if (params.cc_cod.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `imo.cod_cc = '${params.cc_cod}' `;
            } else {
                where += `imo.cod_cc like '%${params.cc_cod.trim()}%' `;
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
				  FROM imobilizados imo   
				 inner join grupos gru on gru.id_empresa = imo.id_empresa and gru.id_filial = imo.id_filial and gru.codigo = imo.cod_grupo
				 inner join centroscustos cc on cc.id_empresa = imo.id_empresa and cc.id_filial = imo.id_filial and cc.codigo = imo.cod_cc
				 left  join nfes nfe on nfe.id_empresa = imo.id_empresa and nfe.id_filial = imo.id_filial and nfe.id_imobilizado = imo.codigo   
				  ${where} `;
            return db.one(sqlStr);
        } else {
            strSql = `select   
			   imo.id_empresa as  id_empresa  
			,  imo.id_filial as  id_filial  
			,  imo.codigo as  codigo  
			,  imo.descricao as  descricao  
			,  imo.cod_grupo as  cod_grupo  
			,  imo.cod_cc as  cod_cc 
			,  imo.nfe as  nfe  
			,  imo.serie as  serie  
			,  imo.item as  item  
			,  imo.origem  as origem
            ,  imo.condicao  as condicao
            ,  imo.apelido  as apelido
            ,  imo.principal  as principal
			,  imo.user_insert as  user_insert  
			,  imo.user_update as  user_update  
			,  gru.descricao as  grupo_descricao  
			,  cc.descricao as  cc_descricao  
			,  coalesce(nfe.razao_fornecedor,'') as  forne_razao     
			FROM imobilizados imo   
				 inner join grupos gru on gru.id_empresa = imo.id_empresa and gru.id_filial = imo.id_filial and gru.codigo = imo.cod_grupo
				 inner join centroscustos cc on cc.id_empresa = imo.id_empresa and cc.id_filial = imo.id_filial and cc.codigo = imo.cod_cc
				 left  join nfes nfe on nfe.id_empresa = imo.id_empresa and nfe.id_filial = imo.id_filial and nfe.id_imobilizado = imo.codigo   
			${where} 			${orderby} ${paginacao} `;
            console.log("getImobilizados", strSql);
            return db.manyOrNone(strSql);
        }
    } else {
        strSql = `select   
			   imo.id_empresa as  id_empresa  
			,  imo.id_filial as  id_filial  
			,  imo.codigo as  codigo  
			,  imo.descricao as  descricao  
			,  imo.cod_grupo as  cod_grupo  
			,  imo.cod_cc as  cod_cc 
			,  imo.nfe as  nfe  
			,  imo.serie as  serie  
			,  imo.item as  item  
			,  imo.origem  as origem
            ,  imo.principal  as principal
			,  imo.user_insert as  user_insert  
			,  imo.user_update as  user_update  
			,  gru.descricao as  grupo_descricao  
			,  cc.descricao as  cc_descricao  
			,  coalesce(nfe.razao_fornecedor,'') as  forne_razao      
			FROM imobilizados imo			   
				 inner join grupos gru on gru.id_empresa = imo.id_empresa and gru.id_filial = imo.id_filial and gru.codigo = imo.cod_grupo
				 inner join centroscustos cc on cc.id_empresa = imo.id_empresa and cc.id_filial = imo.id_filial and cc.codigo = imo.cod_cc
				 left  join nfes nfe on nfe.id_empresa = imo.id_empresa and nfe.id_filial = imo.id_filial and nfe.id_imobilizado = imo.codigo  `;
        return db.manyOrNone(strSql);
    }
};
/* CRUD - INSERT */
exports.insertImobilizado = function(imobilizado) {
    strSql = `
            insert into imobilizados(
                  id_empresa
                , id_filial
                , codigo
                , descricao
                , cod_grupo
                , cod_cc
                , nfe
                , serie
                , item
                , origem
                , condicao
                , apelido
                , principal
                , user_insert
                , user_update
            )
            values(
                   ${imobilizado.id_empresa}
                ,  ${imobilizado.id_filial}
                ,  ${imobilizado.codigo}
                , '${imobilizado.descricao}'
                ,  ${imobilizado.cod_grupo}
                , '${imobilizado.cod_cc}'
                , '${imobilizado.nfe}'
                , '${imobilizado.serie}'
                , '${imobilizado.item}'
                , '${imobilizado.origem}'
                ,  ${imobilizado.condicao} 
                , '${imobilizado.apelido}'
                ,  ${imobilizado.principal}
                ,  ${imobilizado.user_insert}
                ,  ${imobilizado.user_update}
            )
            returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updateImobilizado = function(imobilizado) {
    strSql = `
            update imobilizados set
            descricao = '${shared.excluirCaracteres(imobilizado.descricao.toUpperCase())}'
            , cod_grupo = ${imobilizado.cod_grupo}
            , cod_cc = '${imobilizado.cod_cc}'
            , nfe = '${imobilizado.nfe}'
            , serie = '${imobilizado.serie}'
            , item = '${imobilizado.item}'
            , origem = '${imobilizado.origem}'
            , condicao = ${imobilizado.condicao}
            , apelido = '${imobilizado.apelido}'
            , principal =   ${imobilizado.principal}
            , user_insert = ${imobilizado.user_insert}
            , user_update = ${imobilizado.user_update}
            where id_empresa = ${imobilizado.id_empresa}
            and id_filial = ${imobilizado.id_filial}
            and codigo = ${imobilizado.codigo}
            returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - DELETE */
exports.deleteImobilizado = function(id_empresa, id_filial, codigo) {
    strSql = `
            delete from imobilizados
            where id_empresa = ${id_empresa}
            and id_filial = ${id_filial}
            and codigo = ${codigo}
            `;
    return db.oneOrNone(strSql);
};