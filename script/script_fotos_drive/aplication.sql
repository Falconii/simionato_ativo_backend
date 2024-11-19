/* Script Tabelas */
/* TABELA fotos_drive  */
DROP TABLE IF EXISTS fotos_drive;
CREATE TABLE Public.fotos_drive (
		id_empresa int4  NOT NULL  , 
		id_filial int4  NOT NULL  , 
		id_inventario int4  NOT NULL  , 
        id_file    varchar(255)  NOT NULL  , 
        folder_id  varchar(255)  NOT NULL  , 
        name_file  varchar(255)  NOT NULL  , 
        size       varchar(255)  NOT NULL  , 
        data       varchar(255)  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_filial,id_inventario,id_file) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TRUNCATE TABLES */ 
TRUNCATE TABLE Public.fotos_drive RESTART IDENTITY; 
GO 
/* Drop TABLES */ 
DROP TABLE IF EXISTS Public.fotos_drive ; 
GO 
