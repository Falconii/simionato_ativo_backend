
CREATE OR REPLACE FUNCTION public.function_de_para()
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
		           values(new.id_empresa,new.id_local,new.id_inventario,new.de,hoje,'insert','de_para',new.id_usuario,histo_old,histo_atual,new.user_insert,0);  
		   
       RETURN NEW;
   ELSEIF (TG_OP = 'UPDATE') THEN
       hoje = NOW();

       histo_old   = json_agg(old.*);
       histo_atual = json_agg(new.*);
       insert into auditorias(id_empresa,id_filial,id_inventario,id_imobilizado,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		           values(new.id_empresa,new.id_local,new.id_inventario,new.de,hoje,'update','de_para',new.id_usuario,histo_old,histo_atual,old.user_insert,old.user_update);  
		   
       RETURN NEW;
   ELSIF  (TG_OP = 'DELETE') THEN 
       hoje = NOW();

       histo_old   = json_agg(old.*);
       histo_atual = '';
       insert into auditorias(id_empresa,id_filial,id_inventario,id_imobilizado,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		           values(old.id_empresa,old.id_local,old.id_inventario,old.de,hoje,'delete','de_para',old.id_usuario,histo_old,histo_atual,old.user_insert,old.user_update);  
		   
       RETURN OLD;
   END IF;
   RETURN NULL;
END ;
$function$
;


create trigger trigger_de_para after
insert
    or
delete
    or
update
    on
    public.de_para for each row execute function function_de_para()