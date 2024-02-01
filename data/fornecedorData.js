/* DATA fornecedores */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Fornecedor) {
    return [
        Fornecedor.id_empresa,
        Fornecedor.id_filial,
        Fornecedor.id,
        Fornecedor.cnpj_cpf,
        Fornecedor.inscri,
        Fornecedor.razao,
        Fornecedor.fantasi,
        Fornecedor.cadastr,
        Fornecedor.rua,
        Fornecedor.nro,
        Fornecedor.complemento,
        Fornecedor.bairro,
        Fornecedor.cidade,
        Fornecedor.uf,
        Fornecedor.cep,
        Fornecedor.tel1,
        Fornecedor.tel2,
        Fornecedor.email,
        Fornecedor.obs,
        Fornecedor.user_insert,
        Fornecedor.user_update,
    ];
};
/* CRUD GET */
exports.getFornecedor = function(id_empresa, id_filial, id) {
    strSql = ` select   
			   forne.id_empresa as  id_empresa  
			,  forne.id_filial as  id_filial  
			,  forne.id as  id  
			,  forne.cnpj_cpf as  cnpj_cpf  
			,  forne.inscri as  inscri  
			,  forne.razao as  razao  
			,  forne.fantasi as  fantasi  
			, to_char(forne.cadastr, 'DD/MM/YYYY') as cadastr  
			,  forne.rua as  rua  
			,  forne.nro as  nro  
			,  forne.complemento as  complemento  
			,  forne.bairro as  bairro  
			,  forne.cidade as  cidade  
			,  forne.uf as  uf  
			,  forne.cep as  cep  
			,  forne.tel1 as  tel1  
			,  forne.tel2 as  tel2  
			,  forne.email as  email  
			,  forne.obs as  obs  
			,  forne.user_insert as  user_insert  
			,  forne.user_update as  user_update    
 			FROM fornecedores forne 	     
			 where forne.id_empresa = ${id_empresa} and  forne.id_filial = ${id_filial} and  forne.id = ${id}  `;
    return db.oneOrNone(strSql);
}
exports.getFornecedorByCnpj = function(id_empresa, id_filial, cnpj) {
        strSql = ` select   
			   forne.id_empresa as  id_empresa  
			,  forne.id_filial as  id_filial  
			,  forne.id as  id  
			,  forne.cnpj_cpf as  cnpj_cpf  
			,  forne.inscri as  inscri  
			,  forne.razao as  razao  
			,  forne.fantasi as  fantasi  
			, to_char(forne.cadastr, 'DD/MM/YYYY') as cadastr  
			,  forne.rua as  rua  
			,  forne.nro as  nro  
			,  forne.complemento as  complemento  
			,  forne.bairro as  bairro  
			,  forne.cidade as  cidade  
			,  forne.uf as  uf  
			,  forne.cep as  cep  
			,  forne.tel1 as  tel1  
			,  forne.tel2 as  tel2  
			,  forne.email as  email  
			,  forne.obs as  obs  
			,  forne.user_insert as  user_insert  
			,  forne.user_update as  user_update    
 			FROM fornecedores forne 	     
			 where forne.id_empresa = ${id_empresa} and  forne.id_filial = ${id_filial} and  forne.cnpj_cpf = '${cnpj}'  `;
        return db.oneOrNone(strSql);
    }
    /* CRUD GET ALL*/
exports.getFornecedores = function(params) {
        if (params) {
            where = "";
            orderby = "";
            paginacao = "";

            if (params.orderby == '') orderby = 'forne.id_empresa,forne.id';
            if (params.orderby == 'Código') orderby = 'forne.id_empresa,forne.id';
            if (params.orderby == 'Razão') orderby = 'forne.id_empresa,forne.razao';
            if (params.orderby == 'CNPJ/CPF') orderby = 'forne.id_empresa,forne.id,forne.cnpj_cpf';

            if (orderby != "") orderby = " order by " + orderby;
            if (params.id_empresa !== 0) {
                if (where != "") where += " and ";
                where += `forne.id_empresa = ${params.id_empresa} `;
            }
            if (params.id !== 0) {
                if (where != "") where += " and ";
                where += `forne.id = ${params.id} `;
            }
            if (params.razao.trim() !== '') {
                if (where != "") where += " and ";
                if (params.sharp) {
                    where += `forne.razao = '${params.razao}' `;
                } else {
                    where += `forne.razao like '%${params.razao.trim()}%' `;
                }
            }
            if (params.cnpj_cpf.trim() !== '') {
                if (where != "") where += " and ";
                if (params.sharp) {
                    where += `forne.cnpj_cpf = '${params.cnpj_cpf}' `;
                } else {
                    where += `forne.cnpj_cpf like '%${params.cnpj_cpf.trim()}%' `;
                }
            }
            if (where != "") where = " where " + where;

            if (params.pagina != 0) {
                paginacao = `limit ${params.tamPagina} offset ((${params.pagina} - 1) * ${params.tamPagina})`;
            }

            if (params.contador == 'S') {
                sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM fornecedores forne      
				  ${ where} `;
                return db.one(sqlStr);
            } else {
                strSql = `select   
			   forne.id_empresa as  id_empresa  
			,  forne.id_filial as  id_filial  
			,  forne.id as  id  
			,  forne.cnpj_cpf as  cnpj_cpf  
			,  forne.inscri as  inscri  
			,  forne.razao as  razao  
			,  forne.fantasi as  fantasi  
			, to_char(forne.cadastr, 'DD/MM/YYYY') as cadastr  
			,  forne.rua as  rua  
			,  forne.nro as  nro  
			,  forne.complemento as  complemento  
			,  forne.bairro as  bairro  
			,  forne.cidade as  cidade  
			,  forne.uf as  uf  
			,  forne.cep as  cep  
			,  forne.tel1 as  tel1  
			,  forne.tel2 as  tel2  
			,  forne.email as  email  
			,  forne.obs as  obs  
			,  forne.user_insert as  user_insert  
			,  forne.user_update as  user_update     
			FROM fornecedores forne      
			${where} 			${ orderby} ${ paginacao} `;
                return db.manyOrNone(strSql);
            }
        } else {
            strSql = `select   
			   forne.id_empresa as  id_empresa  
			,  forne.id_filial as  id_filial  
			,  forne.id as  id  
			,  forne.cnpj_cpf as  cnpj_cpf  
			,  forne.inscri as  inscri  
			,  forne.razao as  razao  
			,  forne.fantasi as  fantasi  
			, to_char(forne.cadastr, 'DD/MM/YYYY') as cadastr  
			,  forne.rua as  rua  
			,  forne.nro as  nro  
			,  forne.complemento as  complemento  
			,  forne.bairro as  bairro  
			,  forne.cidade as  cidade  
			,  forne.uf as  uf  
			,  forne.cep as  cep  
			,  forne.tel1 as  tel1  
			,  forne.tel2 as  tel2  
			,  forne.email as  email  
			,  forne.obs as  obs  
			,  forne.user_insert as  user_insert  
			,  forne.user_update as  user_update    
			FROM fornecedores forne			     `;
            return db.manyOrNone(strSql);
        }
    }
    /* CRUD - INSERT */
exports.insertFornecedor = function(fornecedor) {
    strSql = `insert into fornecedores (
		     id_empresa 
		 ,   id_filial 
		 ,   cnpj_cpf 
		 ,   inscri 
		 ,   razao 
		 ,   fantasi 
		 ,   cadastr 
		 ,   rua 
		 ,   nro 
		 ,   complemento 
		 ,   bairro 
		 ,   cidade 
		 ,   uf 
		 ,   cep 
		 ,   tel1 
		 ,   tel2 
		 ,   email 
		 ,   obs 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${fornecedor.id_empresa} 
		 ,   ${fornecedor.id_filial} 
		 ,   '${fornecedor.cnpj_cpf}' 
		 ,   '${fornecedor.inscri}' 
		 ,   '${fornecedor.razao}' 
		 ,   '${fornecedor.fantasi}' 
		 ,   '${fornecedor.cadastr}' 
		 ,   '${fornecedor.rua}' 
		 ,   '${fornecedor.nro}' 
		 ,   '${fornecedor.complemento}' 
		 ,   '${fornecedor.bairro}' 
		 ,   '${fornecedor.cidade}' 
		 ,   '${fornecedor.uf}' 
		 ,   '${fornecedor.cep}' 
		 ,   '${fornecedor.tel1}' 
		 ,   '${fornecedor.tel2}' 
		 ,   '${fornecedor.email}' 
		 ,   '${fornecedor.obs}' 
		 ,   ${fornecedor.user_insert} 
		 ,   ${fornecedor.user_update} 
		 ) 
 returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updateFornecedor = function(fornecedor) {
        strSql = `update   fornecedores set  
		     cnpj_cpf = '${fornecedor.cnpj_cpf}' 
 		 ,   inscri = '${fornecedor.inscri}' 
 		 ,   razao = '${fornecedor.razao}' 
 		 ,   fantasi = '${fornecedor.fantasi}' 
 		 ,   cadastr = '${fornecedor.cadastr}' 
 		 ,   rua = '${fornecedor.rua}' 
 		 ,   nro = '${fornecedor.nro}' 
 		 ,   complemento = '${fornecedor.complemento}' 
 		 ,   bairro = '${fornecedor.bairro}' 
 		 ,   cidade = '${fornecedor.cidade}' 
 		 ,   uf = '${fornecedor.uf}' 
 		 ,   cep = '${fornecedor.cep}' 
 		 ,   tel1 = '${fornecedor.tel1}' 
 		 ,   tel2 = '${fornecedor.tel2}' 
 		 ,   email = '${fornecedor.email}' 
 		 ,   obs = '${fornecedor.obs}' 
 		 ,   user_insert = ${fornecedor.user_insert} 
 		 ,   user_update = ${fornecedor.user_update} 
 		 where id_empresa = ${fornecedor.id_empresa} and  id_filial = ${fornecedor.id_filial} and  id = ${fornecedor.id}  returning * `;
        return db.oneOrNone(strSql);
    }
    /* CRUD - DELETE */
exports.deleteFornecedor = function(id_empresa, id_filial, id) {
    strSql = `delete from fornecedores 
		 where id_empresa = ${id_empresa} and  id_filial = ${id_filial} and  id = ${id}  `;
    return db.oneOrNone(strSql);
}