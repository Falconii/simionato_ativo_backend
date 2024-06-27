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
CREATE TABLE IF NOT EXISTS public.imobilizadosinventarios
(
    id_empresa integer NOT NULL,
    id_filial integer NOT NULL,
    id_inventario integer NOT NULL,
    id_imobilizado integer NOT NULL,
    id_lanca integer NOT NULL,
    status integer NOT NULL,
    new_codigo integer NOT NULL,
    new_cc character varying(10) NOT NULL,
	condicao int4 NOT NULL,
	book     char(1) NOT NULL,
    user_insert integer NOT NULL,
    user_update integer NOT NULL,
    fotos integer DEFAULT 0,
    CONSTRAINT imobilizadosinventarios_pkey PRIMARY KEY (id_empresa, id_filial, id_inventario, id_imobilizado)
)
 
/* TRUNCATE TABLES */ 
TRUNCATE TABLE Public.imobilizadosinventarios RESTART IDENTITY; 
GO 
/* Drop TABLES */ 
DROP TABLE IF EXISTS Public.imobilizadosinventarios ; 
GO 
