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
/* TABELA fotos  */
DROP TABLE IF EXISTS fotos;
CREATE TABLE Public.fotos (
		id_empresa int4  NOT NULL  , 
		id_local int4  NOT NULL  , 
		id_inventario int4  NOT NULL  , 
		id_imobilizado int4  NOT NULL  , 
		id_pasta varchar(255)  NOT NULL  , 
		id_file varchar(255)  NOT NULL  , 
		file_name varchar(255)  NOT NULL  , 
		file_name_original varchar(255)  NOT NULL  , 
		id_usuario int4  NOT NULL  , 
		data date  NOT NULL  , 
		destaque char(1)  NOT NULL  , 
		obs varchar(255)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_local,id_inventario,id_imobilizado,id_pasta,id_file,file_name) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TRUNCATE TABLES */ 
TRUNCATE TABLE Public.fotos RESTART IDENTITY; 
GO 
/* Drop TABLES */ 
DROP TABLE IF EXISTS Public.fotos ; 
GO 
