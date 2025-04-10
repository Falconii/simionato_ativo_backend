/* Script Tabelas */
/* TABELA tickets_cab  */
DROP TABLE IF EXISTS tickets_cab;
CREATE TABLE Public.tickets_cab (
		id_empresa int4  NOT NULL  , 
		id serial  NOT NULL  , 
		periodo varchar(7)  NOT NULL  , 
		descricao varchar(50)  NOT NULL  , 
		id_resp int4  NOT NULL  , 
		real_dt_inicial date  NOT NULL  , 
		real_dt_final date  NOT NULL  , 
		prev_dt_inicial date  NOT NULL  , 
		prev_dt_final date  NOT NULL  , 
		dt_fechamento date  NOT NULL  , 
		qtd_real int4  NOT NULL  , 
		qtd_previsto int4  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id,periodo) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA tickets_real  */
DROP TABLE IF EXISTS tickets_real;
CREATE TABLE Public.tickets_real (
		id_empresa int4  NOT NULL  , 
		id_cab int4  NOT NULL  , 
		id_usuario int4  NOT NULL  , 
		data date  NOT NULL  , 
		util char(1)  NOT NULL  , 
		feriado char(1)  NOT NULL  , 
		ponte char(1)  NOT NULL  , 
		afastado char(1)  NOT NULL  , 
		ferias char(1)  NOT NULL  , 
		horas numeric(8,2)  NOT NULL  , 
		total numeric(15,2)  NOT NULL  , 
		tickets int4  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_cab,id_usuario) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA tickets_prev  */
DROP TABLE IF EXISTS tickets_prev;
CREATE TABLE Public.tickets_prev (
		id_empresa int4  NOT NULL  , 
		id_cab int4  NOT NULL  , 
		id_usuario int4  NOT NULL  , 
		data date  NOT NULL  , 
		horas numeric(8,2)  NOT NULL  , 
		total numeric(15,2)  NOT NULL  , 
		tickets int4  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_cab,id_usuario) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA tickets_saldo  */
DROP TABLE IF EXISTS tickets_saldo;
CREATE TABLE Public.tickets_saldo (
		id_empresa int4  NOT NULL  , 
		id_cab int4  NOT NULL  , 
		id_usuario int4  NOT NULL  , 
		saldo int4  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_cab,id_caract,id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TRUNCATE TABLES */ 
TRUNCATE TABLE Public.tickets_cab RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.tickets_real RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.tickets_prev RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.tickets_saldo RESTART IDENTITY; 
GO 
/* Drop TABLES */ 
DROP TABLE IF EXISTS Public.tickets_cab ; 
GO 
DROP TABLE IF EXISTS Public.tickets_real ; 
GO 
DROP TABLE IF EXISTS Public.tickets_prev ; 
GO 
DROP TABLE IF EXISTS Public.tickets_saldo ; 
GO 
