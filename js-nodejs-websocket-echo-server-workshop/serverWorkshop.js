// 1. load module ws and import class Server, hint: require, 'ws', Server
// 2. create WebSocketServer on the port 8080, hint: WebSocketServer, {port: 8080}
// 3. when connection - log 'client has just connected', hint: on('connection', ...), console.log
//      a. when message, log message, hint: on('message', ...), console.log
//      b. use ws.onmessage = ... instead of on('message', ...) - compare differences, use JSON.parse(e.data);