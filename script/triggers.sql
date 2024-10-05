CREATE OR REPLACE FUNCTION "public"."function_lancamento" () RETURNS trigger AS
$$
DECLARE 
BEGIN
    IF    (TG_OP = 'INSERT') THEN
       update public.imobilizadosinventarios set id_lanca  = NEW.id_lanca, new_codigo = new.new_codigo, new_cc = new.new_cc , status = NEW.estado, condicao = NEW.condicao, book = NEW.book
       where id_empresa = new.id_empresa and id_filial = new.id_filial and id_inventario = new.id_inventario and id_imobilizado = new.id_imobilizado;
       RETURN NEW;
   ELSEIF (TG_OP = 'UPDATE') THEN
       update public.imobilizadosinventarios set id_lanca  = 0, new_codigo = 0, new_cc = '', status = 0, condicao = 9, book = 'N'
       where id_empresa = old.id_empresa and id_filial = old.id_filial and id_inventario = old.id_inventario and id_imobilizado = old.id_imobilizado;

       update public.imobilizadosinventarios set id_lanca  = NEW.id_lanca, new_codigo = new.new_codigo, new_cc = new.new_cc, status = NEW.estado, condicao = NEW.condicao, book = NEW.book
       where id_empresa = new.id_empresa and id_filial = new.id_filial and id_inventario = new.id_inventario and id_imobilizado = new.id_imobilizado;
       RETURN NEW;
   ELSIF  (TG_OP = 'DELETE') THEN 
       update public.imobilizadosinventarios set id_lanca  = 0, status = 0 , new_codigo = 0 , new_cc = '' , condicao = '9', book = 'N'
       where id_empresa = old.id_empresa and id_filial = old.id_filial and id_inventario = old.id_inventario and id_imobilizado = old.id_imobilizado;
       RETURN OLD;
   END IF;
   RETURN NULL;
END ;
$$
LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS "trigger_lancamentos" ON "public"."lancamentos";
CREATE TRIGGER "trigger_lancamentos"
	AFTER INSERT OR UPDATE OR DELETE ON public.lancamentos FOR EACH ROW
	 EXECUTE PROCEDURE function_lancamento();


CREATE OR REPLACE FUNCTION "public"."function_locais" () RETURNS trigger AS
$$
DECLARE 
BEGIN
    IF  (TG_OP = 'DELETE') THEN 
       update public.padroes set id_local_padrao = 0
       where id_empresa = old.id_empresa ;
       RETURN OLD;

   END IF;
   RETURN NULL;
END ;
$$
LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS "trigger_locais" ON "public"."locais";
CREATE TRIGGER "trigger_locais"
	AFTER INSERT OR UPDATE OR DELETE ON public.locais FOR EACH ROW
	 EXECUTE PROCEDURE function_locais();

CREATE OR REPLACE FUNCTION "public"."function_fotos" () RETURNS trigger AS
$$
DECLARE 
BEGIN
    IF     (TG_OP = 'INSERT') THEN
       update public.imobilizadosinventarios set  fotos = fotos + 1
       where id_empresa = new.id_empresa and id_filial = new.id_local and id_inventario = new.id_inventario and id_imobilizado = new.id_imobilizado;
       RETURN NEW;
    ELSEIF (TG_OP = 'UPDATE') THEN
       update public.imobilizadosinventarios set fotos = fotos - 1
       where id_empresa = old.id_empresa and id_filial = old.id_local and id_inventario = old.id_inventario and id_imobilizado = old.id_imobilizado;
       update public.imobilizadosinventarios set  fotos = fotos + 1
       where id_empresa = new.id_empresa and id_filial = new.id_local and id_inventario = new.id_inventario and id_imobilizado = new.id_imobilizado;
       NEW.file_name := replace(NEW.file_name,lpad(cast(OLD.id_imobilizado as varchar),6,'0'),lpad(cast(NEW.id_imobilizado as varchar),6,'0'))
       RETURN NEW;
    ELSIF  (TG_OP = 'DELETE') THEN 
       update public.imobilizadosinventarios set fotos = fotos - 1
       where id_empresa = old.id_empresa and id_filial = old.id_local and id_inventario = old.id_inventario and id_imobilizado = old.id_imobilizado;
       RETURN OLD;

   END IF;
   RETURN NULL;
END ;
$$
LANGUAGE 'plpgsql';


DROP TRIGGER IF EXISTS "trigger_fotos" ON "public"."fotos";
CREATE TRIGGER "trigger_fotos"
	AFTER INSERT OR UPDATE OR DELETE ON public.fotos FOR EACH ROW
	 EXECUTE PROCEDURE function_fotos();


/*

CREATE OR REPLACE FUNCTION "public"."function_lancamento" () RETURNS trigger AS
$$
DECLARE 
 histo_old text;
 histo_atual text;
BEGIN
    IF    (TG_OP = 'INSERT') THEN
       update public.imobilizadosinventarios set id_lanca  = NEW.id_lanca, new_codigo = new.new_codigo, new_cc = new.new_cc , status = NEW.estado, condicao = NEW.condicao, book = NEW.book
       where id_empresa = new.id_empresa and id_filial = new.id_filial and id_inventario = new.id_inventario and id_imobilizado = new.id_imobilizado;

       histo_old   = '';
       histo_atual = json_agg(new.*);
       insert into auditorias(id_empresa,id_filial,id_inventario,id_imobilizado,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		           values(new.id_empresa,new.id_filial,new.id_inventario,new.id_imobilizado,'2024-10-04','insert','lancamentos',new.id_usuario,histo_old,histo_atual,16,0);  
		   
       RETURN NEW;
   ELSEIF (TG_OP = 'UPDATE') THEN
       update public.imobilizadosinventarios set id_lanca  = 0, new_codigo = 0, new_cc = '', status = 0, condicao = 9, book = 'N'
       where id_empresa = old.id_empresa and id_filial = old.id_filial and id_inventario = old.id_inventario and id_imobilizado = old.id_imobilizado;

       update public.imobilizadosinventarios set id_lanca  = NEW.id_lanca, new_codigo = new.new_codigo, new_cc = new.new_cc, status = NEW.estado, condicao = NEW.condicao, book = NEW.book
       where id_empresa = new.id_empresa and id_filial = new.id_filial and id_inventario = new.id_inventario and id_imobilizado = new.id_imobilizado;

       histo_old   = json_agg(old.*);
       histo_atual = json_agg(new.*);
       insert into auditorias(id_empresa,id_filial,id_inventario,id_imobilizado,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		           values(new.id_empresa,new.id_filial,new.id_inventario,new.id_imobilizado,'2024-10-04','update','lancamentos',new.id_usuario,histo_old,histo_atual,16,0);  
		   
       RETURN NEW;
   ELSIF  (TG_OP = 'DELETE') THEN 
       update public.imobilizadosinventarios set id_lanca  = 0, status = 0 , new_codigo = 0 , new_cc = '' , condicao = '9', book = 'N'
       where id_empresa = old.id_empresa and id_filial = old.id_filial and id_inventario = old.id_inventario and id_imobilizado = old.id_imobilizado;

       histo_old   = json_agg(old.*);
       histo_atual = '';
       insert into auditorias(id_empresa,id_filial,id_inventario,id_imobilizado,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		           values(old.id_empresa,old.id_filial,old.id_inventario,old.id_imobilizado,'2024-10-04','delete','lancamentos',old.id_usuario,histo_old,histo_atual,16,0);  
		   
       RETURN OLD;
   END IF;
   RETURN NULL;
END ;
$$
LANGUAGE 'plpgsql';


DROP TRIGGER IF EXISTS "trigger_lancamentos" ON "public"."lancamentos";
CREATE TRIGGER "trigger_lancamentos"
	AFTER INSERT OR UPDATE OR DELETE ON public.lancamentos FOR EACH ROW
	 EXECUTE PROCEDURE function_lancamento();


select * from lancamentos where id_lanca = 6005
	
select * from auditorias

update lancamentos set obs = 'marcos renato falconi' where id_lanca = 172

delete from lancamentos where id_lanca = 172;



*/