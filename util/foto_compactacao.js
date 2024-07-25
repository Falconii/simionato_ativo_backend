const fs = require("fs");
const path = require("path");
const Compressor = require("compressorjs");

function readImage(filePath) {
  return fs.promises.readFile(filePath);
}

function saveImage(filePath, buffer) {
  return fs.promises.writeFile(filePath, buffer);
}

exports.compactarImagem = async function (inputImagePath, outputImagePath) {
  return readImage(inputImagePath)
    .then((data) => {
      const blob = new Blob([data], { type: "image/png" });

      // comprimi a imagem
      new Compressor(blob, {
        quality: 0.6, // qualidade da imagem reduzida (((0 a 1)))
        success(result) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const buffer = Buffer.from(reader.result);

            saveImage(outputImagePath, buffer)
              .then(() => {
                console.log("Imagem comprimida salva em:", outputImagePath);
              })
              .catch((err) => {
                console.error("Erro ao salvar a imagem:", err);
              });
          };
          reader.readAsArrayBuffer(result);
        },
        error(err) {
          console.error("Erro ao comprimir a imagem:", err.message);
        },
      });
    })
    .catch((err) => {
      console.error("Erro ao ler a imagem:", err);
    });
};
