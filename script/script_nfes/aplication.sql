/* Script Tabelas */
/* TABELA nfes  */
DROP TABLE IF EXISTS nfes;
CREATE TABLE Public.nfes (
		id_empresa int4  NOT NULL  , 
		id_filial int4  NOT NULL  , 
		cnpj_fornecedor varchar(20)  NOT NULL  , 
		razao_fornecedor varchar(65)  NOT NULL  , 
		id_imobilizado int4  NOT NULL  , 
		nfe varchar(9)  NOT NULL  , 
		serie varchar(3)  NOT NULL  , 
		item varchar(10)  NOT NULL  , 
		chavee varchar(44)  NOT NULL  , 
		dtemissao date   , 
		dtlancamento date   , 
		qtd numeric(12,4)  NOT NULL  , 
		punit numeric(15,4)  NOT NULL  , 
		totalitem numeric(15,2)  NOT NULL  , 
		vlrcontabil numeric(15,2)  NOT NULL  , 
		baseicms numeric(15,4)  NOT NULL  , 
		percicms numeric(7,2)  NOT NULL  , 
		vlrcicms numeric(15,4)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_filial,cnpj_fornecedor,razao_fornecedor,id_imobilizado,nfe,serie,item) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TRUNCATE TABLES */ 
TRUNCATE TABLE Public.nfes RESTART IDENTITY; 
GO 
/* Drop TABLES */ 
DROP TABLE IF EXISTS Public.nfes ; 
GO 
