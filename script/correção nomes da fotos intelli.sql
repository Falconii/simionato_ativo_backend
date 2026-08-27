select distinct cli.razao,cli.fantasi
from projetos proj
inner join clientes cli on cli.id_empresa = proj.id_empresa and cli.id = proj.id_cliente
inner join  public.grupos_eco gru on gru.id_empresa = cli.id_empresa and gru.id =  cli.gru_econo
where proj.horasexec > 0 and gru.id = 55


//Horas por grupos
select distinct cli.razao,cli.fantasi
from projetos proj
inner join clientes cli on cli.id_empresa = proj.id_empresa and cli.id = proj.id_cliente
inner join  public.grupos_eco gru on gru.id_empresa = cli.id_empresa and gru.id =  cli.gru_econo
where proj.horasexec > 0 and gru.id = 55


SELECT * FROM CLIENTES WHERE gru_econo = 55

drop database ativo_descarte

create database ativo_descarte

//gatilho id_imobilizado <> google_drive
select fotos.*  from 
(
    select fo.*
    from fotos fo 
    inner join lancamentos lan on lan.id_empresa = fo.id_empresa and lan.id_filial = fo.id_local and lan.id_inventario = fo.id_inventario 
               and lan.id_imobilizado = fo.id_imobilizado
    where fo.id_empresa = 1 and fo.id_local = 15 and fo.id_inventario = 11 ) as  fotos
inner join fotos_drive google on google.id_file = fotos.id_file
where fotos.id_imobilizado <>  extrair_ativo_arquivo(google.name_file) limit 1 

select fotos.id_local,extrair_local_arquivo(google.name_file),fotos.file_name as fotos_name,google.name_file as google_name from 
(
    select fo.*
    from fotos fo 
    inner join lancamentos lan on lan.id_empresa = fo.id_empresa and lan.id_filial = fo.id_local and lan.id_inventario = fo.id_inventario 
               and lan.id_imobilizado = fo.id_imobilizado
    where fo.id_empresa = 1 and fo.id_local = 15 and fo.id_inventario = 11  ) as  fotos
inner join fotos_drive google on google.id_file = fotos.id_file
where fotos.id_local <>  extrair_local_arquivo(google.name_file)


select *
    from  public.fotos_drive drive
    where drive.id_empresa = 1 and drive.id_local = 15 and drive.id_inventario = 11 and folder_id = ''


DROP FUNCTION extrair_ativo_arquivo(text)

CREATE OR REPLACE FUNCTION extrair_ativo_arquivo(nome_arquivo text)
RETURNS int4 AS $$
DECLARE
    partes text[];
BEGIN
    partes := string_to_array(split_part(nome_arquivo, '.', 1), '_');

    partes[4] := (partes[4]::int4); -- converte para int e volta para texto

    RETURN partes[4];
END;
$$ LANGUAGE plpgsql IMMUTABLE;
go

CREATE OR REPLACE FUNCTION extrair_empresa_arquivo(nome_arquivo text)
RETURNS text[] AS $$
DECLARE
    partes text[];
BEGIN
    partes := string_to_array(split_part(nome_arquivo, '.', 1), '_');

    partes[1] := (partes[1]::int4)::text; -- converte para int e volta para texto

    RETURN partes[1:1];
END;
$$ LANGUAGE plpgsql IMMUTABLE;
go



CREATE OR REPLACE FUNCTION extrair_local_arquivo(nome_arquivo text)
RETURNS int4 AS $$
DECLARE
    partes text[];
BEGIN
    partes := string_to_array(split_part(nome_arquivo, '.', 1), '_');

    partes[2] := partes[2]::int4;

    RETURN partes[2];
END;
$$ LANGUAGE plpgsql IMMUTABLE;
go


CREATE OR REPLACE FUNCTION extrair_inventario_arquivo(nome_arquivo text)
RETURNS text[] AS $$
DECLARE
    partes text[];
BEGIN
    partes := string_to_array(split_part(nome_arquivo, '.', 1), '_');

    partes[3] := (partes[3]::int4)::text; -- converte para int e volta para texto

    RETURN partes[1:3];
END;
$$ LANGUAGE plpgsql IMMUTABLE;
go





CREATE OR REPLACE FUNCTION extrair_info_arquivo(nome_arquivo text)
RETURNS TABLE (
    empresa int4,
    local int4,
    inventario int4,
    codigo_produto int4
) AS $$
DECLARE
    partes text[];
BEGIN
    -- separa antes da extensão e divide pelos "_"
    partes := string_to_array(split_part(nome_arquivo, '.', 1), '_');

    empresa        := partes[1]::int4;
    local          := partes[2]::int4;
    inventario     := partes[3]::int4;
    codigo_produto := partes[4]::int4;

    RETURN;
END;
$$ LANGUAGE plpgsql IMMUTABLE;


select * from imobilizados where codigo = 2654

select   
                           imo.id_empresa as  id_empresa  
                        ,  imo.id_filial as  id_filial  
                        ,  imo.codigo as  codigo  
                        ,  imo.descricao as  descricao  
                        ,  imo.cod_grupo as  cod_grupo  
                        ,  imo.cod_cc as  cod_cc  
                        ,  imo.nfe as  nfe  
                        ,  imo.serie as  serie  
                        ,  imo.item as  item  
                        ,  imo.origem  as origem
            ,  imo.principal  as principal
            ,  imo.condicao  as condicao
            ,  imo.apelido  as apelido
                        ,  imo.user_insert as  user_insert  
                        ,  imo.user_update as  user_update  
                        ,  gru.descricao as  grupo_descricao  
                        ,  cc.descricao as  cc_descricao  
                        ,  coalesce(nfe.razao_fornecedor,'') as  forne_razao    
            ,  coalesce(prin.descricao,'')       as prin_descricao
                        FROM imobilizados imo     
                                 inner join grupos gru on gru.id_empresa = imo.id_empresa and gru.id_filial = imo.id_filial and gru.codigo= imo.cod_grupo
                                 inner join centroscustos cc on cc.id_empresa = imo.id_empresa and cc.id_filial = imo.id_filial and cc.codigo = imo.cod_cc   
                                 left  join nfes nfe on nfe.id_empresa = imo.id_empresa and nfe.id_filial = imo.id_filial and nfe.id_imobilizado = imo.codigo   
                 left  join principais prin on prin.id_empresa = imo.id_empresa and prin.id_filial = imo.id_filial and prin.codigo = imo.principal  
                         where imo.id_empresa = 1 and  imo.id_filial = 15 and  imo.codigo = 2654  

select   
                           imo_inv.id_empresa as  id_empresa  
                        ,  imo_inv.id_filial as  id_filial  
                        ,  imo_inv.id_inventario as  id_inventario  
                        ,  imo_inv.id_imobilizado as  id_imobilizado  
                        ,  imo_inv.id_lanca as  id_lanca  
                        ,  imo_inv.status as  status  
                        ,  imo_inv.new_codigo as  new_codigo  
                        ,  imo_inv.new_cc as  new_cc  
      ,  imo_inv.condicao as  condicao 
      ,  imo_inv.book     as  book
                        ,  imo_inv.user_insert as  user_insert  
                        ,  imo_inv.user_update as  user_update  
                        ,  imo.descricao as  imo_descricao  
      ,  imo.cod_cc    as  imo_cod_cc
      ,  imo.cod_grupo as  imo_cod_grupo 
      ,  imo.nfe           as imo_nfe 
      ,  imo.serie         as imo_serie 
      ,  imo.item          as imo_item  
      ,  imo.origem        as imo_origem
      ,  imo.principal     as imo_principal
      ,  imo.apelido       as imo_apelido
                        ,  cc.descricao as  cc_descricao  
                        ,  gru.descricao as  grupo_descricao  
                        ,  coalesce(lanca.id_usuario,0) as  lanc_id_usuario  
                        ,  coalesce(lanca.obs,'') as  lanc_obs 
                        ,  coalesce(to_char(lanca.dtlanca, 'DD/MM/YYYY'),'') as  lanc_dt_lanca 
                        ,  coalesce(lanca.estado,0) as  lanc_estado    
                        ,  coalesce(usu.razao,'') as  usu_razao     
      ,  coalesce(new_cc.descricao,'') as  new_cc_descricao 
      ,  coalesce(princ.descricao,'')  as  princ_descricao 
      ,  coalesce(de.para,0)             as  para_ativo
      ,  coalesce(de.status,0)         as  para_status
      ,  coalesce(para.de,0)           as  de_ativo
      ,  coalesce(para.status,0)       as  de_status
                        FROM imobilizadosinventarios imo_inv      
                                 inner join imobilizados  imo on imo.id_empresa = imo_inv.id_empresa and imo.id_filial = imo_inv.id_filialand imo.codigo = imo_inv.id_imobilizado
                                 inner join centroscustos cc  on cc.id_empresa = imo_inv.id_empresa and cc.id_filial = imo_inv.id_filial and cc.codigo = imo.cod_cc
                                 inner join grupos gru    on  gru.id_empresa = imo_inv.id_empresa and gru.id_filial = imo_inv.id_filial and gru.codigo = imo.cod_grupo
                                 left join  lancamentos   lanca on lanca.id_empresa = imo_inv.id_empresa and lanca.id_filial = imo_inv.id_filial and lanca.id_inventario = imo_inv.id_inventario and lanca.id_imobilizado = imo_inv.id_imobilizado and imo_inv.id_lanca = lanca.id_lanca   
         left join de_para        de    on de.id_empresa = imo_inv.id_empresa and de.id_local = imo_inv.id_filial and de.id_inventario = imo_inv.id_inventario and de.de = imo_inv.id_imobilizado
         left join de_para        para  on para.id_empresa = imo_inv.id_empresa and para.id_local = imo_inv.id_filial and para.id_inventario = imo_inv.id_inventario and para.para = imo_inv.id_imobilizado 
         left join usuarios       usu   on usu.id_empresa = imo_inv.id_empresa and usu.id = lanca.id_usuario
         left join centroscustos new_cc on new_cc.id_empresa = imo_inv.id_empresa and new_cc.id_filial = imo_inv.id_filial and new_cc.codigo = imo_inv.new_cc
         left join principais princ  on imo.id_empresa = princ.id_empresa and imo.id_filial = princ.id_filial and imo.principal = princ.codigo
                         where imo_inv.id_empresa = 1 and  imo_inv.id_filial = 15 and  imo_inv.id_inventario = 11 and  imo_inv.id_imobilizado = 2654  









