/* DATA fotos */
const db = require('../infra/database');
const shared = require('../util/shared.js');

/* GET CAMPOS */
exports.getCampos = function(Foto) {
    return [
        Foto.id_empresa,
        Foto.id_local,
        Foto.id_inventario,
        Foto.id_imobilizado,
        Foto.id_pasta,
        Foto.id_file,
        Foto.file_name,
        Foto.file_name_original,
        Foto.id_usuario,
        Foto.data,
        Foto.destaque,
        Foto.obs,
        Foto.user_insert,
        Foto.user_update,
    ];
};
/* CRUD GET */
exports.getFoto = function(id_empresa, id_local, id_inventario, id_imobilizado, id_pasta, id_file, file_name) {
        strSql = ` select   
			   foto.id_empresa as  id_empresa  
			,  foto.id_local as  id_local  
			,  foto.id_inventario as  id_inventario  
			,  foto.id_imobilizado as  id_imobilizado  
			,  foto.id_pasta as  id_pasta  
			,  foto.id_file as  id_file  
			,  foto.file_name as  file_name  
			,  foto.file_name_original as  file_name_original  
			,  foto.id_usuario as  id_usuario  
			, to_char(foto.data, 'DD/MM/YYYY') as data  
			,  foto.destaque as  destaque  
			,  foto.obs as  obs  
			,  foto.user_insert as  user_insert  
			,  foto.user_update as  user_update    
            ,  coalesce(imo.descricao,'') as imo_descricao
            ,  coalesce(usu.razao,'') as usu_razao 
 			FROM fotos foto 
             INNER JOIN imobilizados imo on imo.id_empresa = foto.id_empresa and imo.id_filial = foto.id_local and imo.codigo = foto.id_imobilizado
             INNER JOIN usuarios     usu on usu.id_empresa = usu.id_empresa  and usu.id = foto.id_usuario 	     
			 where foto.id_empresa = ${id_empresa} and  foto.id_local = ${id_local} and  foto.id_inventario = ${id_inventario} and  foto.id_imobilizado = ${id_imobilizado} and  foto.id_pasta = '${id_pasta}' and  foto.id_file = '${id_file}' and  foto.file_name = '${file_name}'  `;
        return db.oneOrNone(strSql);
    }
    /* CRUD GET ALL*/
exports.getFotos = function(params) {
        if (params) {
            where = "";
            orderby = "";
            paginacao = "";

            console.log("params", params)

            if (params.orderby == '') orderby = 'id_empresa,id_empresa,id_local,id_inventario,id_imobilizado,id_pasta,id_file,file_name';
            if (params.orderby == 'Imobilizado') orderby = 'id_empresa,id_empresa,id_local,id_inventario,id_imobilizado,id_pasta,id_file,file_name';

            if (orderby != "") orderby = " order by " + orderby;
            if (params.id_empresa !== 0) {
                if (where != "") where += " and ";
                where += `foto.id_empresa = ${params.id_empresa} `;
            }
            if (params.id_local !== 0) {
                if (where != "") where += " and ";
                where += `foto.id_local = ${params.id_local} `;
            }
            if (params.id_inventario !== 0) {
                if (where != "") where += " and ";
                where += `foto.id_inventario = ${params.id_inventario} `;
            }
            if (params.id_imobilizado !== 0) {
                if (where != "") where += " and ";
                where += `foto.id_imobilizado = ${params.id_imobilizado} `;
            }
            if (params.id_pasta.trim() !== '') {
                if (where != "") where += " and ";
                if (params.sharp) {
                    where += `foto.id_pasta = '${params.id_pasta}' `;
                } else {
                    where += `foto.id_pasta like '%${params.id_pasta.trim()}%' `;
                }
            }
            if (params.id_file.trim() !== '') {
                if (where != "") where += " and ";
                if (params.sharp) {
                    where += `foto.id_file = '${params.id_file}' `;
                } else {
                    where += `foto.id_file like '%${params.id_file.trim()}%' `;
                }
            }
            if (params.file_name.trim() !== '') {
                if (where != "") where += " and ";
                if (params.sharp) {
                    where += `foto.file_name = '${params.file_name}' `;
                } else {
                    where += `foto.file_name like '%${params.file_name.trim()}%' `;
                }
            }
            if (params.destaque.trim() !== '') {
                if (where != "") where += " and ";
                where += `foto.destaque = '${params.destaque}' `;
            }

            if (where != "") where = " where " + where;
            if (params.contador == 'S') {
                sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM fotos foto   
                  INNER JOIN imobilizados imo on imo.id_empresa = foto.id_empresa and imo.id_filial = foto.id_local  and imo.codigo = foto.id_imobilizado
                  INNER JOIN usuarios     usu on usu.id_empresa = usu.id_empresa  and usu.id = foto.id_usuario    
				  ${ where} `;
                return db.one(sqlStr);
            } else {
                strSql = `select   
			   foto.id_empresa as  id_empresa  
			,  foto.id_local as  id_local  
			,  foto.id_inventario as  id_inventario  
			,  foto.id_imobilizado as  id_imobilizado  
			,  foto.id_pasta as  id_pasta  
			,  foto.id_file as  id_file  
			,  foto.file_name as  file_name  
			,  foto.file_name_original as  file_name_original  
			,  foto.id_usuario as  id_usuario  
			,  to_char(foto.data, 'DD/MM/YYYY') as data  
			,  foto.destaque as  destaque  
			,  foto.obs as  obs  
			,  foto.user_insert as  user_insert  
			,  foto.user_update as  user_update  
            ,  coalesce(imo.descricao,'') as imo_descricao
            ,  coalesce(usu.razao,'') as usu_razao      
			FROM fotos foto     
            INNER JOIN imobilizados imo on imo.id_empresa = foto.id_empresa and imo.id_filial = foto.id_local  and imo.codigo = foto.id_imobilizado
            INNER JOIN usuarios     usu on usu.id_empresa = usu.id_empresa  and usu.id = foto.id_usuario 
			${where} 			${ orderby} ${ paginacao} `;
                console.log("strSql", strSql);
                return db.manyOrNone(strSql);
            }
        } else {
            strSql = `select   
			   foto.id_empresa as  id_empresa  
			,  foto.id_local as  id_local  
			,  foto.id_inventario as  id_inventario  
			,  foto.id_imobilizado as  id_imobilizado  
			,  foto.id_pasta as  id_pasta  
			,  foto.id_file as  id_file  
			,  foto.file_name as  file_name  
			,  foto.file_name_original as  file_name_original  
			,  foto.id_usuario as  id_usuario  
			, to_char(foto.data, 'DD/MM/YYYY') as data  
			,  foto.destaque as  destaque  
			,  foto.obs as  obs  
			,  foto.user_insert as  user_insert  
			,  foto.user_update as  user_update    
			FROM fotos foto			     `;
            return db.manyOrNone(strSql);
        }
    }
    /* CRUD - INSERT */
exports.insertFoto = function(foto) {
    strSql = `insert into fotos (
		     id_empresa 
		 ,   id_local 
		 ,   id_inventario 
		 ,   id_imobilizado 
		 ,   id_pasta 
		 ,   id_file 
		 ,   file_name 
		 ,   file_name_original 
		 ,   id_usuario 
		 ,   data 
		 ,   destaque 
		 ,   obs 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${foto.id_empresa} 
		 ,   ${foto.id_local} 
		 ,   ${foto.id_inventario} 
		 ,   ${foto.id_imobilizado} 
		 ,   '${foto.id_pasta}' 
		 ,   '${foto.id_file}' 
		 ,   '${foto.file_name}' 
		 ,   '${foto.file_name_original}' 
		 ,    ${foto.id_usuario} 
		 ,    ${shared.formatDateYYYYMMDD(foto.data)}
		 ,   '${foto.destaque}' 
		 ,   '${foto.obs}' 
		 ,   ${foto.user_insert} 
		 ,   ${foto.user_update} 
		 ) 
 returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updateFoto = function(foto) {
        strSql = `update   fotos set  
		     file_name_original = '${foto.file_name_original}' 
 		 ,   id_usuario = ${foto.id_usuario} 
 		 ,   data =  ${shared.formatDateYYYYMMDD(foto.data)} 
 		 ,   destaque = '${foto.destaque}' 
 		 ,   obs = '${foto.obs}' 
 		 ,   user_insert = ${foto.user_insert} 
 		 ,   user_update = ${foto.user_update} 
 		 where id_empresa = ${foto.id_empresa} and  id_local = ${foto.id_local} and  id_inventario = ${foto.id_inventario} and  id_imobilizado = ${foto.id_imobilizado} and  id_pasta = '${foto.id_pasta}' and  id_file = '${foto.id_file}' and  file_name = '${foto.file_name}'  returning * `;
        return db.oneOrNone(strSql);
    }
    /* CRUD - DELETE */
exports.deleteFoto = function(id_empresa, id_local, id_inventario, id_imobilizado, id_pasta, id_file, file_name) {
    strSql = `delete from fotos 
		 where id_empresa = ${id_empresa} and  id_local = ${id_local} and  id_inventario = ${id_inventario} and  id_imobilizado = ${id_imobilizado} and  id_pasta = '${id_pasta}' and  id_file = '${id_file}' and  file_name = '${file_name}'  `;
    return db.oneOrNone(strSql);
}