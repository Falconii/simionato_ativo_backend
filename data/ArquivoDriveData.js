/* DATA credenciais */
const db = require('../infra/database');

/* CRUD - INSERT */
 exports.insertArquivo = function(arquivo){
	strSql = `insert into arquivos_drive (
		     id_file 
		 ,   id_pasta 
		 ,   name_file
		 ,   size
		 ,   data 
		 ) 
		 values(
		     '${arquivo.id_file}' 
		 ,   '${arquivo.id_pasta}' 
		 ,   '${arquivo.name_file}' 
		 ,   '${arquivo.size}' 
		 ,   '${arquivo.data}' 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};


