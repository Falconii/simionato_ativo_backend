/* Script Tabelas */
/* TABELA credenciais  */
DROP TABLE IF EXISTS credenciais;
CREATE TABLE Public.credenciais (
		id serial  NOT NULL  , 
		client_id varchar(255)  NOT NULL  , 
		client_secret varchar(255)  NOT NULL  , 
		redirect_uri varchar(255)  NOT NULL  , 
		code varchar(255)  NOT NULL  , 
		tokens varchar(255)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TRUNCATE TABLES */ 
TRUNCATE TABLE Public.credenciais RESTART IDENTITY; 
GO 
/* Drop TABLES */ 
DROP TABLE IF EXISTS Public.credenciais ; 
GO 
