/*
 * Servidor 192.168.0.161 
 * Usuario postgres
 * Senha   S1m10n4t0SQL  - S1m10n4t0ACD
 * Porta   49777
 * /

//novo ajuste 

/* fontes gerado automaticamente */
const pgp = require('pg-promise')();

/*
const db = pgp({
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'db_ajustes'
});
*/


const db = pgp({
    user: 'postgres',
    password: '511fAbAB-12bee6dCd3gDGAA5a4Ag4Ca',
    host: 'roundhouse.proxy.rlwy.net',
    port: 59437,
    database: 'railway'
});

module.exports = db;