const express = require("express");
const router = express.Router();
const usuarioSrv = require("../service/usuarioService");
const PORT = process.env.PORT || 3000;
const fs = require("fs");
const path = require("path");




router.get("/api/downloadfile/:fileName", async(req, res) => {
    try {

        const fileName = req.params.fileName;

        const dirBase = global.appRoot;

        const pathFile = path.resolve(`${dirBase}/rel_excel/`);

        const arquivo = path.resolve(`${pathFile}/${fileName}`);

        res.sendFile( arquivo,function(){
            try {
                fs.unlinkSync(`${arquivo}`);
            } catch (err) {
                console.error(err);
            }  
        });
         
            
    } catch (error) {
        console.error("Erro ao enviar o arquivo:", error);
        res.status(500).json({ message: "Erro ao enviar o arquivo" , error : error});
    }
});

module.exports = router;