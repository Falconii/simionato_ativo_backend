/* Script Tabelas */
/* TABELA de_para  */
DROP TABLE IF EXISTS de_para;
CREATE TABLE Public.de_para (
		id_empresa int4  NOT NULL  , 
		id_local int4  NOT NULL  , 
		id_inventario int4  NOT NULL  , 
		de int4  NOT NULL  , 
		para int4  NOT NULL  , 
		status int4  NOT NULL  , 
		de_descricao varchar(155)  NOT NULL  , 
		id_usuario int4  NOT NULL  , 
		dt_processamento TIMESTAMPTZ  NOT NULL  , 
		updated_at TIMESTAMPTZ  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_local,id_inventario,de,para) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA parametros  */
DROP TABLE IF EXISTS parametros;
CREATE TABLE Public.parametros (
		id_empresa int4  NOT NULL  , 
		modulo char(20)  NOT NULL  , 
		assinatura char(20)  NOT NULL  , 
		id_usuario int4  NOT NULL  , 
		parametro text  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,modulo,assinatura,id_usuario) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA empresas  */
DROP TABLE IF EXISTS empresas;
CREATE TABLE Public.empresas (
		id serial  NOT NULL  , 
		cnpj_cpf varchar(14)  NOT NULL  , 
		razao varchar(40)  NOT NULL  , 
		fantasi varchar(40)  NOT NULL  , 
		inscri varchar(14)  NOT NULL  , 
		cadastr Date  NOT NULL  , 
		ruaf varchar(80)  NOT NULL  , 
		nrof varchar(10)  NOT NULL  , 
		complementof varchar(30)  NOT NULL  , 
		bairrof varchar(40)  NOT NULL  , 
		cidadef varchar(40)  NOT NULL  , 
		uff varchar(2)  NOT NULL  , 
		cepf char(8)  NOT NULL  , 
		tel1 varchar(23)  NOT NULL  , 
		tel2 varchar(23)  NOT NULL  , 
		email varchar(100)  NOT NULL  , 
		obs varchar(200)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA locais  */
DROP TABLE IF EXISTS locais;
CREATE TABLE Public.locais (
		id_empresa int4  NOT NULL  , 
		id serial  NOT NULL  , 
		cnpj_cpf varchar(14)  NOT NULL  , 
		inscri varchar(14)  NOT NULL  , 
		razao varchar(65)  NOT NULL  , 
		fantasi varchar(65)  NOT NULL  , 
		cadastr Date  NOT NULL  , 
		ruaf varchar(80)  NOT NULL  , 
		nrof varchar(10)  NOT NULL  , 
		complementof varchar(30)  NOT NULL  , 
		bairrof varchar(40)  NOT NULL  , 
		cidadef varchar(40)  NOT NULL  , 
		uff varchar(2)  NOT NULL  , 
		cepf char(8)  NOT NULL  , 
		tel1 varchar(23)  NOT NULL  , 
		tel2 varchar(23)  NOT NULL  , 
		email varchar(100)  NOT NULL  , 
		obs varchar(200)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA usuarios  */
DROP TABLE IF EXISTS usuarios;
CREATE TABLE Public.usuarios (
		id_empresa int4  NOT NULL  , 
		id serial  NOT NULL  , 
		cnpj_cpf varchar(14)  NOT NULL  , 
		razao varchar(40)  NOT NULL  , 
		cadastr Date  NOT NULL  , 
		rua varchar(80)  NOT NULL  , 
		nro varchar(10)  NOT NULL  , 
		complemento varchar(30)  NOT NULL  , 
		bairro varchar(40)  NOT NULL  , 
		cidade varchar(40)  NOT NULL  , 
		uf varchar(2)  NOT NULL  , 
		cep char(8)  NOT NULL  , 
		tel1 varchar(23)  NOT NULL  , 
		tel2 varchar(23)  NOT NULL  , 
		email varchar(100)  NOT NULL  , 
		obs varchar(200)  NOT NULL  , 
		senha varchar(255)  NOT NULL  , 
		grupo int4  NOT NULL  , 
		ativo char(1)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA gruposusuarios  */
DROP TABLE IF EXISTS gruposusuarios;
CREATE TABLE Public.gruposusuarios (
		id_empresa int4  NOT NULL  , 
		codigo serial  NOT NULL  , 
		descricao varchar(40)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,codigo) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA fornecedores  */
DROP TABLE IF EXISTS fornecedores;
CREATE TABLE Public.fornecedores (
		id_empresa int4  NOT NULL  , 
		id_filial int4  NOT NULL  , 
		id serial  NOT NULL  , 
		cnpj_cpf varchar(14)  NOT NULL  , 
		inscri varchar(14)  NOT NULL  , 
		razao varchar(65)  NOT NULL  , 
		fantasi varchar(65)  NOT NULL  , 
		cadastr Date  NOT NULL  , 
		rua varchar(80)  NOT NULL  , 
		nro varchar(10)  NOT NULL  , 
		complemento varchar(30)  NOT NULL  , 
		bairro varchar(40)  NOT NULL  , 
		cidade varchar(40)  NOT NULL  , 
		uf varchar(2)  NOT NULL  , 
		cep char(8)  NOT NULL  , 
		tel1 varchar(23)  NOT NULL  , 
		tel2 varchar(23)  NOT NULL  , 
		email varchar(100)  NOT NULL  , 
		obs varchar(200)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_filial,id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA principais  */
DROP TABLE IF EXISTS principais;
CREATE TABLE Public.principais (
		id_empresa int4  NOT NULL  , 
		id_filial int4  NOT NULL  , 
		codigo int4  NOT NULL  , 
		descricao varchar(80)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_filial,codigo) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA produtos  */
DROP TABLE IF EXISTS produtos;
CREATE TABLE Public.produtos (
		id_empresa int4  NOT NULL  , 
		id_filial int4  NOT NULL  , 
		codigo int4  NOT NULL  , 
		estado int4  NOT NULL  , 
		descricao varchar(80)  NOT NULL  , 
		ncm varchar(15)  NOT NULL  , 
		id_principal int4  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_filial,codigo) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA grupos  */
DROP TABLE IF EXISTS grupos;
CREATE TABLE Public.grupos (
		id_empresa int4  NOT NULL  , 
		id_filial int4  NOT NULL  , 
		codigo int4  NOT NULL  , 
		descricao varchar(80)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_filial,codigo) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA centroscustos  */
DROP TABLE IF EXISTS centroscustos;
CREATE TABLE Public.centroscustos (
		id_empresa int4  NOT NULL  , 
		id_filial int4  NOT NULL  , 
		codigo varchar(10)  NOT NULL  , 
		descricao varchar(80)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_filial,codigo) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA imobilizados  */
DROP TABLE IF EXISTS imobilizados;
CREATE TABLE Public.imobilizados (
		id_empresa int4  NOT NULL  , 
		id_filial int4  NOT NULL  , 
		codigo int4  NOT NULL  , 
		descricao varchar(100)  NOT NULL  , 
		cod_grupo int4  NOT NULL  , 
		cod_cc varchar(10)  NOT NULL  , 
		id_fornecedor int4  NOT NULL  , 
		nfe int4  NOT NULL  , 
		serie varchar(3)  NOT NULL  , 
		item int4  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_filial,codigo) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA nfes  */
DROP TABLE IF EXISTS nfes;
CREATE TABLE Public.nfes (
		id_empresa int4  NOT NULL  , 
		id_filial int4  NOT NULL  , 
		id_fornecedor int4  NOT NULL  , 
		id_imobilizado int4  NOT NULL  , 
		nfe int4  NOT NULL  , 
		serie varchar(3)  NOT NULL  , 
		item int4  NOT NULL  , 
		chavee varchar(44)  NOT NULL  , 
		qtd numeric(12,4)  NOT NULL  , 
		punit numeric(15,4)  NOT NULL  , 
		totalitem numeric(15,2)  NOT NULL  , 
		vlrcontabil numeric(15,2)  NOT NULL  , 
		baseicms numeric(15,4)  NOT NULL  , 
		percicms numeric(7,2)  NOT NULL  , 
		vlrcicms numeric(15,4)  NOT NULL  , 
		dtemissao date  NOT NULL  , 
		dtvencto date  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_filial,id_fornecedor,id_imobilizado,nfe,serie,item) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA valores  */
DROP TABLE IF EXISTS valores;
CREATE TABLE Public.valores (
		id_empresa int4  NOT NULL  , 
		id_filial int4  NOT NULL  , 
		id_imobilizado int4  NOT NULL  , 
		dtaquisicao date  NOT NULL  , 
		vlraquisicao numeric(15,4)  NOT NULL  , 
		totaldepreciado numeric(15,4)  NOT NULL  , 
		vlrresidual numeric(15,4)  NOT NULL  , 
		reavalicao numeric(15,4)  NOT NULL  , 
		deemed numeric(15,4)  NOT NULL  , 
		vlrconsolidado numeric(15,4)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_filial,id_imobilizado) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA inventarios  */
DROP TABLE IF EXISTS inventarios;
CREATE TABLE Public.inventarios (
		id_empresa int4  NOT NULL  , 
		id_filial int4  NOT NULL  , 
		codigo serial  NOT NULL  , 
		descricao varchar(100)  NOT NULL  , 
		id_responsavel int4  NOT NULL  , 
		data_inicial date  NOT NULL  , 
		data_final date  NOT NULL  , 
		data_encerra date  NOT NULL  , 
		laudo text  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_filial,codigo) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA usuariosinventarios  */
DROP TABLE IF EXISTS usuariosinventarios;
CREATE TABLE Public.usuariosinventarios (
		id_empresa int4  NOT NULL  , 
		id_filial int4  NOT NULL  , 
		id_inventario int4  NOT NULL  , 
		id_usuario int4  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_filial,id_inventario,id_usuario) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA imobilizadosinventarios  */
DROP TABLE IF EXISTS imobilizadosinventarios;
CREATE TABLE Public.imobilizadosinventarios (
		id_empresa int4  NOT NULL  , 
		id_filial int4  NOT NULL  , 
		id_inventario int4  NOT NULL  , 
		id_imobilizado int4  NOT NULL  , 
		id_lanca int4  NOT NULL  , 
		status int4  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_filial,id_inventario,id_imobilizado) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
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
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_filial,id_inventario,id_imobilizado) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TRUNCATE TABLES */ 
TRUNCATE TABLE Public.de_para RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.parametros RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.empresas RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.locais RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.usuarios RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.gruposusuarios RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.fornecedores RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.principais RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.produtos RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.grupos RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.centroscustos RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.imobilizados RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.nfes RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.valores RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.inventarios RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.usuariosinventarios RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.imobilizadosinventarios RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.lancamentos RESTART IDENTITY; 
GO 
/* Drop TABLES */ 
DROP TABLE IF EXISTS Public.de_para ; 
GO 
DROP TABLE IF EXISTS Public.parametros ; 
GO 
DROP TABLE IF EXISTS Public.empresas ; 
GO 
DROP TABLE IF EXISTS Public.locais ; 
GO 
DROP TABLE IF EXISTS Public.usuarios ; 
GO 
DROP TABLE IF EXISTS Public.gruposusuarios ; 
GO 
DROP TABLE IF EXISTS Public.fornecedores ; 
GO 
DROP TABLE IF EXISTS Public.principais ; 
GO 
DROP TABLE IF EXISTS Public.produtos ; 
GO 
DROP TABLE IF EXISTS Public.grupos ; 
GO 
DROP TABLE IF EXISTS Public.centroscustos ; 
GO 
DROP TABLE IF EXISTS Public.imobilizados ; 
GO 
DROP TABLE IF EXISTS Public.nfes ; 
GO 
DROP TABLE IF EXISTS Public.valores ; 
GO 
DROP TABLE IF EXISTS Public.inventarios ; 
GO 
DROP TABLE IF EXISTS Public.usuariosinventarios ; 
GO 
DROP TABLE IF EXISTS Public.imobilizadosinventarios ; 
GO 
DROP TABLE IF EXISTS Public.lancamentos ; 
GO 
