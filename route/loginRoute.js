/* ROUTE credenciais */
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const usuarioService = require("../service/usuarioService");
const tokenService = require("../service/tokenService");
const validade = 30;

let CLIENT_ID = "";
let CLIENT_KEY = "";

if (process.env.CLIENT_ID) {
  CLIENT_ID = process.env.CLIENT_ID;
  CLIENT_KEY = process.env.CLIENT_KEY;
  console.log("client_id", CLIENT_ID, "client_key", CLIENT_KEY);
} else {
  const _id = JSON.parse(fs.readFileSync("./client_id.json", "utf8"));
  const _key = JSON.parse(fs.readFileSync("./client_key.json", "utf8"));

  CLIENT_ID = _id.client_id;
  CLIENT_KEY = _key.client_key;

  console.log("client_id", "client_key");
}

/* Login */
router.post("/", async function (req, res) {
  try {
    const { id_empresa, codigo, password } = req.body;

    console.log("Login:", codigo, password);

    user = await usuarioService.getUsuario(id_empresa, codigo);

    console.log("User:", user);

    if (!user) {
      return res.status(403).send("Credenciais inválidas");
    }

    if (!user || !bcrypt.compareSync(password, user.senha)) {
      return res.status(401).send("Credenciais inválidas");
    }

    console.log("Senha valida:", user.senha);

    await tokenService.deleteTokenByUser(user.id_empresa, user.id);

    const accessToken = tokenService.generateAccessToken(user);

    const refreshToken = tokenService.generateRefreshToken(user);

    await tokenService.insertToken({
      id_empresa: user.id_empresa,
      token: accessToken,
      tipo: "A",
      validade: new Date(Date.now() + validade * 24 * 60 * 60 * 1000), // 7 dias
      id_usuario: user.id,
      status: 1,
      user_insert: user.id,
      user_update: 0,
    });

    await tokenService.insertToken({
      id_empresa: user.id_empresa,
      token: refreshToken,
      tipo: "R",
      validade: new Date(Date.now() + validade * 24 * 60 * 60 * 1000), // 7 dias
      id_usuario: user.id,
      status: 1,
      user_insert: user.id,
      user_update: 0,
    });

    res.status(200).json({
      id_empresa: user.id_empresa,
      id: user.id,
      razao: user.razao,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    res.status(500).json({ erro: "BAK-END", message: err.message });
  }
});

router.post("refresh/", async function (req, res) {
  try {
    const { codigo, password } = req.body;

    user = await usuarioService.getUsuario(1, codigo);

    if (!user) {
      return res.status(403).send("Credenciais inválidas");
    }

    if (!user || !bcrypt.compareSync(password, user.senha)) {
      return res.status(401).send("Credenciais inválidas");
    }

    await tokenService.deleteTokenByUser(user.id_empresa, user.id);

    const accessToken = tokenService.generateAccessToken(user);

    const refreshToken = tokenService.generateRefreshToken(user);

    await tokenService.insertToken({
      id_empresa: user.id_empresa,
      token: accessToken,
      tipo: "A",
      validade: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
      id_usuario: user.id,
      status: 1,
      user_insert: user.id,
      user_update: 0,
    });

    await tokenService.insertToken({
      id_empresa: user.id_empresa,
      token: refreshToken,
      tipo: "R",
      validade: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      id_usuario: user.id,
      status: 1,
      user_insert: user.id,
      user_update: 0,
    });

    res.status(200).json({
      id_empresa: user.id_empresa,
      id_usuario: user.id,
      razao: user.razao,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    res.status(500).json({ erro: "BAK-END", message: err.message });
  }
});

router.post("/atualizartoken", async function (req, res) {
  try {
    const { client_id, client_key } = req.body;

    user = await usuarioService.getUsuario(1, 99);

    if (!user) {
      return res.status(403).send("Credenciais inválidas");
    }

    if (!client_id) {
      return res.status(403).send("Falta Parametros!");
    }

    if (!client_key) {
      return res.status(403).send("Falta Parametros!");
    }

    if (client_id !== CLIENT_ID) {
      return res.status(403).send("Erro Nos Parametros!");
    }

    if (client_key !== CLIENT_KEY) {
      return res.status(403).send("Erro Nos Parametros!");
    }

    await tokenService.deleteTokenByUser(user.id_empresa, user.id);

    const accessToken = tokenService.generateAccessToken(user);

    const refreshToken = tokenService.generateRefreshToken(user);

    const accesstoken = await tokenService.insertToken({
      id_empresa: user.id_empresa,
      token: accessToken,
      tipo: "A",
      validade: new Date(Date.now() + validade * 24 * 60 * 60 * 1000),
      id_usuario: user.id,
      status: 1,
      user_insert: user.id,
      user_update: 0,
    });

    await tokenService.insertToken({
      id_empresa: user.id_empresa,
      token: refreshToken,
      tipo: "R",
      validade: new Date(Date.now() + validade * 24 * 60 * 60 * 1000),
      id_usuario: user.id,
      status: 1,
      user_insert: user.id,
      user_update: 0,
    });

    res.status(200).json({
      id_empresa: user.id_empresa,
      id_usuario: user.id,
      razao: user.razao,
      accessToken: accessToken,
      refreshToken: refreshToken,
      validade: accesstoken.validade,
    });
  } catch (err) {
    res.status(500).json({ erro: "BAK-END", message: err.message });
  }
});

module.exports = router;
