const pgp = require('pg-promise')();
const fs = require('fs');



let dbConfig;

if (process.env.RAILWAY_ENV) 
    {
       dbConfig = process.env.DATABASE_URL;
       console.log("Conexão Configurada Para Nuvem");
    } else {
      const conexao = JSON.parse(fs.readFileSync('./conexoes.json', 'utf8'));
       dbConfig = conexao.database_url;
       console.log("Conexão configurada Para Local!");
   }

const db = pgp(dbConfig);


  module.exports = db;