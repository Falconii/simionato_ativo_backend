const express = require('express');
const router = express.Router();
const WebSocketServer = require('../websocket/websocketServer');

/* ROTA Get Status WebSocket */
router.get("/api/ws_status", async function(req, res) {
    try {
            const wsServer = new WebSocketServer(8080);
            const status = wsServer.server.clients.size > 0 ? 'Conectado' : 'Desconectado';
            const clients = Array.from(wsServer.server.clients).map(client => {
                return {
                    readyState: client.readyState,
                    protocol: client.protocol,
                    url: client.url,
                    idUser:client.idUser,
                };
            });
            res.status(200).json({ 'status': status ,'nro_clientes': wsServer.server.clients.size, 'clientes': clients });
    } catch (err) {
        if (err.name === 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BACK-END', tabela: 'celular', message: err.message });
        }
    }
});


router.post("/api/ws_send_message_to", async function(req, res) {
    try {
            const wsServer = new WebSocketServer(8080);

            const {idUser,mensagem} = req.body;

            wsServer.sendMessageToClient(idUser, mensagem);

            res.status(200).json({ 'idUser': idUser, 'mensagem': mensagem });

    } catch (err) {
        if (err.name === 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BACK-END', tabela: 'WebSocket_API', message: err.message });
        }
    }
});


module.exports = router;
