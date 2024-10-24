/* Script Tabelas */
/* TABELA padroes  */
DROP TABLE IF EXISTS padroes;
CREATE TABLE Public.padroes (
		id_empresa int4  NOT NULL  , 
		id_usuario int4  NOT NULL  , 
		id_empresa_padrao int4  NOT NULL  , 
		id_local_padrao int4  NOT NULL  , 
		id_inv_padrao int4  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_usuario) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TRUNCATE TABLES */ 
TRUNCATE TABLE Public.padroes RESTART IDENTITY; 
GO 
/* Drop TABLES */ 
DROP TABLE IF EXISTS Public.padroes ; 
GO 
