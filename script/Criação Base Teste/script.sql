-- Copiar produtos
INSERT INTO produtos (
  id_empresa,
  id_filial,
  codigo,
  estado,
  descricao,
  ncm,
  id_principal,
  user_insert,
  user_update
)
SELECT
  id_empresa,
  999,
  codigo,
  estado,
  descricao,
  ncm,
  id_principal,
  user_insert,
  user_update
FROM produtos
WHERE id_empresa = 1 AND id_filial = 15
ON CONFLICT (id_empresa, id_filial, codigo) DO NOTHING;
go
-- Copiar principais
INSERT INTO principais (
  id_empresa,
  id_filial,
  codigo,
  descricao,
  user_insert,
  user_update
)
SELECT
  id_empresa,
  999,
  codigo,
  descricao,
  user_insert,
  user_update
FROM principais
WHERE id_empresa = 1 AND id_filial = 15
ON CONFLICT (id_empresa, id_filial, codigo) DO NOTHING;
go
-- Copiar imobilizados
INSERT INTO imobilizados (
  id_empresa,
  id_filial,
  codigo,
  descricao,
  cod_grupo,
  cod_cc,
  nfe,
  serie,
  item,
  origem,
  condicao,
  apelido,
  user_insert,
  user_update,
  principal
)
SELECT
  id_empresa,
  999,
  codigo,
  descricao,
  cod_grupo,
  cod_cc,
  nfe,
  serie,
  item,
  origem,
  condicao,
  apelido,
  user_insert,
  user_update,
  principal
FROM imobilizados
WHERE id_empresa = 1 AND id_filial = 15
ON CONFLICT (id_empresa, id_filial, codigo) DO NOTHING;
go
-- Copiar centroscustos
INSERT INTO centroscustos (
  id_empresa,
  id_filial,
  codigo,
  descricao,
  user_insert,
  user_update
)
SELECT
  id_empresa,
  999,
  codigo,
  descricao,
  user_insert,
  user_update
FROM centroscustos
WHERE id_empresa = 1 AND id_filial = 15
ON CONFLICT (id_empresa, id_filial, codigo) DO NOTHING;
go
-- Copiar grupos
INSERT INTO grupos (
  id_empresa,
  id_filial,
  codigo,
  descricao,
  user_insert,
  user_update
)
SELECT
  id_empresa,
  999,
  codigo,
  descricao,
  user_insert,
  user_update
FROM grupos
WHERE id_empresa = 1 AND id_filial = 15
ON CONFLICT (id_empresa, id_filial, codigo) DO NOTHING;