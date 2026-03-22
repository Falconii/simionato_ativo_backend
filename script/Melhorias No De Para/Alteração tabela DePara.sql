controle automatico 

ALTER TABLE de_para
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE de_para
ADD COLUMN id_usuario INT4 DEFAULT 0;

ALTER TABLE de_para
ADD COLUMN de_descricao varchar(150) DEFAULT '';


ALTER TABLE de_para
ADD COLUMN  dt_processamento TIMESTAMPTZ  ;


CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON de_para
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();