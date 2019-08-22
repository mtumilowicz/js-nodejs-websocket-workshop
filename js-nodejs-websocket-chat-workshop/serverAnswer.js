const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server,
    wss = new WebSocketServer({port: 8181});
const uuid = require('uuid');

const clients = [];

propagateMessage = (nickname, message) => {
    for (let i in clients) {
        const clientSocket = clients[i].ws;
        if (clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(JSON.stringify({
                nickname: nickname,
                message: message
            }));
        }
    }
};

let clientIndex = 1;

wss.on('connection', ws => {
    const client_uuid = uuid.v4();
    const nickname = 'User' + clientIndex;
    clientIndex += 1;
    clients.push({
        id: client_uuid,
        ws: ws,
        nickname: nickname
    });

    propagateMessage(nickname, 'has connected');

    ws.on('message', message => propagateMessage(nickname, message));

    const closeSocket = () => {
        for (let i in clients) {
            if (clients[i].id === client_uuid) {
                propagateMessage(nickname, 'has disconnected');
                clients.splice(i, 1);
            }
        }
    };

    ws.on('close', () => closeSocket());
});
