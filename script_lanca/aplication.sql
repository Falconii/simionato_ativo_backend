/* Script Tabelas */
/* TABELA lancamentos  */
DROP TABLE IF EXISTS lancamentos;
CREATE TABLE Public.lancamentos (
		id_empresa int4  NOT NULL  , 
		id_filial int4  NOT NULL  , 
		id_inventario int4  NOT NULL  , 
		id_imobilizado int4  NOT NULL  , 
		id_usuario int4  NOT NULL  , 
		id_lanca serial  NOT NULL  , 
		obs varchar(255)  NOT NULL  , 
		dtlanca date  NOT NULL  , 
		estado int4  NOT NULL  , 
		new_codigo int4  NOT NULL  , 
		new_cc varchar(10)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_filial,id_inventario,id_imobilizado) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TRUNCATE TABLES */ 
TRUNCATE TABLE Public.lancamentos RESTART IDENTITY; 
GO 
/* Drop TABLES */ 
DROP TABLE IF EXISTS Public.lancamentos ; 
GO 
