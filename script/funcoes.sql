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
	  _fotos = _fotos + tempo.fotos;
	  
	  
 END LOOP;

select inv.descricao,inv.id_responsavel,coalesce(to_char(inv.data_encerra, 'DD/MM/YYYY'),'EM ABERTO') from public.inventarios inv into _descricao, id_usuario , _situacao
	  where inv.id_empresa = _id_empresa  and inv.id_filial = _id_local and  inv.codigo = _id_inventario; 
	  
select usu.razao from public.usuarios usu into _responsavel 
	  where usu.id_empresa = _id_empresa and usu.id = id_usuario; 

END;
$$
LANGUAGE 'plpgsql'
;
/*
select * from resumo_inventario(1,8,2)
*/


CREATE OR REPLACE FUNCTION "public"."call_change_inv" (
	in _id_empresa    int4, 
	in _id_local      int4, 
	in _id_inventario int4, 
	in _status        int4,
	out _qtd          int4
	) 
AS
$$
DECLARE

 tempo public.de_para%ROWTYPE;
 

BEGIN
_qtd := 0 ;
 FOR tempo in  
      SELECT *
      FROM  public.de_para depara
      WHERE depara.id_empresa        = _id_empresa 
	        and depara.id_local      = _id_local 
			and depara.id_inventario = _id_inventario
			and depara.status        = (_status-1)
      ORDER BY depara.id_empresa,depara.id_local,depara.id_inventario,depara.de
      LOOP  
	  if ((_status-1) = 0) then 

		delete from public.imobilizados
		where   id_empresa     = _id_empresa 
	       	and id_filial      = _id_local 
			and codigo         =  tempo.de;
			
        update lancamentos set id_imobilizado = tempo.para 
		where  id_empresa     = _id_empresa 
	        and id_filial      = _id_local 
			and id_inventario  = _id_inventario
			and id_imobilizado = tempo.de;

		update de_para set status = 1
        where   id_empresa    = _id_empresa 
	        and id_local      = _id_local 
			and id_inventario = _id_inventario
			and de            =  tempo.de;

        _qtd := _qtd + 1;

	  end if;

	  if ((_status-1) =  1) then 
        
		delete from public.imobilizadosinventarios 
	    where   id_empresa    =  _id_empresa 
	       	and id_filial      = _id_local 
			and id_inventario  = _id_inventario
			and id_imobilizado =  tempo.de;

		update de_para set status = 2
        where   id_empresa    = _id_empresa 
	        and id_local      = _id_local 
			and id_inventario = _id_inventario
			and de            =  tempo.de;

        _qtd := _qtd + 1;

	  end if;

	  if ((_status-1) =  2) then 
        		
		update fotos set id_imobilizado = tempo.para , file_name = REPLACE(FILE_NAME,LPAD(tempo.de::text, 6, '0'),LPAD(tempo.para::text, 6, '0'))
		where  id_empresa      = _id_empresa 
	        and id_local       = _id_local 
			and id_inventario  = _id_inventario
			and id_imobilizado = tempo.de;


		update de_para set status = 3
        where   id_empresa    = _id_empresa 
	        and id_local      = _id_local 
			and id_inventario = _id_inventario
			and de            =  tempo.de;

        _qtd := _qtd + 1;

	  end if;
	  	  
 END LOOP;


END;
$$
LANGUAGE 'plpgsql'
/*
select * from de_para
select * from call_change_inv(1,14,10,3)
	
select * from fotos foto
inner join de_para de on 
                de.id_empresa     = foto.id_empresa 
	        and de.id_local       = foto.id_local 
			and de.id_inventario  = foto.id_inventario
			and de.para = foto.id_imobilizado;


select * 
from de_para depara
inner join imobilizadosinventarios dp_de on 
                dp_de.id_empresa     = depara.id_empresa 
	        and dp_de.id_filial      = depara.id_local 
			and dp_de.id_inventario  = depara.id_inventario
			and dp_de.id_imobilizado = depara.de

			*/




CREATE OR REPLACE FUNCTION public.realocar(_id_empresa integer, _id_local integer, _id_inventario integer, _status integer, OUT _qtd integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE

 tempo public.realoc_transf%ROWTYPE;
 
 proximo INT4;
 

BEGIN
_qtd := 0 ;
 FOR tempo in  
      SELECT *
      FROM  public.realoc_transf realoc
      WHERE     realoc.id_empresa    = _id_empresa 
	        and realoc.id_local      = _id_local 
			and realoc.id_inventario = _id_inventario
			and realoc.status        = (_status-1)
      ORDER BY realoc.id_empresa,realoc.id_local,realoc.id_inventario,realoc.id_realocado
      LOOP  
	  if ((_status-1) = 0) then 

        select coalesce(max(codigo),0) from imobilizados where id_empresa = _id_empresa and id_filial = _id_local into proximo ;
        
        proximo := proximo + 1;
        
        update  imobilizados 
        set     codigo = proximo
		where   id_empresa     = _id_empresa 
	       	and id_filial      = _id_local 
			and codigo         =  tempo.id_realocado;
			
	    update nfes
        set id_imobilizado     = proximo 
		where  id_empresa      = _id_empresa 
	        and id_filial      = _id_local 
			and id_imobilizado = tempo.id_realocado  ;
			
		update valores
        set id_imobilizado     = proximo 
		where  id_empresa      = _id_empresa 
	        and id_filial      = _id_local 
			and id_imobilizado = tempo.id_realocado;
			
	    update  imobilizadosinventarios	
	    set     id_imobilizado   = proximo
		where   id_empresa       = _id_empresa 
	       	and id_filial        = _id_local 
	       	and id_inventario    = _id_inventario
			and id_imobilizado   =  tempo.id_realocado;
			
        update lancamentos 
        set id_imobilizado     = proximo
		where  id_empresa      = _id_empresa 
	        and id_filial      = _id_local 
			and id_inventario  = _id_inventario
			and id_imobilizado = tempo.id_realocado;
			
		update fotos 
        set id_imobilizado     = proximo,
		    file_name = REPLACE(FILE_NAME,LPAD(tempo.id_realocado::text, 6, '0'),LPAD(proximo::text, 6, '0'))
		where  id_empresa      = _id_empresa 
	        and id_local       = _id_local 
			and id_inventario  = _id_inventario
			and id_imobilizado = tempo.id_realocado;
  
        update realoc_transf
               set novo_realocado  = proximo, 
               status = 1
        where id_empresa        = _id_empresa 
	        and id_local        = _id_local 
			and id_inventario   = _id_inventario
			and id_realocado    = tempo.id_realocado
			and id_transferido  = tempo.id_transferido;       
			
        _status := 2;
        
	  end if;
	  
	  if ((_status-1) = 1) then 
  
        update  imobilizados 
        set     codigo         = tempo.id_realocado
		where   id_empresa     = _id_empresa 
	       	and id_filial      = _id_local 
			and codigo         =  tempo.id_transferido;
			
	    update nfes
        set id_imobilizado = tempo.id_realocado 
		where  id_empresa      = _id_empresa 
	        and id_filial      = _id_local 
			and id_imobilizado = tempo.id_transferido;
			
		update valores
        set id_imobilizado     = tempo.id_realocado 
		where  id_empresa      = _id_empresa 
	        and id_filial      = _id_local 
			and id_imobilizado = tempo.id_transferido;
			
	    update  imobilizadosinventarios	
	    set     id_imobilizado   = tempo.id_realocado 
		where   id_empresa       = _id_empresa 
	       	and id_filial        = _id_local 
	       	and id_inventario    = _id_inventario
			and id_imobilizado   =  tempo.id_transferido;
			
        update lancamentos 
        set id_imobilizado     = tempo.id_realocado 
		where  id_empresa      = _id_empresa 
	        and id_filial      = _id_local 
			and id_inventario  = _id_inventario
			and id_imobilizado = tempo.id_transferido;
			
		update fotos 
        set id_imobilizado     = tempo.id_realocado ,
		    file_name = REPLACE(FILE_NAME,LPAD(tempo.id_transferido::text, 6, '0'),LPAD(tempo.id_realocado::text, 6, '0'))
		where  id_empresa      = _id_empresa 
	        and id_local       = _id_local 
			and id_inventario  = _id_inventario
			and id_imobilizado = tempo.id_transferido;

        update realoc_transf
        set   status = 2
        where id_empresa        = _id_empresa 
	        and id_local        = _id_local 
			and id_inventario   = _id_inventario
			and id_realocado    = tempo.id_realocado;
			
        _qtd := _qtd + 1;
        
        _status := 2;

	  end if;

	  	  
 END LOOP;


END;
$function$
;
go

--select * from realocar(1,14,10,1);
--go


--2697 - Vai para o final

--5853 - Vai para o 2697

--select * from realoc_transf
--delete from realoc_transf
--insert into realoc_transf values(1,14,10,2697,5853,0,0,016,0);


--select * from fotos where id_empresa = 1 and id_local = 14 and id_inventario = 10 and id_imobilizado = 2697