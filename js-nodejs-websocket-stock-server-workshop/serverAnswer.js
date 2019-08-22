const WebSocket = require('ws');
const WebSocketServer = require('ws').Server;
const uuid = require('uuid');

const stocks = {
    APPLE: 178.0,
    ALPHABET: 1151.0,
    AMAZON: 1842.0,
    MICROSOFT: 127.0
};

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

let stockUpdater;
const randomStockUpdater = () => {
    for (const symbol in stocks) {
        stocks[symbol] += randomNumber(-150, 150) / 100;
    }
    stockUpdater = setTimeout(() => randomStockUpdater(), 800);

};

randomStockUpdater();

wss = new WebSocketServer({port: 8181});
wss.on('connection', ws => {
    const clientUuid = uuid.v4();
    console.log('client ' + clientUuid + ' is connected');

    const sendStockUpdates = ws => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(stocks));
        }
    };

    const clientStockUpdater = setInterval(() => sendStockUpdates(ws), 1000);

    ws.onclose = closeEvent => {
        console.log('client ' + clientUuid + ' disconnected with code: ' 
            + closeEvent.code + ' and reason: ' + closeEvent.reason);
        clearInterval(clientStockUpdater);
    };
});