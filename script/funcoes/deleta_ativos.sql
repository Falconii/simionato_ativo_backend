CREATE OR REPLACE FUNCTION delete_ativo(
    p_id_empresa     INTEGER,
    p_id_filial      INTEGER,
    p_id_inventario  INTEGER,
    p_codigos_ativos INTEGER[]
)
RETURNS JSON AS
$$
DECLARE
    v_fotos_deleted          INTEGER;
    v_lancamentos_deleted    INTEGER;
    v_inv_deleted            INTEGER;
    v_imobilizados_deleted   INTEGER;
BEGIN
    -- Excluir fotos
    DELETE FROM fotos
    WHERE id_empresa = p_id_empresa
      AND id_local = p_id_filial
      AND id_inventario = p_id_inventario
      AND id_imobilizado = ANY(p_codigos_ativos);
    GET DIAGNOSTICS v_fotos_deleted = ROW_COUNT;

    -- Excluir lançamentos
    DELETE FROM lancamentos
    WHERE id_empresa = p_id_empresa
      AND id_filial = p_id_filial
      AND id_inventario = p_id_inventario
      AND id_imobilizado = ANY(p_codigos_ativos);
    GET DIAGNOSTICS v_lancamentos_deleted = ROW_COUNT;

    -- Excluir imobilizadosinventarios
    DELETE FROM imobilizadosinventarios
    WHERE id_empresa = p_id_empresa
      AND id_filial = p_id_filial
      AND id_inventario = p_id_inventario
      AND id_imobilizado = ANY(p_codigos_ativos);
    GET DIAGNOSTICS v_inv_deleted = ROW_COUNT;

    -- Excluir imobilizados
    DELETE FROM imobilizados
    WHERE id_empresa = p_id_empresa
      AND id_filial = p_id_filial
      AND codigo = ANY(p_codigos_ativos);
    GET DIAGNOSTICS v_imobilizados_deleted = ROW_COUNT;

    -- Retorno estruturado
    RETURN json_build_object(
        'fotos_excluidas', v_fotos_deleted,
        'lancamentos_excluidos', v_lancamentos_deleted,
        'inventarios_excluidos', v_inv_deleted,
        'imobilizados_excluidos', v_imobilizados_deleted,
        'total_excluido', 
            v_fotos_deleted 
          + v_lancamentos_deleted 
          + v_inv_deleted 
          + v_imobilizados_deleted
    );
END;
$$ LANGUAGE plpgsql;


SELECT delete_ativo(
    1,          -- id_empresa
    15,         -- id_filial
    11,         -- id_inventario
    ARRAY[906130, 906117]
);