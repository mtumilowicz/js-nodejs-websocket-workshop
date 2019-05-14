# js-nodejs-websocket

* https://github.com/mtumilowicz/js-nodejs-websocket-echo-server
* https://github.com/mtumilowicz/js-nodejs-websocket-stock-server
* https://github.com/mtumilowicz/js-nodejs-websocket-chat

* WebSocket is:
    * an event-driven, 
    * full-duplex (both directions) 
    * asynchronous 
    * communications channel
* provides real-time updates without hacks (like long pooling, http2 push notifications, etc.)
* WebSocket uses HTTP as the initial transport mechanism, the communication
    does not end after a response is received by the client
* long polling - server holds the request open until new data is 
                 available then sends it to the client. When the client receives the new information, it 
                 immediately sends another request, and the operation is repeated.
* exactly the opposite to typical HTTP request/response cycle
* as long as the connection stays open, the client and server can exchange information asynchronously
* full support for sending text and binary data
* four types of events
    * open
        * fired after connection request and the handshake
        * it means that connection is established
        * server is ready to send and receive messages                                                            
    * message
        * fired when data is received through a websocket.
        * After you’ve established a connection to the WebSocket server, it will be available to
          send messages to and receive messages
    * error
        * fired when a connection with a websocket has been closed because of an error
        * it can be assumed that after an error event the WebSocket connection
          will be closed and a close event will be fired
    * close
        * fired when connection is closed
        * communication between client is over
        * has two attributes, code and reason
        * either side may terminate the connection
