CREATE DATABASE db_ajustes 
		WITH 
		OWNER = postgres 
		ENCODING = 'UTF8' 
		LC_COLLATE = 'Portuguese_Brazil.1252' 
		LC_CTYPE = 'Portuguese_Brazil.1252' 
		TABLESPACE = "Producao" 
		CONNECTION LIMIT = -1; 
GO 
/* Script Tabelas */
/* TABELA imobilizadosinventarios  */
DROP TABLE IF EXISTS imobilizadosinventarios;
CREATE TABLE Public.imobilizadosinventarios (
		id_empresa int4  NOT NULL  , 
		id_filial int4  NOT NULL  , 
		id_inventario int4  NOT NULL  , 
		id_imobilizado int4  NOT NULL  , 
		id_lanca int4  NOT NULL  , 
		status int4  NOT NULL  , 
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
TRUNCATE TABLE Public.imobilizadosinventarios RESTART IDENTITY; 
GO 
/* Drop TABLES */ 
DROP TABLE IF EXISTS Public.imobilizadosinventarios ; 
GO 
