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
* long polling
    1. client sends request, receives response and immediately sends another request
    1. server holds the request open
    1. waiting for state change (new data emerges)
    1. push response to the client
    1. repeat
* http2 push notifications - TODO
* transport mechanism: HTTP, without ending the communication after a response is received by the client
    * the client and server exchange data asynchronously (as long as the connection stays open)
* supports text and binary data
* four types of events
    * open
        * fired after connection request, after handshake
        * it means that connection is established
        * server is ready to send and receive messages                                                            
    * message
        * fired when data is received through a websocket
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
