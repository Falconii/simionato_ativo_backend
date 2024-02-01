CREATE OR REPLACE FUNCTION "public"."function_lancamento" () RETURNS trigger AS
$$
DECLARE 
BEGIN
    IF     (TG_OP = 'INSERT') THEN
       update public.imobilizadosinventarios set id_lanca  = NEW.id_lanca, new_codigo = new.new_codigo, new_cc = new.new_cc , status = NEW.estado 
       where id_empresa = new.id_empresa and id_filial = new.id_filial and id_inventario = new.id_inventario and id_imobilizado = new.id_imobilizado;
       RETURN NEW;
   ELSEIF (TG_OP = 'UPDATE') THEN
        update public.imobilizadosinventarios set id_lanca  = NEW.id_lanca, new_codigo = new.new_codigo, new_cc = new.new_cc, status = NEW.estado 
       where id_empresa = new.id_empresa and id_filial = new.id_filial and id_inventario = new.id_inventario and id_imobilizado = new.id_imobilizado;
       RETURN NEW;

   ELSIF  (TG_OP = 'DELETE') THEN 
       update public.imobilizadosinventarios set id_lanca  = 0, status = 0 , new_codigo = 0 , new_cc = ''
       where id_empresa = old.id_empresa and id_filial = old.id_filial and id_inventario = old.id_inventario and id_imobilizado = old.id_imobilizado;
       RETURN OLD;

   END IF;
   RETURN NULL;
END ;
$$
LANGUAGE 'plpgsql'
GO

DROP TRIGGER IF EXISTS "trigger_lancamentos" ON "public"."lancamentos"
GO
CREATE TRIGGER "trigger_lancamentos"
	AFTER INSERT OR UPDATE OR DELETE ON public.lancamentos FOR EACH ROW
	 EXECUTE PROCEDURE function_lancamento()


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
LANGUAGE 'plpgsql'
GO

DROP TRIGGER IF EXISTS "trigger_locais" ON "public"."locais"
GO
CREATE TRIGGER "trigger_locais"
	AFTER INSERT OR UPDATE OR DELETE ON public.locais FOR EACH ROW
	 EXECUTE PROCEDURE function_locais()
