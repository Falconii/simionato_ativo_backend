CREATE OR REPLACE FUNCTION "public"."function_lancamento" () RETURNS trigger AS
$$
DECLARE 
BEGIN
    IF    (TG_OP = 'INSERT') THEN
       update public.imobilizadosinventarios set id_lanca  = NEW.id_lanca, new_codigo = new.new_codigo, new_cc = new.new_cc , status = NEW.estado, condicao = NEW.condicao, book = NEW.book
       where id_empresa = new.id_empresa and id_filial = new.id_filial and id_inventario = new.id_inventario and id_imobilizado = new.id_imobilizado;
       RETURN NEW;
   ELSEIF (TG_OP = 'UPDATE') THEN
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

/* Corrige campo fotos 
UPDATE imobilizadosinventarios
SET fotos = foto.contador
FROM (SELECT 
	  foto.id_empresa,
	  foto.id_local,
	  foto.id_inventario,
	  foto.id_imobilizado,
	  COALESCE(count(*),0) as contador
      FROM  fotos foto
	  GROUP BY foto.id_empresa,
	  foto.id_local,
	  foto.id_inventario,
	  foto.id_imobilizado) as foto
WHERE imobilizadosinventarios.id_empresa = foto.id_empresa and 
	  imobilizadosinventarios.id_filial = foto.id_local and 
	  imobilizadosinventarios.id_inventario = foto.id_inventario and 
	  imobilizadosinventarios.id_imobilizado = foto.id_imobilizado
	  
*/
