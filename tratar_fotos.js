const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// caminhos absolutos no Windows
const inputFolder = "C:\\Intelli\\Fotos Coppersteel_2026_lote 1\\Oficiais";
const outputFolder = "C:\\Intelli\\Fotos Coppersteel_2026_lote 1\\Tratadas";

// cria pasta destino se não existir
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

async function processarImagens() {
  const arquivos = fs.readdirSync(inputFolder);

  console.log(`Encontradas ${arquivos.length} imagens para processar...\n`);

  for (const arquivo of arquivos) {
    const inputPath = path.join(inputFolder, arquivo);
    const outputPath = path.join(outputFolder, arquivo);

    try {
      await sharp(inputPath)
        .rotate() // corrige orientação automática
        .resize({
          width: 1000,
          height: 1000,
          fit: "cover",
          position: "attention", // preserva a área mais importante
        })
        .toFile(outputPath);

      console.log(`✔ Processada: ${arquivo}`);
    } catch (err) {
      console.error(`❌ Erro ao processar ${arquivo}:`, err.message);
    }
  }

  console.log("\nFinalizado!");
}

processarImagens();
