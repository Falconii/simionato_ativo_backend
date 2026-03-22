const pgp = require("pg-promise")();
const fs = require("fs");

let dbConfig;

if (process.env.DATABASE_URL) {
  dbConfig = process.env.DATABASE_URL;
  console.log("Conexão Configurada Para DATABASE_URL!!");
} else {
  const conexao = JSON.parse(fs.readFileSync("./conexoes_local.json", "utf8"));
  dbConfig = conexao.database_url;
  console.log("Conexão configurada Para local  !! -conexoes_local.json");
}

const db = pgp(dbConfig);

module.exports = db;
