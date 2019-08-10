[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
# js-nodejs-websocket-echo-server-workshop

* https://github.com/mtumilowicz/js-nodejs-websocket-workshop-theory
* https://github.com/websockets/ws
* https://www.amazon.com/WebSocket-Client-Server-Communications-Andrew-Lombardi/dp/1449369278

# project description
* the goal of this workshop is:
    * introduce chrome websocket devtool
        * investigate handshake
        * investigate traffic
    * communication direction: client -> server
        * client: requesting connection and sending messages
        * server: approving connection and receiving messages
    * opening connection
    * investigating `readyState`
    * investigating `MessageEvent`
* implement:
    * `clientWebSocketWorkshop.js`
    * `serverWorkshop.js`
    * steps and hints are provided in above-mentioned files
* answers in:
    * `clientWebSocketAnswer.js`
    * `serverAnswer.js`
    
# theory in a nutshell
* chrome devtool, Network, WS
* HTTP Upgrade request from client
    ```
    Accept-Encoding: gzip, deflate, br
    Accept-Language: en,pl;q=0.9,en-US;q=0.8,pt;q=0.7
    Cache-Control: no-cache
    Connection: Upgrade
    Host: localhost:8080
    Origin: http://localhost:63342
    Pragma: no-cache
    Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits
    Sec-WebSocket-Key: 5EzMmc2ekUvI1Zq0aeQW+Q==
    Sec-WebSocket-Version: 13
    Upgrade: websocket
    User-Agent: Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36
    ```
* HTTP 101 Switching Protocols response
    ```
    HTTP/1.1 101 Switching Protocols
    Upgrade: websocket
    Connection: Upgrade
    Sec-WebSocket-Accept: wFWv00Myz/aH0+5uoYeD6m7+Dg0=
    ```
* WebSocket states

    |State        |Value    |Description   |
    |---          |---      |---|
    |CONNECTING   |0        |The connection is not yet open.   |
    |OPEN         |1        |The connection is open and ready to communicate.   |
    |CLOSING      |2        |The connection is in the process of closing.   |
    |CLOSED       |3        |The connection is closed or couldn’t be opened.   |
* WebSocket fires four events
    * open
        * when the handshake is complete
        * once this happens - server is ready to send and receive messages from the client
        * `readyState` before: `CONNECTING`
        * `readyState` after: `OPEN`                                                           
    * message
        * used to carry messages
        * readyState: `OPEN`
    * error
        * when an error occurs
        * close event will be fired
        * readyState does not change
    * close
        * after closing handshake communication will not continue
        * two attributes: code and reason
        * either side may terminate the connection
        * `readyState` from: `CLOSING` (when close request is fired)
        * `readyState` to: `CLOSED` (when close handshake is over)
        
# conclusions in a nutshell
* client
    * requesting connection by client
        ```
        const ws = new WebSocket("ws://localhost:8080");
        ```
    * reacting to events:
        ```
        ws.on<eventName> = event => ...;
        ```
        for example:
        ```
        ws.onopen = event => ...;
        ```
    * sending message:
        ```
        ws.send('message');
        ```
* server
    * creating WebSocket server on a given port
        ```
        const WebSocketServer = require('ws').Server;
        const wss = new WebSocketServer({port: 8080});
        ```
    * reacting to connection and messages
        ```
        wss.on('connection', ws => {
            ws.on('message', message => console.log(message));
        });
        ```
