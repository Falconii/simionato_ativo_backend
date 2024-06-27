CREATE DATABASE ?????????
		WITH 
		OWNER = postgres 
		ENCODING = 'UTF8' 
		LC_COLLATE = 'Portuguese_Brazil.1252' 
		LC_CTYPE = 'Portuguese_Brazil.1252' 
		TABLESPACE = "Producao" 
		CONNECTION LIMIT = -1; 
GO 
CREATE TABLE public.centroscustos  ( 
	id_empresa 	int4 NOT NULL,
	id_filial  	int4 NOT NULL,
	codigo     	varchar(10) NOT NULL,
	descricao  	varchar(80) NOT NULL,
	user_insert	int4 NOT NULL,
	user_update	int4 NOT NULL,
	PRIMARY KEY(id_empresa,id_filial,codigo)
)
GO
CREATE TABLE public.draft  ( 
	id_empresa	int4 NOT NULL,
	id        	int4 NOT NULL,
	linha     	text NULL,
	tabela    	varchar(20) NULL,
	PRIMARY KEY(id_empresa,id)
)
WITHOUT OIDS 
TABLESPACE pg_default
GO
CREATE TABLE public.empresas  ( 
	id          	serial NOT NULL,
	cnpj_cpf    	varchar(14) NOT NULL,
	razao       	varchar(40) NOT NULL,
	fantasi     	varchar(40) NOT NULL,
	inscri      	varchar(14) NOT NULL,
	cadastr     	date NOT NULL,
	ruaf        	varchar(80) NOT NULL,
	nrof        	varchar(10) NOT NULL,
	complementof	varchar(30) NOT NULL,
	bairrof     	varchar(40) NOT NULL,
	cidadef     	varchar(40) NOT NULL,
	uff         	varchar(2) NOT NULL,
	cepf        	char(8) NOT NULL,
	tel1        	varchar(23) NOT NULL,
	tel2        	varchar(23) NOT NULL,
	email       	varchar(100) NOT NULL,
	obs         	varchar(200) NOT NULL,
	user_insert 	int4 NOT NULL,
	user_update 	int4 NOT NULL,
	PRIMARY KEY(id)
)
GO
/*
CREATE TABLE public.filiais  ( 
	id_empresa  	int4 NOT NULL,
	id_filial   	int4 NOT NULL,
	id          	serial NOT NULL,
	cnpj_cpf    	varchar(14) NOT NULL,
	inscri      	varchar(14) NOT NULL,
	razao       	varchar(65) NOT NULL,
	fantasi     	varchar(65) NOT NULL,
	cadastr     	date NOT NULL,
	ruaf        	varchar(80) NOT NULL,
	nrof        	varchar(10) NOT NULL,
	complementof	varchar(30) NOT NULL,
	bairrof     	varchar(40) NOT NULL,
	cidadef     	varchar(40) NOT NULL,
	uff         	varchar(2) NOT NULL,
	cepf        	char(8) NOT NULL,
	tel1        	varchar(23) NOT NULL,
	tel2        	varchar(23) NOT NULL,
	email       	varchar(100) NOT NULL,
	obs         	varchar(200) NOT NULL,
	user_insert 	int4 NOT NULL,
	user_update 	int4 NOT NULL,
	PRIMARY KEY(id_empresa,id_filial,id)
)
GO
*/
CREATE TABLE public.grupos  ( 
	id_empresa 	int4 NOT NULL,
	id_filial  	int4 NOT NULL,
	codigo     	int4 NOT NULL,
	descricao  	varchar(80) NOT NULL,
	user_insert	int4 NOT NULL,
	user_update	int4 NOT NULL,
	PRIMARY KEY(id_empresa,id_filial,codigo)
)
GO
CREATE TABLE public.gruposusuarios  ( 
	id_empresa 	int4 NOT NULL,
	codigo     	serial NOT NULL,
	descricao  	varchar(40) NOT NULL,
	user_insert	int4 NOT NULL,
	user_update	int4 NOT NULL,
	PRIMARY KEY(id_empresa,codigo)
)
GO
CREATE TABLE public.imobilizados  ( 
	id_empresa 	int4 NOT NULL,
	id_filial  	int4 NOT NULL,
	codigo     	int4 NOT NULL,
	descricao  	varchar(100) NOT NULL,
	cod_grupo  	int4 NOT NULL,
	cod_cc     	varchar(10) NOT NULL,
	nfe        	varchar(9) NOT NULL,
	serie      	varchar(3) NOT NULL,
	item       	varchar(10) NOT NULL,
	origem     	char(1) NOT NULL,
	condicao    int4 NOT NULL,
	apelido     varchar(30) NOT NULL,
	user_insert	int4 NOT NULL,
	user_update	int4 NOT NULL,
	PRIMARY KEY(id_empresa,id_filial,codigo)
)
GO
CREATE TABLE public.imobilizadosinventarios  ( 
	id_empresa    	int4 NOT NULL,
	id_filial     	int4 NOT NULL,
	id_inventario 	int4 NOT NULL,
	id_imobilizado	int4 NOT NULL,
	id_lanca      	int4 NOT NULL,
	status        	int4 NOT NULL,
	new_codigo    	int4 NOT NULL,
	new_cc        	varchar(10) NOT NULL,
	fotos           int4 NOT NULL defaul 0,
	user_insert   	int4 NOT NULL,
	user_update   	int4 NOT NULL,
	PRIMARY KEY(id_empresa,id_filial,id_inventario,id_imobilizado)
)
WITHOUT OIDS 
TABLESPACE pg_default
GO
CREATE TABLE public.inventarios  ( 
	id_empresa    	int4 NOT NULL,
	id_filial     	int4 NOT NULL,
	codigo        	serial NOT NULL,
	descricao     	varchar(100) NOT NULL,
	id_responsavel	int4 NOT NULL,
	data_inicial  	date NOT NULL,
	data_final    	date NOT NULL,
	data_encerra  	date NULL,
	laudo         	text NOT NULL,
	user_insert   	int4 NOT NULL,
	user_update   	int4 NOT NULL,
	PRIMARY KEY(id_empresa,id_filial,codigo)
)
GO
CREATE TABLE public.lancamentos  ( 
	id_empresa    	int4 NOT NULL,
	id_filial     	int4 NOT NULL,
	id_inventario 	int4 NOT NULL,
	id_imobilizado	int4 NOT NULL,
	id_usuario    	int4 NOT NULL,
	id_lanca      	serial NOT NULL,
	obs           	varchar(255) NOT NULL,
	dtlanca       	date NOT NULL,
	estado        	int4 NOT NULL,
	new_codigo    	int4 NOT NULL,
	new_cc        	varchar(10) NOT NULL,
	user_insert   	int4 NOT NULL,
	user_update   	int4 NOT NULL,
	PRIMARY KEY(id_empresa,id_filial,id_inventario,id_imobilizado)
)
GO
CREATE TABLE public.locais  ( 
	id_empresa  	int4 NOT NULL,
	id          	serial NOT NULL,
	cnpj_cpf    	varchar(14) NOT NULL,
	inscri      	varchar(14) NOT NULL,
	razao       	varchar(65) NOT NULL,
	fantasi     	varchar(65) NOT NULL,
	cadastr     	date NOT NULL,
	ruaf        	varchar(80) NOT NULL,
	nrof        	varchar(10) NOT NULL,
	complementof	varchar(30) NOT NULL,
	bairrof     	varchar(40) NOT NULL,
	cidadef     	varchar(40) NOT NULL,
	uff         	varchar(2) NOT NULL,
	cepf        	char(8) NOT NULL,
	tel1        	varchar(23) NOT NULL,
	tel2        	varchar(23) NOT NULL,
	email       	varchar(100) NOT NULL,
	obs         	varchar(200) NOT NULL,
	user_insert 	int4 NOT NULL,
	user_update 	int4 NOT NULL,
	PRIMARY KEY(id_empresa,id)
)
GO
CREATE TABLE public.nfes  ( 
	id_empresa      	int4 NOT NULL,
	id_filial       	int4 NOT NULL,
	cnpj_fornecedor 	varchar(20) NOT NULL,
	razao_fornecedor	varchar(65) NOT NULL,
	id_imobilizado  	int4 NOT NULL,
	nfe             	varchar(9) NOT NULL,
	serie           	varchar(3) NOT NULL,
	item            	varchar(10) NOT NULL,
	chavee          	varchar(44) NOT NULL,
	dtemissao       	date NULL,
	dtlancamento    	date NULL,
	qtd             	numeric(12,4) NOT NULL,
	punit           	numeric(15,4) NOT NULL,
	totalitem       	numeric(15,2) NOT NULL,
	vlrcontabil     	numeric(15,2) NOT NULL,
	baseicms        	numeric(15,4) NOT NULL,
	percicms        	numeric(7,2) NOT NULL,
	vlrcicms        	numeric(15,4) NOT NULL,
	user_insert     	int4 NOT NULL,
	user_update     	int4 NOT NULL,
	PRIMARY KEY(id_empresa,id_filial,cnpj_fornecedor,razao_fornecedor,id_imobilizado,nfe,serie,item)
)
GO
CREATE TABLE public.padroes  ( 
	id_empresa       	int4 NOT NULL,
	id_usuario       	int4 NOT NULL,
	id_empresa_padrao	int4 NOT NULL,
	id_local_padrao  	int4 NOT NULL,
	id_inv_padrao    	int4 NOT NULL,
	user_insert      	int4 NOT NULL,
	user_update      	int4 NOT NULL,
	PRIMARY KEY(id_empresa,id_usuario)
)
GO
CREATE TABLE public.parametros  ( 
	id_empresa 	int4 NOT NULL,
	modulo     	char(20) NOT NULL,
	assinatura 	char(20) NOT NULL,
	id_usuario 	int4 NOT NULL,
	parametro  	text NOT NULL,
	user_insert	int4 NOT NULL,
	user_update	int4 NOT NULL,
	PRIMARY KEY(id_empresa,modulo,assinatura,id_usuario)
)
GO
CREATE TABLE public.principais  ( 
	id_empresa 	int4 NOT NULL,
	id_filial  	int4 NOT NULL,
	codigo     	int4 NOT NULL,
	descricao  	varchar(80) NOT NULL,
	user_insert	int4 NOT NULL,
	user_update	int4 NOT NULL,
	PRIMARY KEY(id_empresa,id_filial,codigo)
)
GO
CREATE TABLE public.produtos  ( 
	id_empresa  	int4 NOT NULL,
	id_filial   	int4 NOT NULL,
	codigo      	int4 NOT NULL,
	estado      	int4 NOT NULL,
	descricao   	varchar(80) NOT NULL,
	ncm         	varchar(15) NOT NULL,
	id_principal	int4 NOT NULL,
	user_insert 	int4 NOT NULL,
	user_update 	int4 NOT NULL,
	PRIMARY KEY(id_empresa,id_filial,codigo)
)
GO
CREATE TABLE public.usuarios  ( 
	id_empresa 	int4 NOT NULL,
	id         	serial NOT NULL,
	cnpj_cpf   	varchar(14) NOT NULL,
	razao      	varchar(40) NOT NULL,
	cadastr    	date NOT NULL,
	rua        	varchar(80) NOT NULL,
	nro        	varchar(10) NOT NULL,
	complemento	varchar(30) NOT NULL,
	bairro     	varchar(40) NOT NULL,
	cidade     	varchar(40) NOT NULL,
	uf         	varchar(2) NOT NULL,
	cep        	char(8) NOT NULL,
	tel1       	varchar(23) NOT NULL,
	tel2       	varchar(23) NOT NULL,
	email      	varchar(100) NOT NULL,
	obs        	varchar(200) NOT NULL,
	senha      	varchar(255) NOT NULL,
	grupo      	int4 NOT NULL,
	ativo      	char(1) NOT NULL,
	user_insert	int4 NOT NULL,
	user_update	int4 NOT NULL,
	PRIMARY KEY(id_empresa,id)
)
GO
CREATE TABLE public.usuariosinventarios  ( 
	id_empresa   	int4 NOT NULL,
	id_filial    	int4 NOT NULL,
	id_inventario	int4 NOT NULL,
	id_usuario   	int4 NOT NULL,
	user_insert  	int4 NOT NULL,
	user_update  	int4 NOT NULL,
	PRIMARY KEY(id_empresa,id_filial,id_inventario,id_usuario)
)
GO
CREATE TABLE public.valores  ( 
	id_empresa     	int4 NOT NULL,
	id_filial      	int4 NOT NULL,
	id_imobilizado 	int4 NOT NULL,
	dtaquisicao    	date NOT NULL,
	vlraquisicao   	numeric(15,4) ,
	totaldepreciado	numeric(15,4) NOT NULL,
	vlrresidual    	numeric(15,4) NOT NULL,
	reavalicao     	numeric(15,4) NOT NULL,
	deemed         	numeric(15,4) NOT NULL,
	vlrconsolidado 	numeric(15,4) NOT NULL,
	user_insert    	int4 NOT NULL,
	user_update    	int4 NOT NULL,
	PRIMARY KEY(id_empresa,id_filial,id_imobilizado)
)
GO


    