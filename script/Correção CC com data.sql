select convert_cc(codigo),* from centroscustos where id_filial = 15 and codigo like '%/%' order by codigo
go
DO $$
BEGIN
    UPDATE centroscustos
    SET codigo = convert_cc(codigo);
    WHERE id_filial = 15 AND codigo LIKE '%/%';
EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'Linha ignorada por chave duplicada';
END $$;

select convert_cc(cod_cc),cod_cc,codigo,descricao from imobilizados where id_filial = 15 and cod_cc like '%/%'
go
update imobilizados set cod_cc = convert_cc(cod_cc) where id_filial = 15 and cod_cc like '%/%'
go

select * from imobilizadosinventarios where id_filial = 15 and id_inventario = 11 and  new_cc like '%/%'

select * from lancamentos where  id_filial = 15 and id_inventario = 11 and  new_cc like '%/%'

CREATE OR REPLACE FUNCTION convert_cc(old_cc TEXT)
RETURNS TEXT AS $$
DECLARE
    p1 TEXT;
    p2 TEXT;
    m TEXT;
    y TEXT;
    f INTEGER;
BEGIN
    -- separa as partes
    p1 := split_part(old_cc, '/', 1);
    p2 := split_part(old_cc, '/', 2);

    -- caso 1: formato "11/ago" (número / mês)
    IF p1 ~ '^[0-9]+$' THEN
        y := p1;
        m := p2;
        f := 0;
    -- caso 2: formato "nov/13" (mês / número)
    ELSE
        m := p1;
        y := p2;
        f := 1;
    END IF;

    -- converte mês textual para número SEM zero à esquerda
    m := CASE lower(m)
            WHEN 'jan' THEN '1'
            WHEN 'fev' THEN '2'
            WHEN 'mar' THEN '3'
            WHEN 'abr' THEN '4'
            WHEN 'mai' THEN '5'
            WHEN 'jun' THEN '6'
            WHEN 'jul' THEN '7'
            WHEN 'ago' THEN '8'
            WHEN 'set' THEN '9'
            WHEN 'out' THEN '10'
            WHEN 'nov' THEN '11'
            WHEN 'dez' THEN '12'
            ELSE m
         END;
    if (f = 1) then
        
        RETURN m || '-' || y;
       
    else

        RETURN y || '-' || m;
        
    end if;
END;
$$ LANGUAGE plpgsql;