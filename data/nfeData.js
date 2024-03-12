/* DATA nfes */
const db = require('../infra/database');
const shared = require('../util/shared.js');

/* GET CAMPOS */
exports.getCampos = function(Nfe) {
    return [
        Nfe.id_empresa,
        Nfe.id_filial,
        Nfe.cnpj_fornecedor,
        Nfe.razao_fornecedor,
        Nfe.id_imobilizado,
        Nfe.nfe,
        Nfe.serie,
        Nfe.item,
        Nfe.chavee,
        Nfe.dtemissao,
        Nfe.dtlancamento,
        Nfe.qtd,
        Nfe.punit,
        Nfe.totalitem,
        Nfe.vlrcontabil,
        Nfe.baseicms,
        Nfe.percicms,
        Nfe.vlrcicms,
        Nfe.user_insert,
        Nfe.user_update,
    ];
};
/* CRUD GET */
exports.getNfe = function(params) {
    strSql = ` select   
			   nf.id_empresa as  id_empresa  
			,  nf.id_filial as  id_filial  
			,  nf.cnpj_fornecedor as  cnpj_fornecedor  
			,  nf.razao_fornecedor as  razao_fornecedor  
			,  nf.id_imobilizado as  id_imobilizado  
			,  nf.nfe as  nfe  
			,  nf.serie as  serie  
			,  nf.item as  item  
			,  nf.chavee as  chavee  
			,  coalesce (to_char(nf.dtemissao, 'DD/MM/YYYY'),'') as dtemissao  
			,  coalesce (to_char(nf.dtlancamento, 'DD/MM/YYYY'),'') as dtlancamento  
			,  nf.qtd as  qtd  
			,  nf.punit as  punit  
			,  nf.totalitem as  totalitem  
			,  nf.vlrcontabil as  vlrcontabil  
			,  nf.baseicms as  baseicms  
			,  nf.percicms as  percicms  
			,  nf.vlrcicms as  vlrcicms  
			,  nf.user_insert as  user_insert  
			,  nf.user_update as  user_update  
			,  imo.descricao as  imo_descricao    
 			FROM nfes nf 	  
				 inner join imobilizados imo on imo.id_empresa = nf.id_empresa and imo.id_filial = nf.id_filial and imo.codigo = nf.id_imobilizado   
			 where nf.id_empresa = ${params.id_empresa} and  nf.id_filial = ${params.id_filial} and  nf.cnpj_fornecedor = '${params.cnpj_fornecedor}' and  nf.razao_fornecedor = '${params.razao_fornecedor}' and  nf.id_imobilizado = ${params.id_imobilizado} and  nf.nfe = '${params.nfe}' and  nf.serie = '${params.serie}' and  nf.item = '${params.item}'  `;
    console.log('get nf', strSql);
    return db.oneOrNone(strSql);
}


exports.getNfeByImobilizado = function(id_empresa, id_filial, id_imobilizado, nfe, serie, item) {
    console.log('params getNfeByImobilizado', id_empresa, id_filial, id_imobilizado, nfe, serie, item);
    strSql = ` select   
			   nf.id_empresa as  id_empresa  
			,  nf.id_filial as  id_filial  
			,  nf.cnpj_fornecedor as  cnpj_fornecedor  
			,  nf.razao_fornecedor as  razao_fornecedor  
			,  nf.id_imobilizado as  id_imobilizado  
			,  nf.nfe as  nfe  
			,  nf.serie as  serie  
			,  nf.item as  item  
			,  nf.chavee as  chavee  
			,  coalesce (to_char(nf.dtemissao, 'DD/MM/YYYY'),'') as dtemissao  
			,  coalesce (to_char(nf.dtlancamento, 'DD/MM/YYYY'),'') as dtlancamento  
			,  nf.qtd as  qtd  
			,  nf.punit as  punit  
			,  nf.totalitem as  totalitem  
			,  nf.vlrcontabil as  vlrcontabil  
			,  nf.baseicms as  baseicms  
			,  nf.percicms as  percicms  
			,  nf.vlrcicms as  vlrcicms  
			,  nf.user_insert as  user_insert  
			,  nf.user_update as  user_update  
			,  imo.descricao as  imo_descricao    
 			FROM nfes nf 	  
				 inner join imobilizados imo on imo.id_empresa = nf.id_empresa and imo.id_filial = nf.id_filial and imo.codigo = nf.id_imobilizado   
			 where nf.id_empresa = ${id_empresa} and  nf.id_filial = ${id_filial} and  nf.id_imobilizado = ${id_imobilizado} and  nf.nfe = '${nfe}' and nf.serie = '${serie}' and nf.item = '${item}'`;
    console.log('select getNfeByImobilizado => ', strSql)
    return db.manyOrNone(strSql);
}

/* CRUD GET ALL*/
exports.getNfes = function(params) {
        if (params) {
            where = "";
            orderby = "";
            paginacao = "";

            if (params.orderby == '') orderby = 'nfe.id_empresa,nfe.id_filial';
            if (params.orderby == 'Filial') orderby = 'nf.id_empresa,nf.id_filial';
            if (params.orderby == 'Nfe') orderby = 'nf.id_empresa,nf.id_filial,nf.nfe,nf.serie';
            if (params.orderby == 'Fornecedor') orderby = 'nf.id_empresa,nf.id_filial,nf.razao_fornecedor';

            if (orderby != "") orderby = " order by " + orderby;
            if (params.id_empresa !== 0) {
                if (where != "") where += " and ";
                where += `nf.id_empresa = ${params.id_empresa} `;
            }
            if (params.id_filial !== 0) {
                if (where != "") where += " and ";
                where += `nf.id_filial = ${params.id_filial} `;
            }
            if (params.cnpj_fornecedor !== '') {
                if (where != "") where += " and ";
                if (params.sharp) {
                    where += `nf.cnpj_fornecedor = '${params.cnpj_fornecedor}' `;
                } else {
                    where += `nf.cnpj_fornecedor like '%${params.cnpj_fornecedor.trim()}%' `;
                }
            }
            if (params.razao_fornecedor !== '') {
                if (where != "") where += " and ";
                if (params.sharp) {
                    where += `nf.razao_fornecedor = '${params.razao_fornecedor}' `;
                } else {
                    where += `nf.razao_fornecedor like '%${params.razao_fornecedor.trim()}%' `;
                }
            }
            if (params.id_imobilizado !== 0) {
                if (where != "") where += " and ";
                where += `nf.id_imobilizado = ${params.id_imobilizado} `;
            }
            if (params.nfe.trim() !== '') {
                if (where != "") where += " and ";
                if (params.sharp) {
                    where += `nf.nfe = '${params.nfe}' `;
                } else {
                    where += `nf.nfe like '%${params.nfe.trim()}%' `;
                }
            }
            if (params.serie.trim() !== '') {
                if (where != "") where += " and ";
                if (params.sharp) {
                    where += `nf.serie = '${params.serie}' `;
                } else {
                    where += `nf.serie like '%${params.serie.trim()}%' `;
                }
            }
            if (params.chavee.trim() !== '') {
                if (where != "") where += " and ";
                if (params.sharp) {
                    where += `nf.chavee = '${params.chavee}' `;
                } else {
                    where += `nf.chavee like '%${params.chavee.trim()}%' `;
                }
            }
            if (where != "") where = " where " + where;


            if (params.pagina != 0) {
                paginacao = `limit ${params.tamPagina} offset ((${params.pagina} - 1) * ${params.tamPagina})`;
            }

            if (params.contador == 'S') {
                sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM nfes nf   
				 inner join imobilizados imo on imo.id_empresa = nf.id_empresa and imo.id_filial = nf.id_filial and imo.codigo = nf.id_imobilizado   
				  ${ where} `;
                console.log('contador', sqlStr)
                return db.one(sqlStr);
            } else {
                strSql = `select   
			   nf.id_empresa as  id_empresa  
			,  nf.id_filial as  id_filial  
			,  nf.cnpj_fornecedor as  cnpj_fornecedor  
			,  nf.razao_fornecedor as  razao_fornecedor  
			,  nf.id_imobilizado as  id_imobilizado  
			,  nf.nfe as  nfe  
			,  nf.serie as  serie  
			,  nf.item as  item  
			,  nf.chavee as  chavee  
			,  coalesce (to_char(nf.dtemissao, 'DD/MM/YYYY'),'') as dtemissao  
			,  coalesce (to_char(nf.dtlancamento, 'DD/MM/YYYY'),'') as dtlancamento  
			,  nf.qtd as  qtd  
			,  nf.punit as  punit  
			,  nf.totalitem as  totalitem  
			,  nf.vlrcontabil as  vlrcontabil  
			,  nf.baseicms as  baseicms  
			,  nf.percicms as  percicms  
			,  nf.vlrcicms as  vlrcicms  
			,  nf.user_insert as  user_insert  
			,  nf.user_update as  user_update  
			,  imo.descricao as  imo_descricao     
			FROM nfes nf   
				 inner join imobilizados imo on imo.id_empresa = nf.id_empresa and imo.id_filial = nf.id_filial and imo.codigo = nf.id_imobilizado   
			${where} ${ orderby} ${ paginacao} `;
                console.log('select', strSql)
                return db.manyOrNone(strSql);
            }
        } else {
            strSql = `select   
			   nf.id_empresa as  id_empresa  
			,  nf.id_filial as  id_filial  
			,  nf.cnpj_fornecedor as  cnpj_fornecedor  
			,  nf.razao_fornecedor as  razao_fornecedor  
			,  nf.id_imobilizado as  id_imobilizado  
			,  nf.nfe as  nfe  
			,  nf.serie as  serie  
			,  nf.item as  item  
			,  nf.chavee as  chavee  
			,  coalesce (to_char(nf.dtemissao, 'DD/MM/YYYY'),'') as dtemissao  
			,   coalesce (to_char(nf.dtlancamento, 'DD/MM/YYYY'),'') as dtlancamento  
			,  nf.qtd as  qtd  
			,  nf.punit as  punit  
			,  nf.totalitem as  totalitem  
			,  nf.vlrcontabil as  vlrcontabil  
			,  nf.baseicms as  baseicms  
			,  nf.percicms as  percicms  
			,  nf.vlrcicms as  vlrcicms  
			,  nf.user_insert as  user_insert  
			,  nf.user_update as  user_update  
			,  imo.descricao as  imo_descricao    
			FROM nfes nf			   
				 inner join imobilizados imo on imo.id_empresa = nf.id_empresa and imo.id_filial = nf.id_filial and imo.codigo = nf.id_imobilizado  `;
            return db.manyOrNone(strSql);
        }
    }
    /* CRUD - INSERT */
exports.insertNfe = function(nfe) {
    strSql = `insert into nfes (
		     id_empresa 
		 ,   id_filial 
		 ,   cnpj_fornecedor 
		 ,   razao_fornecedor 
		 ,   id_imobilizado 
		 ,   nfe 
		 ,   serie 
		 ,   item 
		 ,   chavee 
		 ,   dtemissao 
		 ,   dtlancamento 
		 ,   qtd 
		 ,   punit 
		 ,   totalitem 
		 ,   vlrcontabil 
		 ,   baseicms 
		 ,   percicms 
		 ,   vlrcicms 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${nfe.id_empresa} 
		 ,   ${nfe.id_filial} 
		 ,   '${nfe.cnpj_fornecedor}'
		 ,   '${nfe.razao_fornecedor}' 
		 ,   ${nfe.id_imobilizado} 
		 ,   '${nfe.nfe}' 
		 ,   '${nfe.serie}' 
		 ,   '${nfe.item}' 
		 ,   '${nfe.chavee}'  
		 ,    ${shared.formatDateYYYYMMDD(nfe.dtemissao)}
		 ,   ${shared.formatDateYYYYMMDD(nfe.dtlancamento)} 
		 ,   ${shared.excluirVirgulasePontos(nfe.qtd)} 
		 ,   ${shared.excluirVirgulasePontos(nfe.punit)} 
		 ,   ${shared.excluirVirgulasePontos(nfe.totalitem)} 
		 ,   ${shared.excluirVirgulasePontos(nfe.vlrcontabil)} 
		 ,   ${shared.excluirVirgulasePontos(nfe.baseicms)} 
		 ,   ${shared.excluirVirgulasePontos(nfe.percicms)} 
		 ,   ${shared.excluirVirgulasePontos(nfe.vlrcicms)} 
		 ,   ${nfe.user_insert} 
		 ,   ${nfe.user_update} 
		 ) 
 returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updateNfe = function(nfe) {
        strSql = `update   nfes set  
		     chavee = '${nfe.chavee}' 
		, dtemissao =  ${shared.formatDateYYYYMMDD(nfe.dtemissao)}
		, dtlancamento =   ${shared.formatDateYYYYMMDD(nfe.dtlancamento)} 
		, qtd =  ${shared.excluirVirgulasePontos(nfe.qtd)} 
		, punit =  ${shared.excluirVirgulasePontos(nfe.punit)} 
		, totalitem =  ${shared.excluirVirgulasePontos(nfe.totalitem)} 
		, vlrcontabil =  ${shared.excluirVirgulasePontos(nfe.vlrcontabil)} 
		, baseicms =  ${shared.excluirVirgulasePontos(nfe.baseicms)} 
		, percicms =  ${shared.excluirVirgulasePontos(nfe.percicms)} 
		, vlrcicms =  ${shared.excluirVirgulasePontos(nfe.vlrcicms)} 
 		 ,   user_insert = ${nfe.user_insert} 
 		 ,   user_update = ${nfe.user_update} 
 		 where id_empresa = ${nfe.id_empresa} and  id_filial = ${nfe.id_filial} and  cnpj_fornecedor = ${nfe.cnpj_fornecedor} and  razao_fornecedor = '${nfe.razao_fornecedor}' and  id_imobilizado = ${nfe.id_imobilizado} and  nfe = '${nfe.nfe}' and  serie = '${nfe.serie}' and  item = '${nfe.item}'  returning * `;
        return db.oneOrNone(strSql);
    }
    /* CRUD - DELETE */
exports.deleteNfe = function(id_empresa, id_filial, cnpj_fornecedor, razao_fornecedor, id_imobilizado, nfe, serie, item) {
    strSql = `delete from nfes 
		 where id_empresa = ${id_empresa} and  id_filial = ${id_filial} and  cnpj_fornecedor = ${cnpj_fornecedor} and  razao_fornecedor = '${razao_fornecedor}' and  id_imobilizado = ${id_imobilizado} and  nfe = '${nfe}' and  serie = '${serie}' and  item = '${item}'  `;
    return db.oneOrNone(strSql);
}