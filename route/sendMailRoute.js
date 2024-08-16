const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const usuarioSrv = require("../service/usuarioService");

// Configurações de e-mail
const configEmail = {
    user: "inventario2024@outlook.com.br",
    pass: "kamekameha01?",
    smtp: "smtp.outlook.com",
    nome: "Inventario-Web",
};

// Configurar o transporte SMTP
const transporter = nodemailer.createTransport({
    host: configEmail.smtp,
    port: 587,
    secure: false, // true para 465, false para outras portas
    auth: {
        user: configEmail.user,
        pass: configEmail.pass,
    },
});

async function getHtml(id_empresa, destinatario) {
    try {
        const usuario = await usuarioSrv.getUsuarioByEmail(
            id_empresa,
            destinatario
        );

        if (usuario !== null) {
            console.log("Nome do usuário:", usuario.razao);

            const html = `<!DOCTYPE html>
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Boas Vindas</title>
                <style>
                        @media screen and (min-width: 601px) {
        
                        body{
                            background-color: black;
                        }
        
                            .header2 {
                                color: red;
                                font-size: 20px;
                                font-family: 'Times New Roman', Times, serif;
                                font-weight: bold;
                                margin-top: 10px;
                                margin-bottom: 10px;
                                text-align: left;
                            }
        
                            .label_paragrafo {
                                color: white;
                                font-size: 15px;
                                font-family: 'Times New Roman', Times, serif;
                                font-weight: 600;
                                margin-top: 30px;
                                margin-left: 30px;
                                margin-bottom: 10px;
                            }    
        
                        }
                        @media screen and (max-width: 600px) {
                            .header2 {
                                color: red;
                                font-size: 14px;
                                font-family: 'Times New Roman', Times, serif;
                                font-weight: bold;
                                margin-top: 5px;
                                margin-bottom: 5px;
                                text-align: left;
                            }
        
                            .label_paragrafo {
                                color: white;
                                font-size: 12px;
                                font-family: 'Times New Roman', Times, serif;
                                font-weight: 600;
                                margin-top: 10px;
                                margin-left: 10px;
                                margin-bottom: 10px;
                            }    
        
                        }
                </style>
            </head>
            <body>
                <p class="header2">Prezado(a) ${usuario.razao}</p>
                <div class="label_paragrafo">
                    <p class="label_paragrafo">Este Email tem apenas o intuito de validar as rotinas de envio de e-mails.</p>
                    <p class="label_paragrafo">Por esta razão solicito a gentiliza de responder com um simples "OK" ou "Ciente"...</p>
                    <p class="label_paragrafo">Em breve você receberá outro email, para uma atualização cadastral, como a digitação da senha.</p>
                </div>
                <div class="label_paragrafo">
                    <p class="label_paragrafo">Por enquanto agradeço a atenção,</p>
                </div>
                <div class="label_paragrafo">
                    <p class="label_paragrafo">Sistema Inventário Web.</p>
                </div>
            </body>
        </html>`;
            return html;
        } else {
            console.error("Usuário não encontrado para o e-mail:", destinatario);
            return "";
        }
    } catch (error) {
        console.error("Erro ao obter detalhes do usuário:", error);
        throw error;
    }
}

// Rota para enviar e-mails
router.post("/api/enviaremail", async(req, res) => {
    try {
        const { id_empresa, destinatario, assunto, mensagem } = req.body;

        const mailList = [
            destinatario,
            "ronie@simionatoauditores.com.br",
            "daniel.barros@simionatoauditores.com.br",
        ];

        // Obtendo o HTML do email com os detalhes do usuário
        const html = await getHtml(id_empresa, destinatario);

        // Opções do e-mail
        const mailOptions = {
            from: `"${configEmail.nome}" <${configEmail.user}>`,
            to: mailList,
            subject: assunto, // Assunto padrão se estiver vazio
            text: mensagem, // Conteúdo de texto alternativo
            attachments: [{
                filename: "imobilizadosinventarios.xlsx",
                path: "./rel_excel/imobilizadosinventarios.xlsx",
            }, ],
        };

        // Enviando o e-mail
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "E-mail enviado com sucesso!" });
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        res.status(500).json({ error: "Erro ao enviar e-mail" });
    }
});

module.exports = router;