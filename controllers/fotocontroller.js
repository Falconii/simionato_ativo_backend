const fs = require("fs");
const erroDB = require('../util/userfunctiondb');
const { google } = require("googleapis");
const funcoes       = require("../util/googleFuncoes");   // autenticação, upload, etc.
const inventarioSrv = require("../service/inventarioService");
const fotoSrv = require("../service/fotoService");
//const { file } = require("googleapis/build/src/apis/file");
//const { param } = require("../route/googleRoute");


const PORT = process.env.PORT || 3000;
