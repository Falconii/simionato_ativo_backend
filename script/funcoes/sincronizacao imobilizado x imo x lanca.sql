/*

  sincronizando imobilizados, imoinventario e lancamentos
  
  filial 15
  inventario 11

*/


select * from imobilizados where id_empresa = 1 and id_filial = 15  order by codigo


select * from imobilizadosinventarios  i 
left join imobilizados imo on imo.id_empresa = i.id_empresa and imo.id_filial = i.id_filial and imo.codigo = i.id_imobilizado
where i.id_empresa = 1 and i.id_filial = 15 and i.id_inventario = 11 and imo.codigo is null


select * from lancamentos  l 
left join imobilizados imo on imo.id_empresa = l.id_empresa and imo.id_filial = l.id_filial and imo.codigo = l.id_imobilizado
where l.id_empresa = 1 and l.id_filial = 15 and l.id_inventario = 11 and imo.codigo is null
/* ImoInventarios */
/* select */
SELECT i.id_imobilizado, i.id_empresa, i.id_filial, i.id_inventario
FROM imobilizadosinventarios i
WHERE i.id_empresa = 1
  AND i.id_filial = 15
  AND i.id_inventario = 11
  AND NOT EXISTS (
    SELECT 1
    FROM imobilizados imo
    WHERE imo.id_empresa = i.id_empresa
      AND imo.id_filial = i.id_filial
      AND imo.codigo = i.id_imobilizado
  );
/* Exclusão */
DELETE FROM imobilizadosinventarios i
WHERE i.id_empresa = 1
  AND i.id_filial = 15
  AND i.id_inventario = 11
  AND NOT EXISTS (
    SELECT 1
    FROM imobilizados imo
    WHERE imo.id_empresa = i.id_empresa
      AND imo.id_filial = i.id_filial
      AND imo.codigo = i.id_imobilizado
  );

/* Lançamentos */
SELECT l.*
FROM lancamentos l
WHERE l.id_empresa = 1
  AND l.id_filial = 15
  AND l.id_inventario = 11
  AND NOT EXISTS (
    SELECT 1
    FROM imobilizados imo
    WHERE imo.id_empresa = l.id_empresa
      AND imo.id_filial = l.id_filial
      AND imo.codigo = l.id_imobilizado
  );
  
 
 DELETE FROM lancamentos l
WHERE l.id_empresa = 1
  AND l.id_filial = 15
  AND l.id_inventario = 11
  AND NOT EXISTS (
    SELECT 1
    FROM imobilizados imo
    WHERE imo.id_empresa = l.id_empresa
      AND imo.id_filial = l.id_filial
      AND imo.codigo = l.id_imobilizado
  );