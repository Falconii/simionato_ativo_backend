/* DATA locais */
const db = require('../infra/database');
const shared = require('../util/shared.js');

/* GET CAMPOS */
exports.getCampos = function(Local) {
    return [
        Local.id_empresa,
        Local.id,
        Local.cnpj_cpf,
        Local.inscri,
        Local.razao,
        Local.fantasi,
        Local.cadastr,
        Local.ruaf,
        Local.nrof,
        Local.complementof,
        Local.bairrof,
        Local.cidadef,
        Local.uff,
        Local.cepf,
        Local.tel1,
        Local.tel2,
        Local.email,
        Local.obs,
        Local.user_insert,
        Local.user_update,
    ];
};
/* CRUD GET */
exports.getLocal = function(id_empresa, id) {
        strSql = ` select   
			   local.id_empresa as  id_empresa  
			,  local.id as  id  
			,  local.cnpj_cpf as  cnpj_cpf  
			,  local.inscri as  inscri  
			,  local.razao as  razao  
			,  local.fantasi as  fantasi  
			, to_char(local.cadastr, 'DD/MM/YYYY') as cadastr  
			,  local.ruaf as  ruaf  
			,  local.nrof as  nrof  
			,  local.complementof as  complementof  
			,  local.bairrof as  bairrof  
			,  local.cidadef as  cidadef  
			,  local.uff as  uff  
			,  local.cepf as  cepf  
			,  local.tel1 as  tel1  
			,  local.tel2 as  tel2  
			,  local.email as  email  
			,  local.obs as  obs  
			,  local.user_insert as  user_insert  
			,  local.user_update as  user_update    
 			FROM locais local 	     
			 where local.id_empresa = ${id_empresa} and  local.id = ${id}  `;
        return db.oneOrNone(strSql);
    }
    /* CRUD GET ALL*/
exports.getLocais = function(params) {
        if (params) {
            where = "";
            orderby = "";
            paginacao = "";

            if (params.orderby == '') orderby = 'local.id_empresa,local.id';
            if (params.orderby == 'Código') orderby = 'local.id_empresa,local.id';
            if (params.orderby == 'Razão') orderby = 'local.id_empresa,local.razao';
            if (params.orderby == 'CNPJ/CPF') orderby = 'local.id_empresa,local.id,local.cnpj_cpf';

            if (orderby != "") orderby = " order by " + orderby;
            if (params.id_empresa !== 0) {
                if (where != "") where += " and ";
                where += `local.id_empresa = ${params.id_empresa} `;
            }
            if (params.id !== 0) {
                if (where != "") where += " and ";
                where += `local.id = ${params.id} `;
            }
            if (params.razao.trim() !== '') {
                if (where != "") where += " and ";
                if (params.sharp) {
                    where += `local.razao = '${params.razao}' `;
                } else {
                    where += `local.razao like '%${params.razao.trim()}%' `;
                }
            }
            if (params.cnpj_cpf.trim() !== '') {
                if (where != "") where += " and ";
                if (params.sharp) {
                    where += `local.cnpj_cpf = '${params.cnpj_cpf}' `;
                } else {
                    where += `local.cnpj_cpf like '%${params.cnpj_cpf.trim()}%' `;
                }
            }
            if (where != "") where = " where " + where;

            if (params.pagina != 0) {
                paginacao = `limit ${params.tamPagina} offset ((${params.pagina} - 1) * ${params.tamPagina})`;
            }


            if (params.contador == 'S') {
                sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM locais local      
				  ${ where} `;
                return db.one(sqlStr);
            } else {
                strSql = `select   
			   local.id_empresa as  id_empresa  
			,  local.id as  id  
			,  local.cnpj_cpf as  cnpj_cpf  
			,  local.inscri as  inscri  
			,  local.razao as  razao  
			,  local.fantasi as  fantasi  
			, to_char(local.cadastr, 'DD/MM/YYYY') as cadastr  
			,  local.ruaf as  ruaf  
			,  local.nrof as  nrof  
			,  local.complementof as  complementof  
			,  local.bairrof as  bairrof  
			,  local.cidadef as  cidadef  
			,  local.uff as  uff  
			,  local.cepf as  cepf  
			,  local.tel1 as  tel1  
			,  local.tel2 as  tel2  
			,  local.email as  email  
			,  local.obs as  obs  
			,  local.user_insert as  user_insert  
			,  local.user_update as  user_update     
			FROM locais local      
			${where} 			${ orderby} ${ paginacao} `;
                return db.manyOrNone(strSql);
            }
        } else {
            strSql = `select   
			   local.id_empresa as  id_empresa  
			,  local.id as  id  
			,  local.cnpj_cpf as  cnpj_cpf  
			,  local.inscri as  inscri  
			,  local.razao as  razao  
			,  local.fantasi as  fantasi  
			, to_char(local.cadastr, 'DD/MM/YYYY') as cadastr  
			,  local.ruaf as  ruaf  
			,  local.nrof as  nrof  
			,  local.complementof as  complementof  
			,  local.bairrof as  bairrof  
			,  local.cidadef as  cidadef  
			,  local.uff as  uff  
			,  local.cepf as  cepf  
			,  local.tel1 as  tel1  
			,  local.tel2 as  tel2  
			,  local.email as  email  
			,  local.obs as  obs  
			,  local.user_insert as  user_insert  
			,  local.user_update as  user_update    
			FROM locais local			     `;
            return db.manyOrNone(strSql);
        }
    }
    /* CRUD - INSERT */
exports.insertLocal = function(local) {
    strSql = `insert into locais (
		     id_empresa 
		 ,   cnpj_cpf 
		 ,   inscri 
		 ,   razao 
		 ,   fantasi 
		 ,   cadastr 
		 ,   ruaf 
		 ,   nrof 
		 ,   complementof 
		 ,   bairrof 
		 ,   cidadef 
		 ,   uff 
		 ,   cepf 
		 ,   tel1 
		 ,   tel2 
		 ,   email 
		 ,   obs 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${local.id_empresa} 
		 ,   '${local.cnpj_cpf}' 
		 ,   '${local.inscri}' 
		 ,   '${local.razao}' 
		 ,   '${local.fantasi}' 
		 ,    ${shared.formatDateYYYYMMDD(local.cadastr)} 
		 ,   '${local.ruaf}' 
		 ,   '${local.nrof}' 
		 ,   '${local.complementof}' 
		 ,   '${local.bairrof}' 
		 ,   '${local.cidadef}' 
		 ,   '${local.uff}' 
		 ,   '${local.cepf}' 
		 ,   '${local.tel1}' 
		 ,   '${local.tel2}' 
		 ,   '${local.email}' 
		 ,   '${local.obs}' 
		 ,   ${local.user_insert} 
		 ,   ${local.user_update} 
		 ) 
 returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updateLocal = function(local) {
        strSql = `update   locais set  
		     cnpj_cpf = '${local.cnpj_cpf}' 
 		 ,   inscri = '${local.inscri}' 
 		 ,   razao = '${local.razao}' 
 		 ,   fantasi = '${local.fantasi}' 
 		 ,   cadastr = ${shared.formatDateYYYYMMDD(local.cadastr)} 
 		 ,   ruaf = '${local.ruaf}' 
 		 ,   nrof = '${local.nrof}' 
 		 ,   complementof = '${local.complementof}' 
 		 ,   bairrof = '${local.bairrof}' 
 		 ,   cidadef = '${local.cidadef}' 
 		 ,   uff = '${local.uff}' 
 		 ,   cepf = '${local.cepf}' 
 		 ,   tel1 = '${local.tel1}' 
 		 ,   tel2 = '${local.tel2}' 
 		 ,   email = '${local.email}' 
 		 ,   obs = '${local.obs}' 
 		 ,   user_insert = ${local.user_insert} 
 		 ,   user_update = ${local.user_update} 
 		 where id_empresa = ${local.id_empresa} and  id = ${local.id}  returning * `;
        return db.oneOrNone(strSql);
    }
    /* CRUD - DELETE */
exports.deleteLocal = function(id_empresa, id) {
    strSql = `delete from locais 
		 where id_empresa = ${id_empresa} and  id = ${id}  `;
    return db.oneOrNone(strSql);
}