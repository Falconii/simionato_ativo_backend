/*

  Local 15
  
  Inventario 11

*/


select * from produtos where id_empresa = 1 and id_filial = 15 and id_principal <> 0
go
select * from principais where id_empresa = 1 and id_filial = 15
go
select * from imobilizados where id_empresa = 1 and id_filial = 15 and origem = 'P' and principal <> 0
go
select * from nfes where id_empresa = 1 and id_filial = 15
go
select * from valores where id_empresa = 1 and id_filial = 15
go
select * from grupos where id_empresa = 1 and id_filial = 15
go
select * from centroscustos where id_empresa = 1 and id_filial = 15
go
select * from imobilizadosinventarios where  id_empresa = 1 and id_filial = 15 and id_inventario = 11 and (id_imobilizado in (
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

/*

ação

delete  from produtos where id_empresa = 1 and id_filial = 15
go
delete  from principais where id_empresa = 1 and id_filial = 15
go
delete  from imobilizados where id_empresa = 1 and id_filial = 15 and origem = 'P'
go
delete  from nfes where id_empresa = 1 and id_filial = 15
go
delete  from valores where id_empresa = 1 and id_filial = 15
go
delete  from grupos where id_empresa = 1 and id_filial = 15
go
delete  from centroscustos where id_empresa = 1 and id_filial = 15
go
delete  from imobilizadosinventarios where  id_empresa = 1 and id_filial = 15 and id_inventario = 11 and not(id_imobilizado in (
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





*/

select * FROM imobilizados WHERE ID_FILIAL = 15 AND CODIGO = 6530