/*

local: 16

inventario: 12


*/


select * 
from   imobilizados imo
where  id_empresa = 1 and id_filial = 16 

select imo.codigo as codigo_antigo, invimo.new_codigo, imo.descricao, fo.file_name
from imobilizadosinventarios invimo
left join imobilizados imo on invimo.id_empresa = imo.id_empresa and invimo.id_filial = imo.id_filial  and invimo.id_imobilizado = imo.codigo
inner join fotos fo on fo.id_empresa = invimo.id_empresa and  fo.id_local = invimo.id_filial and  invimo.id_inventario = fo.id_inventario and  invimo.id_imobilizado = fo.id_imobilizado
where invimo.id_empresa = 1 and invimo.id_filial = 16 and invimo.id_inventario = 12  and imo.codigo is not null
order by 	invimo.id_empresa, invimo.id_filial, invimo.id_inventario,imo.codigo


	


select fo.file_name 
from fotos fo
inner join imobilizados imo  on imo.id_empresa = fo.id_empresa and imo.id_filial = fo.id_local and imo.codigo = fo.id_imobilizado
where fo.id_empresa = 1 and fo.id_local = 16 and fo.id_inventario = 12 
order by fo.id_imobilizado



select * from usuarios order by razao



select count(*)
from public.fotos 
where id_local = 14 and id_inventario = 10 

select count(*) from imobilizados 
where id_filial = 14

select count(*)
from imobilizadosinventarios
where id_filial = 14 and id_inventario = 10 


select count(*)
from  lancamentos
where id_filial = 14 and id_inventario = 10 


select id_imobilizado,count(*)  
from  fotos
where id_local = 14 and id_inventario = 10
group by id_imobilizado
order by  id_imobilizado



/*
validação e correção das fotos do inventario da coppersteel
*/

/*1eQuwNcfTmpYUWUIvlGBouodico8WrjoD
local = 14
inventario = 10
*/

select fotos.id_imobilizado,fotos.file_name,arquivos.name_file
from fotos 
     --and fotos.file_name like '%camera_foto%'
inner join arquivos_drive arquivos on arquivos.id_file = fotos.id_file
where fotos.id_empresa = 1 and fotos.id_local = 14 and fotos.id_inventario = 10 and fotos.id_pasta = '1eQuwNcfTmpYUWUIvlGBouodico8WrjoD' and trim(fotos.file_name) <> trim(arquivos.name_file)
order by id_imobilizado


select fotos.id_imobilizado,fotos.file_name,arquivos.name_file
from fotos 
     --and fotos.file_name like '%camera_foto%'
inner join arquivos_drive arquivos on arquivos.id_file = fotos.id_file
where fotos.id_empresa = 1 and fotos.id_local = 14 and fotos.id_inventario = 10 and fotos.id_pasta = '1eQuwNcfTmpYUWUIvlGBouodico8WrjoD' and substring(fotos.file_name,18,06) <> trim(substring(arquivos.name_file,18,06))
order by id_imobilizado


--group by left(fotos.file_name,23)

select * from imobilizadosinventarios limit 10

alter table fotos add file_name_ex varchar(255) default ''

WITH arquivos AS (
    select
    fotos.id_empresa,
    fotos.id_local,
    fotos.id_inventario,
    fotos.id_imobilizado,
    fotos.id_pasta,
    fotos.id_file,
    fotos.file_name,
    ROW_NUMBER() OVER (PARTITION BY file_name ORDER BY file_name) AS posicao
    from fotos where fotos.id_empresa = 1 and fotos.id_local = 14 and fotos.id_inventario = 10 and fotos.id_pasta = '1eQuwNcfTmpYUWUIvlGBouodico8WrjoD'
    and fotos.file_name like '%camera_foto%'
)
SELECT
    CASE
        WHEN posicao = 1 THEN file_name
        ELSE
            -- Insere o (n-1) antes da extensão
            regexp_replace(file_name, '(\.png)$', ' (' || (posicao - 1) || ')\1')
    END AS file_name_ajustado
FROM arquivos;

update fotos set file_name_ex = file_name 
where fotos.id_empresa = 1 and fotos.id_local = 14 and fotos.id_inventario = 10 and fotos.id_pasta = '1eQuwNcfTmpYUWUIvlGBouodico8WrjoD'

//corrige o nome dos arquivos
WITH arquivos AS (
    SELECT
        fotos.id_empresa,
        fotos.id_local,
        fotos.id_inventario,
        fotos.id_imobilizado,
        fotos.id_pasta,
        fotos.id_file,
        fotos.file_name,
        ROW_NUMBER() OVER (PARTITION BY file_name ORDER BY file_name) AS posicao
    FROM fotos
    WHERE id_empresa = 1
      AND id_local = 14
      AND id_inventario = 10
      AND id_pasta = '1eQuwNcfTmpYUWUIvlGBouodico8WrjoD'
      AND file_name LIKE '%camera_foto%'
)
UPDATE fotos
SET file_name_ex = CASE
    WHEN arquivos.posicao = 1 THEN arquivos.file_name
    ELSE regexp_replace(arquivos.file_name, '(\.png)$', '(' || (arquivos.posicao - 1) || ')\1')
END
FROM arquivos
WHERE fotos.id_empresa = arquivos.id_empresa
  AND fotos.id_local = arquivos.id_local
  AND fotos.id_inventario = arquivos.id_inventario
  AND fotos.id_imobilizado = arquivos.id_imobilizado
  AND fotos.id_pasta = arquivos.id_pasta
  AND fotos.id_file = arquivos.id_file
  AND fotos.file_name = arquivos.file_name;
  
  
  
 select fotos.file_name_ex
 from public.imobilizadosinventarios imo
 inner join  fotos fotos on fotos.id_empresa = 1 and fotos.id_local = 14 and fotos.id_inventario = 10 
       and fotos.id_pasta = '1eQuwNcfTmpYUWUIvlGBouodico8WrjoD' and fotos.id_imobilizado = imo.id_imobilizado
 where imo.id_empresa = 1 and imo.id_filial = 14 and imo.id_inventario = 10 
 order by fotos.id_imobilizado
 
 
 select fotos.*
 from public.imobilizadosinventarios imo
 inner join  fotos fotos on fotos.id_empresa = 1 and fotos.id_local = 14 and fotos.id_inventario = 10 
       and  fotos.id_imobilizado = imo.id_imobilizado
 where imo.id_empresa = 1 and imo.id_filial = 14 and imo.id_inventario = 10 and imo.id_imobilizado = 808133
 order by fotos.id_imobilizado,fotos.id_file
 
 CREATE TABLE arquivos_drive (
     id_file TEXT PRIMARY KEY,
     id_pasta TEXT NOT NULL,
	 name_file TEXT NOT NULL,
	 size TEXT NOT NULL,
	 data TEXT NOT NULL
);

select * from arquivos_drive 


