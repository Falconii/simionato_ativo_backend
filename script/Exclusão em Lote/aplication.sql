
/* TABELA exclusao_em_lote  */
DROP TABLE IF EXISTS exclusao_em_lote;
CREATE TABLE Public.exclusao_em_lote (
	    id_empresa int4  NOT NULL  ,
		id_local int4  NOT NULL  ,
		id_inventario int4  NOT NULL ,
		id_imobilizado int4  NOT NULL, 
		flag_exclusao boolean  NOT NULL default false ,
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_local,id_inventario,id_imobilizado) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 


/*

   Local: 14
   
   Inventario: 10 

*/

--select lote.* from exclusao_em_lote lote
--inner join fotos fo on fo.id_empresa = lote.id_empresa and fo.id_local = lote.id_local and fo.id_inventario = lote.id_inventario and fo.id_imobilizado = lote.id_imobilizado

select imo.* from imobilizados imo
inner join exclusao_em_lote lote 
    on imo.id_empresa = lote.id_empresa and imo.id_filial = lote.id_local  and imo.codigo = lote.id_imobilizado
go
select imo.* from imobilizadosinventarios imo
inner join exclusao_em_lote lote 
    on imo.id_empresa = lote.id_empresa and imo.id_filial = lote.id_local and imo.id_inventario = lote.id_inventario and imo.id_imobilizado = lote.id_imobilizado
go
select lanca.* from lancamentos lanca
inner join exclusao_em_lote lote 
    on lanca.id_empresa = lote.id_empresa and lanca.id_filial = lote.id_local and lanca.id_inventario = lote.id_inventario and lanca.id_imobilizado = lote.id_imobilizado
go


/* excluir */

DELETE FROM imobilizados
USING exclusao_em_lote
WHERE imobilizados.id_empresa = exclusao_em_lote.id_empresa
  AND imobilizados.id_filial = exclusao_em_lote.id_local
  AND imobilizados.codigo = exclusao_em_lote.id_imobilizado;
go

DELETE FROM lancamentos
USING exclusao_em_lote
WHERE lancamentos.id_empresa = exclusao_em_lote.id_empresa
  AND lancamentos.id_filial = exclusao_em_lote.id_local
  AND lancamentos.id_inventario = exclusao_em_lote.id_inventario
  AND lancamentos.id_imobilizado = exclusao_em_lote.id_imobilizado;
 go
 
 
DELETE FROM imobilizadosinventarios
USING exclusao_em_lote
WHERE imobilizadosinventarios.id_empresa = exclusao_em_lote.id_empresa
  AND imobilizadosinventarios.id_filial = exclusao_em_lote.id_local
  AND imobilizadosinventarios.id_inventario = exclusao_em_lote.id_inventario
  AND imobilizadosinventarios.id_imobilizado = exclusao_em_lote.id_imobilizado;
  


