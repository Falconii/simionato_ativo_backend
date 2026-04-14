/* DATA imobilizadosinventarios */
const db = require("../../infra/database");
const shared = require("../../util/shared.js");

exports.getExisteImoInventarioComMovimento = function (
  id_empresa,
  id_filial,
  id_imobilizado,
  id_inventario,
) {
  strSql = ` select   
			   imo_inv.id_empresa as  id_empresa  
			,  imo_inv.id_filial as  id_filial  
			,  imo_inv.id_inventario as  id_inventario  
			,  imo_inv.id_imobilizado as  id_imobilizado  
			,  imo_inv.new_codigo as  new_codigo 
 			FROM imobilizadosinventarios imo_inv
			where imo_inv.id_empresa = ${id_empresa} and  imo_inv.id_filial = ${id_filial} and imo_inv.id_inventario = ${id_inventario} and  imo_inv.id_imobilizado = ${id_imobilizado} and (imo_inv.id_lanca > 0 OR imo_inv.fotos > 0) `;
  console.log("getimobilizado", strSql);
  return db.manyOrNone(strSql);
};
