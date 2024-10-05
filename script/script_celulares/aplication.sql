DROP TABLE IF EXISTS celulares;
CREATE TABLE celulares (
    id SERIAL PRIMARY KEY,
    androidid VARCHAR(20) NOT NULL,
    modelo VARCHAR(50),
    fabricante VARCHAR(50),
    versao_os VARCHAR(20),
    status CHAR(1) NOT NULL default 'S',
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
