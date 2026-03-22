/* DATA de_para */
const db = require("../infra/database");

/* GET CAMPOS */
exports.getCampos = function(Depara) {
    return [
        Depara.id_empresa,
        Depara.id_local,
        Depara.id_inventario,
        Depara.de,
        Depara.para,
        Depara.status,
        Depara.de_descricao,
        Depara.id_usuario,
        Depara.dt_processamento,
        Depara.updated_at,
        Depara.user_insert,
        Depara.user_update,
    ];
};
/* CRUD GET */
exports.getDepara = function(id_empresa, id_local, id_inventario, de, para) {
    strSql = ` select   
			   param.id_empresa as  id_empresa  
			,  param.id_local as  id_local  
			,  param.id_inventario as  id_inventario  
			,  param.de as  de  
			,  param.para as  para  
			,  param.status as  status  
			,  param.de_descricao as  de_descricao  
			,  param.id_usuario as  id_usuario  
			,  param.dt_processamento as  dt_processamento  
			,  param.updated_at as  updated_at  
			,  param.user_insert as  user_insert  
			,  param.user_update as  user_update 
			,  imob.descricao as imob_descricao 
			,  coalesce(exec.razao,'') as exec_nome
            ,  coalesce(proc.razao,'') as proc_nome    
 			FROM de_para param 	     
            inner join imobilizados imob on imob.id_empresa = param.id_empresa and imob.id_filial = param.id_local and imob.codigo = param.para
			left join  usuarios exec on exec.id_empresa = param.id_empresa and exec.id = param.id_usuario
            left join  usuarios proc on proc.id_empresa = param.id_empresa and proc.id = param.user_update
			 where param.id_empresa = ${id_empresa} and  param.id_local = ${id_local} and  param.id_inventario = ${id_inventario} and  param.de = ${de} and  param.para = ${para}  `;
    return db.oneOrNone(strSql);
};
/* CRUD GET ALL*/
exports.getDeparas = function(params) {
    if (params) {
        where = "";
        orderby = "";
        paginacao = "";

        if (params.orderby == "")
            orderby = "param.id_empresa,param.id_local,param.id_inventario,param.de";
        if (params.orderby == "000001")
            orderby = "param.id_empresa,param.id_local,param.id_inventario,param.de";
        if (params.orderby == "000002")
            orderby =
            "param.id_empresa,param.id_local,param.id_inventario,param.para";

        if (orderby != "") orderby = " order by " + orderby;

        console.log("order by", orderby);

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
        if (params.contador == "S") {
            sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM de_para param      
				  ${where} `;
            return db.one(sqlStr);
        } else {
            strSql = `select   
			   param.id_empresa as  id_empresa  
			,  param.id_local as  id_local  
			,  param.id_inventario as  id_inventario  
			,  param.de as  de  
			,  param.para as  para  
			,  param.status as  status  
			,  param.de_descricao as  de_descricao  
			,  param.id_usuario as  id_usuario  
			,  param.dt_processamento as  dt_processamento  
			,  param.updated_at as  updated_at  
			,  param.user_insert as  user_insert  
			,  param.user_update as  user_update    
			,  imob.descricao as imob_descricao 
			,  coalesce(exec.razao,'') as exec_nome
            ,  coalesce(proc.razao,'') as proc_nome
			FROM de_para param    
			inner join imobilizados imob on imob.id_empresa = param.id_empresa and imob.id_filial = param.id_local and imob.codigo = param.para
			left join  usuarios exec on exec.id_empresa = param.id_empresa and exec.id = param.id_usuario
            left join  usuarios proc on proc.id_empresa = param.id_empresa and proc.id = param.user_update
			${where} 	${orderby} ${paginacao} `;
            console.log(strSql);
            return db.manyOrNone(strSql);
        }
    } else {
        strSql = `select   
			   param.id_empresa as  id_empresa  
			,  param.id_local as  id_local  
			,  param.id_inventario as  id_inventario  
			,  param.de as  de  
			,  param.para as  para  
			,  param.status as  status  
			,  param.de_descricao as  de_descricao  
			,  param.id_usuario as  id_usuario  
			,  param.dt_processamento as  dt_processamento  
			,  param.updated_at as  updated_at  
			,  param.user_insert as  user_insert  
			,  param.user_update as  user_update    
			FROM de_para param			     `;
        return db.manyOrNone(strSql);
    }
};
/* CRUD - INSERT */
exports.insertDepara = function(depara) {
    strSql = `insert into de_para (
		     id_empresa 
		 ,   id_local 
		 ,   id_inventario 
		 ,   de 
		 ,   para 
		 ,   status 
		 ,   de_descricao 
		 ,   id_usuario 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${depara.id_empresa} 
		 ,   ${depara.id_local} 
		 ,   ${depara.id_inventario} 
		 ,   ${depara.de} 
		 ,   ${depara.para} 
		 ,   ${depara.status} 
		 ,   '${depara.de_descricao}' 
		 ,   ${depara.id_usuario} 
		 ,   ${depara.user_insert} 
		 ,   ${depara.user_update} 
		 ) 
 returning * `;
    console.log("Insert", strSql);
    return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updateDepara = function(depara) {
    strSql = `update   de_para set  
		     status = ${depara.status} 
 		 ,   de_descricao = '${depara.de_descricao}' 
     ,   dt_processamento = NOW()
 		 ,   id_usuario = ${depara.id_usuario}
 		 ,   user_insert = ${depara.user_insert} 
 		 ,   user_update = ${depara.user_update} 
 		 where id_empresa = ${depara.id_empresa} and  id_local = ${depara.id_local} and  id_inventario = ${depara.id_inventario} and  de = ${depara.de} and  para = ${depara.para}  returning * `;

    console.log("Update", strSql);
    return db.oneOrNone(strSql);
};
/* CRUD - DELETE */
exports.deleteDepara = function(
    id_empresa,
    id_local,
    id_inventario,
    de,
    para,
) {
    strSql = `delete from de_para 
		 where id_empresa = ${id_empresa} and  id_local = ${id_local} and  id_inventario = ${id_inventario} and  de = ${de} and  para = ${para}  `;

    console.log("Delete", strSql);
    return db.oneOrNone(strSql);
};