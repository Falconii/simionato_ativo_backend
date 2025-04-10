/* Script Tabelas */
/* TABELA realoc_transf  */
DROP TABLE IF EXISTS realoc_transf;
CREATE TABLE Public.realoc_transf (
		id_empresa int4  NOT NULL  , 
		id_local int4  NOT NULL  , 
		id_inventario int4  NOT NULL  , 
		id_realocado int4  NOT NULL  , 
		id_transferido int4  NOT NULL  , 
		novo_realocado int4  NOT NULL  , 
		status int4  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_local,id_inventario,id_realocado,id_transferido) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TRUNCATE TABLES */ 
TRUNCATE TABLE Public.realoc_transf RESTART IDENTITY; 
GO 
/* Drop TABLES */ 
DROP TABLE IF EXISTS Public.realoc_transf ; 
GO 
