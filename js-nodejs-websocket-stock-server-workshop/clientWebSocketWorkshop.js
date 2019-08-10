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

// when message, hint: onmessage
//      parse data // hint: JSON.parse, message.data
//      update stocks and update frontend, hint: changeStockEntry

// when close, hint: onclose
//      log that connection is closed
//      reset stocks

// implement function that will close ws with code 1000 and reason 'no more data', hint: ws.close
const disconnect = 0;