const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "fotos/")
    },
    filename: function(req, file, cb) {
        cb(null, `${req.body.id_empresa.padStart(2,'0')}_${req.body.id_local.padStart(6,'0')}_${req.body.id_inventario.padStart(6,'0')}_${req.body.id_imobilizado.padStart(6,'0')}_${file.originalname}`);
    }

});

const uploadFotos = multer({ storage });

module.exports = uploadFotos;