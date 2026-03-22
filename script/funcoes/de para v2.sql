CREATE OR REPLACE FUNCTION public.de_para_v2(_id_empresa integer, _id_local integer, _id_inventario integer, _status integer, _id_usuario integer, _id_imobilizado integer, OUT _qtd integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE

 tempo public.de_para%ROWTYPE;

 _old_descricao text;
 _old_fotos int4;

BEGIN
 _qtd := 0 ;
 _old_descricao := '';
 _old_fotos := 0;
 FOR tempo in  
      SELECT *
      FROM  public.de_para depara
      WHERE depara.id_empresa        = _id_empresa 
	        and depara.id_local      = _id_local 
			and depara.id_inventario = _id_inventario
            and ( (_id_imobilizado = 0) or ((depara.de =_id_imobilizado)) )
			and depara.status        = (_status-1)
      ORDER BY depara.id_empresa,depara.id_local,depara.id_inventario,depara.de
      LOOP  
	  if ((_status-1) = 0) then 
        select coalesce(descricao,'Descrição Não Encontrada')  from imobilizados into _old_descricao where id_empresa = _id_empresa and id_filial = _id_local and codigo = tempo.de;
		delete from public.imobilizados
		where   id_empresa     = _id_empresa 
	       	and id_filial      = _id_local 
			and codigo         =  tempo.de;
			
        update lancamentos set id_imobilizado = tempo.para , user_update = _id_usuario
		where  id_empresa     = _id_empresa 
	        and id_filial      = _id_local 
			and id_imobilizado = tempo.de;

		update de_para set status = 1, de_descricao = _old_descricao
        where   id_empresa    = _id_empresa 
	        and id_local      = _id_local 
			and id_inventario = _id_inventario
			and de            =  tempo.de;

        _qtd := _qtd + 1;

	  end if;

	  if ((_status-1) =  1) then 
         select coalesce(fotos,0) from public.imobilizadosinventarios into _old_fotos
                            where   id_empresa    =  _id_empresa 
                                and id_inventario  = _id_inventario
                                and id_filial      = _id_local 
                                and id_inventario  = _id_inventario
                                and id_imobilizado =  tempo.de;
		delete from public.imobilizadosinventarios 
	    where   id_empresa    =  _id_empresa 
			and id_inventario  = _id_inventario
	       	and id_filial      = _id_local 
			and id_inventario  = _id_inventario
			and id_imobilizado =  tempo.de;

        update public.imobilizadosinventarios set user_update = _id_usuario , fotos = _old_fotos
	    where   id_empresa    =  _id_empresa 
			and id_inventario  = _id_inventario
	       	and id_filial      = _id_local 
			and id_inventario  = _id_inventario
			and id_imobilizado =  tempo.para;

		update de_para set status = 2 , user_update = _id_usuario
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


		update de_para set status = 3,  user_update = _id_usuario
        where   id_empresa    = _id_empresa 
	        and id_local      = _id_local 
			and id_inventario = _id_inventario
			and de            =  tempo.de;

        _qtd := _qtd + 1;

	  end if;
	  	  
 END LOOP;


END;
$function$
;

/*

select * from de_para_v2(1,15,11,3,200,0);

*/

