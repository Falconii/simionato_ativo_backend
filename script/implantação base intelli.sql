/*

  Local 15
  
  Inventario 11

*/
select * from principais pr where pr.id_empresa = 1 and pr.id_filial = 15 

select * from imobilizados imo where imo.id_empresa = 1 and imo.id_filial = 15 AND origem = 'P'
go

select * from imobilizadosinventarios imo where imo.id_empresa = 1 and imo.id_filial = 15 and id_inventario = 11 and id_lanca <> 0 order by id_imobilizado
go

select inv.id_imobilizado,imo.codigo
from imobilizadosinventarios inv 
left join imobilizados imo on imo.id_empresa = inv.id_empresa and imo.id_filial = inv.id_filial and imo.codigo = inv.id_imobilizado
where inv.id_empresa = 1 and inv.id_filial = 15 and inv.id_inventario = 11 --and imo.codigo is null
order by inv.id_imobilizado
go
select lan.id_imobilizado,imo.codigo
from lancamentos lan 
left join imobilizados imo on imo.id_empresa = lan.id_empresa and imo.id_filial = lan.id_filial and imo.codigo = lan.id_imobilizado
where lan.id_empresa = 1 and lan.id_filial = 15 and lan.id_inventario = 11 and imo.codigo is null
go
select distinct fo.id_imobilizado--,imo.codigo,fo.*
from fotos fo
left join imobilizados imo on imo.id_empresa = fo.id_empresa and imo.id_filial = fo.id_local and fo.id_imobilizado = imo.codigo
where fo.id_empresa = 1 and fo.id_local = 15 and fo.id_inventario = 11 and imo.codigo is null
go

select * 
from imobilizados
where imobilizados.id_empresa = 1 and imobilizados.id_filial = 15 and (codigo in (
        1560,
        1565,
        2120,
        9038,
        900001,
        900002,
        900003,
        900004,
        900005,
        900006,
        900007,
        900008,
        900009,
        900010,
        900011,
        900012,
        900013,
        900014,
        900015,
        900016,
        900017,
        900018,
        900019,
        900020,
        900021,
        900022,
        900023,
        900024,
        900025,
        900026,
        900027,
        900028,
        900029,
        900030,
        900031,
        900032,
        900033,
        900034,
        900035,
        900036,
        900037,
        900038,
        900039,
        900040,
        900041,
        900042,
        900043,
        900044,
        30000000,
        400000000,
        1000000000,
        2000000000
))
order by imobilizados.codigo


//7529
/* ação correção do banco
  //excluir  fotos
  delete 
  from fotos fo
  where fo.id_empresa = 1 and fo.id_local = 15 and fo.id_inventario = 11 and fo.id_imobilizado in (  
    100000,
    100002,
    100003,
    100004,
    100005,
    100006,
   5000000
  )
  //excluir lancamentos
  delete
  from lancamentos lan
  where lan.id_empresa = 1 and lan.id_filial = 15 and lan.id_inventario = 11 and lan.id_imobilizado in (  
    100000,
    100002,
    100003,
    100004,
    100005,
    100006,
   5000000
  )
  //excluir imobilizadosinventarios
  delete from imobilizadosinventarios inv where inv.id_empresa = 1 and inv.id_filial = 15 and inv.id_imobilizado in (
  100000,
  100002,
  100003,
  100004,
  100005,
  100006,
  5000000);
 update imobilizados set cod_cc = '4-21' where id_empresa = 1 and id_filial = 15 and codigo = 900001
*/
