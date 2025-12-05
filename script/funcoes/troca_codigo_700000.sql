DROP TABLE IF EXISTS de_para_manuais;
CREATE TABLE Public.de_para_manuais (
		antigo int4    NOT NULL  , 
		novo   serial  NOT NULL  , 
		PRIMARY KEY(antigo) 
)

BEGIN;

ALTER SEQUENCE public.de_para_manuais_novo_seq RESTART WITH 700000;

INSERT INTO Public.de_para_manuais
SELECT codigo
FROM imobilizados i
WHERE i.id_empresa = 1
  AND i.id_filial = 14
  AND i.origem = 'M'
ORDER BY codigo;

-- Atualizar imobilizados
UPDATE public.imobilizados i
SET codigo = d.novo
FROM public.de_para_manuais d
WHERE i.codigo = d.antigo
  AND i.id_empresa = 1
  AND i.id_filial = 14;

-- Atualizar imobilizadosinventarios (somente inventário 10)
UPDATE public.imobilizadosinventarios ii
SET id_imobilizado = d.novo
FROM public.de_para_manuais d
WHERE ii.id_imobilizado = d.antigo
  AND ii.id_empresa = 1
  AND ii.id_filial = 14
  AND ii.id_inventario = 10;

-- Atualizar lancamentos (somente inventário 10)
UPDATE public.lancamentos l
SET id_imobilizado = d.novo
FROM public.de_para_manuais d
WHERE l.id_imobilizado = d.antigo
  AND l.id_empresa = 1
  AND l.id_filial = 14
  AND l.id_inventario = 10;

-- Atualizar fotos (somente inventário 10)
UPDATE public.fotos f
SET id_imobilizado = d.novo
FROM public.de_para_manuais d
WHERE f.id_imobilizado = d.antigo
  AND f.id_empresa = 1
  AND f.id_local = 14
  AND f.id_inventario = 10;

COMMIT;
-- Se algo der errado, use ROLLBACK em vez de COMMIT


--testes
/*

filial : 14 copper
inventario : 10



select i.codigo,dp.antigo from imobilizados i
inner join de_para_manuais dp on dp.novo = i.codigo
where i.id_empresa = 1 and i.id_filial = 14 and i.origem = 'M' order by codigo

select iv.id_imobilizado from imobilizadosinventarios iv
inner join imobilizados i on i.id_empresa = iv.id_empresa and i.id_filial = iv.id_filial and i.codigo = iv.id_imobilizado and i.origem = 'M'
where iv.id_empresa = 1 and iv.id_filial = 14 and iv.id_inventario = 10 order by iv.id_imobilizado

select * from lancamentos la
inner join imobilizados i on i.id_empresa = la.id_empresa and i.id_filial = la.id_filial and i.codigo = la.id_imobilizado and i.origem = 'M'
where la.id_empresa = 1 and la.id_filial = 14 and la.id_inventario = 10 order by la.id_imobilizado

select file_name from fotos f
inner join imobilizados i on i.id_empresa = f.id_empresa and i.id_filial = f.id_local and i.codigo = f.id_imobilizado and i.origem = 'M'
where f.id_empresa = 1 and f.id_local = 14 and f.id_inventario = 10 order by f.id_imobilizado

-- 1. Criar a tabela
CREATE TABLE Public.de_para_manuais (
    antigo INT4 NOT NULL,
    novo   SERIAL NOT NULL,
    PRIMARY KEY (antigo)
);



-- 2. Ajustar a sequência do campo SERIAL para iniciar em 700000
ALTER SEQUENCE public.de_para_manuais_novo_seq RESTART WITH 700000;

-- 3. Popular a tabela com os códigos vindos de imobilizados
INSERT INTO Public.de_para_manuais (antigo)
SELECT codigo
FROM imobilizados i
WHERE i.id_empresa = 1
  AND i.id_filial = 14
  AND i.origem = 'M'
ORDER BY codigo;

-- Atualizar a coluna codigo em imobilizados
UPDATE imobilizados i
SET codigo = d.novo
FROM Public.de_para_manuais d
WHERE i.codigo = d.antigo
  AND i.id_empresa = 1
  AND i.id_filial = 14;


SELECT ii.id_imobilizado AS id_antigo, d.novo AS id_novo
FROM public.imobilizadosinventarios ii
JOIN public.de_para_manuais d ON ii.id_imobilizado = d.antigo
WHERE ii.id_empresa = 1
  AND ii.id_filial = 14
  AND ii.id_inventario = 10
ORDER BY ii.id_imobilizado;

-- Atualizar a coluna id_imobilizado em imobilizadosinventarios
UPDATE public.imobilizadosinventarios ii
SET id_imobilizado = d.novo
FROM public.de_para_manuais d
WHERE ii.id_imobilizado = d.antigo
  AND ii.id_empresa = 1
  AND ii.id_filial = 14
  AND ii.id_inventario = 10;
  
  
SELECT l.id_imobilizado AS id_antigo, d.novo AS id_novo
FROM public.lancamentos l
JOIN public.de_para_manuais d ON l.id_imobilizado = d.antigo
WHERE l.id_empresa = 1
  AND l.id_filial = 14
  AND l.id_inventario = 10
ORDER BY l.id_imobilizado;


-- Atualizar a coluna id_imobilizado em lancamentos
UPDATE public.lancamentos l
SET id_imobilizado = d.novo
FROM public.de_para_manuais d
WHERE l.id_imobilizado = d.antigo
  AND l.id_empresa = 1
  AND l.id_filial = 14
  AND l.id_inventario = 10;
  
  
UPDATE public.fotos f
SET id_imobilizado = d.novo
FROM public.de_para_manuais d
WHERE f.id_imobilizado = d.antigo
  AND f.id_empresa = 1
  AND f.id_local = 14
  AND f.id_inventario = 10;

*/

/*

filial : 16 3 lagoas
inventario : 12

correção do nro novo dos não encontrados. inicio em 120005

*/


WITH seq AS (
    SELECT la.id_empresa,
           la.id_filial,
           la.id_inventario,
           la.id_imobilizado,
           ROW_NUMBER() OVER (ORDER BY la.id_imobilizado) + 120004 AS novo_codigo
    FROM public.lancamentos la
    inner join imobilizados imo on imo.id_empresa = la.id_empresa and imo.id_filial = la.id_filial and imo.codigo = la.id_imobilizado
    WHERE la.id_empresa = 1
      AND la.id_filial = 16
      AND la.id_inventario = 12
      AND la.estado = 5
)
UPDATE public.lancamentos l
SET new_codigo = s.novo_codigo
FROM seq s
WHERE l.id_empresa = s.id_empresa
  AND l.id_filial = s.id_filial
  AND l.id_inventario = s.id_inventario
  AND l.id_imobilizado = s.id_imobilizado;
