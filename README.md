# js-nodejs-websocket

* https://tools.ietf.org/html/rfc6455
* https://www.ably.io/concepts/long-polling
* https://www.amazon.com/WebSocket-Client-Server-Communications-Andrew-Lombardi-ebook/dp/B015D78JVQ
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
* long polling drawbacks
    * the client-side script is forced to maintain a mapping from the outgoing connections to the 
    incoming connection to track replies
    * To maintain the session state for a given client, that state must either:
        * be sharable among all servers behind a load balancer – a task with significant architectural 
        complexity
        * or subsequent client requests within the same session must be routed to the same server to which their original 
        request was processed - contradiction of load-balancing

* http2 push notifications - TODO
* transport mechanism: HTTP, without ending the communication after a response is received by the client
* single TCP connection for traffic in both directions
* supports text and binary data
* four types of events
    * open
        * fired after connection request, after handshake
        * it means that connection is established
        * server is ready to send and receive messages                                                            
    * message
        * use to carry data
    * error
        * fired when a connection with a websocket has been closed because of an error
        * after an error event the WebSocket connection will be closed and a close event will be fired
    * close
        * fired when connection is closed
        * communication between client is over
        * has two attributes, code and reason
        * either side may terminate the connection
* The protocol has two parts:
    1. handshake
        * The handshake from the client looks as follows:
            ```
            GET /chat HTTP/1.1
            Host: server.example.com
            Upgrade: websocket
            Connection: Upgrade
            Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
            Origin: http://example.com
            Sec-WebSocket-Protocol: chat, superchat
            Sec-WebSocket-Version: 13
            ```
        * The handshake from the server looks as follows:
            ```
            HTTP/1.1 101 Switching Protocols
            Upgrade: websocket
            Connection: Upgrade
            Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
            Sec-WebSocket-Protocol: chat
            ```
    1. data transfer
        * Once the client and server have both sent their handshakes, and if
             the handshake was successful, then the data transfer part starts
        * This is a two-way communication channel where each side can,
             independently from the other, send data at will
        * After a successful handshake, clients and servers transfer data back
             and forth in conceptual units referred to in this specification as
             "messages"
            * On the wire, a message is composed of one or more frames
            * The WebSocket message does not necessarily correspond to a
                 particular network layer framing, as a fragmented message may be
                 coalesced or split by an intermediary
            * there are
                 types for textual data (which is interpreted as UTF-8
                 text), binary data (whose interpretation is left up to the
                 application), and control frames (which are not intended to carry
                 data for the application but instead for protocol-level signaling,
                 such as to signal that the connection should be closed).
* Opening Handshake
    * WebSocket client's
         handshake is an HTTP Upgrade request
    * |Sec-WebSocket-Protocol| 
    * server selects one or none of the acceptable protocols and echoes
         that value in its handshake to indicate that it has selected that
         protocol
    * the server has to prove to the client that it received the
         client's WebSocket handshake, so that the server doesn't accept
         connections that are not WebSocket connections
        * This prevents an
         attacker from tricking a WebSocket server by sending it carefully
         crafted packets using XMLHttpRequest or a form
         submission
    * To prove that the handshake was received, the server has to take two
         pieces of information and combine them to form a response
        * The first
             piece of information comes from the |Sec-WebSocket-Key| header field
            * the server has to take the value (as present
                 in the header field, e.g., the base64-encoded version minus
                 any leading and trailing whitespace) and concatenate this with the
                 Globally Unique Identifier (GUID)
            * "dGhlIHNhbXBsZSBub25jZQ==", the server
                 would concatenate the string "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
                 to form the string "dGhlIHNhbXBsZSBub25jZQ==258EAFA5-E914-47DA-95CA-
                 C5AB0DC85B11"
            * SHA-1 hash of this then base64-encoded "s3pPLMBiTxaQ9kYGzzhZRbK+xOo="  
            * This value would then be echoed in
                 the |Sec-WebSocket-Accept| header field
            * |Sec-WebSocket-Accept| header field indicates whether
                 the server is willing to accept the connection
        * HTTP/1.1 101 Switching Protocols
# Closing Handshake
* Either peer can send a control frame with data containing a specified
     control sequence to begin the closing handshake
* Upon receiving such a frame, the other peer sends a
     Close frame in response, if it hasn't already sent one
* Upon
     receiving _that_ control frame, the first peer then closes the
     connection, safe in the knowledge that no further data is
     forthcoming
* After sending a control frame indicating the connection should be
     closed, a peer does not send any further data; after receiving a
     control frame indicating the connection should be closed, a peer
     discards any further data received
