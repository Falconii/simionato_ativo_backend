CREATE OR REPLACE FUNCTION "public"."resumo_inventario" (
	in _id_empresa int4, 
	in _id_local int4, 
	in _id_inventario int4, 
	out _descricao text,
	out _responsavel text,
	out _situacao text,
	out _total_ativos int4 , 
	out _total_inventariados int4,
	out _situacao_0 int4,
	out _situacao_1 int4,
	out _situacao_2 int4,
	out _situacao_3 int4,
	out _situacao_4 int4,
	out _situacao_5 int4,
	out _fotos      int4
	) 
AS
$$
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
_fotos      := 0;
 FOR tempo in  
      SELECT *
      FROM  public.imobilizadosinventarios imo
      WHERE imo.id_empresa = _id_empresa and imo.id_filial = _id_local and  imo.id_inventario = _id_inventario 
      ORDER BY imo.id_empresa,imo.id_filial,imo.id_inventario,imo.id_imobilizado
      LOOP  
	  
	  _total_ativos := _total_ativos + 1;
	  
	  if (tempo.status <> 0) then
	    _total_inventariados := _total_inventariados + 1;
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
	  _fotos = _fotos + tempo.fotos;
	  
	  select inv.descricao,inv.id_responsavel,coalesce(to_char(inv.data_encerra, 'DD/MM/YYYY'),'EM ABERTO') from public.inventarios inv into _descricao, id_usuario , _situacao
	  where inv.id_empresa = _id_empresa  and inv.id_filial = _id_local and  inv.codigo = _id_inventario; 
	  
	  select usu.razao from public.usuarios usu into _responsavel 
	  where usu.id_empresa = _id_empresa and usu.id = id_usuario; 
	  
 END LOOP;
 raise notice 'FIM ';
END;
$$
LANGUAGE 'plpgsql'
;
select * from resumo_inventario(1,8,2)
