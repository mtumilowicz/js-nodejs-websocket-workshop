[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
# js-nodejs-websocket-stock-server-workshop

* https://github.com/mtumilowicz/js-nodejs-websocket-workshop-theory
* https://github.com/mtumilowicz/js-nodejs-websocket-echo-server
* https://github.com/websockets/ws
* https://www.amazon.com/WebSocket-Client-Server-Communications-Andrew-Lombardi/dp/1449369278

# project description
* the goal of this workshop is:
    * communication direction: server -> client
        * client: requesting connection and receiving messages
        * server: approving connection and sending messages
    * closing connection + `CloseEvent` investigation
    * use of `readyState`
* implement:
    * `clientWebSocketWorkshop.js`
    * `serverWorkshop.js`
    * steps and hints are provided in above-mentioned files
* answers in:
    * `clientWebSocketAnswer.js`
    * `serverAnswer.js`

# theory in a nutshell
* closing may be initiated by either endpoint (even simultaneously)
* Close control frame has `code` and `reason`
* upon receiving such a frame, the other peer sends a Close frame in response
* once an endpoint has both sent and received a Close control frame - connection is closed

# conclusions in a nutshell
* client
    * closing with code and reason
        ```
        ws.close(1000, 'no more data');
        ```
* server
    * sending
        ```
        wss.on('connection', ws => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(...);
            }
        }
        ```
    * closing
        ```
        wss.on('connection', ws => {
            ws.onclose = closeEvent => {
                ...
            };
        }
        ```
