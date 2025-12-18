-- DROP FUNCTION public.function_lancamento();

CREATE OR REPLACE FUNCTION public.function_lancamento()
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
       update public.imobilizadosinventarios set id_lanca  = NEW.id_lanca, new_codigo = new.new_codigo, new_cc = new.new_cc , status = NEW.estado, condicao = NEW.condicao, book = NEW.book
       where id_empresa = new.id_empresa and id_filial = new.id_filial and id_inventario = new.id_inventario and id_imobilizado = new.id_imobilizado;

       histo_old   = '';
       histo_atual = json_agg(new.*);
       insert into auditorias(id_empresa,id_filial,id_inventario,id_imobilizado,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		           values(new.id_empresa,new.id_filial,new.id_inventario,new.id_imobilizado,hoje,'insert','lancamentos',new.id_usuario,histo_old,histo_atual,16,0);  
		   
       RETURN NEW;
   ELSEIF (TG_OP = 'UPDATE') THEN
       hoje = NOW();
       update public.imobilizadosinventarios set id_lanca  = 0, new_codigo = 0, new_cc = '', status = 0, condicao = 9, book = 'N'
       where id_empresa = old.id_empresa and id_filial = old.id_filial and id_inventario = old.id_inventario and id_imobilizado = old.id_imobilizado;

       update public.imobilizadosinventarios set id_lanca  = NEW.id_lanca, new_codigo = new.new_codigo, new_cc = new.new_cc, status = NEW.estado, condicao = NEW.condicao, book = NEW.book
       where id_empresa = new.id_empresa and id_filial = new.id_filial and id_inventario = new.id_inventario and id_imobilizado = new.id_imobilizado;

       histo_old   = json_agg(old.*);
       histo_atual = json_agg(new.*);
       insert into auditorias(id_empresa,id_filial,id_inventario,id_imobilizado,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		           values(new.id_empresa,new.id_filial,new.id_inventario,new.id_imobilizado,hoje,'update','lancamentos',new.id_usuario,histo_old,histo_atual,16,0);  
		   
       RETURN NEW;
   ELSIF  (TG_OP = 'DELETE') THEN 
       hoje = NOW();
       update public.imobilizadosinventarios set id_lanca  = 0, status = 0 , new_codigo = 0 , new_cc = '' , condicao = '9', book = 'N'
       where id_empresa = old.id_empresa and id_filial = old.id_filial and id_inventario = old.id_inventario and id_imobilizado = old.id_imobilizado;

       histo_old   = json_agg(old.*);
       histo_atual = '';
       insert into auditorias(id_empresa,id_filial,id_inventario,id_imobilizado,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		           values(old.id_empresa,old.id_filial,old.id_inventario,old.id_imobilizado,hoje,'delete','lancamentos',old.id_usuario,histo_old,histo_atual,16,0);  
		   
       RETURN OLD;
   END IF;
   RETURN NULL;
END ;
$function$
;


create trigger trigger_lancamentos after
insert
    or
delete
    or
update
    on
    public.lancamentos for each row execute function function_lancamento()