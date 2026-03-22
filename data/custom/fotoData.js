/* DATA fotos */
const db = require("../../infra/database");
const shared = require("../../util/shared.js");

function filtro() {
    const where = `
    IN (
003533
,003548
,003548
,003555
,003555
,003558
,003558
,003559
,003559
,003560
,003560
,003560
,003592
,003592
,003594
,003595
,003595
,003596
,003668
,003668
,003669
,003669
,003689
,003689
,003690
,003691
,003691
,003692
,003692
,003693
,003693
,003694
,003694
,003695
,003695
,003711
,003711
,003712
,003712
,003717
,003717
,003725
,003730
,003730
,003753
,003753
,003754
,003754
,003790
,003790
,003791
,003792
,003792
,003793
,003793
,003817
,003817
,003840
,003840
,003851
,003851
,003870
,003870
,003922
,003922
,003924
,004003
,004003
,004009
,004009
,004020
,004021
,004022
,004037
,004045
,004045
,004046
,004046
,004046
,004047
,004047
,004057
,004057
,004058
,004080
,004080
,004100
,004100
,004145
,004145
,004167
,004194
,004194
,004206
,004207
,004207
,004430
,004431
,004431
,004433)
  `;

    return where;
}

/* CRUD GET ALL*/
exports.FotosParaCorrigir = function(params) {
    where = "";
    orderby = "";
    paginacao = "";

    // console.log("params", params);

    if (params.orderby == "")
        orderby =
        "invimo.id_empresa, invimo.id_filial, invimo.id_inventario,imo.codigo";

    if (orderby != "") orderby = " order by " + orderby;
    if (params.id_empresa !== 0) {
        if (where != "") where += " and ";
        where += `invimo.id_empresa = ${params.id_empresa} `;
    }
    if (params.id_local !== 0) {
        if (where != "") where += " and ";
        where += `invimo.id_filial = ${params.id_local} `;
    }
    if (params.id_inventario !== 0) {
        if (where != "") where += " and ";
        where += `invimo.id_inventario = ${params.id_inventario} `;
    }
    if (params.id_imobilizado !== 0) {
        if (where != "") where += " and ";
        where += `invimo.id_imobilizado = ${params.id_imobilizado} `;
    }
    if (params.id_pasta !== "") {
        if (where != "") where += " and ";
        where += `fo.id_pasta = '${params.id_pasta}' `;
    }
    //tamanho do arquivo

    if (where != "") where += " and ";
    where += `imo.codigo is not null  and invimo.id_imobilizado  ${filtro()} `;

    //and length(trim(fo.file_name)) < 60 `;

    if (params.pagina != 0) {
        paginacao = `limit ${params.tamPagina} offset ((${params.pagina} - 1) * ${params.tamPagina})`;
    }

    if (where != "") where = " where " + where;
    if (params.contador == "S") {
        sqlStr = `Sselect  count(*) as TOTAL
            from   imobilizadosinventarios invimo
            left join imobilizados imo on invimo.id_empresa = imo.id_empresa and invimo.id_filial = imo.id_filial  and invimo.id_imobilizado = imo.codigo
            inner join fotos fo on fo.id_empresa = invimo.id_empresa and  fo.id_local = invimo.id_filial and  invimo.id_inventario = fo.id_inventario and  invimo.id_imobilizado = fo.id_imobilizado
            INNER JOIN usuarios     usu on usu.id_empresa = usu.id_empresa  and usu.id = fo.id_usuario
            ${where} `;
        return db.one(sqlStr);
    } else {
        strSql = `select   
                       fo.id_empresa as  id_empresa  
                    ,  fo.id_local as  id_local  
                    ,  fo.id_inventario as  id_inventario  
                    ,  fo.id_imobilizado as  id_imobilizado  
                    ,  fo.id_pasta as  id_pasta  
                    ,  fo.id_file as  id_file  
                    ,  fo.file_name as  file_name  
                    ,  fo.file_name_original as  file_name_original  
                    ,  fo.id_usuario as  id_usuario  
                    ,  to_char(fo.data, 'DD/MM/YYYY') as data  
                    ,  fo.destaque as  destaque  
                    ,  fo.obs as  obs  
                    ,  fo.localizacao as  localizacao
                    ,  fo.user_insert as  user_insert  
                    ,  fo.user_update as  user_update  
                    ,  coalesce(imo.descricao,'') as imo_descricao
                    ,  coalesce(usu.razao,'') as usu_razao      
                    from   imobilizadosinventarios invimo
                    left join imobilizados imo on invimo.id_empresa = imo.id_empresa and invimo.id_filial = imo.id_filial  and invimo.id_imobilizado = imo.codigo
                    inner join fotos fo on fo.id_empresa = invimo.id_empresa and  fo.id_local = invimo.id_filial and  invimo.id_inventario = fo.id_inventario and  invimo.id_imobilizado = fo.id_imobilizado
                    INNER JOIN usuarios     usu on usu.id_empresa = usu.id_empresa  and usu.id = fo.id_usuario
		        	${where} 			${orderby} ${paginacao} `;
        console.log(strSql);
        return db.manyOrNone(strSql);
    }
};