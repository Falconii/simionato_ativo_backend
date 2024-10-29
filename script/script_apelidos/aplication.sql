CREATE DATABASE nao_usado 
		WITH 
		OWNER = postgres 
		ENCODING = 'UTF8' 
		LC_COLLATE = 'Portuguese_Brazil.1252' 
		LC_CTYPE = 'Portuguese_Brazil.1252' 
		TABLESPACE = "Producao" 
		CONNECTION LIMIT = -1; 
GO 
/* Script Tabelas */
/* TABELA padroes_cab  */
DROP TABLE IF EXISTS padroes_cab;
CREATE TABLE Public.padroes_cab (
		id serial  NOT NULL  , 
		apelido varchar(40)  NOT NULL  , 
		descricao varchar(80)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA padroes_caracteristica  */
DROP TABLE IF EXISTS padroes_caracteristica;
CREATE TABLE Public.padroes_caracteristica (
		id_cab int4  NOT NULL  , 
		id serial  NOT NULL  , 
		descricao varchar(40)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_cab,id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA padroes_sugestoes  */
DROP TABLE IF EXISTS padroes_sugestoes;
CREATE TABLE Public.padroes_sugestoes (
		id_cab int4  NOT NULL  , 
		id_caract int4  NOT NULL  , 
		id serial  NOT NULL  , 
		descricao varchar(40)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_cab,id_caract,id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TRUNCATE TABLES */ 
TRUNCATE TABLE Public.padroes_cab RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.padroes_caracteristica RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.padroes_sugestoes RESTART IDENTITY; 
GO 
/* Drop TABLES */ 
DROP TABLE IF EXISTS Public.padroes_cab ; 
GO 
DROP TABLE IF EXISTS Public.padroes_caracteristica ; 
GO 
DROP TABLE IF EXISTS Public.padroes_sugestoes ; 
GO 
