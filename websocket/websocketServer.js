const WebSocket = require('ws');

class WebSocketServer {
    constructor(port) {
        if (WebSocketServer.instance) {
            return WebSocketServer.instance; // Retorna a instância existente
        }

        this.server = new WebSocket.Server({ port });
        this.clients = new Set();
        this.init();

        WebSocketServer.instance = this; // Salva a instância única
    }

    init() {
        this.server.on('connection', (ws,req) => {
            const idUser = new URL(req.url, `http://localhost`).searchParams.get("iduser");
            ws.idUser = idUser; 
            this.clients.add(ws);
            console.log('Novo cliente conectado');

            // Adicionando o evento onMessage para processar mensagens recebidas
            ws.on('message', (message) => {
                console.log(`Mensagem recebida de um cliente: ${message}`);

                // Enviar de volta para todos os clientes conectados
                this.sendMessageToClients({ message: `${message}` });
            });

            ws.on('close', () => {
                this.clients.delete(ws);
                console.log('Cliente desconectado');
            });
        });
    }

    sendMessageToClients(message) {
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
                console.log(`sendMessageToClients - Mensagem enviada para o cliente ${client.idUser}: ${message}`);
            }
        });
    }

     sendMessageToClient(idUser,message) {
        const mensagem = { message: `${message}` }
        this.clients.forEach(client => {
            if ((client.readyState === WebSocket.OPEN) && (client.idUser == idUser)) {
                client.send(JSON.stringify(mensagem));
                console.log(`sendMessageToClient - Mensagem enviada para o cliente ${idUser}: ${message}`);
            }
        });
    }
}

module.exports = WebSocketServer;