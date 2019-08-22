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

// create server on the port 8181, hint: new WebSocketServer({port: 8181});
// when client connects: // hint: on('connection', ...)
//      assign UIID, hint: uiid.v4()
//      if connection is open send stocks, hint: readyState, WebSocket.OPEN, ws.send, JSON.stringify, stocks
//          in interval 1s // hint: setInterval
// when client disconnects
//      log client uiid, log code and reason, close interval, hint: closeInterval