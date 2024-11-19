/* DATA celulares */
const db = require('../infra/database');

/* CRUD - INSERT */
exports.insertFotoDrive = function(fotodrive) {
    strSql = `insert into fotos_drive (
                id_empresa, 
                id_filial, 
                id_inventario, 
                id_file, 
                folder_id,
                name_file, 
                size, 
                data 
              ) VALUES (
                  ${fotodrive.id_empresa}, 
                  ${fotodrive.id_filial}, 
                  ${fotodrive.id_inventario}, 
                 '${fotodrive.id_file}',
                 '${fotodrive.folder_id}', 
                 '${fotodrive.name_file}',
                 '${fotodrive.size}',
                 '${fotodrive.data}'
              ) 
    RETURNING *`;
    return db.oneOrNone(strSql);
};
