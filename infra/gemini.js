const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

let key = process.env.GEMINI_API_KEY || fs.readFileSync("./gemini_key.txt", "utf8");

const genAI = new GoogleGenerativeAI(key.trim());

module.exports = genAI;
