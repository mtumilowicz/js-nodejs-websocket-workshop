const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({port: 8080});
wss.on('connection', ws => {
    console.log('client has just connected');
    ws.on('message', message => console.log(message));
    // compare above to: ws.onmessage = event => console.log(event); try to use JSON.parse(event.data);
});