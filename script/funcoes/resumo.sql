-- DROP FUNCTION public.resumo_inventario(in int4, in int4, in int4, out text, out text, out text, out int4, out int4, out int4, out int4, out int4, out int4, out int4, out int4, out int4, out int4);

CREATE OR REPLACE FUNCTION public.resumo_inventario(_id_empresa integer, _id_local integer, _id_inventario integer, OUT _descricao text, OUT _responsavel text, OUT _situacao text, OUT _total_ativos integer, OUT _total_inventariados integer, OUT _situacao_0 integer, OUT _situacao_1 integer, OUT _situacao_2 integer, OUT _situacao_3 integer, OUT _situacao_4 integer, OUT _situacao_5 integer, OUT _situacao_6 integer, OUT _fotos integer)
 RETURNS record
 LANGUAGE plpgsql
AS $function$
DECLARE

 tempo public.imobilizadosinventarios%ROWTYPE;
 
 id_usuario int4;

BEGIN
id_usuario := 0;
_descricao := '';
_responsavel := '';
_situacao := '';
_total_ativos  := 0;
_total_inventariados := 0;
_situacao_0 := 0;
_situacao_1 := 0;
_situacao_2 := 0;
_situacao_3 := 0;
_situacao_4 := 0;
_situacao_5 := 0;
_situacao_6 := 0;
_fotos      := 0;
 FOR tempo in  
      SELECT *
      FROM  public.imobilizadosinventarios imo
      inner join imobilizados i on i.id_empresa = imo.id_empresa and imo.id_filial = i.id_filial and imo.id_imobilizado = i.codigo
      WHERE imo.id_empresa = _id_empresa and imo.id_filial = _id_local and  imo.id_inventario = _id_inventario 
      ORDER BY imo.id_empresa,imo.id_filial,imo.id_inventario,imo.id_imobilizado
      LOOP  
	  
	  _total_ativos := _total_ativos + 1;
	  
	  if (tempo.status <> 0) then
	    _total_inventariados := _total_inventariados + 1;
	  else 
	    _situacao_0 :=  _situacao_0  + 1;
	  end if;
	  if (tempo.status = 1) then
	    _situacao_1 := _situacao_1 + 1;
	  end if;
	  if (tempo.status = 2) then
	    _situacao_2 := _situacao_2 + 1;
	  end if;
	  if (tempo.status = 3) then
	    _situacao_3 := _situacao_3 + 1;
	  end if;
	  if (tempo.status = 4) then
	    _situacao_4 := _situacao_4 + 1;
	  end if;
	  if (tempo.status = 5) then
	    _situacao_5 := _situacao_5 + 1;
	  end if;
	  if (tempo.status = 6) then
	    _situacao_6 := _situacao_6 + 1;
	  end if;
	  _fotos = _fotos + tempo.fotos;
	  	  
 END LOOP;

select inv.descricao,inv.id_responsavel,coalesce(to_char(inv.data_encerra, 'DD/MM/YYYY'),'EM ABERTO') from public.inventarios inv into _descricao, id_usuario , _situacao
	  where inv.id_empresa = _id_empresa  and inv.id_filial = _id_local and  inv.codigo = _id_inventario; 
	  
select usu.razao from public.usuarios usu into _responsavel 
	  where usu.id_empresa = _id_empresa and usu.id = id_usuario; 

END;
$function$
;
