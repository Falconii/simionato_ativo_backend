/* ROUTE eventos  */
const db = require("../infra/database.js");
const genAI = require("../infra/gemini.js");
const express = require("express");
const router = express.Router();
const erroDB = require("../util/userfunctiondb.js");
const response = require("../util/respostaPadrao.js");
const shared = require("../util/shared.js");
const path = require("path");
const fs = require("fs");


router.post("/padronizar", async (req, res) => {
  const { descricao } = req.body;

  const prompt = `
    Padronize a descrição do ativo abaixo.
    Caso a descrição possua a palavra "morsa", adicione "ferramenta - " na 
    Descrição original: "${descricao}"
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);

    res.json({ resposta: result.response.text() });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
