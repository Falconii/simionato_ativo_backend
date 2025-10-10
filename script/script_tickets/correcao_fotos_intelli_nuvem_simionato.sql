
/*1eQuwNcfTmpYUWUIvlGBouodico8WrjoD
local = 14
inventario = 10

alter table fotos add column file_name_ex varchar(255) default ''

update fotos set file_name_ex = file_name 
where fotos.id_empresa = 1 and fotos.id_local = 14 and fotos.id_inventario = 10 and fotos.id_pasta = '1eQuwNcfTmpYUWUIvlGBouodico8WrjoD'

alter table arquivos_drive add column file_name_ex varchar(255) default ''

update arquivos_drive set file_name_ex = name_file

*/

WITH arquivos AS (
    SELECT
        arquivos_drive.id_file,
        arquivos_drive.name_file,
        ROW_NUMBER() OVER (PARTITION BY name_file ORDER BY name_file) AS posicao
    FROM arquivos_drive
)
UPDATE arquivos_drive
SET file_name_ex = CASE
    WHEN arquivos.posicao = 1 THEN arquivos.name_file
    ELSE regexp_replace(arquivos.name_file, '(\.png)$', '(' || (arquivos.posicao - 1) || ')\1')
END
FROM arquivos
WHERE arquivos.id_file = arquivos_drive.id_file

WITH arquivos AS (
    select
    fotos.id_empresa,
    fotos.id_local,
    fotos.id_inventario,
    fotos.id_imobilizado,
    fotos.id_pasta,
    fotos.id_file,
    fotos.file_name,
    fotos.file_name_ex
    from fotos where fotos.id_empresa = 1 and fotos.id_local = 14 and fotos.id_inventario = 10 and fotos.id_pasta = '1eQuwNcfTmpYUWUIvlGBouodico8WrjoD'
    and fotos.file_name like '%camera_foto%'
)
SELECT
    id_empresa,
    id_local,
    id_inventario,
    id_imobilizado
    id_pasta,
    id_file,
    file_name
    file_name_ex
FROM arquivos;


WITH arquivos AS (
    select
    fotos.id_empresa,
    fotos.id_local,
    fotos.id_inventario,
    fotos.id_imobilizado,
    fotos.id_pasta,
    fotos.id_file,
    fotos.file_name,
    fotos.file_name_ex
    from fotos where fotos.id_empresa = 1 and fotos.id_local = 14 and fotos.id_inventario = 10 and fotos.id_pasta = '1eQuwNcfTmpYUWUIvlGBouodico8WrjoD'
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





select fotos.id_imobilizado,fotos.file_name,fotos.file_name_ex
from fotos 
     --and fotos.file_name like '%camera_foto%'
--inner join arquivos_drive arquivos on arquivos.id_file = fotos.id_file
where fotos.id_empresa = 1 and fotos.id_local = 14 and fotos.id_inventario = 10 and fotos.id_pasta = '1eQuwNcfTmpYUWUIvlGBouodico8WrjoD' --and trim(fotos.file_name) <> trim(arquivos.name_file)
order by fotos.id_imobilizado


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

select  * from arquivos_drive order by name_file


WITH arquivos AS (
    SELECT
        arquivos_drive.id_file,
        arquivos_drive.file_name_ex
    FROM arquivos_drive
)
UPDATE fotos SET file_name_ex = arquivos.file_name_ex
FROM arquivos
WHERE 
   fotos.id_empresa = 1 and fotos.id_local = 14 and fotos.id_inventario = 10 and fotos.id_pasta = '1eQuwNcfTmpYUWUIvlGBouodico8WrjoD' and fotos.id_file = arquivos.id_file


select id_imobilizado,substring(file_name_ex,18,6),file_name_ex from fotos where 
   fotos.id_empresa = 1 and fotos.id_local = 14 and fotos.id_inventario = 10 and fotos.id_pasta = '1eQuwNcfTmpYUWUIvlGBouodico8WrjoD' 
order by id_imobilizado

