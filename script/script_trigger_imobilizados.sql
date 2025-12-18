-- DROP FUNCTION public.function_imobilizados();

CREATE OR REPLACE FUNCTION public.function_imobilizados()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE 
 histo_old text;
 histo_atual text;
 hoje    TIMESTAMP;
BEGIN
    IF    (TG_OP = 'INSERT') THEN
       hoje = NOW();

       histo_old   = '';
       histo_atual = json_agg(new.*);

       insert into auditorias(id_empresa,id_filial,id_inventario,id_imobilizado,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		           values(new.id_empresa,new.id_filial,0,new.codigo,hoje,'insert','imobilizados',new.user_insert,histo_old,histo_atual,new.user_insert,0);  
		   
       RETURN NEW;
   ELSEIF (TG_OP = 'UPDATE') THEN
       hoje = NOW();

       histo_old   = json_agg(old.*);
       histo_atual = json_agg(new.*);

       IF (new.user_update = 0) then
           new.user_update := new.user_insert;
       end if;

       insert into auditorias(id_empresa,id_filial,id_inventario,id_imobilizado,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		           values(new.id_empresa,new.id_filial,0,new.codigo,hoje,'update','imobilizados',new.user_update,histo_old,histo_atual,new.user_insert,new.user_update);   
		   
       RETURN NEW;
   ELSIF  (TG_OP = 'DELETE') THEN 
       hoje = NOW();
       
       cd back  
       
       histo_old   = json_agg(old.*);
       histo_atual = '';
       insert into auditorias(id_empresa,id_filial,id_inventario,id_imobilizado,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		           values(old.id_empresa,old.id_filial,0,old.codigo,hoje,'delete','imobilizados',old.user_update,histo_old,histo_atual,old.user_insert,old.user_update);  
		   
       RETURN OLD;
   END IF;
   RETURN NULL;
END ;
$function$
;
go

drop trigger trigger_imobilizados;

create trigger trigger_imobilizados after
insert
    or
delete
    or
update
    on
    public.imobilizados for each row execute function function_imobilizados();
