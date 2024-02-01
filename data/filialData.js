/* DATA filiais */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Filial) {
    return [
        Filial.id_empresa,
        Filial.id,
        Filial.cnpj_cpf,
        Filial.inscri,
        Filial.razao,
        Filial.fantasi,
        Filial.cadastr,
        Filial.ruaf,
        Filial.nrof,
        Filial.complementof,
        Filial.bairrof,
        Filial.cidadef,
        Filial.uff,
        Filial.cepf,
        Filial.tel1,
        Filial.tel2,
        Filial.email,
        Filial.obs,
        Filial.user_insert,
        Filial.user_update,
    ];
};
/* CRUD GET */
exports.getFilial = function(id_empresa, id_filial, id) {
        strSql = ` select   
			   filial.id_empresa as  id_empresa  
			,  filial.id as  id  
			,  filial.cnpj_cpf as  cnpj_cpf  
			,  filial.inscri as  inscri  
			,  filial.razao as  razao  
			,  filial.fantasi as  fantasi  
			, to_char(filial.cadastr, 'DD/MM/YYYY') as cadastr  
			,  filial.ruaf as  ruaf  
			,  filial.nrof as  nrof  
			,  filial.complementof as  complementof  
			,  filial.bairrof as  bairrof  
			,  filial.cidadef as  cidadef  
			,  filial.uff as  uff  
			,  filial.cepf as  cepf  
			,  filial.tel1 as  tel1  
			,  filial.tel2 as  tel2  
			,  filial.email as  email  
			,  filial.obs as  obs  
			,  filial.user_insert as  user_insert  
			,  filial.user_update as  user_update    
 			FROM filiais filial 	     
			 where filial.id_empresa = ${id_empresa} and  filial.id = ${id}  `;
        return db.oneOrNone(strSql);
    }
    /* CRUD GET ALL*/
exports.getFiliais = function(params) {
        if (params) {
            where = "";
            orderby = "";
            paginacao = "";

            if (params.orderby == '') orderby = 'filial.id_empresa,filial.id';
            if (params.orderby == 'Código') orderby = 'filial.id_empresa,filial.id';
            if (params.orderby == 'Razão') orderby = 'filial.id_empresa,filial.razao';
            if (params.orderby == 'CNPJ/CPF') orderby = 'filial.id_empresa,filial.id,filial.cnpj_cpf';

            if (orderby != "") orderby = " order by " + orderby;
            if (params.id_empresa !== 0) {
                if (where != "") where += " and ";
                where += `filial.id_empresa = ${params.id_empresa} `;
            }
            if (params.id !== 0) {
                if (where != "") where += " and ";
                where += `filial.id = ${params.id} `;
            }
            if (params.razao.trim() !== '') {
                if (where != "") where += " and ";
                if (params.sharp) {
                    where += `filial.razao = '${params.razao}' `;
                } else {
                    where += `filial.razao like '%${params.razao.trim()}%' `;
                }
            }
            if (params.cnpj_cpf.trim() !== '') {
                if (where != "") where += " and ";
                if (params.sharp) {
                    where += `filial.cnpj_cpf = '${params.cnpj_cpf}' `;
                } else {
                    where += `filial.cnpj_cpf like '%${params.cnpj_cpf.trim()}%' `;
                }
            }
            if (where != "") where = " where " + where;

            if (params.pagina != 0) {
                paginacao = `limit ${params.tamPagina} offset ((${params.pagina} - 1) * ${params.tamPagina})`;
            }

            if (params.contador == 'S') {
                sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM filiais filial      
				  ${ where} `;
                return db.one(sqlStr);
            } else {
                strSql = `select   
			   filial.id_empresa as  id_empresa  
			,  filial.id as  id  
			,  filial.cnpj_cpf as  cnpj_cpf  
			,  filial.inscri as  inscri  
			,  filial.razao as  razao  
			,  filial.fantasi as  fantasi  
			, to_char(filial.cadastr, 'DD/MM/YYYY') as cadastr  
			,  filial.ruaf as  ruaf  
			,  filial.nrof as  nrof  
			,  filial.complementof as  complementof  
			,  filial.bairrof as  bairrof  
			,  filial.cidadef as  cidadef  
			,  filial.uff as  uff  
			,  filial.cepf as  cepf  
			,  filial.tel1 as  tel1  
			,  filial.tel2 as  tel2  
			,  filial.email as  email  
			,  filial.obs as  obs  
			,  filial.user_insert as  user_insert  
			,  filial.user_update as  user_update     
			FROM filiais filial      
			${where} 			${ orderby} ${ paginacao} `;
                return db.manyOrNone(strSql);
            }
        } else {
            strSql = `select   
			   filial.id_empresa as  id_empresa  
			,  filial.id as  id  
			,  filial.cnpj_cpf as  cnpj_cpf  
			,  filial.inscri as  inscri  
			,  filial.razao as  razao  
			,  filial.fantasi as  fantasi  
			, to_char(filial.cadastr, 'DD/MM/YYYY') as cadastr  
			,  filial.ruaf as  ruaf  
			,  filial.nrof as  nrof  
			,  filial.complementof as  complementof  
			,  filial.bairrof as  bairrof  
			,  filial.cidadef as  cidadef  
			,  filial.uff as  uff  
			,  filial.cepf as  cepf  
			,  filial.tel1 as  tel1  
			,  filial.tel2 as  tel2  
			,  filial.email as  email  
			,  filial.obs as  obs  
			,  filial.user_insert as  user_insert  
			,  filial.user_update as  user_update    
			FROM filiais filial			     `;
            return db.manyOrNone(strSql);
        }
    }
    /* CRUD - INSERT */
exports.insertFilial = function(filial) {
    strSql = `insert into filiais (
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
		     ${filial.id_empresa} 
		 ,   '${filial.cnpj_cpf}' 
		 ,   '${filial.inscri}' 
		 ,   '${filial.razao}' 
		 ,   '${filial.fantasi}' 
		 ,   '${filial.cadastr}' 
		 ,   '${filial.ruaf}' 
		 ,   '${filial.nrof}' 
		 ,   '${filial.complementof}' 
		 ,   '${filial.bairrof}' 
		 ,   '${filial.cidadef}' 
		 ,   '${filial.uff}' 
		 ,   '${filial.cepf}' 
		 ,   '${filial.tel1}' 
		 ,   '${filial.tel2}' 
		 ,   '${filial.email}' 
		 ,   '${filial.obs}' 
		 ,   ${filial.user_insert} 
		 ,   ${filial.user_update} 
		 ) 
 returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updateFilial = function(filial) {
        strSql = `update   filiais set  
		     cnpj_cpf = '${filial.cnpj_cpf}' 
 		 ,   inscri = '${filial.inscri}' 
 		 ,   razao = '${filial.razao}' 
 		 ,   fantasi = '${filial.fantasi}' 
 		 ,   cadastr = '${filial.cadastr}' 
 		 ,   ruaf = '${filial.ruaf}' 
 		 ,   nrof = '${filial.nrof}' 
 		 ,   complementof = '${filial.complementof}' 
 		 ,   bairrof = '${filial.bairrof}' 
 		 ,   cidadef = '${filial.cidadef}' 
 		 ,   uff = '${filial.uff}' 
 		 ,   cepf = '${filial.cepf}' 
 		 ,   tel1 = '${filial.tel1}' 
 		 ,   tel2 = '${filial.tel2}' 
 		 ,   email = '${filial.email}' 
 		 ,   obs = '${filial.obs}' 
 		 ,   user_insert = ${filial.user_insert} 
 		 ,   user_update = ${filial.user_update} 
 		 where id_empresa = ${filial.id_empresa} and  id = ${filial.id}  returning * `;
        return db.oneOrNone(strSql);
    }
    /* CRUD - DELETE */
exports.deleteFilial = function(id_empresa, id_filial, id) {
    strSql = `delete from filiais 
		 where id_empresa = ${id_empresa} and  id = ${id}  `;
    return db.oneOrNone(strSql);
}