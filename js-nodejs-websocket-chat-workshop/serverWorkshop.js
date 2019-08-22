const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server,
    wss = new WebSocketServer({port: 8181});
const uuid = require('uuid');

const clients = [];

propagateMessage = (nickname, message) => {
    for (let i = 0; i < clients.length; i++) {
        const clientSocket = clients[i].ws;
        // if clientSocket is open send data containing nickname and message
        // hint: readyState, WebSocket.OPEN
        // hint: clientSocket.send, JSON.stringify
        // {"nickname": ..., "message": ...}
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

    // on message, propagate message to other clients
    // hint: on('message', message => ...), propagateMessage

    const closeSocket = () => {
        for (let i = 0; i < clients.length; i++) {
            // find client to close, hint: use id and client_uuid
            // push message that nickname 'has disconnected', hint: propagateMessage
            // remove client from clients, hint: splice
        }
    };

    // on close - closeSocket, hint: on('close', ...), closeSocket()
});
