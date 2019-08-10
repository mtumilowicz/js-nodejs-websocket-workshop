const ws = new WebSocket("ws://localhost:8181");

const stocks = {
    "APPLE": 0,
    "ALPHABET": 0,
    "AMAZON": 0,
    "MICROSOFT": 0
};

const changeStockEntry = (symbol, newValue) => {
    const valElem = $('#' + symbol + ' span');
    valElem.html(newValue.toFixed(2));
};

ws.onmessage = message => {
    const stocksData = JSON.parse(message.data);
    for (const symbol in stocksData) {
        stocks[symbol] = stocksData[symbol];
        changeStockEntry(symbol, stocks[symbol]);
    }
};

ws.onclose = () => {
    console.log("connection closed");
    for (const symbol in stocks) {
        stocks[symbol] = 0;
    }
};

const disconnect = () => ws.close(1000, 'no more data');